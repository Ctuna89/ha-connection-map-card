// Run with: npm test   (needs Node 20+ and Playwright's Chromium: npx playwright install chromium)
// FUZZ=1000 npm test   checks more random installations (default 150).
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const H = require('./harness');

let browser;
before(async () => { browser = await H.launch(); });
after(async () => { await browser.close(); });

const DEMOS = [{ demo: 'unifi' }, { demo: 'fritz' }, { demo: 'large' }, { demo: 'large', group_small: 0 },
  { demo: 'unifi', sizes: { hub: 30, device: 8, network: 36 } }, { demo: 'unifi', exclude_integrations: ['zha', 'zwave_js'] }];
const LOCAL_ONLY = { demo: 'unifi', exclude_integrations: ['zha', 'zwave_js', 'nest', 'ecobee', 'met', 'switchbot', 'xiaomi_ble', 'inkbird', 'matter'] };

test('links never cross or run over another bubble (demo installations)', async () => {
  for (const cfg of DEMOS.concat([LOCAL_ONLY])) {
    const page = await H.newPage(browser);
    await H.mountDemo(page, cfg);
    assert.deepEqual(await H.linkProblems(page), [], JSON.stringify(cfg));
    assert.deepEqual(page.errors, [], JSON.stringify(cfg));
    await page.close();
  }
});

