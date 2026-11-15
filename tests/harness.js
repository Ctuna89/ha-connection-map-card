// Test harness: loads the card in a headless browser, feeds it a fake `hass`, and measures what it drew.
// Everything inside page.evaluate() runs in the browser.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const CARD = fs.readFileSync(path.join(__dirname, '..', 'ha-connection-map-card.js'), 'utf8');

async function launch() { return chromium.launch(); }

async function newPage(browser, viewport) {
  const page = await browser.newPage({ viewport: viewport || { width: 1400, height: 950 } });
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  await page.setContent('<html><body style="margin:0"><div id="host"></div><div id="ed"></div></body></html>');
  await page.addScriptTag({ content: CARD });
  return page;
}

// Mount the card with one of its built-in demo installations and wait until it has loaded everything
// (the demo answers the Bluetooth, Matter and Zigbee questions a few seconds after the first draw).
async function mountDemo(page, config, opts) {
  await page.evaluate((config) => {
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig(config); host.appendChild(c); window.card = c;
    c.hass = { language: config.language || 'en', states: {}, devices: {}, entities: {}, areas: {}, config: { version: '2026.11.1' },
      callWS: async () => { throw new Error('not in test'); }, connection: { subscribeMessage: async () => () => {} } };
  }, config);
  await page.waitForFunction(() => window.card._built && window.card._mnodes);
  if (!opts || opts.settle !== false) await page.waitForTimeout(5500);
}

// Mount the card with a random installation built from a seed: routers, access points, integrations on Wi-Fi or cable,
// hubs with children, cloud services, Z-Wave, Zigbee, a coordinator stick and Matter devices on Thread.
async function mountRandom(page, seed) {
  await page.evaluate(async (seed) => {
    let s = seed * 7919 + 13; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const mac = () => Array.from({ length: 6 }, () => ('0' + ri(0, 255).toString(16)).slice(-2)).join(':');
    const devices = {}, entities = {}, states = {}, man = [], matter = {}; let seq = 0;
    const dev = (p, n, o = {}) => { const id = 'd' + (++seq); devices[id] = { id, name: n, via_device_id: o.via || null, connections: o.mac ? [['mac', o.mac]] : [], identifiers: [], disabled_by: null, area_id: null };
      for (let k = 0; k < (o.ents || 1); k++) { const e = 'sensor.e' + seq + '_' + k; entities[e] = { entity_id: e, device_id: id, platform: p }; states[e] = { entity_id: e, state: 'on', attributes: {} }; } return id; };
    const aps = [], nAp = rnd() < 0.2 ? 0 : ri(1, 7), hasRouter = rnd() < 0.9;
    const trk = (m, ap) => { const e = 'device_tracker.t' + (++seq); entities[e] = { entity_id: e, device_id: null, platform: 'unifi' }; states[e] = { entity_id: e, state: 'home', attributes: ap ? { mac: m, ap_mac: ap, essid: 'x', radio: 'ng' } : { mac: m } }; };
    if (hasRouter) { man.push({ domain: 'unifi', name: 'UniFi', iot_class: 'local_push' }); dev('unifi', 'UDM Gateway', { mac: mac(), ents: 6 }); for (let i = 0; i < nAp; i++) { const m = mac(); aps.push(m); dev('unifi', 'AP ' + i, { mac: m, ents: 4 }); } }
    const pickAp = (bias) => !aps.length || rnd() < 0.25 ? null : (bias != null && rnd() < 0.8 ? aps[bias] : aps[ri(0, aps.length - 1)]);
    for (let i = 0, n = ri(1, 14); i < n; i++) { const d = 'loc' + i; man.push({ domain: d, name: 'Local ' + i, iot_class: 'local_push' }); const bias = aps.length ? ri(0, aps.length - 1) : null;
      for (let k = 0, c = ri(1, rnd() < 0.2 ? 45 : 12); k < c; k++) { const m = mac(); dev(d, d + '.' + k, { mac: m }); if (hasRouter) trk(m, pickAp(bias)); }
      // power strips: a device of the same integration with outlets of its own (drawn as a family inside the group)
      for (let k = 0, c = rnd() < 0.35 ? ri(1, 4) : 0; k < c; k++) { const st = dev(d, d + ' strip ' + k, { mac: mac(), ents: 2 }); for (let q = 0, w = ri(2, 8); q < w; q++) dev(d, d + ' strip ' + k + ' outlet ' + q, { via: st }); } }
    for (let i = 0, n = ri(0, 4); i < n; i++) { const d = 'hubint' + i; man.push({ domain: d, name: 'HubInt ' + i, iot_class: 'local_push' }); const m = mac(); const h = dev(d, 'Bridge ' + i, { mac: m, ents: 2 }); if (hasRouter) trk(m, pickAp());
      for (let k = 0, c = ri(2, 50); k < c; k++) dev(d, 'child ' + i + '.' + k, { via: h }); }
    for (let i = 0, n = ri(0, 9); i < n; i++) { const d = 'cl' + i; man.push({ domain: d, name: 'Cloud ' + i, iot_class: 'cloud_push' }); for (let k = 0, c = ri(1, 15); k < c; k++) dev(d, d + '.' + k); }
    if (rnd() < 0.6) { man.push({ domain: 'zwave_js', name: 'Z-Wave', iot_class: 'local_push' }); const z = dev('zwave_js', 'Z controller', { ents: 2 }); for (let k = 0, c = ri(2, 30); k < c; k++) dev('zwave_js', 'zw' + k, { via: z }); }
    if (rnd() < 0.6) { man.push({ domain: 'zha', name: 'ZHA', iot_class: 'local_polling' }); const z = dev('zha', 'ZHA coordinator', { ents: 2 }); for (let k = 0, c = ri(2, 60); k < c; k++) dev('zha', 'zb' + k, { via: z }); }
    if (rnd() < 0.5) dev('homeassistant_sky_connect', 'Home Assistant SkyConnect', {});
    if (rnd() < 0.5) { man.push({ domain: 'matter', name: 'Matter', iot_class: 'local_push' }); for (let k = 0, c = ri(1, 8); k < c; k++) matter[dev('matter', 'th' + k)] = { network_type: 'thread', network_name: 'net', node_type: 'end_device' }; }
    const hass = { language: 'en', states, devices, entities, areas: {}, config: { version: '1' }, connection: { subscribeMessage: async () => () => {} },
      callWS: async (m) => { if (m.type === 'manifest/list') return man; if (m.type === 'matter/node_diagnostics' && matter[m.device_id]) return matter[m.device_id]; throw new Error('not in test'); } };
    const host = document.getElementById('host'); host.innerHTML = '';
    const c = document.createElement('connection-map-card'); c.setConfig({ animations: false, group_small: seed % 3 ? 1 : 0 }); host.appendChild(c); c.hass = hass; window.card = c;
    for (let i = 0; i < 80 && !(c._built && c._mnodes && (!Object.keys(matter).length || c._matter)); i++) await new Promise((r) => setTimeout(r, 25));
    await new Promise((r) => setTimeout(r, 30));
  }, seed);
}

