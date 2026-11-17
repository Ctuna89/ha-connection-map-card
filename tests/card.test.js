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

test('Sagemcom gateway: it is the main router, not the second router behind it that is called "Router"', async () => {
  const page = await H.newPage(browser);
  const mount = (config) => page.evaluate(async (config) => {
    const devices = {}, entities = {}, states = {};
    const dev = (id, name, mac, via, idf) => { devices[id] = { id, name, via_device_id: via || null, connections: mac ? [['mac', mac]] : [], identifiers: idf ? [idf] : [], disabled_by: null, area_id: null }; };
    const ent = (eid, device_id, platform, state, attributes) => { entities[eid] = { entity_id: eid, device_id, platform }; states[eid] = { entity_id: eid, state, attributes: attributes || {} }; };
    // the second router comes first in the registry and its name says "Router"
    dev('tpl', 'Archer AX55 Router', 'aa:00:00:00:00:02'); ent('sensor.archer_clients', 'tpl', 'tplink_router', '4'); ent('switch.archer_guest', 'tpl', 'tplink_router', 'off');
    ent('device_tracker.archer_ax55', 'tpl', 'sagemcom_fast', 'home', { mac: 'aa:00:00:00:00:02', interface_type: 'Ethernet' }); // ...and it is a client of the gateway
    // the provider's gateway: a device with no entities at all
    dev('gw', 'Home Hub 4000', 'aa:00:00:00:00:01', null, ['sagemcom_fast', 'SN1']);
    // clients that only the gateway knows
    dev('pc', 'Desktop', 'aa:00:00:00:00:09', 'gw', ['sagemcom_fast', '9']); ent('device_tracker.desktop', 'pc', 'sagemcom_fast', 'home', { mac: 'aa:00:00:00:00:09', interface_type: 'Ethernet' });
    // devices of another integration that the gateway also tracks
    for (let i = 0; i < 3; i++) { const id = 'plug' + i, mac = 'aa:00:00:00:01:0' + i;
      dev(id, 'Plug ' + i, mac); ent('switch.plug_' + i, id, 'shelly', 'on'); ent('sensor.plug_' + i + '_power', id, 'shelly', '3'); ent('sensor.plug_' + i + '_energy', id, 'shelly', '3');
      ent('device_tracker.plug_' + i, id, 'sagemcom_fast', 'home', { mac, interface_type: i ? 'WiFi' : 'Ethernet' }); }
    const man = [{ domain: 'sagemcom_fast', name: 'Sagemcom F@st', iot_class: 'local_polling' }, { domain: 'tplink_router', name: 'TP-Link Router', iot_class: 'local_polling' }, { domain: 'shelly', name: 'Shelly', iot_class: 'local_push' }];
    document.getElementById('host').innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig(Object.assign({ animations: false, group_small: 0 }, config)); document.getElementById('host').appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
    return { routers: c._routers.map((x) => x.n).sort(), main: c._router.n, drawn: c._devs.map((d) => d.n).sort(), hubs: c._hubs.map((h) => h.n),
      wired: c._pathOf(c._devs.find((d) => d.n === 'Plug 0')).join(' > '), wifi: c._pathOf(c._devs.find((d) => d.n === 'Plug 1')).join(' > ') };
  }, config);
  let r = await mount({});
  assert.deepEqual(r.routers, ['Archer AX55 Router', 'Home Hub 4000'], 'the gateway counts as a router even with no entities');
  assert.equal(r.main, 'Home Hub 4000', 'the router that is a client of the gateway is not the main one');
  assert.deepEqual(r.drawn, ['Plug 0', 'Plug 1', 'Plug 2'], 'clients that only the gateway knows are not devices of the map');
  assert.deepEqual(r.hubs, ['Shelly']);
  assert.match(r.wired, /Ethernet/); assert.match(r.wifi, /Wi-Fi/);
  assert.deepEqual(await H.linkProblems(page), []);
  r = await mount({ devices_without_entities: false });
  assert.equal(r.main, 'Home Hub 4000', 'still there when devices without entities are hidden');
  r = await mount({ main_router: 'Archer AX55 Router' });
  assert.equal(r.main, 'Archer AX55 Router', 'main_router: by device name');
  r = await mount({ main_router: 'sagemcom_fast' });
  assert.equal(r.main, 'Home Hub 4000', 'main_router: by integration');
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
    // a TV through its local integration and through its maker's cloud: same name, give or take the model in brackets
    dev('fr1', 'Samsung The Frame 65 (QN65LS03BAGXZS)', { mf: 'Samsung', mo: 'QN65LS03BAGXZS' }); ent('media_player.frame', 'fr1', 'samsungtv', 'on');
    dev('fr2', 'Samsung The Frame 65', { mf: 'Samsung Electronics', mo: 'Samsung The Frame' }); ent('media_player.frame_st', 'fr2', 'smartthings', 'on'); ent('sensor.frame_st', 'fr2', 'smartthings', 'on');
    // a speaker and a thermostat both called after their room: different makers, different things
    dev('lr1', 'Living room', { mf: 'Sonos' }); ent('media_player.lr', 'lr1', 'sonos', 'on'); dev('lr2', 'Living room', { mf: 'Google' }); ent('climate.lr', 'lr2', 'nest', 'on');
    // two different lamps that happen to share a name: not the same device
    dev('l1', 'Lamp'); ent('light.l1', 'l1', 'wiz', 'on'); dev('l2', 'Lamp'); ent('light.l2', 'l2', 'wiz', 'on');
    const man = ['unifi', 'braviatv', 'mobile_app', 'androidtv', 'cast', 'dlna_dmr', 'wiz', 'samsungtv', 'smartthings', 'sonos', 'nest'].map((d) => ({ domain: d, name: { braviatv: 'Sony Bravia TV', mobile_app: 'Mobile App', androidtv: 'Android Debug Bridge', samsungtv: 'Samsung Smart TV', smartthings: 'SmartThings' }[d] || d, iot_class: d === 'smartthings' || d === 'nest' ? 'cloud_push' : 'local_push' }));
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig(Object.assign({ animations: false, group_small: 0 }, config)); host.appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
    const by = (n) => c._devs.filter((d) => d.n === n);
    return { names: c._devs.map((d) => d.n).sort(), tv: by('Sony XR-55A84L').map((d) => ({ as: c._intName(d.p), also: d.also.map((o) => o.as) })),
      phone: by('Pixel 9').map((d) => ({ as: c._intName(d.p), also: d.also.map((o) => o.as), remote: d.remote, path: c._pathOf(d).join(' > ') })),
      speaker: by('Kitchen speaker').map((d) => d.also.map((o) => o.n)), groups: c._hubs.map((h) => h.n).sort(),
      frame: c._devs.filter((d) => /Frame/.test(d.n)).map((d) => ({ n: d.n, as: c._intName(d.p), also: d.also.map((o) => o.as) })), rooms: by('Living room').length };
  }, config);
  const r = await mount({ merge_duplicates: 'auto' }); // 'auto' draws look-alikes once without asking; the default asks (next test)
  assert.deepEqual(r.names, ['Kitchen speaker', 'Lamp', 'Lamp', 'Living room', 'Living room', 'Pixel 9', 'Samsung The Frame 65 (QN65LS03BAGXZS)', 'Sony XR-55A84L']);
  assert.deepEqual(r.frame, [{ n: 'Samsung The Frame 65 (QN65LS03BAGXZS)', as: 'Samsung TV', also: ['SmartThings'] }], 'the local entry stays, the cloud one is folded into it');
  assert.equal(r.rooms, 2);
  assert.deepEqual(r.tv, [{ as: 'Sony Bravia TV', also: ['Mobile devices'] }]);
  assert.equal(r.phone.length, 1);
  assert.deepEqual(r.phone[0].also, ['Mobile devices']);
  assert.equal(r.phone[0].remote, true, 'its app says it is on mobile data');
  assert.match(r.phone[0].path, /Mobile data > Internet > Home Assistant$/);
  assert.deepEqual(r.speaker, [['Nest Mini']]);
  assert.ok(!r.groups.includes('Mobile devices'), 'no empty group is left behind');
  assert.equal((await mount({ merge_duplicates: false })).names.length, 12);
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
  // entities that have no state at all (disabled) do not make a bridge, or a device, offline
  const quiet = await page.evaluate(() => { const c = window.card, h = c._hubs.find((x) => x.n === 'Hue Bridge'), d = h.dv[0], S = c._hass.states, keep = {};
    h.ents.concat(d.ents).forEach((e) => { keep[e] = S[e]; delete S[e]; }); c._status(); const out = [h.off, d.off];
    Object.keys(keep).forEach((e) => { S[e] = keep[e]; }); c._status(); return out; });
  assert.deepEqual(quiet, [false, false]);
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