test('links never cross or run over another bubble (random installations)', async () => {
  const n = +process.env.FUZZ || 150, page = await H.newPage(browser);
  for (let seed = 1; seed <= n; seed++) {
    await H.mountRandom(page, seed);
    assert.deepEqual(await H.linkProblems(page), [], 'seed ' + seed);
  }
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('labels never overlap each other or a bubble, at any zoom, on phone and desktop', async () => {
  for (const demo of ['unifi', 'fritz', 'large']) for (const viewport of [{ width: 400, height: 850 }, { width: 1500, height: 950 }]) {
    const page = await H.newPage(browser, viewport), where = demo + ' ' + viewport.width + 'px';
    await H.mountDemo(page, { demo });
    assert.deepEqual(await H.labelProblems(page), [], where + ', first view');
    await page.evaluate(() => window.card._zoom(1.6));
    assert.deepEqual(await H.labelProblems(page), [], where + ', zoomed out');
    await page.evaluate(() => window.card._zoom(0.4));
    assert.deepEqual(await H.labelProblems(page), [], where + ', zoomed in (device names shown)');
    await page.close();
  }
});

test('with a single group its node is at the centre and Home Assistant moves aside', async () => {
  const page = await H.newPage(browser);
  await H.mountDemo(page, LOCAL_ONLY);
  const r = await page.evaluate(() => ({ node: [window.card._mnodes.local.x, window.card._mnodes.local.y], core: window.card._core, off: window.card._offMap }));
  assert.deepEqual(r.node, [0, 0]);
  assert.ok(Math.hypot(r.core.x, r.core.y) > 100);
  assert.deepEqual(r.off, [], 'every access point is drawn');
  await page.close();
});

test('whatever is left off the map is announced under it', async () => {
  const page = await H.newPage(browser);
  let found = false;
  for (let seed = 1; seed <= 400 && !found; seed++) {
    await H.mountRandom(page, seed);
    const r = await page.evaluate(() => ({ off: window.card._offMap.length, note: window.card.shadowRoot.getElementById('note').innerText }));
    if (r.off) { found = true; assert.match(r.note, /not drawn/); } else assert.doesNotMatch(r.note, /not drawn/);
  }
  assert.ok(found, 'no random installation left an access point off the map: the test needs a new example');
  await page.close();
});

test('Bluetooth devices hang from the receiver that hears them, Thread devices from a Thread group', async () => {
  const page = await H.newPage(browser);
  await H.mountDemo(page, { demo: 'unifi' });
  const r = await page.evaluate(() => { const c = window.card, by = (n) => c._devs.find((d) => d.n === n);
    return { proxy: by('Curtain bot').hub.n, path: c._pathOf(by('Curtain bot')).join(' > '), adapter: by('Plant sensor').hub.n, unheard: by('Grill thermometer').hub.n, thread: by('Eve door sensor').hub.n, wifi: by('Matter smart plug').hub.m }; });
  assert.equal(r.proxy, 'ESP32 Bluetooth proxy');
  assert.match(r.path, /ESP32 Bluetooth proxy \(Bluetooth proxy\) > AP Living room \(Wi-Fi 2\.4 GHz\) > UDM Pro > Home Assistant$/);
  assert.equal(r.adapter, 'hci0');
  assert.equal(r.unheard, 'Bluetooth');
  assert.equal(r.thread, 'Thread');
  assert.equal(r.wifi, 'local');
  await page.close();
});

test('a silent battery device is "seen recently" for a while, then offline', async () => {
  const page = await H.newPage(browser);
  const count = () => page.evaluate(() => ({ recent: window.card._devs.filter((d) => d.recent).map((d) => d.n), offline: window.card._devs.filter((d) => d.off).map((d) => d.n) }));
  await H.mountDemo(page, { demo: 'unifi' }, { settle: false });
  assert.deepEqual(await count(), { recent: ['Motion sensor 4'], offline: ['Door sensor 8'] }); // silent for 3 h, and for 90 h
  await H.mountDemo(page, { demo: 'unifi', recent_hours: 0 }, { settle: false });
  assert.deepEqual((await count()).recent, []);
  assert.equal((await count()).offline.length, 2);
  await page.close();
});

test('the visual editor writes the option, and removes it again at its default', async () => {
  const page = await H.newPage(browser);
  await H.mountDemo(page, { demo: 'unifi' }, { settle: false });
  const out = await page.evaluate(() => {
    const ed = customElements.get('connection-map-card').getConfigElement(), seen = [];
    ed.addEventListener('config-changed', (e) => seen.push(e.detail.config));
    ed.setConfig({ demo: 'unifi' }); ed.hass = { language: 'en' }; document.getElementById('ed').appendChild(ed);
    const input = (label) => [...ed.shadowRoot.querySelectorAll('.row')].find((r) => r.querySelector('span').textContent === label).querySelector('input,select');
    const set = (label, v) => { const e = input(label); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); };
    set('Line width', '4'); set('Devices', '8'); set('Internet', '#ff0066'); set('Line width', '2');
    return seen[seen.length - 1];
  });
  assert.deepEqual(out, { demo: 'unifi', sizes: { device: 8 }, colors: { cloud: '#ff0066' } });
  await page.close();
});

test('compact map: one bubble per hub, same rules, offline devices counted on the bubble', async () => {
  for (const demo of ['unifi', 'large']) {
    const page = await H.newPage(browser);
    await H.mountDemo(page, { demo, layout: 'compact' });
    assert.deepEqual(await H.linkProblems(page), [], demo);
    assert.deepEqual(await H.labelProblems(page), [], demo);
    const r = await page.evaluate(() => { const c = window.card, svg = c.shadowRoot.querySelector('svg');
      return { dots: svg.querySelectorAll('.dev').length, hubs: svg.querySelectorAll('.hub').length, model: c._hubs.length,
        badges: c._hubs.filter((h) => h.badge && h.badge.parentNode.style.display !== 'none').map((h) => +h.badge.textContent).reduce((a, b) => a + b, 0), off: c._devs.filter((d) => d.off).length }; });
    assert.equal(r.dots, 0); assert.equal(r.hubs, r.model); assert.equal(r.badges, r.off); assert.ok(r.off > 0);
    // the button on the map switches back to the detailed map
    await page.evaluate(() => window.card.shadowRoot.getElementById('zlay').click());
    assert.ok(await page.evaluate(() => window.card.shadowRoot.querySelectorAll('svg .dev').length) > 20);
    assert.deepEqual(await H.linkProblems(page), [], demo + ' after switching back');
    await page.close();
  }
});

test('the map can be saved as an image, and without names it gives nothing away', async () => {
  const page = await H.newPage(browser);
  await H.mountDemo(page, { demo: 'unifi' });
  await page.evaluate(() => { const h = window.card._hubs.find((x) => x.n === 'Hue Bridge'); window.card._zoom(0.4, h.x, h.y); }); await page.waitForTimeout(600); // zoomed in on the Hue hub: its lamps' names are on screen
  const r = await page.evaluate(async () => { const c = window.card; return { anon: c._exportSvg(true).text, full: c._exportSvg(false).text, png: await c._export(true) }; });
  for (const name of ['Hue Bridge', 'UDM Pro', 'AP Office', 'ESP32 Bluetooth proxy', 'Hue lamp', 'KVM', '2026.11.1', 'ha-thread-1a2b']) {
    assert.ok(r.full.includes(name), 'the image with names shows ' + name);
    assert.ok(!r.anon.includes(name), 'the image without names must not show ' + name);
  }
  for (const alias of ['Router', 'AP 1', 'Hub 1', 'Philips Hue']) assert.ok(r.anon.includes(alias), 'expected ' + alias);
  assert.ok(r.png && r.png.bytes > 20000 && r.png.w > 1000, 'a PNG was produced: ' + JSON.stringify(r.png));
  await page.close();
});

test('Netgear / Orbi: clients are placed behind the satellite named by their access point sensor', async () => {
  const page = await H.newPage(browser);
  await page.evaluate(async () => {
    const devices = {}, entities = {}, states = {};
    const dev = (id, name, mac, via) => { devices[id] = { id, name, via_device_id: via || null, connections: mac ? [['mac', mac]] : [], identifiers: [], disabled_by: null, area_id: null }; };
    const ent = (eid, device_id, platform, state, attributes, translation_key) => { entities[eid] = { entity_id: eid, device_id, platform, translation_key }; states[eid] = { entity_id: eid, state, attributes: attributes || {} }; };
    dev('router', 'Orbi Router', 'aa:00:00:00:00:01'); ent('sensor.orbi_router_uptime', 'router', 'netgear', '5'); ent('switch.orbi_router_x', 'router', 'netgear', 'on');
    dev('sat', 'Orbi Satellite', 'aa:00:00:00:00:02', 'router'); ent('device_tracker.orbi_satellite', 'sat', 'netgear', 'home', { mac: 'aa:00:00:00:00:02' }); ent('sensor.orbi_satellite_ssid', 'sat', 'netgear', 'backhaul', {}, 'ssid');
    // a laptop that only Netgear knows: a plain client, not a network node
    dev('laptop', 'Laptop', 'aa:00:00:00:00:09', 'router'); ent('device_tracker.laptop', 'laptop', 'netgear', 'home', { mac: 'aa:00:00:00:00:09' }); ent('sensor.laptop_ssid', 'laptop', 'netgear', 'Home', {}, 'ssid');
    // four plugs from another integration; Netgear adds its tracker and sensors to the same devices
    for (let i = 0; i < 4; i++) { const id = 'plug' + i, mac = 'aa:00:00:00:01:0' + i, onSat = i < 3;
      dev(id, 'Plug ' + i, mac, 'router'); ent('switch.plug_' + i, id, 'shelly', 'on'); ent('sensor.plug_' + i + '_power', id, 'shelly', '3'); ent('sensor.plug_' + i + '_energy', id, 'shelly', '3'); ent('sensor.plug_' + i + '_temp', id, 'shelly', '3');
      ent('device_tracker.plug_' + i, id, 'netgear', 'home', { mac });
      ent('sensor.plug_' + i + '_access_point_mac', id, 'netgear', onSat ? 'AA:00:00:00:00:02' : 'AA:00:00:00:00:01', {}, 'access_point_mac');
      ent('sensor.plug_' + i + '_link_type', id, 'netgear', onSat ? '2.4GHz' : 'wired', {}, 'link_type'); }
    const man = [{ domain: 'netgear', name: 'NETGEAR', iot_class: 'local_polling' }, { domain: 'shelly', name: 'Shelly', iot_class: 'local_push' }];
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false, group_small: 0 }); document.getElementById('host').appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
  });
  const r = await page.evaluate(() => { const c = window.card; return { routers: c._routers.map((x) => x.n).sort(), main: c._router.n, drawn: c._devs.map((d) => d.n).sort(), hubs: c._hubs.map((h) => h.n),
    sat: c._pathOf(c._devs.find((d) => d.n === 'Plug 0')).join(' > '), wired: c._pathOf(c._devs.find((d) => d.n === 'Plug 3')).join(' > '), node: !!c._rnodes['Orbi Satellite'], from: c._hubs[0].from === c._rnodes['Orbi Satellite'] }; });
  assert.deepEqual(r.routers, ['Orbi Router', 'Orbi Satellite']);
  assert.equal(r.main, 'Orbi Router');
  assert.deepEqual(r.drawn, ['Plug 0', 'Plug 1', 'Plug 2', 'Plug 3'], 'the laptop is a client, not a device of the map');
  assert.deepEqual(r.hubs, ['Shelly'], 'being "via the router" does not make the router a hub');
  assert.equal(r.sat, 'Plug 0 > Shelly > Orbi Satellite (Wi-Fi 2.4 GHz) > Orbi Router > Home Assistant');
  assert.equal(r.wired, 'Plug 3 > Shelly > Orbi Router (Ethernet) > Home Assistant');
  assert.ok(r.node && r.from, 'the satellite is drawn, and the Shelly group (mostly on it) hangs from it');
  assert.deepEqual(await H.linkProblems(page), []);
  await page.close();
});