// Rule 1: two links never cross, and a link never runs over a bubble that is not one of its ends.
// Measured from the positions the card ended up with, independently of the card's own check.
function linkProblems(page) {
  return page.evaluate(() => {
    const c = window.card, core = c._core, E = [], S = [];
    Object.keys(c._mnodes).forEach((m) => E.push({ a: core, b: c._mnodes[m], n: 'home>' + m }));
    Object.keys(c._rnodes || {}).forEach((k) => { const n = c._rnodes[k]; if (n.router) E.push({ a: c._mnodes.local, b: n, n: 'router>' + k }); });
    c._hubs.forEach((h) => E.push({ a: h.from || core, b: h, n: '>' + h.n }));
    c._devs.forEach((d) => { const tree = d.meshParent && d.meshParent.x != null && d.hub.tree; S.push({ a: tree ? d.meshParent : d.hub, b: d, n: d.n, hub: d.hub }); });
    const w = (p, q, r) => (r.y - p.y) * (q.x - p.x) - (q.y - p.y) * (r.x - p.x);
    const X = (e, f) => !(e.a === f.a || e.a === f.b || e.b === f.a || e.b === f.b) && w(e.a, e.b, f.a) * w(e.a, e.b, f.b) < 0 && w(f.a, f.b, e.a) * w(f.a, f.b, e.b) < 0;
    const out = [];
    for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) if (X(E[i], E[j])) out.push('links cross: ' + E[i].n + ' × ' + E[j].n);
    for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) if (X(S[i], S[j])) out.push('device lines cross: ' + S[i].n + ' × ' + S[j].n);
    E.forEach((e) => S.forEach((s) => { if (s.hub !== e.b && s.hub !== e.a && X(e, s)) out.push('link crosses a device line: ' + e.n + ' × ' + s.n); }));
    const Z = c._sz, D = [{ o: core, r: Z.core * 1.25, n: 'Home Assistant' }];
    Object.keys(c._mnodes).forEach((m) => D.push({ o: c._mnodes[m], r: c._mnodes[m].r, n: m }));
    Object.keys(c._rnodes || {}).forEach((k) => { if (c._rnodes[k].router) D.push({ o: c._rnodes[k], r: c._rnodes[k].r, n: k }); });
    c._hubs.forEach((h) => D.push({ o: h, r: h.outer + Z.dev, n: h.n }));
    E.forEach((e) => D.forEach((d) => { if (d.o === e.a || d.o === e.b) return; const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, t = Math.max(0, Math.min(1, ((d.o.x - e.a.x) * dx + (d.o.y - e.a.y) * dy) / (dx * dx + dy * dy)));
      if (Math.hypot(d.o.x - e.a.x - t * dx, d.o.y - e.a.y - t * dy) < d.r) out.push('link over a bubble: ' + e.n + ' over ' + d.n); }));
    // Rule 3: dots never sit on top of each other, or on their hub's bubble.
    const drawn = c._devs.filter((d) => d.g);
    for (let i = 0; i < drawn.length; i++) {
      const a = drawn[i]; if (Math.hypot(a.x - a.hub.x, a.y - a.hub.y) < Z.hub + Z.dev - 0.5) out.push('dot on its hub: ' + a.n);
      for (let j = i + 1; j < drawn.length; j++) if (Math.hypot(a.x - drawn[j].x, a.y - drawn[j].y) < 2 * Z.dev - 0.5) out.push('dots overlap: ' + a.n + ' × ' + drawn[j].n);
    }
    // Rule 4: a group's own link reaches its bubble without running over its dots or crossing their lines.
    c._hubs.forEach((h) => { const e = { a: h.from || core, b: h };
      drawn.forEach((d) => { if (d.hub !== h) return; const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, t = Math.max(0, Math.min(1, ((d.x - e.a.x) * dx + (d.y - e.a.y) * dy) / (dx * dx + dy * dy)));
        if (Math.hypot(d.x - e.a.x - t * dx, d.y - e.a.y - t * dy) < Z.dev) out.push('link over a dot of its own group: ' + h.n + ' over ' + d.n); });
      S.forEach((sp) => { if (sp.hub === h && sp.a !== h && X(e, sp)) out.push('link crosses a line of its own group: ' + h.n + ' × ' + sp.n); }); });
    if (c._linkProblems) out.push('the card itself reports ' + c._linkProblems + ' link problems');
    return out;
  });
}