test('group_by_area also works in a group with power strips: singles by area, each strip with its outlets', async () => {
  const page = await H.newPage(browser);
  const r = await page.evaluate(async () => {
    const devices = {}, entities = {}, states = {}, areas = { a: { area_id: 'a', name: 'Kitchen' }, b: { area_id: 'b', name: 'Office' } }; let n = 0;
    const dev = (name, area, via) => { const id = 'd' + (++n); devices[id] = { id, name, via_device_id: via || null, connections: [], identifiers: [['tplink', id]], disabled_by: null, area_id: area || null };
      const e = 'switch.e' + n; entities[e] = { entity_id: e, device_id: id, platform: 'tplink' }; states[e] = { entity_id: e, state: 'on', attributes: {} }; return id; };
    for (let i = 0; i < 5; i++) dev('Kitchen plug ' + i, 'a'); for (let i = 0; i < 4; i++) dev('Office plug ' + i, 'b'); dev('Hall plug'); dev('Lone office lamp', 'b');
    const st = dev('HS300', 'b'); for (let i = 0; i < 6; i++) dev('HS300 outlet ' + i, 'b', st);
    const man = [{ domain: 'tplink', name: 'TP-Link Smart Home', iot_class: 'local_polling' }];
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false, group_by_area: true }); document.getElementById('host').appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((res) => setTimeout(res, 25));
    const h = c._hubs[0], by = (name) => c._devs.find((d) => d.n === name);
    return { hubs: c._hubs.length, areas: h.areas.map((a) => a.n + ':' + a.list.length), outlet: by('HS300 outlet 0').meshParent.n, outletArea: !!by('HS300 outlet 0').parentNode, strip: !!by('HS300').parentNode };
  });
  assert.equal(r.hubs, 1);
  assert.deepEqual(r.areas, ['Kitchen:5', 'Office:5']);
  assert.equal(r.outlet, 'HS300'); assert.equal(r.outletArea, false); assert.equal(r.strip, false);
  assert.deepEqual(await H.linkProblems(page), []);
  assert.deepEqual(await H.labelProblems(page), []);
  await page.close();
});

test('desktop computers with the companion app are not "mobile devices"', async () => {
  const page = await H.newPage(browser);
  const mount = (config) => page.evaluate(async (config) => {
    const devices = {}, entities = {}, states = {}; let n = 0;
    const dev = (name, dom, o = {}) => { const id = 'd' + (++n); devices[id] = { id, name, manufacturer: o.mf || '', model: o.mo || '', via_device_id: null, connections: [], identifiers: [[dom, id]], disabled_by: null, area_id: null };
      ['a', 'b'].concat(o.battery ? ['battery_level'] : []).forEach((k) => { const e = 'sensor.e' + n + '_' + k; entities[e] = { entity_id: e, device_id: id, platform: dom }; states[e] = { entity_id: e, state: 'on', attributes: {} }; }); return id; };
    dev('Gateway', 'unifi');
    dev('Kitchen iMac', 'mobile_app', { mf: 'Apple', mo: 'iMac21,1' }); dev('Mac Studio', 'mobile_app', { mf: 'Apple', mo: 'Mac13,1' });
    dev('MacBook Air', 'mobile_app', { mf: 'Apple', mo: 'Mac14,2', battery: true }); dev('iPhone', 'mobile_app', { mf: 'Apple', mo: 'iPhone15,2', battery: true });
    dev('Office PC', 'mobile_app', { mf: 'Dell', mo: 'OptiPlex' });
    const man = [{ domain: 'mobile_app', name: 'Mobile App', iot_class: 'local_push' }, { domain: 'unifi', name: 'UniFi', iot_class: 'local_polling' }];
    document.getElementById('host').innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig(Object.assign({ animations: false }, config)); document.getElementById('host').appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
    const g = {}; c._hubs.forEach((h) => { g[h.n] = h.dv.map((d) => d.n).sort(); }); return g;
  }, config);
  let g = await mount({});
  assert.deepEqual(g['Computers'], ['Kitchen iMac', 'Mac Studio'], 'an iMac, and a Mac with no battery');
  assert.deepEqual(g['Mobile devices'], ['MacBook Air', 'Office PC', 'iPhone'], 'laptops and phones stay mobile');
  assert.deepEqual(await H.linkProblems(page), []); assert.deepEqual(await H.labelProblems(page), []);
  g = await mount({ computers: ['office pc'], names: { computers: 'Desktops' } });
  assert.deepEqual(g['Desktops'], ['Kitchen iMac', 'Mac Studio', 'Office PC'], 'computers: by device name; names.computers renames the group');
  await page.close();
});