test('a device set up through several integrations is drawn once', async () => {
  const page = await H.newPage(browser);
  const mount = (config) => page.evaluate(async (config) => {
    const devices = {}, entities = {}, states = {};
    const dev = (id, name, o = {}) => { devices[id] = { id, name, manufacturer: o.mf || '', model: o.mo || '', via_device_id: null, connections: o.mac ? [['mac', o.mac]] : [], identifiers: [], disabled_by: null, area_id: null }; };
    const ent = (eid, device_id, platform, state, attributes) => { entities[eid] = { entity_id: eid, device_id, platform }; states[eid] = { entity_id: eid, state, attributes: attributes || {} }; };
    dev('gw', 'UDM Gateway', { mac: 'aa:00:00:00:00:01' }); ent('sensor.gw_a', 'gw', 'unifi', '1'); ent('sensor.gw_b', 'gw', 'unifi', '1');
    // a TV: its own integration, and the companion app running on it (same name, different capitals, another model text)
    dev('tv', 'Sony XR-55A84L', { mf: 'Sony', mo: 'XR-55A84L' }); ent('media_player.tv', 'tv', 'braviatv', 'on'); ent('remote.tv', 'tv', 'braviatv', 'on');
    dev('tvapp', 'SONY XR-55A84L', { mf: 'Sony', mo: 'BRAVIA 4K VH22' }); for (let i = 0; i < 6; i++) ent('sensor.tvapp_' + i, 'tvapp', 'mobile_app', '1');
    // a phone: the companion app, on mobile data, and a second integration under the same name
    dev('phoneapp', 'Pixel 9'); for (let i = 0; i < 5; i++) ent('sensor.pixel_9_' + i, 'phoneapp', 'mobile_app', '1'); ent('sensor.pixel_9_network_type', 'phoneapp', 'mobile_app', 'cellular');
    dev('phoneadb', 'Pixel 9'); ent('media_player.pixel_adb', 'phoneadb', 'androidtv', 'on');
    // a speaker known to two integrations by the same network address
    dev('spk1', 'Kitchen speaker', { mac: 'aa:00:00:00:00:10' }); ent('media_player.spk1', 'spk1', 'cast', 'on'); ent('sensor.spk1', 'spk1', 'cast', 'on');
    dev('spk2', 'Nest Mini', { mac: 'aa:00:00:00:00:10' }); ent('media_player.spk2', 'spk2', 'dlna_dmr', 'on');
    ent('device_tracker.kitchen_speaker', null, 'unifi', 'home', { mac: 'aa:00:00:00:00:10' });
    // two different lamps that happen to share a name: not the same device
    dev('l1', 'Lamp'); ent('light.l1', 'l1', 'wiz', 'on'); dev('l2', 'Lamp'); ent('light.l2', 'l2', 'wiz', 'on');
    const man = ['unifi', 'braviatv', 'mobile_app', 'androidtv', 'cast', 'dlna_dmr', 'wiz'].map((d) => ({ domain: d, name: { braviatv: 'Sony Bravia TV', mobile_app: 'Mobile App', androidtv: 'Android Debug Bridge' }[d] || d, iot_class: 'local_push' }));
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig(Object.assign({ animations: false, group_small: 0 }, config)); host.appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
    const by = (n) => c._devs.filter((d) => d.n === n);
    return { names: c._devs.map((d) => d.n).sort(), tv: by('Sony XR-55A84L').map((d) => ({ as: c._intName(d.p), also: d.also.map((o) => o.as) })),
      phone: by('Pixel 9').map((d) => ({ as: c._intName(d.p), also: d.also.map((o) => o.as), remote: d.remote, path: c._pathOf(d).join(' > ') })),
      speaker: by('Kitchen speaker').map((d) => d.also.map((o) => o.n)), groups: c._hubs.map((h) => h.n).sort() };
  }, config);
  const r = await mount({});
  assert.deepEqual(r.names, ['Kitchen speaker', 'Lamp', 'Lamp', 'Pixel 9', 'Sony XR-55A84L']);
  assert.deepEqual(r.tv, [{ as: 'Sony Bravia TV', also: ['Mobile devices'] }]);
  assert.equal(r.phone.length, 1);
  assert.deepEqual(r.phone[0].also, ['Mobile devices']);
  assert.equal(r.phone[0].remote, true, 'its app says it is on mobile data');
  assert.match(r.phone[0].path, /Mobile data > Internet > Home Assistant$/);
  assert.deepEqual(r.speaker, [['Nest Mini']]);
  assert.ok(!r.groups.includes('Mobile devices'), 'no empty group is left behind');
  assert.equal((await mount({ merge_duplicates: false })).names.length, 8);
  await page.close();
});

