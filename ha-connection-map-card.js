/*
 * Connection Map Card for Home Assistant
 * Shows how every device reaches Home Assistant: through the cloud, through the
 * local network (directly or via a hub/bridge), or over a local radio coordinator
 * (Zigbee / Z-Wave). Hubs are detected automatically from the device registry.
 *
 * https://github.com/Ctuna89/ha-connection-map-card  ·  MIT License
 */
(function () {
  'use strict';
  var VERSION = '0.2.0';

  var STR = {
    en: {
      title: 'Connection map', loading: 'Loading devices…', cloud: 'Internet', local: 'Local network', radio: 'Local radio',
      cloudSub: 'Cloud integrations', localSub: 'LAN / Wi-Fi', radioSub: 'Zigbee · Z-Wave',
      offline: 'Offline', search: 'Search device, model or area…', allAreas: 'All areas', onlyOffline: 'Offline only',
      summary: 'Summary', devices: 'devices', found: 'devices found', none: 'Nothing matches.', allOnline: 'Everything is online.',
      offlineNow: 'Offline now', model: 'Model', area: 'Area', status: 'Status', online: 'Online', hub: 'Hub', integration: 'Integration',
      path: 'Path to Home Assistant', open: 'Open device', seeAll: 'Show all of', back: 'Back to summary', device: 'Device',
      otherCloud: 'Other cloud services', otherLocal: 'Other local devices', otherRadio: 'Other radio devices',
      hubDesc: 'Bridge or hub: its devices talk to it, and it talks to Home Assistant.',
      intDesc: 'Devices handled directly by this integration.',
      otherDesc: 'Integrations with only a few devices, grouped together.',
      summaryText: 'Each dot is a device. Lines show the path its data takes to Home Assistant.',
      zoomIn: 'Zoom in', zoomOut: 'Zoom out', fit: 'Fit', nodata: 'No devices to show.',
      meshNodes: 'nodes', coordinator: 'Zigbee coordinator', repeater: 'repeater', connectedTo: 'Connected to', signal: 'Signal (LQI)',
      role: 'Role', roleRouter: 'Router / repeater', roleEnd: 'End device', host: 'Host', os: 'System', runsOn: 'Runs on', vm: 'Virtual machine',
      disk: 'Disk', version: 'Version', hostname: 'Hostname', infraLocal: 'Every local device and hub reaches Home Assistant through this network.',
      infraRadio: 'Radio devices talk to this coordinator, directly or through a router (repeater).', coreDesc: 'The machine that runs Home Assistant.',
      meshNote: 'Zigbee routes come from the Zigbee2MQTT network map.', status2: 'Status'
    },
    es: {
      title: 'Mapa de conexiones', loading: 'Cargando equipos…', cloud: 'Internet', local: 'Red local', radio: 'Radio local',
      cloudSub: 'Integraciones en la nube', localSub: 'LAN / Wi-Fi', radioSub: 'Zigbee · Z-Wave',
      offline: 'Sin conexión', search: 'Buscar equipo, modelo o pieza…', allAreas: 'Todas las piezas', onlyOffline: 'Solo sin conexión',
      summary: 'Resumen', devices: 'equipos', found: 'equipos encontrados', none: 'Nada coincide.', allOnline: 'Todo conectado.',
      offlineNow: 'Sin conexión ahora', model: 'Modelo', area: 'Pieza', status: 'Estado', online: 'Conectado', hub: 'Hub', integration: 'Integración',
      path: 'Camino hasta Home Assistant', open: 'Abrir equipo', seeAll: 'Ver todo', back: 'Volver al resumen', device: 'Equipo',
      otherCloud: 'Otros servicios en la nube', otherLocal: 'Otros equipos locales', otherRadio: 'Otros equipos por radio',
      hubDesc: 'Puente o hub: sus equipos le hablan a él, y él le habla a Home Assistant.',
      intDesc: 'Equipos que maneja directamente esta integración.',
      otherDesc: 'Integraciones con pocos equipos, agrupadas.',
      summaryText: 'Cada punto es un equipo. Las líneas muestran el camino que siguen sus datos hasta Home Assistant.',
      zoomIn: 'Acercar', zoomOut: 'Alejar', fit: 'Ver todo', nodata: 'No hay equipos para mostrar.',
      meshNodes: 'nodos', coordinator: 'Coordinador Zigbee', repeater: 'repetidor', connectedTo: 'Conectado a', signal: 'Señal (LQI)',
      role: 'Rol', roleRouter: 'Router / repetidor', roleEnd: 'Equipo final', host: 'Host', os: 'Sistema', runsOn: 'Corre en', vm: 'Máquina virtual',
      disk: 'Disco', version: 'Versión', hostname: 'Nombre', infraLocal: 'Todos los equipos y hubs locales llegan a Home Assistant por esta red.',
      infraRadio: 'Los equipos por radio le hablan a este coordinador, directo o a través de un router (repetidor).', coreDesc: 'La máquina donde corre Home Assistant.',
      meshNote: 'Las rutas Zigbee vienen del mapa de red de Zigbee2MQTT.', status2: 'Estado'
    }
  };

  // Integrations that are helpers / system plumbing, not devices.
  var SKIP = ['hassio', 'sun', 'backup', 'proximity', 'template', 'group', 'switch_as_x', 'min_max', 'derivative',
    'utility_meter', 'threshold', 'trend', 'statistics', 'integration', 'hacs', 'marketplace', 'homeassistant',
    'homeassistant_sky_connect', 'homeassistant_hardware', 'homeassistant_yellow', 'homeassistant_green', 'person', 'zone'];
  var RADIO = ['zha', 'zwave_js', 'zwave_me', 'deconz', 'insteon', 'zigbee2mqtt', 'enocean', 'rfxtrx'];
  // Integrations for routers / access points: drawn as the local network itself, not as devices.
  var ROUTER_INTS = ['huawei_mesh_router', 'huawei_lte', 'unifi', 'fritz', 'tplink_omada', 'tplink_router', 'tplink_deco', 'asuswrt',
    'netgear', 'keenetic_ndms2', 'mikrotik', 'openwrt', 'luci', 'ubus', 'eero', 'google_wifi', 'synology_srm', 'ruckus_unleashed',
    'vodafone_station', 'sfr_box', 'freebox', 'bbox', 'orbi', 'linksys_smart', 'aruba', 'cisco_ios', 'ddwrt', 'tomato', 'opnsense', 'pfsense'];
  // Radio coordinators (USB sticks / built-in radios).
  var COORD_INTS = ['homeassistant_sky_connect', 'homeassistant_hardware', 'homeassistant_yellow', 'homeassistant_connect_zbt2'];
  var VIRT = { oracle: 'VirtualBox', kvm: 'KVM', qemu: 'QEMU', vmware: 'VMware', microsoft: 'Hyper-V', xen: 'Xen', parallels: 'Parallels', lxc: 'LXC', docker: 'Docker' };
  var CLOUD_GUESS = ['smartthings', 'tuya', 'spotify', 'met', 'google_translate', 'anthropic', 'openai_conversation', 'nest',
    'ring', 'tesla_fleet', 'netatmo', 'ecobee', 'alexa', 'google_assistant', 'cloud', 'waze_travel_time', 'openweathermap'];
  var NS = 'http://www.w3.org/2000/svg';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function deg(a) { return a * Math.PI / 180; }

  var CSS = [
    ':host{--cm-cloud:#7c5cff;--cm-local:#0f9f8a;--cm-radio:#e08a00;--cm-core:var(--primary-color,#03a9f4);--cm-bad:var(--error-color,#db4437);',
    '--cm-ink:var(--primary-text-color,#212121);--cm-muted:var(--secondary-text-color,#727272);--cm-line:var(--divider-color,rgba(0,0,0,.12));',
    '--cm-bg:var(--ha-card-background,var(--card-background-color,#fff));--cm-faint:var(--secondary-background-color,rgba(127,127,127,.12));display:block}',
    'ha-card{overflow:hidden}',
    '.wrap{padding:16px;display:flex;flex-direction:column;gap:12px}',
    '.head{display:flex;flex-wrap:wrap;align-items:center;gap:8px;justify-content:space-between}',
    '.head h1{font-size:20px;margin:0;font-weight:600;color:var(--cm-ink)}',
    '.stats{display:flex;flex-wrap:wrap;gap:8px}',
    '.stat{display:inline-flex;align-items:center;gap:7px;background:var(--cm-faint);border:0;border-radius:999px;padding:5px 11px 5px 7px;cursor:pointer;color:var(--cm-ink);font:inherit;font-size:13px;font-weight:600}',
    '.stat i{width:11px;height:11px;border-radius:50%;display:inline-block}',
    '.stat[aria-pressed="false"]{opacity:.4}',
    '.stat.static{cursor:default}',
    '.tools{display:flex;flex-wrap:wrap;gap:8px}',
    '.tools input,.tools select,.btn{font:inherit;font-size:13px;background:var(--cm-bg);color:var(--cm-ink);border:1px solid var(--cm-line);border-radius:10px;padding:7px 11px}',
    '.tools input{flex:1 1 180px;min-width:0}',
    '.btn{cursor:pointer}',
    '.btn[aria-pressed="true"]{border-color:var(--cm-bad);color:var(--cm-bad);font-weight:600}',
    '.main{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}',
    '.main.wide{grid-template-columns:minmax(0,1fr) 300px;align-items:start}',
    '.map{position:relative;border:1px solid var(--cm-line);border-radius:14px;overflow:hidden;min-width:0}',
    '.map svg{display:block;width:100%;height:auto;touch-action:none;user-select:none}',
    '.zoom{position:absolute;right:8px;top:8px;display:flex;gap:6px}',
    '.zoom .btn{padding:3px 10px;font-weight:700}',
    '.legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:var(--cm-muted);padding:8px 12px;border-top:1px solid var(--cm-line)}',
    '.legend span{display:inline-flex;align-items:center;gap:5px}.legend i{width:10px;height:10px;border-radius:50%;display:inline-block}',
    '.panel{border:1px solid var(--cm-line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:9px;min-width:0;color:var(--cm-ink)}',
    '.panel h2{font-size:17px;margin:0;font-weight:600}',
    '.eyebrow{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase}',
    '.panel p{margin:0;color:var(--cm-muted);font-size:13px}',
    '.route{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:12px}',
    '.route span{background:var(--cm-faint);border-radius:7px;padding:2px 7px}.route em{font-style:normal;color:var(--cm-muted)}',
    '.list{display:flex;flex-direction:column;gap:1px;max-height:360px;overflow:auto;margin:0 -6px;padding:0 6px}',
    '.item{display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:9px;align-items:center;padding:6px 7px;border-radius:8px;cursor:pointer;border:0;background:none;color:inherit;font:inherit;font-size:13px;text-align:left;width:100%}',
    '.item:hover,.item.sel{background:var(--cm-faint)}.item i{width:10px;height:10px;border-radius:50%}',
    '.item .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.item small{color:var(--cm-muted);font-size:11.5px;white-space:nowrap}',
    '.off{color:var(--cm-bad)!important;font-weight:600}',
    '.kv{display:grid;grid-template-columns:auto minmax(0,1fr);gap:3px 12px;font-size:13px;margin:0}.kv dt{color:var(--cm-muted)}.kv dd{margin:0}',
    '.msg{padding:32px 12px;text-align:center;color:var(--cm-muted)}',
    '.edge{stroke-width:2;fill:none;stroke-opacity:.55}.edge.hot{stroke-width:4;stroke-opacity:.9}',
    '.spoke{stroke:var(--cm-line);stroke-width:1}.spoke.meshl{stroke:var(--cm-radio);stroke-dasharray:3 2;stroke-opacity:.8}',
    '.dev{cursor:pointer}.dev circle{stroke:var(--cm-bg);stroke-width:1.5}',
    '.dev.offline circle{fill:var(--cm-bg)!important;stroke:var(--cm-bad);stroke-width:2.2}',
    '.dev.sel circle{stroke:var(--cm-ink);stroke-width:3}',
    '.hub,.mnode{cursor:pointer}.disc{fill:var(--cm-bg);stroke-width:2.5}.hub.sel .disc{stroke-width:5}',
    '.lbl{font-size:13px;font-weight:600;fill:var(--cm-ink)}.sub{font-size:10.5px;fill:var(--cm-muted)}',
    '.dim{opacity:.12}',
    '.pulse{animation:cmpulse 2.4s ease-in-out infinite}@keyframes cmpulse{0%,100%{opacity:.3}50%{opacity:.85}}',
    '@media (prefers-reduced-motion:reduce){.pulse{animation:none}}',
    '.tip{position:absolute;pointer-events:none;background:var(--cm-ink);color:var(--cm-bg);font-size:12px;padding:5px 8px;border-radius:7px;white-space:nowrap;transform:translate(-50%,-135%);display:none;z-index:3}'
  ].join('\n');

  class ConnectionMapCard extends HTMLElement {
    static getStubConfig() { return {}; }
    setConfig(config) {
      this._cfg = Object.assign({
        title: null, group_small: 1, exclude_integrations: [], exclude_devices: [], show_trackers: false,
        show_panel: true, colors: {}, show_mesh: true, z2m_base_topic: 'zigbee2mqtt'
      }, config || {});
      if (this._root) this._built = false;
    }
    getCardSize() { return 12; }
    getGridOptions() { return { columns: 'full', min_rows: 8 }; }

    set hass(h) {
      this._hass = h;
      if (!this._root) this._skeleton();
      if (!this._built && !this._loading) { this._load(); return; }
      var now = Date.now();
      if (this._built && now - (this._last || 0) > 5000) { this._last = now; this._status(); this._marks(); }
    }

    _t(k) { var l = (this._hass && this._hass.language || 'en').slice(0, 2); return (STR[l] || STR.en)[k] || STR.en[k]; }

    _skeleton() {
      this._root = this.attachShadow({ mode: 'open' });
      var c = this._cfg.colors || {};
      var vars = (c.cloud ? '--cm-cloud:' + c.cloud + ';' : '') + (c.local ? '--cm-local:' + c.local + ';' : '') + (c.radio ? '--cm-radio:' + c.radio + ';' : '');
      this._root.innerHTML = '<style>' + CSS + '</style><ha-card style="' + vars + '"><div class="wrap"><div class="head"><h1 id="title"></h1><div class="stats" id="stats"></div></div>' +
        '<div class="tools"><input id="q" type="search"><select id="area"></select><button class="btn" id="offBtn" aria-pressed="false"></button></div>' +
        '<div class="main" id="main"><div class="map" id="map"><svg id="svg" viewBox="0 0 1000 700" role="img"></svg><div class="tip" id="tip"></div>' +
        '<div class="legend" id="legend"></div><div class="zoom"><button class="btn" id="zin">+</button><button class="btn" id="zout">−</button><button class="btn" id="zfit">⤢</button></div></div>' +
        '<aside class="panel" id="panel"><div class="msg" id="loading"></div></aside></div></div></ha-card>';
      var self = this;
      this._ro = new ResizeObserver(function (en) { var w = en[0].contentRect.width; self._$('main').classList.toggle('wide', w > 860 && self._cfg.show_panel !== false); });
      this._ro.observe(this._$('main'));
      if (this._cfg.show_panel === false) this._$('panel').style.display = 'none';
    }
    _$(id) { return this._root.getElementById(id); }

    async _load() {
      this._loading = true;
      var t = this._t.bind(this);
      this._$('title').textContent = this._cfg.title || t('title');
      this._$('loading').textContent = t('loading');
      var man = {};
      try { (await this._hass.callWS({ type: 'manifest/list' })).forEach(function (m) { man[m.domain] = m; }); } catch (e) { /* non-admin: fall back to guesses */ }
      this._man = man;
      this._model();
      this._loading = false;
      this._built = true;
      this._render();
      this._extras();
    }

    // Host details (Supervisor, admin only) and the Zigbee2MQTT mesh. Both are optional.
    async _extras() {
      var H = this._hass;
      try {
        var hi = await H.callWS({ type: 'supervisor/api', endpoint: '/host/info', method: 'get' });
        this._host = { os: hi.operating_system, chassis: hi.chassis, virt: hi.virtualization, hostname: hi.hostname, disk: [hi.disk_used, hi.disk_total] };
        this._coreText();
      } catch (e) { /* not supervised or not admin */ }
      if (this._cfg.show_mesh !== false && this._z2mBridge) {
        try { await this._loadMesh(); this._render(); } catch (e) { /* no MQTT access or Zigbee2MQTT did not answer */ }
      }
    }
    _loadMesh() {
      var H = this._hass, base = this._cfg.z2m_base_topic || 'zigbee2mqtt', self = this;
      return new Promise(function (resolve, reject) {
        var done = false, unsub = null;
        var timer = setTimeout(function () { if (!done) { done = true; if (unsub) unsub(); reject(new Error('timeout')); } }, 45000);
        H.connection.subscribeMessage(function (m) {
          if (done) return; done = true; clearTimeout(timer); if (unsub) unsub();
          try { var p = JSON.parse(m.variables.trigger.payload); self._applyMesh(p.data && p.data.value); resolve(); } catch (e) { reject(e); }
        }, { type: 'subscribe_trigger', trigger: { platform: 'mqtt', topic: base + '/bridge/response/networkmap' } }).then(function (u) {
          unsub = u; if (done) u();
          return H.callService('mqtt', 'publish', { topic: base + '/bridge/request/networkmap', payload: JSON.stringify({ type: 'raw', routes: false }) });
        }).catch(function (e) { if (!done) { done = true; clearTimeout(timer); reject(e); } });
      });
    }
    _applyMesh(v) {
      if (!v || !v.nodes) return;
      var byIeee = {}, types = {}, coord = null, parent = {}, lqi = {};
      (this._devs || []).forEach(function (d) { if (d.ieee) byIeee[d.ieee] = d; });
      v.nodes.forEach(function (n) { types[n.ieeeAddr] = n.type; if (n.type === 'Coordinator') coord = n.ieeeAddr; });
      // A link means: target reported source in its neighbour table. relationship 1 = source is a child of target.
      (v.links || []).forEach(function (l) {
        var s = l.source.ieeeAddr, t = l.target.ieeeAddr;
        if (l.relationship === 1) { parent[s] = t; lqi[s] = l.lqi; }
      });
      (v.links || []).forEach(function (l) {
        var s = l.source.ieeeAddr, t = l.target.ieeeAddr;
        if (l.relationship === 0 && types[t] === 'EndDevice' && !parent[t]) { parent[t] = s; lqi[t] = l.lqi; }
        // routers are meshed: keep their strongest link towards the coordinator or another router
        if (types[s] === 'Router' && !parent[s] && (types[t] === 'Coordinator' || types[t] === 'Router') && (lqi[s] == null || l.lqi > lqi[s])) { parent['~' + s] = t; lqi[s] = l.lqi; }
      });
      Object.keys(byIeee).forEach(function (ie) {
        var d = byIeee[ie], p = parent[ie] || parent['~' + ie];
        d.router = types[ie] === 'Router'; d.lqi = lqi[ie];
        d.meshParent = p && p !== coord && byIeee[p] && byIeee[p] !== d ? byIeee[p] : null;
      });
      this._mesh = true;
    }
    _hostText() {
      var h = this._host, t = this._t.bind(this); if (!h) return '';
      var where = h.chassis === 'vm' ? t('vm') + (h.virt && h.virt !== 'none' ? ' (' + (VIRT[h.virt] || h.virt) + ')' : '') : (h.chassis || '');
      return [h.os, where].filter(Boolean).join(' · ');
    }
    _hostShort() {
      var h = this._host; if (!h) return '';
      return h.chassis === 'vm' ? ((VIRT[h.virt] || (h.virt && h.virt !== 'none' ? h.virt : '')) + ' VM').trim() : (h.os || '');
    }
    _coreText() { var e = this._root && this._root.getElementById('coreHost'); if (e) e.textContent = this._hostShort(); }
    _mname(m) {
      if (m === 'local' && this._router) return this._router.n;
      if (m === 'radio' && this._coord) return this._coord;
      return this._t(m);
    }

    _intName(p) { return (this._man[p] && this._man[p].name) || p.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
    _medium(p) {
      if (RADIO.indexOf(p) >= 0) return 'radio';
      var iot = this._man[p] && this._man[p].iot_class;
      if (iot) return iot.indexOf('cloud') === 0 ? 'cloud' : 'local';
      return CLOUD_GUESS.indexOf(p) >= 0 ? 'cloud' : 'local';
    }

    _model() {
      var H = this._hass, cfg = this._cfg, self = this, t = this._t.bind(this);
      var devices = H.devices || {}, entities = H.entities || {}, areas = H.areas || {};
      var byDev = {};
      Object.keys(entities).forEach(function (id) { var e = entities[id]; if (e.device_id) (byDev[e.device_id] = byDev[e.device_id] || []).push(e); });
      var children = {};
      Object.keys(devices).forEach(function (id) { var d = devices[id]; if (d.via_device_id) children[d.via_device_id] = (children[d.via_device_id] || 0) + 1; });
      function primary(list) {
        var c = {}; list.forEach(function (e) { if (e.platform) c[e.platform] = (c[e.platform] || 0) + 1; });
        return Object.keys(c).sort(function (a, b) { return c[b] - c[a]; })[0];
      }
      function isHubDevice(v) { return v && !v.disabled_by && ((children[v.id] || 0) >= 2 || (byDev[v.id] || []).length <= 5); }
      var hubs = {}, devs = [], routers = [], coords = [];
      this._z2mBridge = null;
      function hubFor(key, name, medium, kind, p) {
        if (!hubs[key]) hubs[key] = { key: key, n: name, m: medium, kind: kind, p: p, dv: [] };
        return hubs[key];
      }
      Object.keys(devices).forEach(function (id) {
        var d = devices[id];
        if (d.disabled_by || cfg.exclude_devices.indexOf(id) >= 0) return;
        if (d.entry_type === 'service' && d.via_device_id) return; // virtual rooms/zones/groups exposed by a hub
        var es = byDev[id] || []; if (!es.length) return;
        var p = primary(es); if (!p) return;
        var nm = (d.name_by_user || d.name || id).trim();
        if (COORD_INTS.indexOf(p) >= 0) { coords.push(nm.replace(/\s*\([^)]*\)\s*$/, '').replace(/^Home Assistant\s+/, '')); return; }
        if (p === 'mqtt' && /zigbee2mqtt/i.test(d.manufacturer || '')) self._z2mBridge = d;
        var doms = es.map(function (e) { return e.entity_id.split('.')[0]; });
        if (doms.every(function (x) { return x === 'update'; })) return;
        if (!cfg.show_trackers && doms.every(function (x) { return x === 'device_tracker' || x === 'update'; })) return;
        if (SKIP.indexOf(p) >= 0 || cfg.exclude_integrations.indexOf(p) >= 0) return;
        if (ROUTER_INTS.indexOf(p) >= 0) { routers.push({ id: id, n: nm, p: p, ents: es.map(function (e) { return e.entity_id; }) }); return; }
        if ((children[id] || 0) > 0 && isHubDevice(d)) return; // the hub itself is drawn as a hub node
        var v = d.via_device_id ? devices[d.via_device_id] : null;
        var medium = self._medium(p);
        if (p === 'mqtt' && v && /zigbee2mqtt/i.test((v.manufacturer || '') + ' ' + (v.name || ''))) medium = 'radio';
        var hub;
        if (v && isHubDevice(v)) {
          var vp = primary(byDev[v.id] || []) || p;
          if (medium !== 'radio') medium = self._medium(vp);
          hub = hubFor('dev:' + v.id, (v.name_by_user || v.name || 'Hub'), medium, 'hub', p);
          hub.devId = v.id; hub.sub = self._intName(p);
        } else {
          hub = hubFor('int:' + p + ':' + medium, self._intName(p), medium, 'int', p);
          hub.sub = self._intName(p);
        }
        var x = {
          id: id, n: (d.name_by_user || d.name || id).trim(), mo: [d.manufacturer, d.model].filter(Boolean).join(' · '),
          a: d.area_id && areas[d.area_id] ? areas[d.area_id].name : '', p: p, hub: hub, ents: es.filter(function (e) { return !e.hidden; }).map(function (e) { return e.entity_id; })
        };
        if (!x.ents.length) x.ents = es.map(function (e) { return e.entity_id; });
        var ie = (d.identifiers || []).map(function (i) { return String(i[1] || ''); }).filter(function (s) { return s.indexOf('zigbee2mqtt_0x') === 0; })[0];
        x.ieee = ie ? ie.slice(12) : null;
        hub.dv.push(x); devs.push(x);
      });
      this._routers = routers;
      this._router = routers.filter(function (r) { return /primary|main|principal|gateway|router/i.test(r.n); })[0] || routers[0] || null;
      if (this._router && cfg.router_name) this._router.n = cfg.router_name;
      this._coord = cfg.coordinator_name || coords[0] || null;
      // Merge small integration groups into one "other" node per medium.
      var small = Math.max(0, cfg.group_small | 0);
      Object.keys(hubs).forEach(function (k) {
        var h = hubs[k];
        if (h.kind === 'int' && h.dv.length <= small) {
          var o = hubFor('other:' + h.m, t(h.m === 'cloud' ? 'otherCloud' : h.m === 'radio' ? 'otherRadio' : 'otherLocal'), h.m, 'other', null);
          h.dv.forEach(function (d) { d.hub = o; d.via = self._intName(h.p); o.dv.push(d); });
          delete hubs[k];
        }
      });
      this._hubs = Object.keys(hubs).map(function (k) { return hubs[k]; }).filter(function (h) { return h.dv.length; });
      this._hubs.forEach(function (h) { h.dv.sort(function (a, b) { return (a.a || '~').localeCompare(b.a || '~') || a.n.localeCompare(b.n); }); });
      this._devs = devs;
      this._status();
    }

    _status() {
      var S = this._hass.states;
      (this._devs || []).concat(this._routers || []).forEach(function (d) {
        var st = d.ents.map(function (e) { return S[e] ? S[e].state : 'unavailable'; });
        d.off = st.length > 0 && st.every(function (s) { return s === 'unavailable'; });
      });
    }

    _layout() {
      var hubs = this._hubs, C = { x: 0, y: 0 };
      hubs.forEach(function (h) {
        h.dv.forEach(function (d) { d.rx = null; d.ry = null; });
        // devices that reach the hub through a mesh router are drawn next to that router
        var top = h.dv.filter(function (d) { return !d.meshParent || h.dv.indexOf(d.meshParent) < 0; }), i = 0, ring = 0; h.outer = 30;
        while (i < top.length) {
          var rad = 34 + ring * 15, cap = Math.floor(2 * Math.PI * rad / 15), n = Math.min(cap, top.length - i);
          top.slice(i, i + n).forEach(function (d, k) { var a = -Math.PI / 2 + (k / n) * 2 * Math.PI + ring * 0.2; d.ang = a; d.rx = rad * Math.cos(a); d.ry = rad * Math.sin(a); });
          i += n; ring++; h.outer = rad;
        }
        var level = top, guard = 0;
        while (level.length && guard++ < 6) {
          var next = [];
          level.forEach(function (p) {
            var kids = h.dv.filter(function (d) { return d.meshParent === p && d.rx == null; });
            kids.forEach(function (d, k) {
              var a = p.ang + (k - (kids.length - 1) / 2) * 0.6; d.ang = a;
              d.rx = p.rx + 22 * Math.cos(a); d.ry = p.ry + 22 * Math.sin(a);
              h.outer = Math.max(h.outer, Math.sqrt(d.rx * d.rx + d.ry * d.ry));
            });
            next = next.concat(kids);
          });
          level = next;
        }
        h.dv.forEach(function (d) { if (d.rx == null) { d.ang = Math.PI / 2; d.rx = 0; d.ry = h.outer + 15; h.outer += 15; } });
        h.w = h.outer * 2 + 70;
      });
      var order = ['cloud', 'local', 'radio'], groups = {}, W = 0;
      order.forEach(function (m) { groups[m] = hubs.filter(function (h) { return h.m === m; }).sort(function (a, b) { return b.dv.length - a.dv.length; }); });
      order.forEach(function (m) { groups[m].w = groups[m].reduce(function (s, h) { return s + h.w; }, 0); W += groups[m].w; });
      var present = order.filter(function (m) { return groups[m].length; }), gap = 18, avail = 360 - gap * present.length;
      var spans = {}; present.forEach(function (m) { spans[m] = Math.max(55, avail * groups[m].w / W); });
      var tot = present.reduce(function (s, m) { return s + spans[m]; }, 0);
      present.forEach(function (m) { spans[m] = spans[m] * avail / tot; });
      var start = -90 - (spans.cloud || 0) / 2, mnodes = {};
      present.forEach(function (m) {
        var span = spans[m], g = groups[m];
        var R = Math.max(250, g.w / deg(span));
        var totalDeg = g.w / R * 180 / Math.PI, scale = Math.min(1, span / totalDeg);
        var a = start + (span - totalDeg * scale) / 2, mid = start + span / 2;
        // centre the heaviest hubs in the sector, smaller ones towards the edges
        var arranged = []; g.forEach(function (h, i) { if (i % 2) arranged.push(h); else arranged.unshift(h); });
        arranged.forEach(function (h) {
          var aw = h.w / R * 180 / Math.PI * scale;
          var ac = a + aw / 2; a += aw;
          var rr = R + (arranged.length > 4 && arranged.indexOf(h) % 2 ? h.outer * 0.9 : 0);
          h.x = C.x + rr * Math.cos(deg(ac)); h.y = C.y + rr * Math.sin(deg(ac)); h.ac = ac;
          h.dv.forEach(function (d) { d.x = h.x + d.rx; d.y = h.y + d.ry; });
        });
        mnodes[m] = { m: m, x: C.x + 140 * Math.cos(deg(mid)), y: C.y + 140 * Math.sin(deg(mid)), r: 28, ac: mid };
        start += span + gap;
      });
      this._mnodes = mnodes;
      var minX = -110, minY = -110, maxX = 110, maxY = 110;
      hubs.forEach(function (h) { var p = h.outer + 70; minX = Math.min(minX, h.x - p - 40); maxX = Math.max(maxX, h.x + p + 40); minY = Math.min(minY, h.y - p); maxY = Math.max(maxY, h.y + p); });
      this._vb0 = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
      this._vb = Object.assign({}, this._vb0);
    }

    _render() {
      var self = this, t = this._t.bind(this), svg = this._$('svg');
      var M = { cloud: 'var(--cm-cloud)', local: 'var(--cm-local)', radio: 'var(--cm-radio)', core: 'var(--cm-core)' };
      this._M = M;
      this._$('q').placeholder = t('search');
      this._$('offBtn').textContent = t('onlyOffline');
      this._$('legend').innerHTML = ['cloud', 'local', 'radio'].map(function (m) { return '<span><i style="background:' + M[m] + '"></i>' + esc(t(m)) + '</span>'; }).join('') +
        '<span><i style="border:2px solid var(--cm-bad)"></i>' + esc(t('offline')) + '</span>';
      this._$('zin').title = t('zoomIn'); this._$('zout').title = t('zoomOut'); this._$('zfit').title = t('fit');
      if (!this._devs.length) { this._$('panel').innerHTML = '<div class="msg">' + esc(t('nodata')) + '</div>'; return; }
      this._layout();
      svg.innerHTML = '';
      function el(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; }
      var gE = el('g'), gS = el('g'), gN = el('g'), gH = el('g'), gD = el('g');
      this._edges = [];
      var core = { x: 0, y: 0 };
      Object.keys(this._mnodes).forEach(function (m) {
        var n = self._mnodes[m];
        n.edge = el('line', { x1: 0, y1: 0, x2: n.x, y2: n.y, 'class': 'edge', stroke: M[m], 'stroke-dasharray': m === 'cloud' ? '6 6' : '' }, gE);
      });
      this._hubs.forEach(function (h) {
        var n = self._mnodes[h.m];
        h.edge = el('line', { x1: n.x, y1: n.y, x2: h.x, y2: h.y, 'class': 'edge', stroke: M[h.m], 'stroke-dasharray': h.m === 'cloud' ? '6 6' : '' }, gE);
      });
      this._devs.forEach(function (d) {
        var from = d.meshParent && d.meshParent.x != null ? d.meshParent : d.hub;
        d.spoke = el('line', { x1: from.x, y1: from.y, x2: d.x, y2: d.y, 'class': 'spoke' + (d.meshParent ? ' meshl' : '') }, gS);
        var g = el('g', { 'class': 'dev', tabindex: 0, role: 'button', 'aria-label': d.n }, gD);
        if (d.router) el('circle', { cx: d.x, cy: d.y, r: 10, fill: 'none', stroke: M[d.hub.m], 'stroke-width': 1.6, 'class': 'rring' }, g);
        el('circle', { cx: d.x, cy: d.y, r: 6.2, fill: M[d.hub.m] }, g); d.g = g;
        g.addEventListener('click', function (e) { e.stopPropagation(); self._selDev(d); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._selDev(d); });
        g.addEventListener('pointerenter', function () { self._tip(d.x, d.y, d.n + (d.off ? ' · ' + t('offline') : '')); });
        g.addEventListener('pointerleave', function () { self._$('tip').style.display = 'none'; });
      });
      // core
      var gc = el('g', { 'class': 'mnode' }, gN);
      el('circle', { cx: 0, cy: 0, r: 70, fill: 'none', stroke: M.core, 'stroke-width': 2, 'class': 'pulse' }, gc);
      el('circle', { cx: 0, cy: 0, r: 56, fill: M.core }, gc);
      var tc = el('text', { x: 0, y: -2, 'text-anchor': 'middle', 'class': 'lbl', style: 'fill:#fff;font-size:14px' }, gc); tc.textContent = 'Home Assistant';
      var ts = el('text', { x: 0, y: 15, 'text-anchor': 'middle', 'class': 'sub', style: 'fill:rgba(255,255,255,.85)' }, gc); ts.textContent = (this._hass.config && this._hass.config.version) || '';
      var th = el('text', { x: 0, y: 31, 'text-anchor': 'middle', 'class': 'sub', id: 'coreHost', style: 'fill:rgba(255,255,255,.85)' }, gc); th.textContent = this._hostShort();
      gc.addEventListener('click', function (e) { e.stopPropagation(); self._selCore(); });
      Object.keys(this._mnodes).forEach(function (m) {
        var n = self._mnodes[m], g = el('g', { 'class': 'mnode' }, gN);
        var down = m === 'local' && self._routers && self._routers.length && self._routers.every(function (r) { return r.off; });
        el('circle', { cx: n.x, cy: n.y, r: n.r, 'class': 'disc', stroke: down ? 'var(--cm-bad)' : M[m] }, g);
        var ic = el('text', { x: n.x, y: n.y + 4, 'text-anchor': 'middle', style: 'font-size:11px;font-weight:700;fill:' + M[m] }, g);
        ic.textContent = m === 'cloud' ? 'WWW' : m === 'local' ? (self._router ? 'Wi-Fi' : 'LAN') : (self._coord ? 'USB' : 'RF');
        var oy = Math.sin(deg(n.ac)) >= 0 ? n.r + 15 : -(n.r + 20);
        var name = self._mname(m), sub = t(m + 'Sub');
        if (m === 'local' && self._router) sub = self._intName(self._router.p) + (self._routers.length > 1 ? ' · ' + self._routers.length + ' ' + t('meshNodes') : '');
        if (m === 'radio' && self._coord) sub = t('coordinator');
        var tl = el('text', { x: n.x, y: n.y + oy, 'text-anchor': 'middle', 'class': 'lbl' }, g); tl.textContent = name.length > 30 ? name.slice(0, 29) + '…' : name;
        var tsb = el('text', { x: n.x, y: n.y + oy + 13, 'text-anchor': 'middle', 'class': 'sub' }, g); tsb.textContent = sub;
        g.addEventListener('click', function (e) { e.stopPropagation(); self._selMedium(m); });
      });
      this._hubs.forEach(function (h) {
        var g = el('g', { 'class': 'hub', tabindex: 0, role: 'button', 'aria-label': h.n }, gH);
        el('circle', { cx: h.x, cy: h.y, r: 22, 'class': 'disc', stroke: M[h.m] }, g);
        var c = el('text', { x: h.x, y: h.y + 5, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:' + M[h.m] }, g); c.textContent = h.dv.length;
        var below = Math.sin(deg(h.ac)) > -0.35;
        var ty = below ? h.y + h.outer + 19 : h.y - h.outer - 22;
        var tl = el('text', { x: h.x, y: ty, 'text-anchor': 'middle', 'class': 'lbl' }, g); tl.textContent = h.n.length > 26 ? h.n.slice(0, 25) + '…' : h.n;
        var tsb = el('text', { x: h.x, y: ty + 13, 'text-anchor': 'middle', 'class': 'sub' }, g); tsb.textContent = h.kind === 'hub' ? h.sub : h.kind === 'other' ? '' : '';
        h.g = g;
        g.addEventListener('click', function (e) { e.stopPropagation(); self._selHub(h); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._selHub(h); });
      });
      this._setVB();
      this._wire();
      this._filters();
      this._marks();
    }

    _wire() {
      if (this._wired) return; this._wired = true;
      var self = this, svg = this._$('svg'), drag = { on: false, moved: false };
      this._drag = drag;
      this._$('zin').onclick = function () { self._zoom(0.75); };
      this._$('zout').onclick = function () { self._zoom(1.33); };
      this._$('zfit').onclick = function () { self._vb = Object.assign({}, self._vb0); self._setVB(); };
      svg.addEventListener('wheel', function (e) { e.preventDefault(); var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var s = p.matrixTransform(svg.getScreenCTM().inverse()); self._zoom(e.deltaY > 0 ? 1.12 : 0.89, s.x, s.y); }, { passive: false });
      svg.addEventListener('pointerdown', function (e) { drag.on = true; drag.moved = false; drag.x = e.clientX; drag.y = e.clientY; drag.vb = Object.assign({}, self._vb); });
      window.addEventListener('pointermove', function (e) {
        if (!drag.on) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true; if (!drag.moved) return;
        var sc = self._vb.w / svg.getBoundingClientRect().width; self._vb.x = drag.vb.x - dx * sc; self._vb.y = drag.vb.y - dy * sc; self._setVB();
        self._$('tip').style.display = 'none';
      });
      window.addEventListener('pointerup', function () { drag.on = false; setTimeout(function () { drag.moved = false; }, 0); });
      svg.addEventListener('click', function () { if (!drag.moved) self._reset(); });
      this._$('q').addEventListener('input', function (e) { self._S.q = e.target.value.trim().toLowerCase(); self._apply(); self._list(); });
      this._$('area').onchange = function (e) { self._S.area = e.target.value; self._apply(); self._list(); };
      this._$('offBtn').onclick = function (e) { self._S.off = !self._S.off; e.target.setAttribute('aria-pressed', self._S.off); self._apply(); self._list(); };
    }
    _setVB() { var v = this._vb; this._$('svg').setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h); }
    _zoom(f, cx, cy) {
      var v = this._vb; if (cx == null) { cx = v.x + v.w / 2; cy = v.y + v.h / 2; }
      var nw = Math.min(this._vb0.w * 1.6, Math.max(this._vb0.w * 0.15, v.w * f)), k = nw / v.w;
      this._vb = { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, w: nw, h: v.h * k }; this._setVB();
    }
    _tip(x, y, txt) {
      var svg = this._$('svg'), pt = svg.createSVGPoint(); pt.x = x; pt.y = y; var s = pt.matrixTransform(svg.getScreenCTM());
      var b = this._$('map').getBoundingClientRect(), tip = this._$('tip');
      tip.style.left = (s.x - b.left) + 'px'; tip.style.top = (s.y - b.top) + 'px'; tip.textContent = txt; tip.style.display = 'block';
    }

    _filters() {
      var self = this, t = this._t.bind(this), M = this._M;
      this._S = this._S || { med: { cloud: true, local: true, radio: true }, q: '', area: '', off: false, sel: null };
      var stats = this._$('stats'); stats.innerHTML = '';
      ['cloud', 'local', 'radio'].forEach(function (m) {
        var n = self._devs.filter(function (d) { return d.hub.m === m; }).length; if (!n) return;
        var b = document.createElement('button'); b.className = 'stat'; b.setAttribute('aria-pressed', self._S.med[m]);
        b.innerHTML = '<i style="background:' + M[m] + '"></i>' + esc(t(m)) + ' <b>' + n + '</b>';
        b.onclick = function () { self._S.med[m] = !self._S.med[m]; b.setAttribute('aria-pressed', self._S.med[m]); self._apply(); };
        stats.appendChild(b);
      });
      var ob = document.createElement('span'); ob.className = 'stat static'; ob.id = 'offStat'; stats.appendChild(ob);
      var areas = []; this._devs.forEach(function (d) { if (d.a && areas.indexOf(d.a) < 0) areas.push(d.a); }); areas.sort();
      this._$('area').innerHTML = '<option value="">' + esc(t('allAreas')) + '</option>' + areas.map(function (a) { return '<option>' + esc(a) + '</option>'; }).join('');
    }
    _marks() {
      if (!this._devs || !this._S) return;
      var t = this._t.bind(this);
      this._devs.forEach(function (d) { if (d.g) d.g.classList.toggle('offline', !!d.off); });
      var ob = this._$('offStat'), n = this._devs.filter(function (d) { return d.off; }).length;
      if (ob) ob.innerHTML = '<i style="border:2px solid var(--cm-bad)"></i>' + esc(t('offline')) + ' <b class="off">' + n + '</b>';
      this._apply();
      if (!this._S.sel) this._list();
    }
    _vis(d) { var S = this._S; return S.med[d.hub.m] && (!S.off || d.off) && (!S.area || d.a === S.area) && (!S.q || (d.n + ' ' + d.mo + ' ' + d.a + ' ' + d.hub.n + ' ' + (d.via || '')).toLowerCase().indexOf(S.q) >= 0); }
    _apply() {
      var self = this, S = this._S, f = S.q || S.area || S.off;
      this._devs.forEach(function (d) { d.vis = self._vis(d); if (d.g) { d.g.classList.toggle('dim', !d.vis); d.spoke.classList.toggle('dim', !d.vis); } });
      this._hubs.forEach(function (h) { if (!h.g) return; var on = S.med[h.m] && (!f || h.dv.some(function (d) { return d.vis; })); h.g.classList.toggle('dim', !on); h.edge.classList.toggle('dim', !on); });
    }

    _item(d) {
      var M = this._M, t = this._t.bind(this);
      return '<button class="item' + (this._S.sel === d ? ' sel' : '') + '" data-id="' + esc(d.id) + '"><i style="' + (d.off ? 'border:2px solid var(--cm-bad)' : 'background:' + M[d.hub.m]) + '"></i><span class="nm">' + esc(d.n) + '</span><small class="' + (d.off ? 'off' : '') + '">' + (d.off ? esc(t('offline')) : esc(d.a || d.hub.n)) + '</small></button>';
    }
    _bind() {
      var self = this, p = this._$('panel');
      p.querySelectorAll('.item[data-id]').forEach(function (b) { b.onclick = function () { self._selDev(self._devs.find(function (d) { return d.id === b.dataset.id; })); }; });
      p.querySelectorAll('[data-hub]').forEach(function (b) { b.onclick = function () { self._selHub(self._hubs.find(function (h) { return h.key === b.dataset.hub; })); }; });
      var bk = p.querySelector('#back'); if (bk) bk.onclick = function () { self._reset(); };
    }
    _route(arr) { return '<div class="route">' + arr.map(function (x, i) { return (i ? '<em>→</em>' : '') + '<span>' + esc(x) + '</span>'; }).join('') + '</div>'; }
    _pathOf(d) {
      var t = this._t.bind(this), r = [d.n], m = d.hub.m;
      if (m === 'radio') {
        var p = d.meshParent, guard = 0;
        while (p && guard++ < 6) { r.push(p.n + ' (' + t('repeater') + ')'); p = p.meshParent; }
        if (this._coord) r.push(this._coord);
        r.push(d.hub.kind === 'hub' ? d.hub.n : (d.via || this._intName(d.p)));
      } else {
        if (d.hub.kind === 'hub') r.push(d.hub.n);
        r.push(d.via || this._intName(d.p));
        r.push(this._mname(m));
      }
      r.push('Home Assistant');
      return r;
    }
    _clear() {
      (this._devs || []).forEach(function (d) { if (d.g) d.g.classList.remove('sel'); });
      (this._hubs || []).forEach(function (h) { if (h.g) h.g.classList.remove('sel'); if (h.edge) h.edge.classList.remove('hot'); });
      Object.keys(this._mnodes || {}).forEach(function (m) { var n = this._mnodes[m]; if (n.edge) n.edge.classList.remove('hot'); }, this);
    }
    _hot(h) { if (h.edge) h.edge.classList.add('hot'); var n = this._mnodes[h.m]; if (n && n.edge) n.edge.classList.add('hot'); }
    _list() {
      var S = this._S, t = this._t.bind(this), self = this;
      if (S.sel && S.sel.dv) return this._selHub(S.sel, true);
      if (S.sel) return;
      var f = S.q || S.area || S.off, vis = this._devs.filter(function (d) { return d.vis; });
      var html = '<div class="eyebrow" style="color:var(--cm-core)">' + esc(t('summary')) + '</div><h2>' + (f ? vis.length + ' ' + esc(t('found')) : this._devs.length + ' ' + esc(t('devices'))) + '</h2>';
      if (f) html += '<div class="list">' + (vis.map(function (d) { return self._item(d); }).join('') || '<p>' + esc(t('none')) + '</p>') + '</div>';
      else {
        var offs = this._devs.filter(function (d) { return d.off; });
        html += '<p>' + esc(t('summaryText')) + '</p><div class="list">' + this._hubs.slice().sort(function (a, b) { return b.dv.length - a.dv.length; }).map(function (h) {
          return '<button class="item" data-hub="' + esc(h.key) + '"><i style="background:' + self._M[h.m] + '"></i><span class="nm">' + esc(h.n) + '</span><small>' + h.dv.length + '</small></button>';
        }).join('') + '</div><div class="eyebrow off">' + esc(t('offlineNow')) + ' · ' + offs.length + '</div><div class="list">' + (offs.map(function (d) { return self._item(d); }).join('') || '<p>' + esc(t('allOnline')) + '</p>') + '</div>';
      }
      this._$('panel').innerHTML = html; this._bind();
    }
    _selHub(h, keep) {
      if (!h) return; var t = this._t.bind(this), self = this, S = this._S;
      if (!keep) S.sel = h; this._clear(); h.g.classList.add('sel'); this._hot(h);
      var f = S.q || S.area || S.off, list = h.dv.filter(function (d) { return !f || d.vis; }), off = h.dv.filter(function (d) { return d.off; }).length;
      var desc = h.kind === 'hub' ? t('hubDesc') : h.kind === 'other' ? t('otherDesc') : t('intDesc');
      var route = h.m === 'radio' ? [t('device'), this._coord || t('radio'), h.n, 'Home Assistant'] :
        h.kind === 'hub' ? [t('device'), h.n, h.sub, this._mname(h.m), 'Home Assistant'] : [t('device'), h.kind === 'other' ? t('integration') : h.n, this._mname(h.m), 'Home Assistant'];
      if (h.m === 'radio' && this._mesh) desc += ' ' + t('meshNote');
      this._$('panel').innerHTML = '<div class="eyebrow" style="color:' + this._M[h.m] + '">' + esc(t(h.m)) + (h.kind === 'hub' ? ' · ' + esc(t('hub')) : '') + '</div><h2>' + esc(h.n) + '</h2>' + this._route(route) + '<p>' + esc(desc) + '</p>' +
        '<dl class="kv"><dt>' + esc(t('devices')) + '</dt><dd>' + h.dv.length + '</dd>' + (off ? '<dt>' + esc(t('offline')) + '</dt><dd class="off">' + off + '</dd>' : '') + '</dl>' +
        '<div class="list">' + list.map(function (d) { return self._item(d); }).join('') + '</div><button class="btn" id="back">← ' + esc(t('back')) + '</button>';
      this._bind();
    }
    _selMedium(m) {
      var t = this._t.bind(this), self = this; this._S.sel = { medium: m }; this._clear();
      var n = this._mnodes[m]; if (n.edge) n.edge.classList.add('hot');
      var hs = this._hubs.filter(function (h) { return h.m === m; });
      var extra = '';
      if (m === 'local' && this._routers && this._routers.length) {
        extra = '<p>' + esc(t('infraLocal')) + '</p><div class="eyebrow" style="color:var(--cm-muted)">' + esc(this._intName(this._router.p)) + '</div><div class="list">' +
          this._routers.map(function (r) { return '<div class="item"><i style="' + (r.off ? 'border:2px solid var(--cm-bad)' : 'background:' + self._M.local) + '"></i><span class="nm">' + esc(r.n) + '</span><small class="' + (r.off ? 'off' : '') + '">' + esc(r.off ? t('offline') : t('online')) + '</small></div>'; }).join('') + '</div>';
      }
      if (m === 'radio' && this._coord) extra = '<p>' + esc(t('infraRadio')) + '</p>';
      this._$('panel').innerHTML = '<div class="eyebrow" style="color:' + this._M[m] + '">' + esc(t(m)) + '</div><h2>' + esc(this._mname(m)) + '</h2>' + extra + '<div class="list">' +
        hs.map(function (h) { return '<button class="item" data-hub="' + esc(h.key) + '"><i style="background:' + self._M[h.m] + '"></i><span class="nm">' + esc(h.n) + '</span><small>' + h.dv.length + '</small></button>'; }).join('') +
        '</div><button class="btn" id="back">← ' + esc(t('back')) + '</button>';
      this._bind();
    }
    _selDev(d) {
      if (!d) return; var t = this._t.bind(this), self = this, h = d.hub;
      this._S.sel = d; this._clear(); if (d.g) d.g.classList.add('sel'); if (h.g) h.g.classList.add('sel'); this._hot(h);
      this._$('panel').innerHTML = '<div class="eyebrow" style="color:' + this._M[h.m] + '">' + esc(t(h.m)) + '</div><h2>' + esc(d.n) + '</h2><dl class="kv">' +
        (d.mo ? '<dt>' + esc(t('model')) + '</dt><dd>' + esc(d.mo) + '</dd>' : '') + (d.a ? '<dt>' + esc(t('area')) + '</dt><dd>' + esc(d.a) + '</dd>' : '') +
        '<dt>' + esc(t('integration')) + '</dt><dd>' + esc(this._intName(d.p)) + '</dd>' +
        '<dt>' + esc(t('status')) + '</dt><dd class="' + (d.off ? 'off' : '') + '">' + esc(d.off ? t('offline') : t('online')) + '</dd>' +
        (d.router != null && d.ieee ? '<dt>' + esc(t('role')) + '</dt><dd>' + esc(d.router ? t('roleRouter') : t('roleEnd')) + '</dd>' : '') +
        (d.ieee && this._mesh ? '<dt>' + esc(t('connectedTo')) + '</dt><dd>' + esc(d.meshParent ? d.meshParent.n : (this._coord || t('coordinator'))) + '</dd>' : '') +
        (d.lqi != null ? '<dt>' + esc(t('signal')) + '</dt><dd>' + d.lqi + ' / 255</dd>' : '') + '</dl>' +
        '<div class="eyebrow" style="color:var(--cm-muted)">' + esc(t('path')) + '</div>' + this._route(this._pathOf(d)) +
        '<button class="btn" id="open">' + esc(t('open')) + '</button><button class="btn" id="hubb">' + esc(t('seeAll')) + ' ' + esc(h.n) + '</button><button class="btn" id="back">← ' + esc(t('back')) + '</button>';
      this._bind();
      this._$('panel').querySelector('#open').onclick = function () {
        history.pushState(null, '', '/config/devices/device/' + d.id);
        window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
      };
      this._$('panel').querySelector('#hubb').onclick = function () { self._selHub(h); };
    }
    _selCore() {
      var t = this._t.bind(this), h = this._host, cfg = this._hass.config || {};
      this._S.sel = { core: true }; this._clear();
      var rows = '<dt>' + esc(t('version')) + '</dt><dd>' + esc(cfg.version || '') + '</dd>';
      if (h) {
        rows += '<dt>' + esc(t('os')) + '</dt><dd>' + esc(h.os || '') + '</dd>' +
          '<dt>' + esc(t('runsOn')) + '</dt><dd>' + esc(this._hostText().split(' · ').slice(1).join(' · ') || h.chassis || '') + '</dd>' +
          (h.hostname ? '<dt>' + esc(t('hostname')) + '</dt><dd>' + esc(h.hostname) + '</dd>' : '') +
          (h.disk && h.disk[1] ? '<dt>' + esc(t('disk')) + '</dt><dd>' + h.disk[0] + ' / ' + h.disk[1] + ' GB</dd>' : '');
      }
      this._$('panel').innerHTML = '<div class="eyebrow" style="color:var(--cm-core)">' + esc(t('host')) + '</div><h2>Home Assistant</h2><p>' + esc(t('coreDesc')) + '</p><dl class="kv">' + rows + '</dl><button class="btn" id="back">← ' + esc(t('back')) + '</button>';
      this._bind();
    }
    _reset() { if (!this._S) return; this._S.sel = null; this._clear(); this._list(); }
  }

  if (!customElements.get('connection-map-card')) customElements.define('connection-map-card', ConnectionMapCard);
  window.customCards = window.customCards || [];
  window.customCards.push({ type: 'connection-map-card', name: 'Connection Map Card', description: 'Shows how every device reaches Home Assistant: cloud, local network, hubs and local radio.', preview: false, documentationURL: 'https://github.com/Ctuna89/ha-connection-map-card' });
  console.info('%c CONNECTION-MAP-CARD %c v' + VERSION + ' ', 'color:#fff;background:#0f9f8a;font-weight:700', 'color:#0f9f8a;background:#fff');
})();