test('each mobile device is drawn on the access point it is on, and follows it when it roams', async () => {
  const page = await H.newPage(browser);
  await page.evaluate(async () => {
    const devices = {}, entities = {}, states = {}; let n = 0;
    const dev = (name, dom, mac) => { const id = 'd' + (++n); devices[id] = { id, name, via_device_id: null, connections: mac ? [['mac', mac]] : [], identifiers: [[dom, id]], disabled_by: null, area_id: null };
      for (let k = 0; k < 2; k++) { const e = 'sensor.e' + n + '_' + k; entities[e] = { entity_id: e, device_id: id, platform: dom }; states[e] = { entity_id: e, state: 'on', attributes: {} }; } return id; };
    const trk = (slug, via, kind) => { const e = 'device_tracker.' + slug; entities[e] = { entity_id: e, device_id: null, platform: 'huawei_mesh_router' }; states[e] = { entity_id: e, state: 'home', attributes: { connected_via: via, interface_type: kind } }; };
    dev('Primary router', 'huawei_mesh_router', 'aa:00:00:00:00:01'); dev('Wifi auxiliar living', 'huawei_mesh_router', 'aa:00:00:00:00:02');
    dev('Pixel 9', 'mobile_app'); dev('Galaxy Tab', 'mobile_app'); dev('iPhone de Ana', 'mobile_app');
    trk('pixel_9', 'Primary router', '5GHz'); trk('galaxy_tab', 'Primary router', '5GHz'); trk('iphone_de_ana', 'Wifi auxiliar living', '2.4GHz');
    for (let i = 0; i < 3; i++) dev('Plug ' + i, 'shelly');
    const man = [['huawei_mesh_router', 'Huawei Mesh Router'], ['mobile_app', 'Mobile App'], ['shelly', 'Shelly']].map((m) => ({ domain: m[0], name: m[1], iot_class: 'local_push' }));
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false }); document.getElementById('host').appendChild(c); window.card = c;
    window.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    c.hass = window.hass;
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
  });
  const look = () => page.evaluate(() => { const c = window.card; return c._hubs.filter((h) => h.p === 'mobile_app').map((h) => h.dv.map((d) => d.n).sort().join('+') + ' @ ' + (h.from.router ? h.from.router.n : 'Primary router')).sort(); });
  assert.deepEqual(await look(), ['Galaxy Tab+Pixel 9 @ Primary router', 'iPhone de Ana @ Wifi auxiliar living']);
  assert.equal(await page.evaluate(() => window.card._pathOf(window.card._devs.find((d) => d.n === 'iPhone de Ana')).join(' > ')), 'iPhone de Ana > Mobile devices > Wifi auxiliar living (Wi-Fi 2.4 GHz) > Primary router > Home Assistant');
  assert.deepEqual(await H.linkProblems(page), []);
  // the tablet walks to the living room: on the next update it is drawn there
  await page.evaluate(() => { window.hass.states['device_tracker.galaxy_tab'].attributes.connected_via = 'Wifi auxiliar living'; window.card._last = 0; window.card.hass = window.hass; });
  assert.deepEqual(await look(), ['Galaxy Tab+iPhone de Ana @ Wifi auxiliar living', 'Pixel 9 @ Primary router']);
  // everybody back on the main router: one group again
  await page.evaluate(() => { for (const e of ['galaxy_tab', 'iphone_de_ana']) window.hass.states['device_tracker.' + e].attributes.connected_via = 'Primary router'; window.card._last = 0; window.card.hass = window.hass; });
  assert.deepEqual(await look(), ['Galaxy Tab+Pixel 9+iPhone de Ana @ Primary router']);
  assert.deepEqual(await H.linkProblems(page), []);
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('services and physical devices are never folded into the same "Other" group', async () => {
  const page = await H.newPage(browser);
  const r = await page.evaluate(async () => {
    const devices = {}, entities = {}, states = {}, man = []; let n = 0;
    const dev = (name, dom, service) => { const id = 'd' + (++n); devices[id] = { id, name, via_device_id: null, entry_type: service ? 'service' : null, connections: [], identifiers: [[dom, id]], disabled_by: null, area_id: null };
      const e = 'sensor.e' + n; entities[e] = { entity_id: e, device_id: id, platform: dom }; states[e] = { entity_id: e, state: 'on', attributes: {} }; };
    const integ = (domain, name, iot, type) => man.push({ domain, name, iot_class: iot, integration_type: type });
    // accounts and APIs: many of them, each with one entry
    integ('spotify', 'Spotify', 'cloud_polling', 'service'); dev('Spotify Jaime', 'spotify', true); dev('SpotifyPlus Jaime', 'spotify', true);
    integ('google_translate', 'Google Translate', 'cloud_push', 'service'); dev('Google Translate en com', 'google_translate', true);
    integ('anthropic', 'Anthropic', 'cloud_polling', 'service'); dev('Claude conversation', 'anthropic', true); dev('Claude AI Task', 'anthropic', true);
    for (let i = 0; i < 20; i++) { integ('svc' + i, 'Service ' + i, 'cloud_polling', 'service'); dev('Account ' + i, 'svc' + i, true); }
    // things in the house that report through their maker's cloud
    integ('tuya', 'Tuya', 'cloud_push', 'hub'); dev('Ti Pro25 Smart Litter Box', 'tuya');
    integ('hisense', 'Hisense', 'cloud_polling', 'hub'); dev('Aire Pieza', 'hisense'); dev('Aire Living', 'hisense');
    for (let i = 0; i < 5; i++) { integ('loc' + i, 'Local ' + i, 'local_push', 'hub'); for (let k = 0; k < 4; k++) dev('Thing ' + i + '.' + k, 'loc' + i); }
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false }); document.getElementById('host').appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((res) => setTimeout(res, 25));
    const g = (name) => { const d = c._devs.find((x) => x.n === name); return d.hub.n; };
    return { spotify: g('Spotify Jaime'), claude: g('Claude AI Task'), account: g('Account 3'), litter: g('Ti Pro25 Smart Litter Box'), air: g('Aire Pieza'), air2: g('Aire Living'),
      mixed: c._hubs.filter((h) => h.kind === 'other').map((h) => h.n + ':' + (h.dv.every((d) => d.svc) ? 'services' : h.dv.some((d) => d.svc) ? 'MIXED' : 'devices')).sort() };
  });
  assert.equal(r.account, 'Other cloud services');
  assert.equal(r.litter, 'Other cloud devices', 'a single Tuya device is folded, but with other devices, not with accounts');
  assert.equal(r.air, 'Hisense'); assert.equal(r.air2, 'Hisense', 'two air conditioners keep their own group: 25 services do not make the map crowded');
  assert.deepEqual(r.mixed, ['Other cloud devices:devices', 'Other cloud services:services']);
  // separate_services: false puts them back in one group, for a map with fewer nodes
  const one = await page.evaluate(async () => { const c = window.card; c.setConfig({ animations: false, separate_services: false }); c.hass = c._hass;
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((res) => setTimeout(res, 25));
    const g = (name) => c._devs.find((x) => x.n === name).hub.n; return { litter: g('Ti Pro25 Smart Litter Box'), account: g('Account 3'), others: c._hubs.filter((h) => h.kind === 'other').map((h) => h.n).sort() }; });
  assert.equal(one.litter, one.account); assert.deepEqual(one.others, ['Other cloud services']);
  await page.close();
});