test('in a big home, radios and phones keep their own group, and Z-Wave does not go through the Zigbee coordinator', async () => {
  const page = await H.newPage(browser);
  const r = await page.evaluate(async () => {
    const devices = {}, entities = {}, states = {}, man = []; let n = 0;
    const dev = (name, platform, o = {}) => { const id = 'd' + (++n); devices[id] = { id, name, via_device_id: o.via || null, connections: [], identifiers: [], disabled_by: null, area_id: null };
      (o.ents || ['sensor.e' + n]).forEach((e) => { entities[e] = { entity_id: e, device_id: id, platform }; states[e] = { entity_id: e, state: 'on', attributes: {} }; }); return id; };
    const integ = (domain, name, iot) => man.push({ domain, name, iot_class: iot || 'local_push' });
    for (let i = 0; i < 34; i++) { integ('loc' + i, 'Local ' + i); dev('Thing ' + i, 'loc' + i); dev('Thing ' + i + 'b', 'loc' + i); dev('Thing ' + i + 'c', 'loc' + i); dev('Thing ' + i + 'd', 'loc' + i); }
    integ('zwave_js', 'Z-Wave'); dev('Z-Wave lock', 'zwave_js'); dev('Z-Wave dimmer', 'zwave_js');
    integ('zha', 'Zigbee Home Automation'); const zc = dev('ZHA coordinator', 'zha'); dev('Zigbee plug', 'zha', { via: zc }); dev('Zigbee bulb', 'zha', { via: zc });
    dev('Home Assistant SkyConnect', 'homeassistant_sky_connect');
    integ('mobile_app', 'Mobile App'); dev('Pixel 9', 'mobile_app', { ents: ['sensor.pixel_a', 'sensor.pixel_b'] }); dev('iPhone', 'mobile_app', { ents: ['device_tracker.iphone'] }); // only its tracker is enabled
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false }); document.getElementById('host').appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((res) => setTimeout(res, 25));
    const by = (name) => c._devs.find((d) => d.n === name);
    return { groups: c._hubs.map((h) => h.n), zwave: c._pathOf(by('Z-Wave lock')).join(' > '), zigbee: c._pathOf(by('Zigbee plug')).join(' > '), phones: c._devs.filter((d) => d.p === 'mobile_app').map((d) => d.hub.n + ': ' + d.n).sort() };
  });
  assert.ok(r.groups.includes('Z-Wave'), 'Z-Wave has its own group');
  assert.ok(!r.groups.includes('Other radio devices'));
  assert.equal(r.zwave, 'Z-Wave lock > Z-Wave > Home Assistant');
  assert.equal(r.zigbee, 'Zigbee plug > SkyConnect > ZHA coordinator > Home Assistant');
  assert.deepEqual(r.phones, ['Mobile devices: Pixel 9', 'Mobile devices: iPhone']);
  assert.deepEqual(await H.linkProblems(page), []);
  await page.close();
});

