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