// Rule 2: a label is never drawn over another label or over a bubble. Measured on screen.
function labelProblems(page) {
  return page.evaluate(async () => {
    await new Promise((r) => setTimeout(r, 450));
    const svg = window.card.shadowRoot.querySelector('svg'), vis = (e) => e.style.display !== 'none';
    const R = [...svg.querySelectorAll('text.tl, text.elbl, text.dl')].filter(vis).map((e) => ({ t: e.textContent, r: e.getBoundingClientRect() }));
    const out = [];
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i].r, b = R[j].r; if (a.left < b.right - 0.5 && a.right > b.left + 0.5 && a.top < b.bottom - 0.5 && a.bottom > b.top + 0.5) out.push('labels overlap: ' + R[i].t + ' × ' + R[j].t); }
    const discs = [...svg.querySelectorAll('circle.disc, .dev circle:last-of-type')].map((e) => e.getBoundingClientRect());
    R.forEach((x) => discs.forEach((d) => { const cx = d.left + d.width / 2, cy = d.top + d.height / 2, rr = d.width / 2, dx = cx - Math.max(x.r.left, Math.min(cx, x.r.right)), dy = cy - Math.max(x.r.top, Math.min(cy, x.r.bottom)); if (dx * dx + dy * dy < rr * rr - 2) out.push('label over a bubble: ' + x.t); }));
    return out;
  });
}

module.exports = { launch, newPage, mountDemo, mountRandom, linkProblems, labelProblems };