test('devices without entities and entities without a device are on the map', async () => {
  const page = await H.newPage(browser);
  const mount = (config) => page.evaluate(async (config) => {
    const devices = {}, entities = {}, states = {};
    const dev = (id, name, domain, o = {}) => { devices[id] = { id, name, via_device_id: o.via || null, entry_type: o.service ? 'service' : null, connections: [], identifiers: [[domain, id]], disabled_by: null, area_id: null }; };
    const ent = (eid, device_id, platform, name) => { entities[eid] = { entity_id: eid, device_id, platform }; states[eid] = { entity_id: eid, state: 'on', attributes: { friendly_name: name || eid } }; };
    // Lutron: a bridge, two dimmers with entities and two Pico remotes that only send events
    dev('bridge', 'Caseta Bridge', 'lutron_caseta'); ent('sensor.bridge', 'bridge', 'lutron_caseta');
    for (const n of ['Hall dimmer', 'Porch dimmer']) { dev(n, n, 'lutron_caseta', { via: 'bridge' }); ent('light.' + n.replace(' ', '_'), n, 'lutron_caseta'); }
    for (const n of ['Hall Pico', 'Bedroom Pico']) dev(n, n, 'lutron_caseta', { via: 'bridge' });
    // Tuya: a plug with entities and a lock the integration creates nothing for
    dev('plug', 'Tuya plug', 'tuya'); ent('switch.tuya_plug', 'plug', 'tuya'); dev('lock', 'Front door lock', 'tuya');
    // a two-outlet plug whose own entry has no entities, next to enough plugs of the same integration
    dev('ep40', 'Patio EP40', 'tplink'); for (const n of ['Patio left', 'Patio right']) { dev(n, n, 'tplink', { via: 'ep40' }); ent('switch.' + n.replace(' ', '_'), n, 'tplink'); }
    for (let i = 0; i < 4; i++) { dev('kp' + i, 'Plug ' + i, 'tplink'); ent('switch.kp' + i, 'kp' + i, 'tplink'); }
    // integrations that give their entities no device: an ATA box with sensors only, lights from a custom integration
    for (const n of ['status', 'reboot_cause', 'last_caller']) ent('sensor.obihai_' + n, null, 'obihai');
    ent('light.daybetter_strip', null, 'daybetter', 'Desk strip'); ent('light.daybetter_bulb', null, 'daybetter', 'Reading bulb'); ent('sensor.daybetter_rssi', null, 'daybetter');
    // not devices: a helper, the sun, a service
    ent('input_boolean.guests', null, 'input_boolean'); ent('sun.sun', null, 'sun'); ent('sensor.steps', null, 'google_health'); dev('room', 'Living room', 'hue', { service: true });
    const man = [['lutron_caseta', 'Lutron Caséta', 'hub'], ['tuya', 'Tuya', 'hub', 'cloud_push'], ['tplink', 'TP-Link Smart Home', 'hub'], ['obihai', 'Obihai', 'device'], ['daybetter', 'DayBetter'], ['input_boolean', 'Toggle', 'helper'], ['sun', 'Sun', 'service'], ['google_health', 'Google Health', 'service', 'cloud_polling'], ['hue', 'Philips Hue', 'hub']]
      .map((m) => ({ domain: m[0], name: m[1], integration_type: m[2], iot_class: m[3] || 'local_push' }));
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig(Object.assign({ animations: false, group_small: 0 }, config)); host.appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
    const by = (n) => c._devs.find((d) => d.n === n), path = (n) => by(n) && c._pathOf(by(n)).join(' > ');
    return { names: c._devs.map((d) => d.n).sort(), pico: path('Hall Pico'), lock: by('Front door lock') && [by('Front door lock').hub.n, by('Front door lock').bare, by('Front door lock').off],
      ep40: path('Patio left'), obihai: by('Obihai') && by('Obihai').mo, daybetter: c._devs.filter((d) => d.p === 'daybetter').map((d) => d.n + (d.mo ? ' (' + d.mo + ')' : '')).sort() };
  }, config);
  const r = await mount({});
  assert.equal(r.pico, 'Hall Pico > Caseta Bridge > Lutron Caséta > Local network > Home Assistant');
  assert.deepEqual(r.lock, ['Tuya', true, false], 'drawn in its integration, and never reported offline: there is nothing to tell');
  assert.equal(r.ep40, 'Patio left > Patio EP40 > TP-Link Smart Home > Local network > Home Assistant');
  assert.equal(r.obihai, '3 entities without a device');
  assert.deepEqual(r.daybetter, ['DayBetter (1 entities without a device)', 'Desk strip', 'Reading bulb']);
  for (const n of ['guests', 'sun', 'steps', 'Living room', 'Google Health', 'Sun', 'Toggle']) assert.ok(!r.names.some((x) => x.includes(n)), n + ' is not a device');
  assert.deepEqual(await H.linkProblems(page), []);
  const off = await mount({ devices_without_entities: false, entities_without_device: false });
  for (const n of ['Hall Pico', 'Front door lock', 'Obihai', 'Desk strip']) assert.ok(!off.names.includes(n), n + ' is hidden when the options are off');
  await page.close();
});