test('physical_only: accounts, services and loose sensors are left out, and the button switches it', async () => {
  const page = await H.newPage(browser);
  const mount = (config) => page.evaluate(async (config) => {
    const devices = {}, entities = {}, states = {}, man = []; let n = 0;
    const dev = (name, dom, service) => { const id = 'd' + (++n); devices[id] = { id, name, via_device_id: null, entry_type: service ? 'service' : null, connections: [], identifiers: [[dom, id]], disabled_by: null, area_id: null };
      const e = 'sensor.e' + n; entities[e] = { entity_id: e, device_id: id, platform: dom }; states[e] = { entity_id: e, state: 'on', attributes: {} }; };
    const integ = (domain, name, iot, type) => man.push({ domain, name, iot_class: iot, integration_type: type });
    integ('spotify', 'Spotify', 'cloud_polling', 'service'); dev('Spotify Jaime', 'spotify', true);
    integ('anthropic', 'Anthropic', 'cloud_polling', 'service'); dev('Claude conversation', 'anthropic', true);
    integ('met', 'Met.no', 'cloud_polling', 'service'); dev('Forecast', 'met', true);
    integ('tuya', 'Tuya', 'cloud_push', 'hub'); dev('Litter box', 'tuya');
    integ('hisense', 'Hisense', 'cloud_polling', 'hub'); dev('Aire Pieza', 'hisense'); dev('Aire Living', 'hisense');
    integ('shelly', 'Shelly', 'local_push', 'device'); dev('Plug 1', 'shelly'); dev('Plug 2', 'shelly');
    // an integration that gives its entities no device: a light you can operate, and plain sensors
    integ('daybetter', 'DayBetter', 'local_push', 'hub');
    for (const [e, p] of [['light.desk_strip', 'daybetter'], ['sensor.daybetter_rssi', 'daybetter'], ['sensor.daybetter_uptime', 'daybetter']]) { entities[e] = { entity_id: e, device_id: null, platform: p }; states[e] = { entity_id: e, state: 'on', attributes: { friendly_name: e } }; }
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig(Object.assign({ animations: false }, config)); host.appendChild(c); window.card = c;
    c.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} }, callWS: async (m) => { if (m.type === 'manifest/list') return man; throw new Error('not in test'); } };
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
  }, config);
  const names = () => page.evaluate(() => ({ names: window.card._devs.map((d) => d.n).sort(), groups: window.card._hubs.map((h) => h.n).sort(), pressed: window.card.shadowRoot.getElementById('physBtn').getAttribute('aria-pressed'), stats: window.card.shadowRoot.getElementById('stats').innerText.replace(/\s+/g, ' ') }));
  const PHYSICAL = ['Aire Living', 'Aire Pieza', 'Litter box', 'Plug 1', 'Plug 2', 'light.desk_strip'];
  await mount({ physical_only: true });
  let r = await names();
  assert.deepEqual(r.names, PHYSICAL);
  assert.ok(!r.groups.includes('Other cloud services')); assert.equal(r.pressed, 'true');
  assert.match(r.stats, /Internet 3 Local network 3/);
  assert.deepEqual(await H.linkProblems(page), []);
  // the button brings everything back, and takes it away again
  await page.evaluate(() => window.card.shadowRoot.getElementById('physBtn').click());
  r = await names();
  assert.equal(r.names.length, 10, 'three accounts and the DayBetter sensors are back'); assert.equal(r.pressed, 'false');
  await page.evaluate(() => window.card.shadowRoot.getElementById('physBtn').click());
  assert.deepEqual((await names()).names, PHYSICAL);
  // off by default
  await mount({});
  assert.equal((await names()).names.length, 10);
  assert.deepEqual(page.errors, []);
  await page.close();
});

// ---- shared by the tests below: a small home with a TV set up twice, a phone set up twice and a speaker known by one address
async function mountDupHome(page, config, extra) {
  await page.evaluate(async ([config, extra]) => {
    const devices = {}, entities = {}, states = {};
    const dev = (id, name, o = {}) => { devices[id] = { id, name, manufacturer: o.mf || '', model: o.mo || '', via_device_id: null, connections: o.mac ? [['mac', o.mac]] : [], identifiers: [], disabled_by: null, area_id: null }; };
    const ent = (eid, device_id, platform, state, attributes) => { entities[eid] = { entity_id: eid, device_id, platform }; states[eid] = { entity_id: eid, state, attributes: attributes || {} }; };
    dev('gw', 'UDM Gateway', { mac: 'aa:00:00:00:00:01' }); ent('sensor.gw_a', 'gw', 'unifi', '1'); ent('sensor.gw_b', 'gw', 'unifi', '1');
    dev('fr1', 'Samsung The Frame 65 (QN65LS03BAGXZS)', { mf: 'Samsung' }); ent('media_player.frame', 'fr1', 'samsungtv', 'on');
    dev('fr2', 'Samsung The Frame 65', { mf: 'Samsung Electronics' }); ent('media_player.frame_st', 'fr2', 'smartthings', 'on');
    dev('ph1', 'Pixel 9'); for (let i = 0; i < 3; i++) ent('sensor.pixel_9_' + i, 'ph1', 'mobile_app', '1'); dev('ph2', 'Pixel 9'); ent('media_player.pixel_adb', 'ph2', 'androidtv', 'on');
    dev('spk1', 'Kitchen speaker', { mac: 'aa:00:00:00:00:10' }); ent('media_player.spk1', 'spk1', 'cast', 'on'); ent('sensor.spk1', 'spk1', 'cast', 'on');
    dev('spk2', 'Nest Mini', { mac: 'aa:00:00:00:00:10' }); ent('media_player.spk2', 'spk2', 'dlna_dmr', 'on');
    ent('device_tracker.kitchen_speaker', null, 'unifi', 'home', { mac: 'aa:00:00:00:00:10' });
    for (let i = 0; i < 3; i++) { dev('p' + i, 'Plug ' + i); ent('switch.p' + i, 'p' + i, 'shelly', 'on'); }
    if (extra === 'odd-device') dev('odd', 12345); // a name that is not text: this one entry cannot be read
    if (extra === 'odd-device') ent('switch.odd', 'odd', 'shelly', 'on');
    const man = ['unifi', 'samsungtv', 'smartthings', 'mobile_app', 'androidtv', 'cast', 'dlna_dmr', 'shelly'].map((d) => ({ domain: d, name: d, iot_class: d === 'smartthings' ? 'cloud_push' : 'local_push' }));
    window.saved = window.saved || null; window.calls = [];
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig(Object.assign({ animations: false, group_small: 0 }, config)); host.appendChild(c); window.card = c;
    window.hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '2026.11.1' }, user: { is_admin: true }, connection: { subscribeMessage: async () => () => {} },
      callWS: async (m) => { if (m.type === 'manifest/list') return man; if (m.type === 'frontend/get_user_data') return { value: window.saved };
        if (m.type === 'frontend/set_user_data') { window.saved = JSON.parse(JSON.stringify(m.value)); window.calls.push(m.key); return null; } throw new Error('not in test'); } };
    c.hass = window.hass;
    for (let i = 0; i < 80 && !(c._built && c._mnodes); i++) await new Promise((r) => setTimeout(r, 25));
  }, [config || {}, extra || '']);
}
const dupState = (page) => page.evaluate(() => { const c = window.card, m = c.shadowRoot.getElementById('modal');
  return { names: c._devs.map((d) => d.n).sort(), pending: c._dupPending.length, note: c.shadowRoot.getElementById('note').innerText.replace(/\s+/g, ' '), modal: m.style.display === 'flex' ? m.innerText.replace(/\s+/g, ' ') : null }; });