test('a Z-Wave controller is the hub of its network, linked straight to Home Assistant', async () => {
  const page = await H.newPage(browser);
  const r = await page.evaluate(async () => {
    const devices = {}, entities = {}, states = {}; let n = 0;
    const dev = (name, dom, ident, o = {}) => { const id = 'd' + (++n); devices[id] = { id, name, via_device_id: o.via || null, connections: [], identifiers: ident || [[dom, id]], disabled_by: null, area_id: null };
      for (let k = 0; k < (o.ents || 1); k++) { const e = 'sensor.e' + n + '_' + k; entities[e] = { entity_id: e, device_id: id, platform: dom }; states[e] = { entity_id: e, state: 'on', attributes: {} }; } return id; };
    // Z-Wave: the controller is node 1 of the network; nodes are not linked to it in the registry
    dev('Home Assistant Connect ZWA-2', 'zwave_js', [['zwave_js', '3912345678-1'], ['zwave_js', '3912345678-1-1121:1:1']], { ents: 8 });
    dev('001.Smoke Detector', 'zwave_js', [['zwave_js', '3912345678-7'], ['zwave_js', '3912345678-7-312:3:11']]);
    dev('Garage lock', 'zwave_js', [['zwave_js', '3912345678-12']]);
    // Zigbee next to it, with its own coordinator stick
    const br = dev('Zigbee2MQTT Bridge', 'mqtt', null, { ents: 3 }); devices[br].manufacturer = 'Zigbee2MQTT'; for (let i = 0; i < 4; i++) dev('Zigbee ' + i, 'mqtt', null, { via: br });
    dev('Home Assistant Connect ZBT-2', 'homeassistant_connect_zbt2');
    const man = [['zwave_js', 'Z-Wave'], ['mqtt', 'MQTT']].map((m) => ({ domain: m[0], name: m[1], iot_class: 'local_push' }));
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false }); document.getElementById('host').appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((res) => setTimeout(res, 25));
    const by = (name) => c._devs.find((d) => d.n === name), z = c._hubs.find((h) => h.n === 'Connect ZWA-2');
    return { hub: z && { sub: z.sub, kind: z.kind, devs: z.dv.map((d) => d.n).sort(), direct: z.direct }, asDot: !!by('Home Assistant Connect ZWA-2'),
      path: c._pathOf(by('001.Smoke Detector')).join(' > '), zigbee: c._pathOf(by('Zigbee 0')).join(' > '), radioNode: c._mname('radio') };
  });
  assert.deepEqual(r.hub, { sub: 'Z-Wave', kind: 'hub', devs: ['001.Smoke Detector', 'Garage lock'], direct: true });
  assert.equal(r.asDot, false, 'the controller is the hub, not one more dot');
  assert.equal(r.path, '001.Smoke Detector > Connect ZWA-2 > Home Assistant');
  assert.equal(r.zigbee, 'Zigbee 0 > Connect ZBT-2 > Zigbee2MQTT Bridge > Home Assistant');
  assert.equal(r.radioNode, 'Connect ZBT-2');
  assert.deepEqual(await H.linkProblems(page), []);
  await page.close();
});