test('a suspected duplicate is the user\'s call: asked once, remembered for that user', async () => {
  const page = await H.newPage(browser);
  await page.evaluate(() => { window.saved = null; });
  await mountDupHome(page, {});
  let r = await dupState(page);
  assert.equal(r.pending, 2, 'the TV and the phone are suspicions');
  assert.ok(r.names.includes('Samsung The Frame 65') && r.names.includes('Samsung The Frame 65 (QN65LS03BAGXZS)'), 'until answered, both entries are drawn');
  assert.ok(!r.names.includes('Nest Mini'), 'the speaker is known by one address: merged without asking');
  assert.match(r.note, /4 devices may be on the map twice\. Review/);
  // the note opens the question
  await page.evaluate(() => window.card.shadowRoot.getElementById('noteDup').click());
  r = await dupState(page);
  assert.match(r.modal, /Is this one device\? · 1 of 2/); assert.match(r.modal, /Pixel 9 .*androidtv.*Pixel 9 .*Mobile devices/);
  // "no": both stay, and it is not asked again
  await page.evaluate(() => window.card.shadowRoot.getElementById('dDiff').click());
  r = await dupState(page);
  assert.equal(r.pending, 1); assert.equal(r.names.filter((n) => n === 'Pixel 9').length, 2);
  assert.match(r.modal, /Samsung The Frame 65 .*Samsung TV.*smartthings/, 'the next one is asked right away');
  // "yes": drawn once from now on
  await page.evaluate(() => window.card.shadowRoot.getElementById('dSame').click());
  r = await dupState(page);
  assert.equal(r.pending, 0); assert.equal(r.modal, null); assert.doesNotMatch(r.note, /twice/);
  assert.ok(!r.names.includes('Samsung The Frame 65'), 'the cloud entry is folded into the local one');
  assert.deepEqual(await page.evaluate(() => [window.calls, Object.values(window.saved.dup).sort()]), [['connection_map_card', 'connection_map_card'], [false, true]]);
  // a new card (another browser, a reload) gets the answers from Home Assistant
  await mountDupHome(page, {});
  r = await dupState(page);
  assert.equal(r.pending, 0); assert.ok(!r.names.includes('Samsung The Frame 65')); assert.equal(r.names.filter((n) => n === 'Pixel 9').length, 2);
  // "ask me again" from the menu
  await page.evaluate(() => { const c = window.card; c.shadowRoot.getElementById('zexp').click(); c.shadowRoot.getElementById('xr').click(); });
  assert.equal((await dupState(page)).pending, 2);
  // never ask, never merge look-alikes
  await mountDupHome(page, { merge_duplicates: false });
  r = await dupState(page);
  assert.equal(r.pending, 0); assert.ok(r.names.includes('Nest Mini'));
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('one entry that cannot be read is left out and reported; a failed update keeps the last map', async () => {
  const page = await H.newPage(browser);
  await page.evaluate(() => { window.saved = null; });
  await mountDupHome(page, { merge_duplicates: 'auto' }, 'odd-device');
  let r = await page.evaluate(() => { const c = window.card; return { devs: c._devs.length, skipped: c._skipped, note: c.shadowRoot.getElementById('note').innerText.replace(/\s+/g, ' '), dots: c.shadowRoot.querySelectorAll('svg .dev').length }; });
  assert.equal(r.skipped.length, 1); assert.equal(r.skipped[0].integration, 'shelly');
  assert.match(r.note, /1 device could not be read and was left out\. Details/);
  assert.ok(r.dots >= 5, 'the rest of the map is there');
  // now something breaks the whole model: the error is shown and the map that was drawn stays
  r = await page.evaluate(() => { const c = window.card, dots = c.shadowRoot.querySelectorAll('svg .dev').length;
    window.hass.devices.p0.connections = 7; c._remodel();
    const out = { before: dots, after: c.shadowRoot.querySelectorAll('svg .dev').length, error: c._error && c._error.where, note: c.shadowRoot.getElementById('note').innerText.replace(/\s+/g, ' ') };
    window.hass.devices.p0.connections = []; c._remodel(); out.cleared = c._error; out.noteAfter = c.shadowRoot.getElementById('note').innerText.replace(/\s+/g, ' '); return out; });
  assert.equal(r.error, 'model'); assert.equal(r.after, r.before);
  assert.match(r.note, /The map could not be updated\. The last map that worked is still shown\. Details/);
  assert.equal(r.cleared, null); assert.doesNotMatch(r.noteAfter, /could not be updated/);
  await page.close();
});

test('diagnostics describe the map without naming anything in the home', async () => {
  const page = await H.newPage(browser);
  await page.evaluate(() => { window.saved = null; });
  await mountDupHome(page, { title: 'Casa de Jaime', router_name: 'Mi router', core_size: 'compact', colour: 'red' });
  const r = await page.evaluate(() => { const c = window.card; c.shadowRoot.getElementById('zexp').click(); c.shadowRoot.getElementById('xd').click();
    return { text: c.shadowRoot.getElementById('dgText').value, d: c._diagnostics(), core: c._sz.core, notes: c._optNotes }; });
  for (const secret of ['Samsung', 'Frame', 'Pixel', 'Kitchen', 'Plug 0', 'UDM', 'aa:00', 'media_player.', 'sensor.', 'Casa de Jaime', 'Mi router']) assert.ok(!r.text.includes(secret), 'diagnostics must not contain ' + secret);
  assert.equal(r.d.card.length > 0, true); assert.equal(r.d.home_assistant, '2026.11.1'); assert.equal(r.d.user_is_admin, true);
  assert.equal(r.d.totals.devices, 8); assert.equal(r.d.duplicates.waiting_for_an_answer, 2); assert.equal(r.d.duplicates.merged, 1);
  assert.deepEqual(r.d.config.title, '<text>'); assert.equal(r.d.integrations.shelly.devices, 3);
  assert.ok(r.d.groups.some((g) => g.integration === 'shelly' && g.devices === 3 && g.medium === 'local'));
  // option names: the replaced one still works and is reported, a typo is reported
  assert.deepEqual(r.notes, ['deprecated: core_size -> sizes.core', 'unknown: colour']);
  assert.deepEqual(r.d.option_notes, r.notes); assert.equal(r.core, 28);
  await page.close();
});

test('every language has the same texts as English', async () => {
  const page = await H.newPage(browser);
  const r = await page.evaluate(() => window.__connectionMapCardTexts());
  for (const set of ['card', 'editor']) for (const lang of Object.keys(r[set])) {
    if (lang === 'en') continue;
    assert.deepEqual(Object.keys(r[set][lang]).sort(), Object.keys(r[set].en).sort(), set + ' texts in ' + lang);
    for (const k of Object.keys(r[set][lang])) assert.ok(String(r[set][lang][k]).trim(), set + '.' + lang + '.' + k + ' is empty');
  }
  await page.close();
});

test('two entries can be merged by hand, and merged ones split again', async () => {
  const page = await H.newPage(browser);
  await page.evaluate(() => { window.saved = null; });
  await mountDupHome(page, { merge_duplicates: 'auto' });
  const names = () => page.evaluate(() => window.card._devs.map((d) => d.n).sort());
  assert.ok((await names()).includes('Plug 0') && (await names()).includes('Plug 1'));
  // open a device, choose "Merge with another device", search and pick
  let r = await page.evaluate(() => { const c = window.card; c._selDev(c._devs.find((d) => d.n === 'Plug 0')); c.shadowRoot.getElementById('mergeb').click();
    const q = c.shadowRoot.getElementById('mgQ'); q.value = 'plug 1'; q.dispatchEvent(new Event('input'));
    const rows = [...c.shadowRoot.querySelectorAll('#mgList [data-mid]')].map((b) => b.innerText.replace(/\s+/g, ' ')); c.shadowRoot.querySelector('#mgList [data-mid]').click();
    return { rows, modal: c.shadowRoot.getElementById('modal').style.display, panel: c.shadowRoot.getElementById('panel').innerText.replace(/\s+/g, ' ') }; });
  assert.deepEqual(r.rows, ['Plug 1 shelly']); assert.equal(r.modal, 'none');
  assert.match(r.panel, /Also set up as shelly/); assert.match(r.panel, /Split merged devices/);
  assert.equal((await names()).filter((n) => /^Plug [01]$/.test(n)).length, 1, 'one dot for the two entries');
  assert.equal(await page.evaluate(() => Object.values(window.saved.dup).filter((v) => v === true).length), 1, 'remembered like any other answer');
  // split them again
  await page.evaluate(() => window.card.shadowRoot.getElementById('splitb').click());
  assert.equal((await names()).filter((n) => /^Plug [01]$/.test(n)).length, 2);
  // the speaker is merged because the router knows both entries by one address: that can be split too
  assert.ok(!(await names()).includes('Nest Mini'));
  await page.evaluate(() => { const c = window.card; c._selDev(c._devs.find((d) => d.n === 'Kitchen speaker')); c.shadowRoot.getElementById('splitb').click(); });
  assert.ok((await names()).includes('Nest Mini'));
  // with merging turned off there is nothing to merge by hand
  await mountDupHome(page, { merge_duplicates: 'off' });
  assert.equal(await page.evaluate(() => { const c = window.card; c._selDev(c._devs.find((d) => d.n === 'Plug 2')); return !!c.shadowRoot.getElementById('mergeb'); }), false);
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('Matter over Thread is classified from the entity registry without waking sleepy battery sensors', async () => {
  const page = await H.newPage(browser);
  const r = await page.evaluate(async () => {
    const devices = {}, entities = {}, states = {}, fullReg = [], pinged = [];
    // only the Matter devices carry a Matter identifier: the gateway and the access point belong to UniFi
    const dev = (id, name, mac) => { devices[id] = { id, name, via_device_id: null, connections: mac ? [['mac', mac]] : [], identifiers: [[mac ? 'unifi' : 'matter', id]], disabled_by: null, area_id: null }; };
    const ent = (eid, device_id, platform, state, attributes, tk, disabled_by) => {
      const row = { entity_id: eid, device_id, platform, translation_key: tk || null, disabled_by: disabled_by || null };
      fullReg.push(row);
      if (!disabled_by) { entities[eid] = row; states[eid] = { entity_id: eid, state, attributes: attributes || {} }; }
    };
    dev('gw', 'UDM Gateway', 'aa:00:00:00:00:01'); ent('sensor.gw_a', 'gw', 'unifi', '1'); ent('sensor.gw_b', 'gw', 'unifi', '1');
    dev('ap', 'AP Living', 'aa:00:00:00:00:02'); ent('sensor.ap_a', 'ap', 'unifi', '1');
    // Sleepy battery Thread sensor: thread_* entities are disabled by the integration, and live diagnostics would hang 20 s
    dev('leak', 'Leak sensor');
    ent('binary_sensor.leak', 'leak', 'matter', 'off');
    ent('sensor.leak_battery', 'leak', 'matter', '88', { device_class: 'battery' });
    ent('sensor.leak_thread_role', 'leak', 'matter', null, {}, 'thread_routing_role', 'integration');
    // Mains-powered Thread plug: fast diagnostics report routing_end_device
    dev('tplug', 'Thread plug');
    ent('switch.tplug', 'tplug', 'matter', 'on');
    ent('sensor.tplug_thread_role', 'tplug', 'matter', null, {}, 'thread_routing_role', 'integration');
    // Matter over Wi-Fi plug: diagnostics report its MAC so it links to AP Living
    dev('wplug', 'Wi-Fi plug');
    ent('switch.wplug', 'wplug', 'matter', 'on');
    ent('device_tracker.wplug', null, 'unifi', 'home', { mac: 'aa:bb:cc:dd:ee:01', ap_mac: 'aa:00:00:00:00:02', essid: 'IoT', radio: 'ng' });
    const man = [{ domain: 'unifi', name: 'UniFi', iot_class: 'local_push' }, { domain: 'matter', name: 'Matter', iot_class: 'local_push' }];
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false, group_small: 0 }); host.appendChild(c); window.card = c;
    c.hass = {
      language: 'en', states, devices, entities, areas: {}, config: { version: '1' },
      connection: { subscribeMessage: async () => () => {} },
      callWS: async (m) => {
        if (m.type === 'manifest/list') return man;
        if (m.type === 'config/entity_registry/list') return fullReg;
        if (m.type === 'thread/list_datasets') return { datasets: [{ network_name: 'MyThread', preferred: true }] };
        if (m.type === 'matter/node_diagnostics') {
          pinged.push(m.device_id);
          if (m.device_id === 'leak') return new Promise((res) => setTimeout(() => res({ network_type: 'thread' }), 20000));
          if (m.device_id === 'tplug') return { network_type: 'thread', network_name: 'MyThread', node_type: 'routing_end_device' };
          if (m.device_id === 'wplug') return { network_type: 'wifi', network_name: 'IoT', node_type: 'end_device', mac_address: 'AA:BB:CC:DD:EE:01', ip_addresses: ['10.0.0.55'] };
        }
        throw new Error('not in test');
      }
    };
    const t0 = performance.now();
    for (let i = 0; i < 40 && !(c._built && c._mnodes); i++) await new Promise((res) => setTimeout(res, 10));
    const firstMs = performance.now() - t0;
    await new Promise((res) => setTimeout(res, 60));
    const by = (n) => c._devs.find((d) => d.n === n), th = c._hubs.find((h) => h.thread);
    return { firstMs, pinged: pinged.sort(), threadHub: th && [th.n, th.sub, th.dv.map((d) => d.n).sort()],
      routerRing: by('Thread plug').router, sleepyRing: by('Leak sensor').router,
      wifiPath: c._pathOf(by('Wi-Fi plug')).join(' > ') };
  });
  assert.ok(r.firstMs < 500, 'first draw did not wait for sleepy Thread diagnostics: ' + r.firstMs + 'ms');
  assert.deepEqual(r.pinged, ['tplug', 'wplug'], 'sleepy battery Thread sensor was never pinged');
  assert.deepEqual(r.threadHub, ['Thread', 'MyThread', ['Leak sensor', 'Thread plug']]);
  assert.equal(r.routerRing, true);
  assert.equal(r.sleepyRing, false);
  assert.equal(r.wifiPath, 'Wi-Fi plug > Matter > AP Living (Wi-Fi 2.4 GHz) > UDM Gateway > Home Assistant');
  assert.deepEqual(await H.linkProblems(page), []);
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('Thread mesh places end devices behind their Matter router plug with RSSI and LQI', async () => {
  const page = await H.newPage(browser);
  await page.evaluate(async () => {
    const devices = {}, entities = {}, states = {}, fullReg = [], matter = {};
    const add = (id, nodeHex, name, nodeType) => {
      devices[id] = { id, name, identifiers: [['matter', 'deviceid_0000000000000001-' + nodeHex + '-MatterNodeDevice']], connections: [], config_entries: ['ce_mat'], disabled_by: null };
      const eid = 'sensor.' + id;
      const row = { entity_id: eid, device_id: id, platform: 'matter', translation_key: null, disabled_by: null };
      entities[eid] = row; states[eid] = { entity_id: eid, state: 'on', attributes: {} }; fullReg.push(row);
      fullReg.push({ entity_id: eid + '_thread_role', device_id: id, platform: 'matter', translation_key: 'thread_routing_role', disabled_by: 'integration' });
      if (nodeType === 'sleepy_end_device') {
        const be = eid + '_battery';
        entities[be] = { entity_id: be, device_id: id, platform: 'matter' };
        states[be] = { entity_id: be, state: '95', attributes: { device_class: 'battery' } };
        fullReg.push(entities[be]);
      } else {
        matter[id] = { network_type: 'thread', network_name: 'home-thread', node_type: nodeType };
      }
    };
    add('d_leader', '0000000000000033', 'Rack plug', 'routing_end_device');
    add('d_router', '0000000000000034', 'Dishwasher plug', 'routing_end_device');
    add('d_leak', '000000000000001F', 'Leak sensor', 'sleepy_end_device');
    add('d_btn', '0000000000000032', 'Remote button', 'sleepy_end_device');
    const diag = { data: { server: { nodes: [
      { node_id: 51, attributes: { '0/51/0': [{ '4': 'vioFWLJYpxQ=', '7': 4 }], '0/53/1': 6, '0/53/7': [{ '0': 4184815487261952093, '2': 54275, '5': 3, '6': -74, '7': -74, '13': true }, { '0': 12859206485249176173, '2': 45056, '5': 3, '6': -64, '7': -64, '13': false }], '0/53/8': [{ '0': 12859206485249176173, '1': 45056, '2': 44, '3': 6, '4': 1, '5': 3, '6': 3, '8': true, '9': true }, { '0': 0, '1': 54272, '2': 53, '3': 63, '4': 0, '5': 0, '6': 0, '8': true, '9': false }] } },
      { node_id: 52, attributes: { '0/51/0': [{ '4': 'SqWkoW4gyrU=', '7': 4 }], '0/53/1': 5, '0/53/7': [{ '0': 9106268042656607802, '2': 6166, '5': 3, '6': -59, '7': -60, '13': true }, { '0': 12859206485249176173, '2': 45056, '5': 3, '6': -62, '7': -59, '13': false }], '0/53/8': [{ '0': 5378886343208258229, '1': 6144, '2': 6, '3': 63, '4': 0, '5': 0, '6': 0, '8': true, '9': false }, { '0': 12859206485249176173, '1': 45056, '2': 44, '3': 53, '4': 1, '5': 3, '6': 3, '8': true, '9': true }] } },
      { node_id: 31, attributes: { '0/51/0': [{ '4': 'fl/2iagJ7jo=', '6': ['/e79aSfTAAAAAAD//gAYFg=='], '7': 4 }], '0/53/1': 2, '0/53/7': [{ '0': 5378886343208258229, '2': 6144, '5': 3, '6': -54, '7': -55, '13': false }], '0/53/8': [] } },
      { node_id: 50, attributes: { '0/51/0': [{ '4': 'OhNzg3jNSF0=', '6': ['/e79aSfTAAAAAAD//gDUAw=='], '7': 4 }], '0/53/1': 2, '0/53/7': [{ '0': 13702770694735570708, '2': 54272, '5': 3, '6': -15, '7': -67, '13': false }], '0/53/8': [] } }
    ] } } };
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false }); host.appendChild(c); window.card = c;
    c.hass = {
      language: 'en', user: { id: 'u_thread_mesh', is_admin: true }, states, devices, entities, areas: {}, config: { version: '2026.11.1', components: ['matter'] },
      callService: async () => {}, connection: { subscribeMessage: async () => () => {} },
      callApi: async (method, p) => { if (method === 'GET' && p === 'diagnostics/config_entry/ce_mat') return diag; throw new Error('404'); },
      callWS: async (m) => {
        if (m.type === 'manifest/list') return [{ domain: 'matter', name: 'Matter', iot_class: 'local_push' }];
        if (m.type === 'config/entity_registry/list') return fullReg;
        if (m.type === 'thread/list_datasets') return { datasets: [{ network_name: 'home-thread', preferred: true }] };
        if (m.type === 'config_entries/get') return [{ entry_id: 'ce_mat', domain: 'matter', title: 'Matter' }];
        if (m.type === 'matter/node_diagnostics' && matter[m.device_id]) return matter[m.device_id];
        throw new Error('not in test: ' + m.type + ' ' + (m.device_id || ''));
      }
    };
    for (let i = 0; i < 120 && !c._threadMeshOn; i++) await new Promise((r) => setTimeout(r, 25));
  });
  assert.deepEqual(await H.linkProblems(page), []);
  const r = await page.evaluate(() => {
    const c = window.card, by = (n) => c._devs.find((d) => d.n === n);
    c._selDev(by('Leak sensor'));
    const leakPanel = c.shadowRoot.getElementById('panel').innerText.replace(/\s+/g, ' ');
    c._selDev(by('Rack plug'));
    const leaderPanel = c.shadowRoot.getElementById('panel').innerText.replace(/\s+/g, ' ');
    return {
      leakParent: by('Leak sensor').meshParent && by('Leak sensor').meshParent.n,
      btnParent: by('Remote button').meshParent && by('Remote button').meshParent.n,
      leaderParent: by('Rack plug').meshParent,
      leakRssi: by('Leak sensor').rssi,
      btnRssi: by('Remote button').rssi,
      leakSpoke: by('Leak sensor').spoke.getAttribute('class'),
      leakPath: c._pathOf(by('Leak sensor')).join(' > '),
      leakPanel,
      leaderPanel
    };
  });
  assert.equal(r.leakParent, 'Dishwasher plug');
  assert.equal(r.btnParent, 'Rack plug');
  assert.equal(r.leaderParent, null);
  assert.equal(r.leakRssi, -59);
  assert.equal(r.btnRssi, -74);
  assert.match(r.leakSpoke, /meshl/);
  assert.equal(r.leakPath, 'Leak sensor > Dishwasher plug (repeater) > Matter > Thread (home-thread) > Home Assistant');
  assert.match(r.leakPanel, /Connected to Dishwasher plug/);
  assert.match(r.leakPanel, /Signal \(LQI\) 3 \/ 3/);
  assert.match(r.leakPanel, /Signal \(RSSI\) -59 dBm/);
  assert.match(r.leaderPanel, /Leader · Router \/ repeater/);
  assert.deepEqual(page.errors, []);
  await page.close();
});

test('UniFi / UniFi Insights: switches are SW nodes, bare and blocked clients are filtered, and cached client MACs avoid repeat calls', async () => {
  const page = await H.newPage(browser);
  const r = await page.evaluate(async () => {
    try { localStorage.getItem('probe'); } catch (e) {
      const mem = {};
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } },
        configurable: true
      });
    }
    const devices = {}, entities = {}, states = {};
    const dev = (id, name, o = {}) => {
      devices[id] = { id, name, model: o.mo || '', entry_type: o.service ? 'service' : null, via_device_id: o.via || null,
        connections: o.mac ? [['mac', o.mac]] : [], identifiers: [[o.dom || 'unifi', id]], disabled_by: null, area_id: null };
    };
    const ent = (eid, device_id, platform, state, attributes) => {
      entities[eid] = { entity_id: eid, device_id, platform }; states[eid] = { entity_id: eid, state: state || 'on', attributes: attributes || {} };
    };
    // Switch comes before gateway in registry; both unifi and unifi_insights register the gateway MAC
    dev('sw', 'USW Flex Mini', { dom: 'unifi_insights', mo: 'USW Flex Mini', mac: '58:d6:1f:00:00:02' }); ent('binary_sensor.sw_st', 'sw', 'unifi_insights');
    dev('gw', 'Cloud Gateway Max', { mo: 'UCG-Max', mac: '6c:63:f8:00:00:01' }); ent('sensor.gw_up', 'gw', 'unifi');
    dev('gw2', 'Cloud Gateway Max', { dom: 'unifi_insights', mo: 'UCG-Max', mac: '6c:63:f8:00:00:01' }); ent('binary_sensor.gw_st', 'gw2', 'unifi_insights');
    dev('ap', 'U7 Pro XG', { dom: 'unifi_insights', mo: 'U7 Pro XG', mac: '84:78:48:00:00:03' }); ent('binary_sensor.ap_st', 'ap', 'unifi_insights');
    // UniFi client with block switch, bare 0-entity client (disabled tracker), and virtual WLAN service entry: none are APs
    dev('cli', 'Laptop', { mac: 'aa:bb:cc:00:00:99' }); ent('device_tracker.laptop', 'cli', 'unifi', 'home', { mac: 'aa:bb:cc:00:00:99' }); ent('switch.laptop_blocked', 'cli', 'unifi', 'on');
    dev('bare_cli', 'Smartwatch', { mac: 'aa:bb:cc:00:00:88' });
    dev('wlan', 'IoT WiFi', { mo: 'UniFi WLAN', service: true }); ent('switch.iot_wifi', 'wlan', 'unifi', 'on');
    dev('fw', 'Firewall policies', { dom: 'unifi_insights', mo: 'UniFi Firewall Policies' });
    // Hue Bridge (via UniFi Insights), Sonos on U7 Pro XG, and Apple TV wired to port 2 via native unifi sw_mac attributes
    dev('hue', 'Hue Bridge', { dom: 'hue', mac: 'c4:29:96:00:00:10' }); ent('sensor.hue_st', 'hue', 'hue');
    for (let i = 0; i < 3; i++) { dev('l' + i, 'Lamp ' + i, { dom: 'hue', via: 'hue' }); ent('light.l' + i, 'l' + i, 'hue'); }
    dev('sonos', 'Arc Ultra', { dom: 'sonos', mac: 'c4:38:75:00:00:20' }); ent('media_player.arc', 'sonos', 'sonos');
    dev('atv', 'Living TV Box', { dom: 'apple_tv', mac: 'c0:95:6d:00:00:30' }); ent('media_player.atv', 'atv', 'apple_tv');
    ent('device_tracker.atv', null, 'unifi', 'home', { mac: 'c0:95:6d:00:00:30', is_wired: true, sw_mac: '58:d6:1f:00:00:02', sw_port: 2, wired_rate_mbps: 1000 });
    const topo = {
      nodes: [
        { id: 'wan1', kind: 'wan', name: 'WAN', ha_device_id: 'gw2' },
        { id: 'n_gw', kind: 'gateway', name: 'Cloud Gateway Max', state: 'online', ha_device_id: 'gw2' },
        { id: 'n_sw', kind: 'switch', name: 'USW Flex Mini', state: 'online', ha_device_id: 'sw' },
        { id: 'n_ap', kind: 'access_point', name: 'U7 Pro XG', state: 'online', ha_device_id: 'ap' },
        { id: 'c_hue', kind: 'client', name: 'Hue Bridge Pro', state: 'online', connection: 'wired', vlan_id: 3, network_name: 'IoT' },
        { id: 'c_sonos', kind: 'client', name: 'Arc Ultra', state: 'online', connection: 'wireless', vlan_id: 2, network_name: 'Media' }
      ],
      edges: [
        { source: 'n_gw', target: 'wan1', medium: 'wired' },
        { source: 'n_sw', target: 'n_gw', medium: 'wired', parent_port: 3, speed_mbps: 1000 },
        { source: 'n_ap', target: 'n_gw', medium: 'wired', parent_port: 4, speed_mbps: 2500 },
        { source: 'c_hue', target: 'n_sw', medium: 'wired', parent_port: 4, speed_mbps: 100 },
        { source: 'c_sonos', target: 'n_ap', medium: 'wireless' }
      ]
    };
    const dets = {
      c_hue: { kind: 'client', mac_address: 'c4:29:96:00:00:10', ip_address: '192.168.50.84' },
      c_sonos: { kind: 'client', mac_address: 'c4:38:75:00:00:20', ip_address: '192.168.1.56' }
    };
    const man = [['unifi', 'UniFi'], ['unifi_insights', 'UniFi Insights'], ['hue', 'Philips Hue'], ['sonos', 'Sonos'], ['apple_tv', 'Apple TV']].map((d) => ({ domain: d[0], name: d[1], iot_class: 'local_push' }));
    const asked = [];
    const makeHass = () => ({
      language: 'en', user: { id: 'u_unifi_cache', is_admin: true }, states, devices, entities, areas: {}, config: { version: '1', components: ['unifi', 'unifi_insights'] },
      connection: { subscribeMessage: async () => () => {} },
      callWS: async (m) => {
        if (m.type === 'manifest/list') return man;
        if (m.type === 'unifi_insights/topology/sources') return [{ entry_id: 'e1', sites: [{ id: 's1' }] }];
        if (m.type === 'unifi_insights/topology/get') return topo;
        if (m.type === 'unifi_insights/topology/node_details') { asked.push(m.node_id); return dets[m.node_id] || {}; }
        throw new Error('not in test: ' + m.type);
      }
    });
    const host = document.getElementById('host'); host.innerHTML = '';
    let c = document.createElement('connection-map-card'); c.setConfig({ animations: false, group_small: 0 }); host.appendChild(c); window.card = c;
    c.hass = makeHass();
    for (let i = 0; i < 120 && !(c._built && c._uiClients); i++) await new Promise((res) => setTimeout(res, 25));
    await new Promise((res) => setTimeout(res, 40));
    const firstAsked = asked.slice().sort();
    // Reloading uses cached client MACs: zero node_details calls on second mount
    asked.length = 0;
    host.innerHTML = '';
    c = document.createElement('connection-map-card'); c.setConfig({ animations: false, group_small: 0 }); host.appendChild(c); window.card = c;
    c.hass = makeHass();
    for (let i = 0; i < 120 && !(c._built && c._uiClients); i++) await new Promise((res) => setTimeout(res, 25));
    await new Promise((res) => setTimeout(res, 40));
    const by = (n) => c._devs.find((d) => d.n === n);
    return {
      firstAsked,
      secondAsked: asked.slice(),
      main: c._router.n,
      routers: c._routers.map((x) => x.n + ':' + (x.sw ? 'SW' : 'AP')).sort(),
      swBadge: c._rnodes['USW Flex Mini'].g.querySelector('text').textContent,
      huePath: c._pathOf(by('Lamp 0')).join(' > '),
      atvPath: c._pathOf(by('Living TV Box')).join(' > '),
      sonosPath: c._pathOf(by('Arc Ultra')).join(' > ')
    };
  });
  assert.deepEqual(r.firstAsked, ['c_hue', 'c_sonos'], 'gateway, switch and AP use ha_device_id MACs without node_details');
  assert.deepEqual(r.secondAsked, [], 'cached client MACs make zero node_details requests on reload');
  assert.equal(r.main, 'Cloud Gateway Max');
  assert.deepEqual(r.routers, ['Cloud Gateway Max:AP', 'U7 Pro XG:AP', 'USW Flex Mini:SW'], 'blocked/bare clients, WLANs and duplicate gateway MACs are excluded');
  assert.equal(r.swBadge, 'SW');
  assert.equal(r.huePath, 'Lamp 0 > Hue Bridge > Philips Hue > USW Flex Mini (Ethernet · 100 Mbps · Port 4) > Cloud Gateway Max > Home Assistant');
  assert.equal(r.atvPath, 'Living TV Box > Apple TV > USW Flex Mini (Ethernet · 1 Gbps · Port 2) > Cloud Gateway Max > Home Assistant');
  assert.equal(r.sonosPath, 'Arc Ultra > Sonos > U7 Pro XG (Wi-Fi) > Cloud Gateway Max > Home Assistant');
  assert.deepEqual(await H.linkProblems(page), []);
  assert.deepEqual(page.errors, []);
  await page.close();
});