test('group_by_area: hub -> area -> devices, for areas with more than one device', async () => {
  for (const demo of ['unifi', 'large']) {
    const page = await H.newPage(browser);
    await H.mountDemo(page, { demo, group_by_area: true });
    assert.deepEqual(await H.linkProblems(page), [], demo);
    assert.deepEqual(await H.labelProblems(page), [], demo);
    await page.evaluate(() => { const h = window.card._hubs.find((x) => x.n === 'Hue Bridge'); window.card._zoom(0.4, h.x, h.y); });
    assert.deepEqual(await H.labelProblems(page), [], demo + ', zoomed in on the Hue hub');
    const r = await page.evaluate(() => { const c = window.card, h = c._hubs.find((x) => x.n === 'Hue Bridge'), z = c._hubs.find((x) => x.m === 'radio' && x.dv.some((d) => d.meshParent));
      const sizes = {}; h.dv.forEach((d) => { if (d.a) sizes[d.a] = (sizes[d.a] || 0) + 1; });
      return { areas: h.areas.map((a) => a.n + ':' + a.list.length).sort(), expected: Object.keys(sizes).filter((a) => sizes[a] > 1).map((a) => a + ':' + sizes[a]).sort(),
        inArea: h.dv.filter((d) => d.parentNode).length, total: h.dv.length, mesh: z ? z.areas.length : 0, shown: c._alabs.filter((a) => a.lab.style.display !== 'none').length }; });
    assert.ok(r.areas.length > 0); assert.deepEqual(r.areas, r.expected);
    assert.equal(r.mesh, 0, 'a Zigbee mesh keeps its own shape');
    assert.ok(r.shown > 0, 'area names are on the map');
    // clicking an area node filters the map to that area
    const picked = await page.evaluate(() => { const c = window.card, ar = c._hubs.find((x) => x.n === 'Hue Bridge').areas[0];
      [...c.shadowRoot.querySelectorAll('svg g[role=button]')].find((g) => g.getAttribute('aria-label') === ar.n && g.querySelector('.anode')).dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return [ar.n, c._S.area, c.shadowRoot.getElementById('area').value]; });
    assert.deepEqual(picked, [picked[0], picked[0], picked[0]]);
    await page.close();
  }
});

test('a bridge is listed as a device of its own, and can be offline', async () => {
  const page = await H.newPage(browser);
  await H.mountDemo(page, { demo: 'unifi' }, { settle: false });
  const r = await page.evaluate(() => { const c = window.card, h = c._hubs.find((x) => x.n === 'Hue Bridge'); c._selHub(h);
    const row = c.shadowRoot.querySelector('#hubdev'), before = row.innerText.replace(/\n+/g, ' | ');
    h.ents.forEach((e) => { c._hass.states[e].state = 'unavailable'; }); c._status(); c._marks(); c._selHub(h);
    return { before, after: c.shadowRoot.querySelector('#hubdev').innerText.replace(/\n+/g, ' | '), red: h.g.classList.contains('offline') }; });
  assert.equal(r.before, 'Hue Bridge · Signify · BSB002 | The bridge itself');
  assert.equal(r.after, 'Hue Bridge · Signify · BSB002 | Offline');
  assert.ok(r.red);
  await page.close();
});

test('a Connect stick is the Zigbee coordinator or the Thread border router, depending on what uses it', async () => {
  const page = await H.newPage(browser);
  const mount = (o) => page.evaluate(async (o) => {
    const devices = {}, entities = {}, states = {}, matter = {}; let n = 0;
    const dev = (name, dom, x = {}) => { const id = 'd' + (++n); devices[id] = Object.assign({ id, name, via_device_id: null, connections: [], identifiers: [[dom, id]], disabled_by: null, area_id: null }, x.reg || {}, { via_device_id: x.via || null });
      for (let k = 0; k < (x.ents || 1); k++) { const e = 'sensor.e' + n + '_' + k; entities[e] = { entity_id: e, device_id: id, platform: dom }; states[e] = { entity_id: e, state: 'on', attributes: {} }; } return id; };
    dev('Home Assistant Connect ZBT-2', 'homeassistant_connect_zbt2');
    if (o.zigbee) { const br = dev('Zigbee2MQTT Bridge', 'mqtt', { ents: 3, reg: { manufacturer: 'Zigbee2MQTT' } }); for (let i = 0; i < 4; i++) dev('Zigbee ' + i, 'mqtt', { via: br }); }
    dev('SLZB-06', 'smlight', { reg: { model: 'SLZB-06', configuration_url: 'http://10.0.0.5' } });
    for (const t of ['Eve door', 'Eve motion']) matter[dev(t, 'matter')] = { network_type: 'thread', network_name: 'ha-thread-9d7d', node_type: 'sleepy_end_device' };
    const man = [['mqtt', 'MQTT'], ['matter', 'Matter'], ['smlight', 'SMLIGHT']].map((m) => ({ domain: m[0], name: m[1], iot_class: 'local_push' }));
    const info = { coordinator: { type: 'EZSP v13', meta: { revision: '7.4.4' } }, config: { serial: { port: o.port } } };
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false, show_mesh: false, group_small: 0 }); host.appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1', components: o.otbr ? ['otbr', 'mqtt', 'matter'] : ['mqtt', 'matter'] }, callService: async () => {},
      connection: { subscribeMessage: async (cb, msg) => { if (msg.trigger && /bridge\/info$/.test(msg.trigger.topic)) setTimeout(() => cb({ variables: { trigger: { payload: JSON.stringify(info) } } }), 30); return () => {}; } },
      callWS: async (m) => { if (m.type === 'manifest/list') return man; if (m.type === 'matter/node_diagnostics' && matter[m.device_id]) return matter[m.device_id]; throw new Error('not in test'); } };
    for (let i = 0; i < 200 && !(c._built && c._matter && (!o.zigbee || c._coordInfo)); i++) await new Promise((r) => setTimeout(r, 25));
    await new Promise((r) => setTimeout(r, 120));
    const by = (name) => c._devs.find((d) => d.n === name), th = c._hubs.find((h) => h.thread);
    return { radio: c._mname('radio'), thread: [th.n, th.sub], threadPath: c._pathOf(by('Eve door')).join(' > '), zigbeePath: by('Zigbee 0') && c._pathOf(by('Zigbee 0')).join(' > ') };
  }, o);
  // the reported home: OTBR on the stick, Zigbee2MQTT on a network coordinator
  let r = await mount({ otbr: true, zigbee: true, port: 'tcp://10.0.0.5:6638' });
  assert.equal(r.radio, 'SLZB-06');
  assert.deepEqual(r.thread, ['Connect ZBT-2', 'Thread border router · ha-thread-9d7d']);
  assert.equal(r.threadPath, 'Eve door > Matter > Connect ZBT-2 (Thread border router) > Home Assistant');
  assert.equal(r.zigbeePath, 'Zigbee 0 > SLZB-06 > Zigbee2MQTT Bridge > Home Assistant');
  assert.deepEqual(await H.linkProblems(page), []);
  // Zigbee2MQTT on the stick itself: it is the coordinator, whatever else is set up
  r = await mount({ otbr: true, zigbee: true, port: '/dev/serial/by-id/usb-Nabu_Casa_ZBT-2_abc123-if00' });
  assert.equal(r.radio, 'Connect ZBT-2');
  assert.deepEqual(r.thread, ['Thread', 'ha-thread-9d7d']);
  // no Zigbee at all, and OTBR set up: the stick can only be the border router
  r = await mount({ otbr: true, zigbee: false });
  assert.deepEqual(r.thread, ['Connect ZBT-2', 'Thread border router · ha-thread-9d7d']);
  // without OTBR, Zigbee2MQTT on the network coordinator: the stick is not the coordinator, and nothing says it does Thread
  r = await mount({ otbr: false, zigbee: true, port: 'tcp://10.0.0.5:6638' });
  assert.equal(r.radio, 'SLZB-06');
  assert.deepEqual(r.thread, ['Thread', 'ha-thread-9d7d']);
  await page.close();
});
