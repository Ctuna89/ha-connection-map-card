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
  var VERSION = '0.8.5';

  // Texts of the card, one per line and in alphabetical order, the same in every language.
  // To add a language: copy the whole "en" block, name it with the two-letter code Home Assistant uses ("de", "fr", ...)
  // and translate the values. Do the same in ED, further down, for the visual editor. A text that is missing falls back
  // to English, and the tests fail if a language does not have exactly the keys of English.
  var STR = {
    en: {
      ago: '{t} ago',
      allAreas: 'All areas',
      allOnline: 'Everything is online.',
      alsoAs: 'Also set up as',
      area: 'Area',
      areaTip: 'devices in this area. Click to show only this area.',
      away: 'Off the network',
      awayLong: 'Not connected to the network right now (off or sleeping)',
      back: 'Back to summary',
      backhaul: 'Link to main router',
      bare: 'No entities',
      bluetooth: 'Bluetooth',
      bridgeItself: 'The bridge itself',
      btAdapter: 'Bluetooth adapter',
      btDesc: 'Bluetooth devices: Home Assistant hears them directly or through a Bluetooth proxy.',
      btHeard: 'Devices that this Bluetooth receiver hears best right now.',
      btProxy: 'Bluetooth proxy',
      btSignal: 'Signal (RSSI)',
      cable: 'Cable',
      close: 'Close',
      cloud: 'Internet',
      cloudSub: 'Cloud integrations',
      computers: 'Computers',
      connectedHere: 'Connected to this node',
      connectedTo: 'Connected to',
      coordinator: 'Zigbee coordinator',
      coreDesc: 'The machine that runs Home Assistant.',
      details: 'Details',
      device: 'Device',
      devices: 'devices',
      diagBtn: 'Copy diagnostics',
      diagCopied: 'Copied',
      diagCopy: 'Copy',
      diagHint: 'It has no names, addresses or entity IDs: only counts and how each group was classified. Paste it in a GitHub issue.',
      diagTitle: 'Diagnostics',
      disabled: 'Disabled',
      disabledLong: 'Disabled in Home Assistant',
      disk: 'Disk',
      dupDiff: 'No, they are different',
      dupGroup: 'Group',
      dupLater: 'Decide later',
      dupNote: 'devices may be on the map twice.',
      dupNote1: '1 device may be on the map twice.',
      dupOf: 'of',
      dupReset: 'Ask me again about duplicates',
      dupReview: 'Review',
      dupSame: 'Yes, draw it once',
      dupTitle: 'Is this one device?',
      dupWhyApp: 'The companion app runs on a device with the same name.',
      dupWhyName: 'Two integrations report a device with the same name and maker.',
      entity: 'Entity',
      errHint: 'The last map that worked is still shown.',
      errTitle: 'The map could not be updated.',
      exportAnon: 'Image without names',
      exportBtn: 'Save the map as an image',
      exportFull: 'Image with names',
      exportHint: 'Without names, hubs, routers and devices are numbered: safe to share.',
      fit: 'Fit',
      found: 'devices found',
      host: 'Host',
      hostname: 'Hostname',
      hub: 'Hub',
      hubDesc: 'Bridge or hub: its devices talk to it, and it talks to Home Assistant.',
      infraLocal: 'Every local device and hub reaches Home Assistant through this network.',
      infraRadio: 'Radio devices talk to this coordinator, directly or through a router (repeater).',
      intDesc: 'Devices handled directly by this integration.',
      integration: 'Integration',
      ip: 'IP address',
      layoutBtn: 'Switch between the detailed and the compact map',
      loading: 'Loading devices…',
      local: 'Local network',
      localSub: 'LAN / Wi-Fi',
      mergeHint: 'They will be drawn as one device. You can split them again from the panel of the device.',
      mergeNone: 'No device matches.',
      mergeSearch: 'Search device…',
      mergeTitle: 'Merge with which device?',
      mergeWith: 'Merge with another device…',
      meshNodes: 'nodes',
      meshNote: 'Zigbee routes come from the Zigbee2MQTT network map.',
      meshRefresh: 'Refresh mesh routes',
      meshRefreshing: 'Refreshing mesh…',
      mobile: 'Mobile devices',
      mobileData: 'Mobile data',
      model: 'Model',
      mqttManual: 'MQTT entity without a device',
      nEntities: 'entities without a device',
      network: 'Network',
      nodata: 'No devices to show.',
      noEntities: 'No entities in Home Assistant',
      none: 'Nothing matches.',
      noRoomAp: 'access points are not drawn: there is no room for them without crossing links.',
      noRoomAp1: '1 access point is not drawn: there is no room for it without crossing links.',
      noRoomName: 'labels are hidden at this zoom: there is no room for them.',
      noRoomName1: '1 label is hidden at this zoom: there is no room for it.',
      noRoomSee: 'See them in the router panel',
      noRoomZoom: 'Zoom in to see them',
      notDrawn: 'Not drawn',
      offline: 'Offline',
      offlineNow: 'Offline now',
      online: 'Online',
      onlyBare: 'No entities only',
      onlyDisabled: 'Disabled only',
      onlyOffline: 'Offline only',
      onlyPhysical: 'Physical only',
      onlyPhysicalTip: 'Hide accounts, online services and loose sensors: only things you can touch',
      open: 'Open device',
      openEntity: 'Open entity',
      openIntegration: 'Open integration',
      os: 'System',
      otherCloud: 'Other cloud services',
      otherCloudDev: 'Other cloud devices',
      otherDesc: 'Integrations with only a few devices, grouped together.',
      otherLocal: 'Other local devices',
      otherLocalSvc: 'Other local services',
      otherRadio: 'Other radio devices',
      parentDev: 'Part of',
      path: 'Path to Home Assistant',
      port: 'Port',
      radio: 'Local radio',
      radioSub: 'Zigbee · Z-Wave',
      recent: 'Seen recently',
      recentLong: 'Not answering now. Battery device, last seen',
      recentNow: 'Seen recently',
      remote: 'Away · via internet',
      remoteLong: 'Away from your network: reaches Home Assistant over the internet',
      repeater: 'repeater',
      role: 'Role',
      roleEnd: 'End device',
      roleLeader: 'Leader · Router / repeater',
      roleRouter: 'Router / repeater',
      routerDesc: 'Access point / mesh node of your network.',
      runsOn: 'Runs on',
      search: 'Search device, model or area…',
      seeAll: 'Show all of',
      showAll: 'All devices',
      signal: 'Signal (LQI)',
      skipped: 'devices could not be read and were left out.',
      skipped1: '1 device could not be read and was left out.',
      sortArea: 'Sort: area',
      sortName: 'Sort: name',
      splitMerged: 'Split merged devices',
      status: 'Status',
      status2: 'Status',
      summary: 'Summary',
      summaryText: 'Each dot is a device. Lines show the path its data takes to Home Assistant.',
      switchDesc: 'Network switch of your local network.',
      threadBr: 'Thread border router',
      threadDesc: 'Matter devices on the Thread mesh. They reach Home Assistant through a Thread border router.',
      threadMeshNote: 'Thread routes come from Matter network diagnostics.',
      title: 'Connection map',
      version: 'Version',
      vm: 'Virtual machine',
      wifi: 'Wi-Fi',
      wired: 'Ethernet',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out'
    },
    es: {
      ago: 'hace {t}',
      allAreas: 'Todas las piezas',
      allOnline: 'Todo conectado.',
      alsoAs: 'También configurado como',
      area: 'Pieza',
      areaTip: 'equipos en esta pieza. Clic para ver solo esta pieza.',
      away: 'Fuera de la red',
      awayLong: 'No está conectado a la red ahora (apagado o en reposo)',
      back: 'Volver al resumen',
      backhaul: 'Enlace al router principal',
      bare: 'Sin entidades',
      bluetooth: 'Bluetooth',
      bridgeItself: 'El puente mismo',
      btAdapter: 'Adaptador Bluetooth',
      btDesc: 'Equipos Bluetooth: Home Assistant los escucha directo o a través de un proxy Bluetooth.',
      btHeard: 'Equipos que este receptor Bluetooth escucha mejor en este momento.',
      btProxy: 'Proxy Bluetooth',
      btSignal: 'Señal (RSSI)',
      cable: 'Cable',
      close: 'Cerrar',
      cloud: 'Internet',
      cloudSub: 'Integraciones en la nube',
      computers: 'Computadores',
      connectedHere: 'Conectados a este nodo',
      connectedTo: 'Conectado a',
      coordinator: 'Coordinador Zigbee',
      coreDesc: 'La máquina donde corre Home Assistant.',
      details: 'Detalles',
      device: 'Equipo',
      devices: 'equipos',
      diagBtn: 'Copiar diagnóstico',
      diagCopied: 'Copiado',
      diagCopy: 'Copiar',
      diagHint: 'No lleva nombres, direcciones ni IDs de entidades: solo cantidades y cómo se clasificó cada grupo. Pégalo en un issue de GitHub.',
      diagTitle: 'Diagnóstico',
      disabled: 'Desactivado',
      disabledLong: 'Desactivado en Home Assistant',
      disk: 'Disco',
      dupDiff: 'No, son distintos',
      dupGroup: 'Grupo',
      dupLater: 'Decidir después',
      dupNote: 'equipos pueden estar dos veces en el mapa.',
      dupNote1: '1 equipo puede estar dos veces en el mapa.',
      dupOf: 'de',
      dupReset: 'Volver a preguntar por duplicados',
      dupReview: 'Revisar',
      dupSame: 'Sí, dibujarlo una vez',
      dupTitle: '¿Es un solo equipo?',
      dupWhyApp: 'La app móvil corre en un equipo con el mismo nombre.',
      dupWhyName: 'Dos integraciones informan un equipo con el mismo nombre y fabricante.',
      entity: 'Entidad',
      errHint: 'Se sigue mostrando el último mapa que funcionó.',
      errTitle: 'No se pudo actualizar el mapa.',
      exportAnon: 'Imagen sin nombres',
      exportBtn: 'Guardar el mapa como imagen',
      exportFull: 'Imagen con nombres',
      exportHint: 'Sin nombres, los hubs, routers y equipos van numerados: se puede compartir.',
      fit: 'Ver todo',
      found: 'equipos encontrados',
      host: 'Host',
      hostname: 'Nombre',
      hub: 'Hub',
      hubDesc: 'Puente o hub: sus equipos le hablan a él, y él le habla a Home Assistant.',
      infraLocal: 'Todos los equipos y hubs locales llegan a Home Assistant por esta red.',
      infraRadio: 'Los equipos por radio le hablan a este coordinador, directo o a través de un router (repetidor).',
      intDesc: 'Equipos que maneja directamente esta integración.',
      integration: 'Integración',
      ip: 'Dirección IP',
      layoutBtn: 'Cambiar entre el mapa detallado y el compacto',
      loading: 'Cargando equipos…',
      local: 'Red local',
      localSub: 'LAN / Wi-Fi',
      mergeHint: 'Se dibujarán como un solo equipo. Puedes separarlos después desde el panel del equipo.',
      mergeNone: 'Ningún equipo coincide.',
      mergeSearch: 'Buscar equipo…',
      mergeTitle: '¿Con qué equipo unirlo?',
      mergeWith: 'Unir con otro equipo…',
      meshNodes: 'nodos',
      meshNote: 'Las rutas Zigbee vienen del mapa de red de Zigbee2MQTT.',
      meshRefresh: 'Actualizar rutas de la malla',
      meshRefreshing: 'Actualizando malla…',
      mobile: 'Dispositivos móviles',
      mobileData: 'Datos móviles',
      model: 'Modelo',
      mqttManual: 'Entidad MQTT sin dispositivo',
      nEntities: 'entidades sin dispositivo',
      network: 'Red',
      nodata: 'No hay equipos para mostrar.',
      noEntities: 'Sin entidades en Home Assistant',
      none: 'Nada coincide.',
      noRoomAp: 'puntos de acceso no se dibujan: no hay espacio para ellos sin cruzar líneas.',
      noRoomAp1: '1 punto de acceso no se dibuja: no hay espacio para él sin cruzar líneas.',
      noRoomName: 'etiquetas están ocultas con este zoom: no hay espacio para ellas.',
      noRoomName1: '1 etiqueta está oculta con este zoom: no hay espacio para ella.',
      noRoomSee: 'Verlos en el panel del router',
      noRoomZoom: 'Acerca el mapa para verlas',
      notDrawn: 'No dibujado',
      offline: 'Sin conexión',
      offlineNow: 'Sin conexión ahora',
      online: 'Conectado',
      onlyBare: 'Solo sin entidades',
      onlyDisabled: 'Solo desactivados',
      onlyOffline: 'Solo sin conexión',
      onlyPhysical: 'Solo físicos',
      onlyPhysicalTip: 'Oculta cuentas, servicios en línea y sensores sueltos: solo cosas que se pueden tocar',
      open: 'Abrir equipo',
      openEntity: 'Abrir entidad',
      openIntegration: 'Abrir integración',
      os: 'Sistema',
      otherCloud: 'Otros servicios en la nube',
      otherCloudDev: 'Otros equipos en la nube',
      otherDesc: 'Integraciones con pocos equipos, agrupadas.',
      otherLocal: 'Otros equipos locales',
      otherLocalSvc: 'Otros servicios locales',
      otherRadio: 'Otros equipos por radio',
      parentDev: 'Parte de',
      path: 'Camino hasta Home Assistant',
      port: 'Puerto',
      radio: 'Radio local',
      radioSub: 'Zigbee · Z-Wave',
      recent: 'Visto hace poco',
      recentLong: 'No responde ahora. Equipo a batería, visto por última vez',
      recentNow: 'Vistos hace poco',
      remote: 'Fuera de casa · vía internet',
      remoteLong: 'Fuera de tu red: llega a Home Assistant por internet',
      repeater: 'repetidor',
      role: 'Rol',
      roleEnd: 'Equipo final',
      roleLeader: 'Líder · Router / repetidor',
      roleRouter: 'Router / repetidor',
      routerDesc: 'Punto de acceso / nodo de la red.',
      runsOn: 'Corre en',
      search: 'Buscar equipo, modelo o pieza…',
      seeAll: 'Ver todo',
      showAll: 'Todos los equipos',
      signal: 'Señal (LQI)',
      skipped: 'equipos no se pudieron leer y quedaron fuera.',
      skipped1: '1 equipo no se pudo leer y quedó fuera.',
      sortArea: 'Orden: pieza',
      sortName: 'Orden: nombre',
      splitMerged: 'Separar equipos unidos',
      status: 'Estado',
      status2: 'Estado',
      summary: 'Resumen',
      summaryText: 'Cada punto es un equipo. Las líneas muestran el camino que siguen sus datos hasta Home Assistant.',
      switchDesc: 'Switch de tu red local.',
      threadBr: 'Router de borde Thread',
      threadDesc: 'Equipos Matter en la malla Thread. Llegan a Home Assistant a través de un border router Thread.',
      threadMeshNote: 'Las rutas Thread vienen del diagnóstico de red Matter.',
      title: 'Mapa de conexiones',
      version: 'Versión',
      vm: 'Máquina virtual',
      wifi: 'Wi-Fi',
      wired: 'Cable (Ethernet)',
      zoomIn: 'Acercar',
      zoomOut: 'Alejar'
    }
  };

  // Integrations that are helpers / system plumbing, not devices.
  var SKIP = ['hassio', 'sun', 'backup', 'proximity', 'template', 'group', 'switch_as_x', 'min_max', 'derivative',
    'utility_meter', 'threshold', 'trend', 'statistics', 'integration', 'hacs', 'marketplace', 'homeassistant',
    'homeassistant_sky_connect', 'homeassistant_hardware', 'homeassistant_yellow', 'homeassistant_green', 'person', 'zone'];
  var ZIGBEE = ['zha', 'zigbee2mqtt', 'deconz'];
  var RADIO = ['zha', 'zwave_js', 'zwave_me', 'deconz', 'insteon', 'zigbee2mqtt', 'enocean', 'rfxtrx'];
  // Integrations for routers / access points: drawn as the local network itself, not as devices.
  var ROUTER_INTS = ['huawei_mesh_router', 'huawei_lte', 'unifi', 'unifi_insights', 'fritz', 'tplink_omada', 'tplink_router', 'tplink_deco', 'asuswrt', 'sagemcom_fast',
    'netgear', 'keenetic_ndms2', 'mikrotik', 'openwrt', 'luci', 'ubus', 'eero', 'google_wifi', 'synology_srm', 'ruckus_unleashed',
    'vodafone_station', 'sfr_box', 'freebox', 'bbox', 'orbi', 'linksys_smart', 'aruba', 'cisco_ios', 'ddwrt', 'tomato', 'opnsense', 'pfsense'];
  // Radio coordinators (USB sticks / built-in radios).
  var COORD_INTS = ['homeassistant_sky_connect', 'homeassistant_hardware', 'homeassistant_yellow', 'homeassistant_connect_zbt2'];
  // Short, user-facing names for integrations whose official name is long or technical.
  var SHORT = { hisense_ac_plugin: 'Hisense', anthropic: 'Claude', openai_conversation: 'ChatGPT', google_generative_ai_conversation: 'Gemini',
    samsungtv: 'Samsung TV', androidtv_remote: 'Android TV', dlna_dmr: 'DLNA', wake_on_lan: 'Wake on LAN', hue: 'Philips Hue',
    google_translate: 'Google TTS', waze_travel_time: 'Waze', radio_browser: 'Radio Browser', huawei_mesh_router: 'Huawei Mesh' };
  var VIRT = { oracle: 'VirtualBox', kvm: 'KVM', qemu: 'QEMU', vmware: 'VMware', microsoft: 'Hyper-V', xen: 'Xen', parallels: 'Parallels', lxc: 'LXC', docker: 'Docker' };
  var CLOUD_GUESS = ['smartthings', 'tuya', 'spotify', 'met', 'google_translate', 'anthropic', 'openai_conversation', 'nest',
    'ring', 'tesla_fleet', 'netatmo', 'ecobee', 'alexa', 'google_assistant', 'cloud', 'waze_travel_time', 'openweathermap'];
  // Every option the card takes. Names are stable from 1.0; the replaced ones keep working.
  // Router integrations that register every client of the network as a device of its own, linked to the gateway.
  var CLIENTS_AS_DEVICES = ['netgear', 'sagemcom_fast'];
  var OPTIONS = ['type', 'title', 'language', 'demo', 'layout', 'height', 'sort', 'group_by_area', 'group_small', 'separate_services', 'physical_only', 'show_panel', 'show_export', 'show_mesh', 'show_trackers', 'show_disabled', 'minimap', 'device_labels', 'animations',
    'colors', 'lines', 'sizes', 'names', 'overrides', 'exclude_integrations', 'exclude_devices', 'computers', 'merge_duplicates', 'entities_without_device', 'devices_without_entities', 'recent_hours',
    'main_router', 'router_name', 'coordinator_name', 'thread_via_border_router', 'z2m_base_topic', 'grid_options', 'layout_options', 'view_layout', 'visibility', 'card_mod'];
  var DEPRECATED = { core_size: 'sizes.core', mqtt_entities: 'entities_without_device' };
  var NS = 'http://www.w3.org/2000/svg';

  // "/dev/serial/by-id/usb-ITead_Sonoff_Zigbee_3.0_USB_Dongle_Plus_ab12...-if00-port0" -> "ITead Sonoff Zigbee 3.0 USB Dongle Plus"
  function adapterName(port) {
    port = String(port || ''); if (!port) return '';
    var m = port.match(/^(?:tcp|socket):\/\/([^:/]+)/i); if (m) return 'Network coordinator (' + m[1] + ')';
    var b = port.split('/').pop().replace(/^usb-/, '').replace(/-if\d+(-port\d+)?$/, '').replace(/_[0-9A-Fa-f]{6,}$/, '');
    if (/^tty|^COM\d/i.test(b)) return '';
    return b.replace(/_/g, ' ').replace(/^Nabu Casa Home Assistant /, '').replace(/\s+/g, ' ').trim();
  }

  // ---------- demo mode: synthetic installations to try the card (and its layout) without those devices ----------
  //   demo: unifi  -> UniFi APs (wired + 2.4/5 GHz clients), Hue, Shelly, Sonos, ZHA mesh, Z-Wave, Nest/ecobee cloud
  //   demo: fritz  -> FRITZ!Box + repeater, Zigbee2MQTT on a network coordinator, Tuya/tado cloud, no Supervisor (Docker)
  //   demo: large  -> ~350 devices across 30 integrations
  function makeDemo(kind, real) {
    var devices = {}, entities = {}, states = {}, areas = {}, man = [], src = {}, bts = [], scans = [], matter = {}, matDiag = null, seq = 0, seed = 7;
    var host = null, haIp = null, zha = null, z2mInfo = null, z2mMap = null, i, j;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function mac() { var s = []; for (var k = 0; k < 6; k++) s.push(('0' + Math.floor(rnd() * 256).toString(16)).slice(-2)); return s.join(':'); }
    function area(n) { var id = n.toLowerCase().replace(/\W+/g, '_'); areas[id] = { area_id: id, name: n }; return id; }
    var A = ['Living room', 'Kitchen', 'Bedroom', 'Office', 'Garage', 'Garden', 'Hallway', 'Bathroom'].map(area);
    function integ(domain, name, iot) { man.push({ domain: domain, name: name, iot_class: iot }); }
    function dev(o) {
      var id = 'demo_' + (++seq);
      devices[id] = { id: id, name: o.n, manufacturer: o.mf || '', model: o.mo || '', via_device_id: o.via || null, area_id: o.a || null,
        entry_type: o.svc ? 'service' : null, connections: o.mac ? [['mac', o.mac]] : o.bt ? [['bluetooth', (bts[bts.length] = mac())]] : [], identifiers: o.ieee ? [['mqtt', 'zigbee2mqtt_' + o.ieee]] : [], disabled_by: null };
      for (var k = 0; k < (o.ents || 1); k++) {
        var eid = (o.dom || 'sensor') + '.demo_' + seq + '_' + k;
        entities[eid] = { entity_id: eid, device_id: id, platform: o.p };
        states[eid] = { entity_id: eid, state: o.off || o.rec ? 'unavailable' : 'on', attributes: {}, last_changed: new Date(Date.now() - (o.rec ? 3 : 90) * 3600000).toISOString() };
      }
      if (o.rec || o.bat) { var be = 'sensor.demo_' + seq + '_battery'; entities[be] = { entity_id: be, device_id: id, platform: o.p }; states[be] = { entity_id: be, state: o.rec || o.off ? 'unavailable' : '87', attributes: { device_class: 'battery' }, last_changed: states[eid].last_changed }; }
      return id;
    }
    function trk(name, plat, attrs, home) {
      var eid = 'device_tracker.' + name.toLowerCase().replace(/\W+/g, '_');
      entities[eid] = { entity_id: eid, platform: plat }; states[eid] = { entity_id: eid, state: home === false ? 'not_home' : 'home', attributes: attrs };
    }
    if (kind === 'fritz') {
      integ('fritz', 'AVM FRITZ!Box Tools', 'local_polling'); integ('mqtt', 'MQTT', 'local_push'); integ('tuya', 'Tuya', 'cloud_push');
      integ('tado', 'tado°', 'cloud_polling'); integ('cast', 'Google Cast', 'local_polling'); integ('spotify', 'Spotify', 'cloud_polling'); integ('esphome', 'ESPHome', 'local_push');
      dev({ p: 'fritz', n: 'FRITZ!Box 7590', mo: 'FRITZ!Box 7590', ents: 6 }); dev({ p: 'fritz', n: 'FRITZ!Repeater 1200', mo: 'Repeater 1200', ents: 3 });
      var br = dev({ p: 'mqtt', n: 'Zigbee2MQTT Bridge', mf: 'Zigbee2MQTT', mo: 'Bridge', ents: 4 });
      z2mMap = { nodes: [{ ieeeAddr: '0xc0', type: 'Coordinator' }], links: [] };
      var rs = [];
      for (i = 0; i < 3; i++) { var ie = '0xr' + i; rs.push(ie); dev({ p: 'mqtt', n: 'Smart plug ' + (i + 1), mo: 'TS011F', via: br, ieee: ie, a: A[i], dom: 'switch' }); z2mMap.nodes.push({ ieeeAddr: ie, type: 'Router' }); z2mMap.links.push({ source: { ieeeAddr: ie }, target: { ieeeAddr: '0xc0' }, lqi: 220 - i * 50, relationship: 2 }); }
      for (i = 0; i < 10; i++) { var ie2 = '0xe' + i, par = i < 3 ? '0xc0' : rs[i % 3]; dev({ p: 'mqtt', n: ['Motion', 'Contact', 'Climate'][i % 3] + ' sensor ' + (i + 1), mo: 'Aqara', via: br, ieee: ie2, a: A[i % 8], dom: 'binary_sensor', off: i === 8 }); z2mMap.nodes.push({ ieeeAddr: ie2, type: 'EndDevice' }); z2mMap.links.push({ source: { ieeeAddr: ie2 }, target: { ieeeAddr: par }, lqi: 90 + i * 12, relationship: 1 }); }
      z2mInfo = { coordinator: { type: 'zStack3x0', meta: { revision: 20240710 } }, config: { serial: { port: 'tcp://192.168.178.50:6638' } } };
      for (i = 0; i < 4; i++) { var m = mac(); dev({ p: 'cast', n: ['Kitchen speaker', 'Living room TV', 'Bedroom speaker', 'Office display'][i], mo: 'Nest Audio', mac: m, a: A[i], dom: 'media_player' }); trk('cast_' + i, 'fritz', { mac: m, ip: '192.168.178.' + (30 + i), connected_to: i < 2 ? 'FRITZ!Box 7590' : 'FRITZ!Repeater 1200', connection_type: i === 1 ? 'LAN' : 'WLAN', ssid: 'Home' }, i !== 3); }
      for (i = 0; i < 6; i++) dev({ p: 'tuya', n: 'Tuya ' + ['bulb', 'plug', 'fan', 'heater', 'blind', 'kettle'][i], mo: 'Tuya', a: A[i], dom: 'light' });
      for (i = 0; i < 3; i++) dev({ p: 'tado', n: 'tado ' + ['Living room', 'Bedroom', 'Office'][i], mo: 'Smart Radiator Thermostat', a: A[[0, 2, 3][i]], dom: 'climate' });
      for (i = 0; i < 4; i++) { var m2 = mac(); dev({ p: 'esphome', n: 'ESP node ' + (i + 1), mo: 'ESP32-C3', mac: m2, a: A[i + 2] }); trk('esp_' + i, 'fritz', { mac: m2, connected_to: 'FRITZ!Repeater 1200', connection_type: 'WLAN', ssid: 'Home' }); }
      dev({ p: 'spotify', n: 'Spotify', svc: true, dom: 'media_player' });
    } else if (kind === 'large') {
      integ('unifi', 'UniFi Network', 'local_push'); integ('hue', 'Philips Hue', 'local_push'); integ('mqtt', 'MQTT', 'local_push'); integ('esphome', 'ESPHome', 'local_push');
      integ('shelly', 'Shelly', 'local_push'); integ('tuya', 'Tuya', 'cloud_push'); integ('sonos', 'Sonos', 'local_push'); integ('nest', 'Google Nest', 'cloud_push'); integ('ring', 'Ring', 'cloud_polling'); integ('mobile_app', 'Mobile App', 'local_push');
      var gw = dev({ p: 'unifi', n: 'UDM SE', mo: 'UDM-SE', mac: mac(), ents: 8 }), aps = [];
      for (i = 0; i < 4; i++) { var am = mac(); aps.push(am); dev({ p: 'unifi', n: 'AP ' + ['Ground floor', 'First floor', 'Garage', 'Garden'][i], mo: 'U6-LR', mac: am, ents: 4 }); }
      var hue = dev({ p: 'hue', n: 'Hue Bridge', mo: 'BSB002', ents: 2 }); for (i = 0; i < 60; i++) dev({ p: 'hue', n: 'Hue light ' + (i + 1), via: hue, a: A[i % 8], dom: 'light', off: i % 23 === 5 });
      var br2 = dev({ p: 'mqtt', n: 'Zigbee2MQTT Bridge', mf: 'Zigbee2MQTT', mo: 'Bridge', ents: 4 }); z2mMap = { nodes: [{ ieeeAddr: '0xc0', type: 'Coordinator' }], links: [] };
      var rr = []; for (i = 0; i < 12; i++) { var ri = '0xr' + i; rr.push(ri); dev({ p: 'mqtt', n: 'Router plug ' + (i + 1), via: br2, ieee: ri, a: A[i % 8], dom: 'switch' }); z2mMap.nodes.push({ ieeeAddr: ri, type: 'Router' }); z2mMap.links.push({ source: { ieeeAddr: ri }, target: { ieeeAddr: i < 6 ? '0xc0' : rr[i - 6] }, lqi: 80 + Math.floor(rnd() * 170), relationship: 2 }); }
      for (i = 0; i < 108; i++) { var ei = '0xe' + i; dev({ p: 'mqtt', n: 'Zigbee sensor ' + (i + 1), via: br2, ieee: ei, a: A[i % 8], dom: 'binary_sensor', off: i % 31 === 7 }); z2mMap.nodes.push({ ieeeAddr: ei, type: 'EndDevice' }); z2mMap.links.push({ source: { ieeeAddr: ei }, target: { ieeeAddr: i % 4 === 0 ? '0xc0' : rr[i % 12] }, lqi: 40 + Math.floor(rnd() * 200), relationship: 1 }); }
      z2mInfo = { coordinator: { type: 'EmberZNet', meta: { revision: '7.4.4 [GA]' } }, config: { serial: { port: '/dev/serial/by-id/usb-ITead_Sonoff_Zigbee_3.0_USB_Dongle_Plus_V2_20240123abcdef-if00-port0' } } };
      for (i = 0; i < 40; i++) { var em = mac(); dev({ p: 'esphome', n: 'ESPHome node ' + (i + 1), mac: em, a: A[i % 8] }); trk('esphome_' + i, 'unifi', { mac: em, ap_mac: aps[i % 4], essid: 'IoT', radio: 'ng' }); }
      for (i = 0; i < 30; i++) { var sm = mac(); dev({ p: 'shelly', n: 'Shelly ' + (i + 1), mac: sm, a: A[i % 8], dom: 'switch' }); trk('shelly_' + i, 'unifi', { mac: sm, ap_mac: aps[(i + 1) % 4], essid: 'IoT', radio: 'ng' }, i % 13 !== 4); }
      for (i = 0; i < 40; i++) dev({ p: 'tuya', n: 'Tuya device ' + (i + 1), a: A[i % 8], off: i % 17 === 3 });
      for (i = 0; i < 8; i++) { var so = mac(); dev({ p: 'sonos', n: 'Sonos ' + (i + 1), mac: so, a: A[i], dom: 'media_player' }); trk('sonos_' + i, 'unifi', { mac: so, ap_mac: aps[i % 4], essid: 'Home', radio: i % 3 ? 'na' : '' }); }
      for (i = 0; i < 5; i++) dev({ p: 'nest', n: 'Nest ' + (i + 1), a: A[i] }); for (i = 0; i < 4; i++) dev({ p: 'ring', n: 'Ring ' + (i + 1), a: A[i + 4] });
      for (i = 0; i < 4; i++) dev({ p: 'mobile_app', n: 'Phone ' + (i + 1) });
      for (j = 0; j < 20; j++) { var dom = 'misc_' + j; integ(dom, 'Integration ' + (j + 1), j % 3 ? 'local_polling' : 'cloud_polling'); for (i = 0; i < 1 + (j % 3); i++) dev({ p: dom, n: 'Gadget ' + (j + 1) + '.' + (i + 1), a: A[j % 8] }); }
      host = { operating_system: 'Home Assistant OS 18.4', chassis: 'embedded', hostname: 'homeassistant', disk_used: 41, disk_total: 116 };
    } else {
      integ('unifi', 'UniFi Network', 'local_push'); integ('hue', 'Philips Hue', 'local_push'); integ('shelly', 'Shelly', 'local_push'); integ('sonos', 'Sonos', 'local_push');
      integ('nest', 'Google Nest', 'cloud_push'); integ('ecobee', 'ecobee', 'cloud_polling'); integ('zha', 'Zigbee Home Automation', 'local_polling'); integ('zwave_js', 'Z-Wave', 'local_push');
      integ('mobile_app', 'Mobile App', 'local_push'); integ('esphome', 'ESPHome', 'local_push'); integ('met', 'Meteorologisk institutt (Met.no)', 'cloud_polling');
      dev({ p: 'unifi', n: 'UDM Pro', mf: 'Ubiquiti', mo: 'UDM-Pro', mac: mac(), ents: 8 });
      var ap1 = mac(), ap2 = mac();
      dev({ p: 'unifi', n: 'AP Living room', mf: 'Ubiquiti', mo: 'U6-Lite', mac: ap1, a: A[0], ents: 4 }); dev({ p: 'unifi', n: 'AP Office', mf: 'Ubiquiti', mo: 'U6-Pro', mac: ap2, a: A[3], ents: 4 });
      var hm = mac(), hb = dev({ p: 'hue', n: 'Hue Bridge', mf: 'Signify', mo: 'BSB002', mac: hm, ents: 2 });
      trk('hue_bridge', 'unifi', { mac: hm, ip: '10.0.0.20' });
      for (i = 0; i < 12; i++) dev({ p: 'hue', n: 'Hue lamp ' + (i + 1), mf: 'Signify', mo: 'LCA001', via: hb, a: A[i % 4], dom: 'light' });
      for (i = 0; i < 6; i++) { var sh = mac(); dev({ p: 'shelly', n: 'Shelly plug ' + (i + 1), mo: 'Plus Plug S', mac: sh, a: A[i % 6], dom: 'switch' }); trk('shelly_' + i, 'unifi', { mac: sh, ap_mac: i % 2 ? ap2 : ap1, essid: 'IoT', radio: 'ng', ip: '10.0.0.' + (40 + i) }, i !== 5); }
      for (i = 0; i < 4; i++) { var sn = mac(); dev({ p: 'sonos', n: 'Sonos ' + ['Living room', 'Kitchen', 'Bedroom', 'Office'][i], mo: 'Era 100', mac: sn, a: A[i], dom: 'media_player' }); trk('sonos_' + i, 'unifi', { mac: sn, ap_mac: i < 2 ? ap1 : ap2, essid: 'Home', radio: 'na' }); }
      for (i = 0; i < 3; i++) dev({ p: 'esphome', n: 'ESP sensor ' + (i + 1), mo: 'ESP32', a: A[i] });
      dev({ p: 'nest', n: 'Nest Thermostat', a: A[0], dom: 'climate' }); dev({ p: 'nest', n: 'Nest Doorbell', a: A[6], dom: 'camera' }); dev({ p: 'ecobee', n: 'ecobee Premium', a: A[2], dom: 'climate' });
      dev({ p: 'met', n: 'Forecast', svc: true, dom: 'weather' }); dev({ p: 'mobile_app', n: 'Pixel 9' }); dev({ p: 'mobile_app', n: 'Galaxy Tab S9' });
      var ph = dev({ p: 'mobile_app', n: 'iPhone 16' }); entities['sensor.' + ph + '_connection_type'] = { entity_id: 'sensor.' + ph + '_connection_type', device_id: ph, platform: 'mobile_app' }; states['sensor.' + ph + '_connection_type'] = { entity_id: 'sensor.' + ph + '_connection_type', state: 'Cellular', attributes: {} };
      // MQTT entities written by hand in YAML: one in the entity registry (it has a unique_id), two only in the state machine
      if (!man.some(function (m) { return m.domain === 'mqtt'; })) integ('mqtt', 'MQTT', 'local_push');
      entities['sensor.water_tank_level'] = { entity_id: 'sensor.water_tank_level', device_id: null, platform: 'mqtt', area_id: A[5] };
      [['sensor.water_tank_level', 'Water tank level'], ['switch.gate_relay', 'Gate relay'], ['sensor.boiler_temperature', 'Boiler temperature']].forEach(function (m) {
        states[m[0]] = { entity_id: m[0], state: 'on', attributes: { friendly_name: m[1] } }; if (!entities[m[0]]) src[m[0]] = { domain: 'mqtt' };
      });
      integ('switchbot', 'SwitchBot Bluetooth', 'local_push'); integ('xiaomi_ble', 'Xiaomi BLE', 'local_push'); integ('inkbird', 'INKBIRD', 'local_push');
      dev({ p: 'switchbot', n: 'Curtain bot', mo: 'Curtain 3', bt: true, a: A[2], dom: 'cover' }); dev({ p: 'switchbot', n: 'Bedroom meter', mo: 'Meter Plus', bt: true, a: A[2] });
      dev({ p: 'xiaomi_ble', n: 'Plant sensor', mo: 'HHCCJCY01', bt: true, a: A[5] }); dev({ p: 'inkbird', n: 'Grill thermometer', mo: 'IBT-4XS', bt: true, a: A[5] });
      // the first two are heard by an ESP32 Bluetooth proxy, the third by the built-in adapter, the last one by nobody yet
      var pm = mac(); dev({ p: 'esphome', n: 'ESP32 Bluetooth proxy', mo: 'ESP32-C3', mac: pm, a: A[2] }); trk('esp32_bluetooth_proxy', 'unifi', { mac: pm, ap_mac: ap1, essid: 'IoT', radio: 'ng' });
      scans = [{ source: pm.toUpperCase(), name: 'esp32-bt-proxy (' + pm.toUpperCase() + ')', adapter: 'esp32-bt-proxy', connectable: true, scanner_type: 'remote' }, { source: 'AA:AA:AA:AA:AA:01', name: 'hci0 (AA:AA:AA:AA:AA:01)', adapter: 'hci0', connectable: true, scanner_type: 'usb' }];
      bts = [{ address: bts[0].toUpperCase(), source: scans[0].source, rssi: -61 }, { address: bts[1].toUpperCase(), source: scans[0].source, rssi: -74 }, { address: bts[2].toUpperCase(), source: scans[1].source, rssi: -83 }];
      // Matter: three devices on Thread (one router repeating for one sleepy sensor), one on Wi-Fi
      integ('matter', 'Matter', 'local_push');
      ['Eve door sensor', 'Eve motion sensor', 'Nanoleaf bulb'].forEach(function (n, k) {
        var mid = dev({ p: 'matter', n: n, a: A[k + 4] });
        devices[mid].identifiers = [['matter', 'deviceid_0000000000000001-000000000000000' + (k + 1) + '-MatterNodeDevice']];
        devices[mid].config_entries = ['ce_matter'];
        matter[mid] = { network_type: 'thread', network_name: 'ha-thread-1a2b', node_type: k === 2 ? 'routing_end_device' : 'sleepy_end_device' };
      });
      matDiag = { data: { server: { nodes: [
        { node_id: 1, attributes: { '0/51/0': [{ '4': 'AAAAAAAAAAE=', '7': 4 }], '0/53/1': 2, '0/53/7': [{ '0': 100, '2': 45056, '5': 3, '6': -61, '7': -61, '13': false }], '0/53/8': [{ '0': 100, '1': 45056, '2': 44, '3': 0, '4': 0, '5': 3, '6': 3, '8': true, '9': true }] } },
        { node_id: 2, attributes: { '0/51/0': [{ '4': 'AAAAAAAAAAI=', '7': 4 }], '0/53/1': 2, '0/53/7': [{ '0': 3, '2': 6144, '5': 3, '6': -65, '7': -66, '13': false }], '0/53/8': [{ '0': 3, '1': 6144, '2': 6, '3': 0, '4': 0, '5': 3, '6': 3, '8': true, '9': true }] } },
        { node_id: 3, attributes: { '0/51/0': [{ '4': 'AAAAAAAAAAM=', '7': 4 }], '0/53/1': 5, '0/53/7': [{ '0': 2, '2': 6145, '5': 3, '6': -65, '7': -65, '13': true }, { '0': 100, '2': 45056, '5': 3, '6': -58, '7': -58, '13': false }], '0/53/8': [{ '0': 0, '1': 6144, '2': 6, '3': 63, '4': 0, '5': 0, '6': 0, '8': true, '9': false }, { '0': 100, '1': 45056, '2': 44, '3': 6, '4': 1, '5': 3, '6': 3, '8': true, '9': true }] } }
      ] } } };
      matter[dev({ p: 'matter', n: 'Matter smart plug', a: A[1], dom: 'switch' })] = { network_type: 'wifi', network_name: 'IoT', node_type: 'end_device' };
      integ('tplink', 'TP-Link Smart Home', 'local_polling');
      var strip = dev({ p: 'tplink', n: 'Office power strip', mo: 'HS300', a: A[3], dom: 'switch', ents: 3 });
      for (i = 0; i < 6; i++) dev({ p: 'tplink', n: 'Strip outlet ' + (i + 1), via: strip, a: A[3], dom: 'switch' });
      for (i = 0; i < 7; i++) dev({ p: 'tplink', n: 'Smart plug ' + (i + 1), mo: 'KP115', a: A[i], dom: 'switch' });
      var co = dev({ p: 'zha', n: 'SkyConnect', mf: 'Nabu Casa', mo: 'SkyConnect v1.0', ents: 2 });
      zha = [{ ieee: 'c0', device_type: 'Coordinator', device_reg_id: co, manufacturer: 'Nabu Casa', model: 'SkyConnect v1.0', neighbors: [] }];
      var zr = [];
      for (i = 0; i < 3; i++) { var rid = dev({ p: 'zha', n: 'Zigbee plug ' + (i + 1), mo: 'TS011F', via: co, a: A[i], dom: 'switch' }); zr.push('r' + i); zha.push({ ieee: 'r' + i, device_type: 'Router', device_reg_id: rid, lqi: 210 - i * 45, neighbors: [{ ieee: 'c0', device_type: 'Coordinator', relationship: 'Sibling', lqi: 210 - i * 45 }] }); }
      for (i = 0; i < 12; i++) {
        var eid2 = dev({ p: 'zha', n: ['Motion', 'Door', 'Climate'][i % 3] + ' sensor ' + (i + 1), mo: 'Aqara', via: co, a: A[i % 8], dom: 'binary_sensor', off: i === 7, rec: i === 3, bat: i === 7 });
        zha.push({ ieee: 'e' + i, device_type: 'EndDevice', device_reg_id: eid2, lqi: 100 + ((i * 37) % 140), neighbors: [] });
        var pz = i < 4 ? zha[0] : zha.filter(function (z) { return z.ieee === zr[i % 3]; })[0];
        pz.neighbors.push({ ieee: 'e' + i, device_type: 'EndDevice', relationship: 'Child', lqi: 90 + i * 9 });
      }
      var zc = dev({ p: 'zwave_js', n: 'Z-Wave controller', mf: 'Zooz', mo: 'ZST39 800', ents: 2 });
      for (i = 0; i < 6; i++) dev({ p: 'zwave_js', n: 'Z-Wave ' + ['lock', 'dimmer', 'switch'][i % 3] + ' ' + (i + 1), via: zc, a: A[i % 8] });
      host = { operating_system: 'Home Assistant OS 18.4', chassis: 'vm', virtualization: 'kvm', hostname: 'homeassistant', disk_used: 22, disk_total: 64 };
      haIp = '10.0.0.10'; trk('homeassistant', 'unifi', { mac: mac(), ip: haIp });
    }
    return {
      demo: true, language: (real && real.language) || 'en', themes: real && real.themes, config: { version: (real && real.config && real.config.version) || '2026.11.1' },
      devices: devices, entities: entities, states: states, areas: areas,
      callWS: function (msg) {
        if (msg.type === 'manifest/list') return Promise.resolve(man);
        if (msg.type === 'entity/source') return Promise.resolve(src);
        if (msg.type === 'matter/node_diagnostics' && matter[msg.device_id]) return Promise.resolve(matter[msg.device_id]);
        if (msg.type === 'supervisor/api' && host) {
          if (msg.endpoint === '/host/info') return Promise.resolve(host);
          if (msg.endpoint === '/network/info') return Promise.resolve({ interfaces: haIp ? [{ ipv4: { address: [haIp + '/24'] } }] : [] });
        }
        if (msg.type === 'zha/devices' && zha) return Promise.resolve(zha);
        return Promise.reject(new Error('not available in demo'));
      },
      callApi: function (method, path) {
        if (method === 'GET' && path === 'diagnostics/config_entry/ce_matter' && matDiag) return Promise.resolve(matDiag);
        return Promise.reject(new Error('not available in demo'));
      },
      callService: function () { return Promise.resolve(); },
      connection: {
        subscribeMessage: function (cb, msg) {
          if (msg.type === 'bluetooth/subscribe_scanner_details') { setTimeout(function () { cb({ add: scans }); }, 50); return Promise.resolve(function () { }); }
          if (msg.type === 'bluetooth/subscribe_advertisements') { setTimeout(function () { cb({ add: bts }); }, 80); return Promise.resolve(function () { }); }
          var topic = (msg.trigger && msg.trigger.topic) || '', p = null;
          if (/bridge\/info$/.test(topic)) p = z2mInfo; else if (/networkmap$/.test(topic) && z2mMap) p = { data: { value: z2mMap } };
          if (p) setTimeout(function () { cb({ variables: { trigger: { payload: JSON.stringify(p) } } }); }, 300);
          return Promise.resolve(function () { });
        }
      }
    };
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function deg(a) { return a * Math.PI / 180; }

  var CSS = [
    ':host{--cm-cloud:#7c5cff;--cm-local:#0b8a77;--cm-radio:#b86e00;--cm-core:var(--primary-color,#03a9f4);--cm-bad:var(--error-color,#db4437);--cm-away:#a86400;--cm-recent:#d9a900;--cm-bare:var(--disabled-text-color,#9e9e9e);',
    '--cm-ink:var(--primary-text-color,#212121);--cm-muted:var(--secondary-text-color,#727272);--cm-line:var(--divider-color,rgba(0,0,0,.12));',
    '--cm-bg:var(--ha-card-background,var(--card-background-color,#fff));--cm-faint:var(--secondary-background-color,rgba(127,127,127,.12));display:block;height:100%}',
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
    '.btn[aria-pressed="true"]{border-color:var(--cm-bad);color:var(--cm-bad);font-weight:600}#physBtn[aria-pressed="true"]{border-color:var(--cm-core);color:var(--cm-core)}',
    '.main{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}',
    '.main.wide{grid-template-columns:minmax(0,1fr) 300px;align-items:start}',
    '.map{position:relative;border:1px solid var(--cm-line);border-radius:14px;overflow:hidden;min-width:0}',
    '.map>svg{display:block;width:100%;height:auto;touch-action:none;user-select:none}',
    '.zoom{position:absolute;right:8px;top:8px;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:132px}.zoom .btn.on{border-color:var(--cm-core);color:var(--cm-core)}',
    '.xmenu{position:absolute;right:8px;top:84px;z-index:4;display:none;flex-direction:column;gap:6px;background:var(--cm-bg);border:1px solid var(--cm-line);border-radius:12px;padding:10px;max-width:230px;box-shadow:0 2px 10px rgba(0,0,0,.18)}',
    '.xmenu p{margin:0;font-size:12px;color:var(--cm-muted)}.xmenu .btn{text-align:left;cursor:pointer}',
    'ha-card{position:relative}.modal{position:fixed;inset:0;z-index:9;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.45);padding:16px}',
    '.dlg{background:var(--cm-bg);color:var(--cm-ink);border-radius:16px;padding:18px;max-width:560px;width:100%;max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:12px;box-shadow:0 8px 30px rgba(0,0,0,.35)}',
    '.dlg h2{margin:0;font-size:18px;font-weight:600}.dlg p{margin:0;font-size:13px;color:var(--cm-muted)}.dlg .acts{display:flex;flex-wrap:wrap;gap:8px}.dlg .btn{cursor:pointer}.dlg .btn.go{border-color:var(--cm-core);color:var(--cm-core);font-weight:600}',
    '.dlg .pair{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dlg .one{border:1px solid var(--cm-line);border-radius:12px;padding:10px;min-width:0}.dlg .one b{display:block;font-size:14px;overflow-wrap:anywhere}',
    '.dlg input[type=search]{font:inherit;font-size:14px;padding:8px 10px;border:1px solid var(--cm-line);border-radius:10px;background:var(--cm-bg);color:var(--cm-ink)}.dlg .list{max-height:300px}',
    '.dlg textarea{font:12px/1.4 ui-monospace,monospace;width:100%;height:240px;box-sizing:border-box;border:1px solid var(--cm-line);border-radius:10px;background:var(--cm-faint);color:var(--cm-ink);padding:8px;resize:vertical}',
    '@media (max-width:520px){.dlg .pair{grid-template-columns:1fr}}',
    '.hub.offline .disc{stroke:var(--cm-bad)!important}.anode{fill:var(--cm-bg);stroke-width:1.6;cursor:pointer}.dl.al{font-weight:600;fill:var(--cm-muted)}',
    '.badge{fill:var(--cm-bad)}.badget{fill:#fff;font-weight:700}',
    // overview map: only shown while part of the map is outside the view
    '.mini{position:absolute;left:8px;top:8px;width:150px;border:1px solid var(--cm-line);border-radius:10px;background:var(--cm-bg);overflow:hidden;display:none;cursor:pointer;touch-action:none;z-index:2;box-shadow:0 1px 4px rgba(0,0,0,.12)}',
    '.mini svg{display:block;width:100%;height:auto}.mini .view{fill:var(--cm-core);fill-opacity:.14;stroke:var(--cm-core);stroke-width:2;vector-effect:non-scaling-stroke}',
    '@media (max-width:600px){.mini{width:104px}}',
    // names of the devices, shown when the zoom leaves room for them
    '.dl{font-size:calc(10px / var(--k,1));fill:var(--cm-ink);pointer-events:none;paint-order:stroke;stroke:var(--cm-bg);stroke-width:calc(3px / var(--k,1));stroke-linejoin:round;dominant-baseline:middle}',
    '.foc .dl{opacity:.25}',
    '.zoom .btn{padding:3px 10px;font-weight:700}',
    '.note{display:none;font-size:12.5px;color:var(--cm-ink);background:rgba(255,166,0,.16);border-top:1px solid var(--warning-color,#ffa600);padding:7px 12px;line-height:1.5}',
    '.note div{display:flex;flex-wrap:wrap;gap:2px 8px;align-items:baseline}.note button{font:inherit;background:none;border:0;padding:0;color:var(--cm-core);cursor:pointer;text-decoration:underline}',
    '.legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:var(--cm-muted);padding:8px 12px;border-top:1px solid var(--cm-line)}',
    '.legend span{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.legend i{width:10px;height:10px;border-radius:50%;display:inline-block}.legend svg{width:26px;height:8px;flex:0 0 auto;display:block}',
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
    '.edge{fill:none;stroke-opacity:.55}.edge.hot{stroke-opacity:.9}',
    '.spoke{stroke:var(--cm-line);stroke-width:1}.spoke.meshl{stroke:var(--cm-radio);stroke-dasharray:3 2;stroke-opacity:.8}.spoke.meshl.l-local{stroke:var(--cm-local)}',
    // motion: data flowing towards Home Assistant, devices popping in, offline / off-network rings breathing
    '.flow{fill:none;stroke-width:2;stroke-dasharray:2 18;stroke-linecap:round;opacity:.35;pointer-events:none;animation:cmflow 3.2s linear infinite}',
    '.edge.hot+.flow{stroke-width:3.6;animation-duration:.7s;opacity:1}.edge.dim+.flow{opacity:.08}',
    '@keyframes cmflow{from{stroke-dashoffset:0}to{stroke-dashoffset:40}}',
    '.spoke.meshl{animation:cmmesh 1s linear infinite}@keyframes cmmesh{to{stroke-dashoffset:10}}',
    '.enter{animation:cmpop .55s cubic-bezier(.2,.8,.3,1.35) backwards;transform-box:fill-box;transform-origin:center}',
    '@keyframes cmpop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}',
    '.dev circle{transition:transform .18s cubic-bezier(.2,.8,.3,1.3);transform-box:fill-box;transform-origin:center}.dev:hover circle,.dev.hov circle,.dev:focus-visible circle{transform:scale(1.7)}',
    '.disc{transition:transform .18s cubic-bezier(.2,.8,.3,1.3),stroke-width .15s ease;transform-box:fill-box;transform-origin:center}',
    '.hub:hover .disc,.hub.hov .disc,.hub:focus-visible .disc,.mnode:hover .disc,.mnode.hov .disc,.mnode:focus-visible .disc{transform:scale(1.14);stroke-width:4.5}',
    '.dev:focus,.hub:focus,.mnode:focus{outline:none}.dev:focus-visible circle:last-of-type{stroke:var(--cm-ink);stroke-width:3}',
    // focus + context: pointing at something keeps its whole path to Home Assistant bright and fades the rest, without hiding it
    '.dev,.hub,.mnode,.edge,.spoke,.elbl{transition:opacity .18s ease}',
    '.foc .dev:not(.on),.foc .hub:not(.on),.foc .mnode:not(.on),.foc .elbl{opacity:.2}.foc .edge:not(.on),.foc .spoke:not(.on){opacity:.14}.foc .edge:not(.on)+.flow{opacity:.04}',
    '.foc .edge.on{stroke-opacity:.95}.foc .edge.on+.flow{opacity:.95;animation-duration:1.1s}.foc .spoke.on{stroke:var(--cm-muted);stroke-width:1.5}',
    '.dev.offline circle:last-of-type{animation:cmblink 2.4s ease-in-out infinite}@keyframes cmblink{50%{stroke-opacity:.25}}',
    '.dev.recent circle:last-of-type{fill:var(--cm-bg)!important;stroke:var(--cm-recent);stroke-width:2.2}',
    '.dev.away circle:last-of-type{fill:var(--cm-bg)!important;stroke:var(--cm-away);stroke-width:2.2;stroke-dasharray:2.5 2}',
    // a device with no entities (all disabled, or none created) says nothing about itself: grey, neither online nor offline
    '.dev.disabled circle:last-of-type{fill:var(--cm-bg)!important;stroke:var(--cm-bare);stroke-width:2;stroke-dasharray:1.5 2}',
    '.dev.bare circle:last-of-type{fill:var(--cm-bare)!important;stroke:var(--cm-bare);fill-opacity:.35}',
    '.still .flow{display:none}.still *{animation:none!important;transition:none!important}',
    '@media (prefers-reduced-motion:reduce){.flow{display:none}.enter,.spoke.meshl,.dev circle,.disc,.dev,.hub,.mnode,.edge,.spoke,.elbl{animation:none!important;transition:none!important}}',
    '.elbl{font-size:calc(10px / var(--k,1));font-weight:600;fill:var(--cm-muted);paint-order:stroke;stroke:var(--cm-bg);stroke-width:calc(4px / var(--k,1));stroke-linejoin:round}',
    '.dev{cursor:pointer}.dev circle{stroke:var(--cm-bg);stroke-width:1.5}',
    '.dev.offline circle{fill:var(--cm-bg)!important;stroke:var(--cm-bad);stroke-width:2.2}',
    '.dev.sel circle{stroke:var(--cm-ink);stroke-width:3}',
    '.hub,.mnode{cursor:pointer}.disc{fill:var(--cm-bg);stroke-width:2.5}.hub.sel .disc{stroke-width:5}',
    // text keeps the same size on screen whatever the zoom: --k is the current pixels-per-unit scale
    '.lbl{font-size:calc(12px / var(--k,1));font-weight:600;fill:var(--cm-ink)}.lbl.small{font-size:calc(11px / var(--k,1))}',
    '.sub{font-size:calc(10.5px / var(--k,1));fill:var(--cm-muted)}.tl{paint-order:stroke;stroke:var(--cm-bg);stroke-width:calc(3px / var(--k,1));stroke-linejoin:round}.tl.below{dominant-baseline:hanging}',
    '@media (max-width:600px){.wrap{padding:12px;gap:9px}.stat{padding:3px 9px 3px 6px;font-size:12px;gap:5px}.tools input{flex:1 1 100%}.tools select{flex:1 1 100%;min-width:0}.tools #show{flex:1 1 0}.tools .btn{flex:1 1 0;min-width:0}.zoom .btn{padding:7px 13px}.zoom{max-width:156px}.xmenu{top:104px}}',
    '.dim{opacity:.12}',
    '.pulse{animation:cmpulse 2.4s ease-in-out infinite}@keyframes cmpulse{0%,100%{opacity:.3}50%{opacity:.85}}',
    '@media (prefers-reduced-motion:reduce){.pulse{animation:none}}',
    '.tip{position:absolute;pointer-events:none;background:var(--cm-ink);color:var(--cm-bg);font-size:12px;padding:5px 8px;border-radius:7px;white-space:nowrap;transform:translate(-50%,calc(-100% - 14px));display:none;z-index:3;text-align:center;line-height:1.35}.tip b{display:block;font-weight:600}.tip span{opacity:.75;font-size:11px}',
    'ha-card.fill{height:100%;box-sizing:border-box;display:flex;flex-direction:column}ha-card.fill .wrap{flex:1 1 0;min-height:0;box-sizing:border-box}ha-card.fill .main{flex:1 1 0;min-height:0}',
    'ha-card.fill .main.wide{grid-template-rows:minmax(0,1fr);align-items:stretch}ha-card.fill .main:not(.wide){grid-template-rows:minmax(180px,1fr) minmax(0,auto);overflow:auto}',
    'ha-card.fill .map,ha-card.custom-h .map{display:flex;flex-direction:column;min-height:0}ha-card.fill #svg{flex:1 1 0;min-height:120px;height:100%}',
    'ha-card.custom-h #svg{height:var(--cm-map-h)!important}ha-card.custom-h .main.wide{align-items:stretch}',
    'ha-card.fill .main.wide .panel{max-height:100%;overflow:auto;box-sizing:border-box}ha-card.custom-h .main.wide .panel{max-height:calc(var(--cm-map-h) + 46px);overflow:auto;box-sizing:border-box}',
    'ha-card.fill .main.wide .list,ha-card.custom-h .main.wide .list{max-height:none;flex:1 1 auto;min-height:60px}'
  ].join('\n');

  class ConnectionMapCard extends HTMLElement {
    static getStubConfig() { return {}; }
    setConfig(config) {
      // Option names are stable from 1.0. The ones that were replaced keep working and are reported once in the console.
      var given = Object.assign({}, config || {}), self0 = this, prevCfg = this._cfg; this._optNotes = [];
      Object.keys(given).forEach(function (k) {
        if (DEPRECATED[k]) self0._optNotes.push('deprecated: ' + k + ' -> ' + DEPRECATED[k]);
        else if (OPTIONS.indexOf(k) < 0) self0._optNotes.push('unknown: ' + k);
      });
      if (given.core_size === 'compact' && !(given.sizes && given.sizes.core != null)) given.sizes = Object.assign({ core: 28 }, given.sizes || {});
      var noteKey = this._optNotes.join(';');
      if (noteKey && noteKey !== ConnectionMapCard._warned) { ConnectionMapCard._warned = noteKey; console.warn('connection-map-card options — ' + this._optNotes.join(', ')); }
      this._given = given; config = given;
      this._cfg = Object.assign({
        title: null, height: null, group_small: 1, exclude_integrations: [], exclude_devices: [], computers: [], show_trackers: false,
        show_panel: true, colors: {}, show_mesh: true, z2m_base_topic: 'zigbee2mqtt', overrides: {}, animations: true, sort: 'area', core_size: 'large', physical_only: false, group_by_area: false, mqtt_entities: true, entities_without_device: true, devices_without_entities: true, merge_duplicates: true, recent_hours: 24, layout: 'detailed', show_export: true
      }, config || {});
      // look-only options are applied by drawing again; anything else needs the model to be rebuilt
      var LOOK = ['title', 'height', 'colors', 'lines', 'sizes', 'core_size', 'minimap', 'device_labels', 'animations', 'show_panel', 'layout', 'show_export', 'group_by_area', 'grid_options', 'layout_options', 'view_layout'];
      if (this._S) { this._S.layout = null; this._S.physical = null; } // what was chosen with the buttons gives way to the configuration
      function rest(c) { var o = {}; Object.keys(c || {}).sort().forEach(function (k) { if (LOOK.indexOf(k) < 0) o[k] = c[k]; }); return JSON.stringify(o); }
      var same = this._built && this._modelKey === rest(this._cfg);
      var needLoad = !this._built || !prevCfg || String(prevCfg.demo || '') !== String(this._cfg.demo || '') ||
        String(prevCfg.z2m_base_topic || '') !== String(this._cfg.z2m_base_topic || '') ||
        (this._cfg.show_mesh !== false && prevCfg.show_mesh === false && !this._rawMesh && !this._rawZha && !this._rawThread);
      this._modelKey = rest(this._cfg);
      if (!this._root) { if (needLoad) { this._built = false; this._demoHass = null; } return; }
      this._applyCfg();
      var ttl = (this._cfg.title || this._t('title')) + (this._hass && this._hass.demo ? ' · demo: ' + this._cfg.demo : '');
      if (same) { this._$('title').textContent = ttl; this._render(); }
      else if (!needLoad) { this._$('title').textContent = ttl; this._vb = null; this._remodel(); }
      else { this._built = false; this._demoHass = null; if (this._hass && !this._loading) this._load(); }
    }
    static getConfigElement() { return document.createElement('connection-map-card-editor'); }
    // sizes of each level, in map units (the defaults are the original look)
    _sizes() {
      var z = this._cfg.sizes || {};
      function num(v, d, lo, hi) { v = parseFloat(v); return isNaN(v) ? d : Math.max(lo, Math.min(hi, v)); }
      return { core: num(z.core, this._cfg.core_size === 'compact' ? 28 : 56, 20, 80), net: num(z.network, 28, 16, 40), hub: num(z.hub, 22, 14, 34), dev: num(z.device, 6.2, 3, 9) };
    }
    _mapHeight() {
      var h = this._cfg && this._cfg.height;
      if (h == null || h === '' || h === 0 || h === '0' || h === 'auto') return '';
      if (typeof h === 'number' || /^\d+(\.\d+)?$/.test(String(h).trim())) {
        var n = parseFloat(h); return n > 0 ? Math.max(180, Math.round(n)) + 'px' : '';
      }
      var s = String(h).trim();
      return /^\d+(\.\d+)?(px|vh|dvh|svh|rem|em|%)$/i.test(s) ? s : '';
    }
    _isGridFill() {
      var go = this._cfg && this._cfg.grid_options;
      if (go && go.rows === 'auto') return false;
      var el = this, n = 0;
      while (el && n++ < 6) {
        if (el.classList && el.classList.contains('fit-rows')) return true;
        el = el.parentElement || (el.getRootNode && el.getRootNode().host) || null;
      }
      return !!(go && typeof go.rows === 'number' && go.rows > 0 && this.clientHeight > 120);
    }
    _syncFill() {
      if (!this._root) return;
      var card = this._root.querySelector('ha-card'); if (!card) return;
      var mh = this._mapHeight(), fill = !mh && this._isGridFill();
      card.classList.toggle('custom-h', !!mh);
      card.classList.toggle('fill', fill);
    }
    // colours, line styles and widths come from the configuration: written as CSS so that a change needs no new model
    _applyCfg() {
      var cfg = this._cfg, c = cfg.colors || {}, L = cfg.lines || {}, card = this._root.querySelector('ha-card'), mh = this._mapHeight();
      function col(v) { return /^[#a-z0-9(),.%\s-]+$/i.test(String(v || '')) ? String(v) : ''; }
      var vars = ''; ['cloud', 'local', 'radio', 'core'].forEach(function (k) { if (col(c[k])) vars += '--cm-' + k + ':' + col(c[k]) + ';'; });
      if (col(c.offline)) vars += '--cm-bad:' + col(c.offline) + ';'; if (col(c.away)) vars += '--cm-away:' + col(c.away) + ';'; if (col(c.recent)) vars += '--cm-recent:' + col(c.recent) + ';'; if (col(c.no_entities)) vars += '--cm-bare:' + col(c.no_entities) + ';';
      if (mh) vars += '--cm-map-h:' + mh + ';';
      card.setAttribute('style', vars); card.className = cfg.animations === false ? 'still' : '';
      this._syncFill();
      var w = parseFloat(L.width); w = isNaN(w) ? 2 : Math.max(0.5, Math.min(6, w));
      function dash(st) { return st === 'dashed' ? 'stroke-dasharray:' + (w * 3) + ' ' + (w * 3) + ';stroke-linecap:butt;stroke-width:' + w : st === 'dotted' ? 'stroke-dasharray:1 ' + (w * 3) + ';stroke-linecap:round;stroke-width:' + (w * 1.5) : 'stroke-dasharray:none;stroke-width:' + w; }
      var st = { cloud: L.cloud || 'dashed', local: L.local || 'solid', radio: L.radio || 'solid', wifi: L.wifi || 'dotted' };
      this._lineCss = { cable: dash(st.local), wifi: dash(st.wifi) };
      this._$('dyn').textContent = '.edge{stroke-width:' + w + '}.edge.l-cloud{' + dash(st.cloud) + '}.edge.l-local{' + dash(st.local) + '}.edge.l-radio{' + dash(st.radio) + '}.edge.wifi{' + dash(st.wifi) + '}' +
        '.edge.hot{stroke-width:' + (w * 2) + '}.foc .edge.on{stroke-width:' + (w * 1.6) + '}';
      this._$('panel').style.display = cfg.show_panel === false ? 'none' : '';
      var m = this._$('main'); if (m) m.classList.toggle('wide', m.getBoundingClientRect().width > 860 && cfg.show_panel !== false);
    }
    connectedCallback() { this._syncFill(); }
    getCardSize() { return 12; }
    getGridOptions() { return { columns: 'full', rows: 14, min_rows: 4 }; }

    set hass(h) {
      if (this._cfg && this._cfg.demo) { if (!this._demoHass) this._demoHass = makeDemo(String(this._cfg.demo), h); h = this._demoHass; }
      this._hass = h;
      if (!this._root) this._skeleton();
      if (!this._built && !this._loading) { this._load(); return; }
      var now = Date.now();
      if (this._built && now - (this._last || 0) > 5000) { this._last = now; try { if (!this._roam()) { this._status(); this._marks(); } } catch (e) { this._fail('update', e); } }
    }

    _t(k) { var l = ((this._cfg && this._cfg.language) || (this._hass && this._hass.language) || 'en').slice(0, 2); return (STR[l] || STR.en)[k] || STR.en[k]; }

    _skeleton() {
      this._root = this.attachShadow({ mode: 'open' });
      this._root.innerHTML = '<style>' + CSS + '</style><style id="dyn"></style><ha-card><div class="wrap"><div class="head"><h1 id="title"></h1><div class="stats" id="stats"></div></div>' +
        '<div class="tools"><input id="q" type="search"><select id="area"></select><select id="show"></select><button class="btn" id="physBtn" aria-pressed="false"></button></div>' +
        '<div class="main" id="main"><div class="map" id="map"><svg id="svg" viewBox="0 0 1000 700" role="img"></svg><div class="tip" id="tip"></div><div class="mini" id="mini"></div>' +
        '<div class="note" id="note" role="status"></div><div class="legend" id="legend"></div><div class="xmenu" id="xmenu"></div><div class="zoom"><button class="btn" id="zin">+</button><button class="btn" id="zout">−</button><button class="btn" id="zfit">⤢</button><button class="btn" id="zlay">◎</button><button class="btn" id="zexp">⤓</button></div></div>' +
        '<aside class="panel" id="panel"><div class="msg" id="loading"></div></aside></div></div><div class="modal" id="modal" role="dialog" aria-modal="true"></div></ha-card>';
      var self = this;
      this._ro = new ResizeObserver(function () {
        self._syncFill();
        var m = self._$('main'); if (m) m.classList.toggle('wide', m.getBoundingClientRect().width > 860 && self._cfg.show_panel !== false);
        if (self._vb) requestAnimationFrame(function () { self._setVB(); if (self._labs) self._declutter(); });
      });
      this._ro.observe(this);
      this._ro.observe(this._$('main'));
      this._applyCfg();
    }
    _$(id) { return this._root.getElementById(id); }

    async _load() {
      this._loading = true;
      var gen = this._gen = (this._gen || 0) + 1, self = this, H = this._hass;
      var t = this._t.bind(this);
      this._$('title').textContent = (this._cfg.title || t('title')) + (H.demo ? ' · demo: ' + this._cfg.demo : '');
      var ld = this._$('loading'); if (ld) ld.textContent = t('loading');
      var key = this._modelKey, man = {};
      this._man = man; this._src = {}; this._bt = null; this._mesh = false; this._threadMeshOn = false; this._rawThread = null;
      this._uiClients = null; this._uiInfra = null; this._uiByMac = null; this._haIps = [];
      await Promise.all([
        H.callWS({ type: 'manifest/list' }).then(function (l) { (l || []).forEach(function (m) { man[m.domain] = m; }); }, function () { /* non-admin: fall back to guesses */ }),
        H.callWS({ type: 'entity/source' }).then(function (s) { self._src = s || {}; }, function () { /* older versions: registry only */ }),
        this._loadAnswers(),
        this._matterFast()
      ]);
      this._loadMeshCache();
      this._model();
      if (this._cfg.show_mesh !== false) {
        if (this._rawMesh) this._applyMesh(this._rawMesh);
        if (this._rawZha) this._applyZhaMesh(this._rawZha);
        if (this._rawThread) this._applyThreadMesh(this._rawThread);
      }
      this._loading = false;
      if (key !== this._modelKey) { this._load(); return; } // the configuration changed while loading
      this._built = true;
      this._render();
      this._extras(gen);
    }

    // Host details (Supervisor), live Bluetooth / Matter enrichment, coordinator details and Zigbee / Thread meshes. Non-blocking.
    async _extras(gen) {
      var self = this, H = this._hass;
      var hostTask = (async function () {
        try {
          var hi = await H.callWS({ type: 'supervisor/api', endpoint: '/host/info', method: 'get' });
          if (gen !== self._gen) return;
          self._host = { os: hi.operating_system, chassis: hi.chassis, virt: hi.virtualization, hostname: hi.hostname, disk: [hi.disk_used, hi.disk_total] };
          self._coreText();
        } catch (e) { /* not supervised or not admin */ }
        var ips = [];
        try {
          var ni = await H.callWS({ type: 'supervisor/api', endpoint: '/network/info', method: 'get' });
          if (gen !== self._gen) return;
          (ni.interfaces || []).forEach(function (i) { ((i.ipv4 && i.ipv4.address) || []).forEach(function (a) { var ip = String(a).split('/')[0]; if (ip && ip !== '127.0.0.1' && ips.indexOf(ip) < 0) ips.push(ip); }); });
        } catch (e) { /* not supervised or not admin */ }
        if (!ips.length && !H.demo) {
          try {
            var net = await H.callWS({ type: 'network' });
            if (gen !== self._gen) return;
            ((net && net.adapters) || []).forEach(function (ad) { if (!ad.enabled) return; (ad.ipv4 || []).forEach(function (v4) { if (v4.address && v4.address !== '127.0.0.1' && ips.indexOf(v4.address) < 0) ips.push(v4.address); }); });
          } catch (e) { /* optional */ }
        }
        self._haIps = ips;
        if (ips.length) {
          self._haTrk = (self._trk || []).filter(function (eid) { var c = self._conn(eid); return c && c.ip && ips.indexOf(c.ip) >= 0; })[0] || null;
          if (self._haTrk) self._render();
        }
      })();
      var uiTask = this._unifiInsights().then(function (ch) { if (ch && gen === self._gen) self._remodel(); });
      var matTask = H.demo ? Promise.resolve() : this._matterInfo().then(function (ch) { if (ch && gen === self._gen) self._remodel(); });
      var btTask = this._btInfo().then(function (ch) { if (ch && gen === self._gen) self._remodel(); });
      var meshTask = this._refreshMeshes(false, gen, matTask);
      await Promise.all([hostTask, uiTask, matTask, btTask, meshTask]);
    }
    _meshKey() {
      var H = this._hass;
      return !H || H.demo || !(H.user && H.user.id) ? '' : 'connection-map-card-mesh:' + H.user.id;
    }
    _loadMeshCache() {
      var empty = { z2m: null, z2mTs: 0, z2mTopic: '', z2mInfo: null, zha: null, thread: null, threadTs: 0 }, ck = this._meshKey();
      this._meshCache = empty;
      if (!ck) { this._coordInfo = this._rawMesh = this._rawZha = this._rawThread = null; return; }
      try {
        var raw = JSON.parse(localStorage.getItem(ck) || 'null');
        if (raw && typeof raw === 'object') this._meshCache = Object.assign(empty, raw);
      } catch (e) { /* no storage */ }
      var mc = this._meshCache, base = this._cfg.z2m_base_topic || 'zigbee2mqtt';
      if (!mc.z2mTopic || mc.z2mTopic === base) {
        if (mc.z2mInfo) this._coordInfo = mc.z2mInfo;
        if (mc.z2m) this._rawMesh = mc.z2m;
      }
      if (mc.zha) this._rawZha = mc.zha;
      if (mc.thread) this._rawThread = mc.thread;
    }
    _saveMeshCache() {
      var ck = this._meshKey(); if (!ck || !this._meshCache) return;
      try { localStorage.setItem(ck, JSON.stringify(this._meshCache)); } catch (e) { /* quota or disabled */ }
    }
    _meshStateSig() {
      return (this._devs || []).filter(function (d) { return !!(d.ieee || d.threadMesh); }).map(function (d) {
        return d.id + ':' + (d.meshParent ? d.meshParent.id : '') + ':' + (d.router ? 1 : 0);
      }).sort().join('|');
    }
    async _refreshMeshes(force, gen, matWait) {
      var H = this._hass, base = this._cfg.z2m_base_topic || 'zigbee2mqtt', mesh = this._cfg.show_mesh !== false;
      var mc = this._meshCache = this._meshCache || { z2m: null, z2mTs: 0, z2mTopic: '', z2mInfo: null, zha: null, thread: null, threadTs: 0 };
      if (this._z2mBridge) {
        try {
          var prevCi = JSON.stringify(this._coordInfo || null);
          var info = await this._mqttOnce(base + '/bridge/info', null, 5000);
          if (gen != null && gen !== this._gen) return;
          this._z2mInfo(info);
          mc.z2mInfo = this._coordInfo; mc.z2mTopic = base; this._saveMeshCache();
          if (JSON.stringify(this._coordInfo || null) !== prevCi) this._remodel();
        } catch (e) { /* retained bridge/info not available */ }
        if (mesh) {
          var known = {}; ((this._rawMesh && this._rawMesh.nodes) || []).forEach(function (n) { if (n && n.ieeeAddr) known[n.ieeeAddr] = 1; });
          var missing = (this._devs || []).some(function (d) { return d.ieee && !known[d.ieee]; });
          var stale = force || H.demo || !this._rawMesh || mc.z2mTopic !== base || missing || (Date.now() - (mc.z2mTs || 0) > 14400000);
          if (stale) {
            try {
              var beforeZ = this._meshStateSig(), hadM = !!this._mesh;
              var nm = await this._mqttOnce(base + '/bridge/response/networkmap', { topic: base + '/bridge/request/networkmap', payload: JSON.stringify({ type: 'raw', routes: false }) }, 45000);
              if (gen != null && gen !== this._gen) return;
              var val = nm && nm.data && nm.data.value;
              if (val && Array.isArray(val.nodes)) {
                var slim = {
                  nodes: val.nodes.map(function (n) { return { ieeeAddr: n.ieeeAddr, type: n.type }; }),
                  links: (val.links || []).map(function (l) { return { source: { ieeeAddr: l.source && l.source.ieeeAddr }, target: { ieeeAddr: l.target && l.target.ieeeAddr }, lqi: l.lqi, relationship: l.relationship }; })
                };
                mc.z2m = slim; mc.z2mTs = Date.now(); mc.z2mTopic = base; this._saveMeshCache();
                this._applyMesh(slim);
                if (!hadM || force || this._meshStateSig() !== beforeZ) this._render();
              }
            } catch (e) { /* no answer */ }
          }
        }
      }
      if (mesh && this._hasZha) {
        try {
          var beforeZha = this._meshStateSig(), hadZha = !!this._mesh;
          var zd = await H.callWS({ type: 'zha/devices' });
          if (gen != null && gen !== this._gen) return;
          if (Array.isArray(zd)) {
            var slimZha = zd.map(function (z) {
              return { ieee: z.ieee, device_type: z.device_type, device_reg_id: z.device_reg_id, lqi: z.lqi, manufacturer: z.manufacturer, model: z.model,
                neighbors: (z.neighbors || []).map(function (n) { return { ieee: n.ieee, device_type: n.device_type, relationship: n.relationship, lqi: n.lqi }; }) };
            });
            mc.zha = slimZha; this._saveMeshCache();
            this._applyZhaMesh(slimZha);
            if (!hadZha || force || this._meshStateSig() !== beforeZha) this._render();
          }
        } catch (e) { /* ZHA not loaded or not admin */ }
      }
      if (mesh && (this._matter || this._matterIds().length)) {
        if (matWait) await matWait;
        if (gen != null && gen !== this._gen) return;
        var tKnown = {}; (this._rawThread || []).forEach(function (n) { if (n && n.node_id != null) tKnown[String(n.node_id)] = 1; });
        var thDevs = (this._devs || []).filter(function (d) { return d.p === 'matter' && d.hub && d.hub.thread; });
        var thMissing = thDevs.some(function (d) { return !d.threadMesh; });
        var thStale = force || H.demo || !this._rawThread || !Object.keys(tKnown).length || thMissing || (Date.now() - (mc.threadTs || 0) > 3600000);
        if (thStale) {
          var beforeTh = this._meshStateSig(), hadTh = !!this._threadMeshOn;
          var tnodes = await this._threadMesh();
          if (gen != null && gen !== this._gen) return;
          if (tnodes) {
            var slimTh = tnodes.map(function (n) {
              var a = (n && n.attributes) || {};
              return { node_id: n.node_id, attributes: { '0/51/0': a['0/51/0'], '0/53/1': a['0/53/1'], '0/53/7': a['0/53/7'], '0/53/8': a['0/53/8'] } };
            });
            mc.thread = slimTh; mc.threadTs = Date.now(); this._saveMeshCache();
            this._applyThreadMesh(slimTh);
            if (!hadTh || force || this._meshStateSig() !== beforeTh) this._render();
          }
        }
      }
    }
    // UniFi Insights topology API: switch-port, access-point and multi-VLAN client graph when device_tracker entities are absent.
    // Infrastructure MACs come from ha_device_id in the registry when present; opaque client node IDs (HMAC of MAC) are cached
    // in localStorage so reloads make zero node_details requests.
    async _unifiInsights() {
      var H = this._hass, devices = (H && H.devices) || {};
      this._uiClients = null; this._uiInfra = null; this._uiByMac = null;
      if (!H || !H.callWS || H.demo || (((H.config && H.config.components) || []).indexOf('unifi_insights') < 0)) return false;
      var ck = H.user && H.user.id ? 'connection-map-card-ui:' + H.user.id : '', cached = {}, dirty = false;
      if (ck) { try { cached = JSON.parse(localStorage.getItem(ck) || '{}') || {}; } catch (e0) { cached = {}; } }
      function regMac(devId) {
        var rd = devId && devices[devId]; if (!rd) return null;
        var mc = (rd.connections || []).filter(function (c) { return c[0] === 'mac' && c[1]; })[0];
        return mc ? String(mc[1]).toLowerCase() : null;
      }
      try {
        var srcs = await H.callWS({ type: 'unifi_insights/topology/sources' });
        if (!Array.isArray(srcs) || !srcs.length) return false;
        var clients = {}, infra = {}, byMac = {}, found = false;
        for (var si = 0; si < srcs.length; si++) {
          var src = srcs[si], sites = (src && src.sites) || [];
          for (var k = 0; k < sites.length; k++) {
            var siteId = sites[k].id || sites[k].site_id;
            if (!src.entry_id || !siteId) continue;
            var topo = await H.callWS({ type: 'unifi_insights/topology/get', entry_id: src.entry_id, site_id: siteId });
            if (!topo || !Array.isArray(topo.nodes)) continue;
            var nodes = {}, edges = {}, details = {}, noDet = false, ask = [];
            topo.nodes.forEach(function (n) {
              nodes[n.id] = n;
              if (n.kind === 'wan') return;
              var rm = regMac(n.ha_device_id);
              if (rm) details[n.id] = { mac_address: rm, device_id: n.ha_device_id };
              else if (cached[n.id]) details[n.id] = { mac_address: cached[n.id].mac || null, ip_address: cached[n.id].ip || null };
              else if (n.kind !== 'client' || n.state !== 'offline') ask.push(n.id);
            });
            (topo.edges || []).forEach(function (e) { if (e.source && e.target) edges[e.source] = e; });
            ask = ask.slice(0, 64);
            for (var b = 0; b < ask.length && !noDet; b += 12) {
              await Promise.all(ask.slice(b, b + 12).map(function (nid) {
                return H.callWS({ type: 'unifi_insights/topology/node_details', entry_id: src.entry_id, site_id: siteId, node_id: nid }).then(
                  function (r) {
                    if (!r) return;
                    details[nid] = r;
                    if (r.mac_address || r.ip_address) { cached[nid] = { mac: r.mac_address ? String(r.mac_address).toLowerCase() : null, ip: r.ip_address || null }; dirty = true; }
                  },
                  function (err) { if (err && (err.code === 'unauthorized' || err.code === 'unknown_command')) noDet = true; }
                );
              }));
            }
            topo.nodes.forEach(function (n) {
              if (n.kind === 'wan') return;
              var det = details[n.id] || {}, ed = edges[n.id] || {}, par = ed.target ? nodes[ed.target] : null;
              var mac = det.mac_address ? String(det.mac_address).toLowerCase() : regMac(n.ha_device_id);
              var parDet = par && details[par.id] ? details[par.id] : null;
              var parMac = (parDet && parDet.mac_address ? String(parDet.mac_address).toLowerCase() : null) || (par ? regMac(par.ha_device_id) : null);
              var rec = {
                id: 'ui:' + (mac || n.id), name: n.name || '', kind: n.kind, mac: mac, ip: det.ip_address || null,
                haDevId: det.device_id || n.ha_device_id || null,
                via: par && par.kind !== 'wan' ? par.name : null,
                viaMac: par && par.kind !== 'wan' ? parMac : null,
                wired: ed.medium === 'wired' || n.connection === 'wired',
                wifi: ed.medium === 'wireless' || n.connection === 'wireless',
                port: ed.parent_port || null, speed: ed.speed_mbps || null,
                vlan: n.vlan_id || null, netName: n.network_name || null,
                home: n.state !== 'offline'
              };
              if (n.kind === 'gateway' || n.kind === 'switch' || n.kind === 'access_point') {
                infra[mac || n.name] = rec; if (mac) byMac[mac] = rec; found = true;
              } else if (n.kind === 'client') {
                clients[rec.id] = rec; if (mac) byMac[mac] = rec; found = true;
              }
            });
          }
        }
        if (dirty && ck) {
          var cks = Object.keys(cached);
          if (cks.length > 500) { var trim = {}; cks.slice(cks.length - 500).forEach(function ( xk ) { trim[xk] = cached[xk]; }); cached = trim; }
          try { localStorage.setItem(ck, JSON.stringify(cached)); } catch (e1) { /* no storage */ }
        }
        if (found) { this._uiClients = clients; this._uiInfra = infra; this._uiByMac = byMac; }
        return found;
      } catch (e) { return false; }
    }
    _matterIds() {
      var H = this._hass, devices = (H && H.devices) || {}, entities = (H && H.entities) || {}, mat = {};
      Object.keys(entities).forEach(function (eid) { var e = entities[eid]; if (e.platform === 'matter' && e.device_id) mat[e.device_id] = 1; });
      Object.keys(devices).forEach(function (id) { if ((devices[id].identifiers || []).some(function (i) { return i[0] === 'matter'; })) mat[id] = 1; });
      return Object.keys(mat).filter(function (id) { return devices[id] && !devices[id].disabled_by; }).slice(0, 250);
    }
    _matterCacheKey() { var u = this._hass && !this._hass.demo && this._hass.user && this._hass.user.id; return u ? 'connection-map-card-matter:' + u : ''; }
    // Instant Thread vs Wi-Fi classification from the entity registry and Thread dataset list, without waking sleepy Thread sensors.
    async _matterFast() {
      var H = this._hass, states = (H && H.states) || {}, ids = this._matterIds();
      this._matter = null; this._matSleepy = {};
      if (!ids.length || !H || !H.callWS) return;
      if (H.demo) { await this._matterInfo(); return; }
      var reg = null, ds = null, cached = {}, ck = this._matterCacheKey();
      if (ck) { try { cached = JSON.parse(localStorage.getItem(ck) || '{}') || {}; } catch (e) { cached = {}; } }
      await Promise.all([
        H.callWS({ type: 'config/entity_registry/list' }).then(function (r) { reg = r; }, function () { }),
        H.callWS({ type: 'thread/list_datasets' }).then(function (r) { ds = r && r.datasets; }, function () { })
      ]);
      var dsName = '';
      if (Array.isArray(ds) && ds.length) {
        var pref = ds.filter(function (d) { return d.preferred; })[0] || ds[0];
        dsName = (pref && pref.network_name) || '';
      }
      var byDev = {}, list = Array.isArray(reg) ? reg : Object.keys(H.entities || {}).map(function (k) { return H.entities[k]; });
      list.forEach(function (e) { if (e && e.device_id) (byDev[e.device_id] = byDev[e.device_id] || []).push(e); });
      var res = {}, sleepy = this._matSleepy, thName = dsName;
      ids.forEach(function (id) {
        var es = byDev[id] || [], c = cached[id];
        if (c && c.net === 'thread' && !thName && c.name) thName = c.name;
        var isTh = es.some(function (e) { return /^thread_/.test(e.translation_key || '') || /_thread_(channel|network_name|routing_role|extended_address)$/.test(e.entity_id || ''); });
        var isBat = es.some(function (e) {
          var a = (states[e.entity_id] || {}).attributes || {};
          return a.device_class === 'battery' || /^battery/.test(e.translation_key || '') || /_battery(_level|_voltage|_type)?$/.test(e.entity_id || '');
        });
        if (isTh && isBat) sleepy[id] = true;
        if (isTh) res[id] = { net: 'thread', name: (c && c.name) || dsName, type: (c && c.type) || (isBat ? 'sleepy_end_device' : ''), mac: (c && c.mac) || null, ip: (c && c.ip) || null, fabs: (c && c.fabs) || [] };
        else if (c) res[id] = Object.assign({}, c);
      });
      Object.keys(res).forEach(function (id) { if (res[id].net === 'thread' && !res[id].name && thName) res[id].name = thName; });
      if (Object.keys(res).length) this._matter = res;
    }
    // Live Matter diagnostics for mains-powered / Wi-Fi nodes only (sleepy battery Thread sensors block 5-20 s waiting to wake).
    async _matterInfo() {
      var H = this._hass, ids = this._matterIds(), sleepy = this._matSleepy || {};
      if (!ids.length || !H || !H.callWS) return false;
      function low(x) { return String(x || '').toLowerCase(); }
      var before = JSON.stringify(this._matter || {}), res = Object.assign({}, this._matter || {}), dead = false;
      var fastIds = ids.filter(function (id) { return !sleepy[id]; });
      for (var i = 0; i < fastIds.length && !dead; i += 8) {
        await Promise.all(fastIds.slice(i, i + 8).map(function (id) {
          var req = H.callWS({ type: 'matter/node_diagnostics', device_id: id });
          var race = H.demo ? req : Promise.race([req, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 2500); })]);
          return race.then(function (r) {
            if (!r || !r.network_type) return;
            var mac = r.mac_address && /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(r.mac_address) ? low(r.mac_address) : null;
            var ip = ((r.ip_adresses || r.ip_addresses || []).filter(function (x) { return /^\d+\.\d+\.\d+\.\d+$/.test(String(x || '')); })[0]) || null;
            var fabs = [];
            (r.active_fabrics || []).forEach(function (fb) {
              var vn = String(fb.fabric_label || fb.vendor_name || '').trim();
              if (vn && !/home assistant|open home|keychain|^home$/i.test(vn) && fabs.indexOf(vn) < 0) fabs.push(vn);
            });
            res[id] = { net: r.network_type, name: r.network_name || (res[id] && res[id].name) || '', type: r.node_type || '', mac: mac, ip: ip, fabs: fabs };
          }, function (e) { if (e && e.code === 'unknown_command') dead = true; });
        }));
      }
      var thName = '';
      Object.keys(res).forEach(function (id) { if (res[id] && res[id].net === 'thread' && !thName && res[id].name) thName = res[id].name; });
      Object.keys(res).forEach(function (id) { if (res[id] && res[id].net === 'thread' && thName && !res[id].name) res[id].name = thName; });
      if (!Object.keys(res).length) return false;
      this._matter = res;
      var ck = this._matterCacheKey();
      if (ck) { try { localStorage.setItem(ck, JSON.stringify(res)); } catch (e) { /* no storage */ } }
      return JSON.stringify(res) !== before;
    }
    // Which Bluetooth receiver (adapter or proxy) hears each Bluetooth device best. Needs admin; runs independently of Matter.
    async _btInfo() {
      var H = this._hass, devices = (H && H.devices) || {};
      function low(x) { return String(x || '').toLowerCase(); }
      var hasBt = Object.keys(devices).some(function (id) { return (devices[id].connections || []).some(function (c) { return c[0] === 'bluetooth'; }); });
      if (!hasBt || !H.connection || !H.connection.subscribeMessage) return false;
      try {
        var sc = {}, adv = {};
        var u1 = await H.connection.subscribeMessage(function (m) { ((m && m.add) || []).forEach(function (x) { sc[low(x.source)] = x; }); }, { type: 'bluetooth/subscribe_scanner_details' });
        var u2 = await H.connection.subscribeMessage(function (m) {
          ((m && m.add) || []).forEach(function (a) { var k = low(a.address), o = adv[k], src = low(a.source); if (!o || o.source === src || a.rssi > o.rssi) adv[k] = { source: src, rssi: a.rssi }; });
        }, { type: 'bluetooth/subscribe_advertisements' });
        await new Promise(function (r) { setTimeout(r, 3500); }); // the advertisements are a live stream: listen briefly, then stop
        if (typeof u1 === 'function') u1(); if (typeof u2 === 'function') u2();
        if (Object.keys(adv).length) { this._bt = { sc: sc, adv: adv }; return true; }
      } catch (e) { /* Bluetooth not loaded or not admin */ }
      return false;
    }
    // subscribe to one MQTT topic (optionally publishing a request) and resolve with the first JSON payload
    _mqttOnce(topic, pub, ms) {
      var H = this._hass;
      return new Promise(function (resolve, reject) {
        var done = false, unsub = null;
        var timer = setTimeout(function () { if (!done) { done = true; if (unsub) unsub(); reject(new Error('timeout')); } }, ms || 45000);
        H.connection.subscribeMessage(function (m) {
          if (done) return; done = true; clearTimeout(timer); if (unsub) unsub();
          try { resolve(JSON.parse(m.variables.trigger.payload)); } catch (e) { reject(e); }
        }, { type: 'subscribe_trigger', trigger: { platform: 'mqtt', topic: topic } }).then(function (u) {
          unsub = u; if (done) u();
          if (pub) return H.callService('mqtt', 'publish', pub);
        }).catch(function (e) { if (!done) { done = true; clearTimeout(timer); reject(e); } });
      });
    }
    // Zigbee2MQTT bridge/info: coordinator firmware and the adapter, named from its serial port
    _z2mInfo(info) {
      if (!info) return;
      var c = info.coordinator || {}, meta = c.meta || {}, port = ((info.config || {}).serial || {}).port || '';
      var fw = meta.revision || [meta.major, meta.minor, meta.patch].filter(function (x) { return x != null; }).join('.');
      this._coordInfo = { type: c.type || '', fw: fw ? String(fw) : '', port: port, name: adapterName(port) };
    }
    // ZHA: every device lists its neighbours with their relationship (Parent / Child / Sibling) and LQI
    _applyZhaMesh(list) {
      this._rawZha = list;
      if (!Array.isArray(list) || !list.length) return;
      var byIeee = {}, byReg = {}, types = {}, parent = {}, lqi = {}, own = {}, coord = null;
      (this._devs || []).forEach(function (d) { byReg[d.id] = d; });
      list.forEach(function (z) {
        types[z.ieee] = z.device_type; own[z.ieee] = z.lqi;
        if (z.device_reg_id && byReg[z.device_reg_id]) byIeee[z.ieee] = byReg[z.device_reg_id];
        if (z.device_type === 'Coordinator') coord = z;
      });
      list.forEach(function (z) {
        (z.neighbors || []).forEach(function (n) {
          var rel = String(n.relationship || '').toLowerCase();
          if (rel === 'child' && !parent[n.ieee]) { parent[n.ieee] = z.ieee; lqi[n.ieee] = +n.lqi; }
          else if (rel === 'parent' && !parent[z.ieee]) { parent[z.ieee] = n.ieee; lqi[z.ieee] = +n.lqi; }
        });
      });
      list.forEach(function (z) {
        if (types[z.ieee] !== 'Router' || parent[z.ieee]) return;
        var best = null;
        (z.neighbors || []).forEach(function (n) { if ((n.device_type === 'Coordinator' || n.device_type === 'Router') && (!best || +n.lqi > +best.lqi)) best = n; });
        if (best) { parent['~' + z.ieee] = best.ieee; lqi[z.ieee] = +best.lqi; }
      });
      Object.keys(byIeee).forEach(function (ie) {
        var d = byIeee[ie], p = parent[ie] || parent['~' + ie];
        d.ieee = d.ieee || ie; d.router = types[ie] === 'Router'; d.lqi = lqi[ie] != null && !isNaN(lqi[ie]) ? lqi[ie] : own[ie];
        d.meshParent = p && (!coord || p !== coord.ieee) && byIeee[p] && byIeee[p] !== d ? byIeee[p] : null;
      });
      if (coord && !this._coordFromDev && !this._cfg.coordinator_name) this._coord = [coord.manufacturer, coord.model].filter(Boolean).join(' ') || this._coord;
      this._mesh = true;
    }
    // Matter ThreadNetworkDiagnostics (cluster 53) + GeneralDiagnostics (cluster 51) cached in Home Assistant's Matter diagnostics endpoint
    async _threadMesh() {
      var H = this._hass, devices = (H && H.devices) || {}, ids = this._matterIds();
      if (!ids.length || !H || typeof H.callApi !== 'function') return null;
      var entries = {}, cids = [];
      try { ((await H.callWS({ type: 'config_entries/get' })) || []).forEach(function (ce) { if (ce && ce.entry_id) entries[ce.entry_id] = ce; }); } catch (e) { /* optional */ }
      Object.keys(entries).forEach(function (cid) { if (entries[cid] && entries[cid].domain === 'matter' && cids.indexOf(cid) < 0) cids.push(cid); });
      if (!cids.length) ids.forEach(function (id) {
        ((devices[id] && devices[id].config_entries) || []).forEach(function (cid) {
          if ((!entries[cid] || entries[cid].domain === 'matter') && cids.indexOf(cid) < 0) cids.push(cid);
        });
      });
      if (!cids.length) return null;
      var out = [];
      for (var i = 0; i < cids.length; i++) {
        try {
          var resp = await H.callApi('GET', 'diagnostics/config_entry/' + cids[i]);
          var d = (resp && resp.data) || resp || {};
          var raw = (d.server && d.server.nodes) || d.nodes || (d.server_info && d.server_info.nodes) || [];
          var arr = Array.isArray(raw) ? raw : Object.keys(raw).map(function (k) { return raw[k]; });
          arr.forEach(function (n) {
            var a = n && n.attributes;
            if (a && (a['0/53/1'] != null || a['0/53/7'] != null || a['0/53/8'] != null)) out.push(n);
          });
        } catch (e) { /* diagnostics not available or not admin */ }
      }
      return out.length ? out : null;
    }
    _applyThreadMesh(list) {
      this._rawThread = list;
      if (!Array.isArray(list) || !list.length || this._cfg.show_mesh === false) return;
      var H = this._hass, devices = (H && H.devices) || {}, byNodeId = {};
      function nodeIdOf(regId) {
        var rd = devices[regId]; if (!rd) return null;
        var found = null;
        (rd.identifiers || []).forEach(function (tup) {
          if (!tup || tup[0] !== 'matter') return;
          var m = /^deviceid_[0-9a-f]+-([0-9a-f]{16})-(.+)$/i.exec(String(tup[1] || ''));
          if (!m) return;
          var dec = typeof BigInt === 'function' ? BigInt('0x' + m[1]).toString() : String(parseInt(m[1], 16));
          if (!found || m[2] === 'MatterNodeDevice') found = dec;
        });
        return found;
      }
      (this._devs || []).forEach(function (d) {
        var nid = nodeIdOf(d.id);
        if (!nid && d.also) d.also.forEach(function (o) { if (!nid) nid = nodeIdOf(o.id); });
        if (nid) byNodeId[nid] = d;
      });
      function b64(s) {
        try { var bin = atob(String(s || '')), a = []; for (var i = 0; i < bin.length; i++) a.push(bin.charCodeAt(i) & 255); return a; }
        catch (e) { return null; }
      }
      function extOf(bytes) {
        if (!bytes || bytes.length !== 8) return null;
        if (typeof BigInt === 'function') {
          var v = BigInt(0); for (var i = 0; i < 8; i++) v = (v << BigInt(8)) | BigInt(bytes[i]);
          return String(Number(v));
        }
        var n = 0; for (var j = 0; j < 8; j++) n = n * 256 + bytes[j];
        return String(n);
      }
      function okRssi(v) { return typeof v === 'number' && !isNaN(v) && v < 0 && v >= -127 ? Math.round(v) : null; }
      function okLqi(v) { return typeof v === 'number' && !isNaN(v) && v >= 0 ? Math.round(v) : null; }
      var tnodes = [], extToRloc = {}, byExt = {}, byRloc = {}, byRouterId = {};
      list.forEach(function (n) {
        if (!n || n.node_id == null) return;
        var a = n.attributes || {}, role = a['0/53/1'], nbs = Array.isArray(a['0/53/7']) ? a['0/53/7'] : [], rts = Array.isArray(a['0/53/8']) ? a['0/53/8'] : [];
        var extKey = null, rloc = null;
        (Array.isArray(a['0/51/0']) ? a['0/51/0'] : []).forEach(function (ifc) {
          if (!ifc) return;
          var hb = b64(ifc['4']);
          if (hb && hb.length === 8 && (ifc['7'] === 4 || !extKey)) extKey = extOf(hb);
          (ifc['6'] || []).forEach(function (ip6) {
            var ib = b64(ip6);
            if (ib && ib.length === 16 && !ib[8] && !ib[9] && !ib[10] && !ib[13] && ib[11] === 255 && ib[12] === 254) rloc = (ib[14] << 8) | ib[15];
          });
        });
        rts.forEach(function (rt) {
          if (rt && rt['0'] && rt['1'] != null) extToRloc[String(rt['0'])] = rt['1'];
          if (rloc == null && rt && rt['8'] && !rt['9'] && rt['3'] === 63 && rt['1'] != null) rloc = rt['1'];
        });
        nbs.forEach(function (nb) { if (nb && nb['0'] && nb['2'] != null) extToRloc[String(nb['0'])] = nb['2']; });
        tnodes.push({ nid: String(n.node_id), d: byNodeId[String(n.node_id)] || null, role: role, isRouter: role === 5 || role === 6, isLeader: role === 6, ext: extKey, rloc: rloc, nbs: nbs, rts: rts });
      });
      tnodes.forEach(function (tn) {
        if (tn.rloc == null && tn.ext && extToRloc[tn.ext] != null) tn.rloc = extToRloc[tn.ext];
        if (tn.ext) byExt[tn.ext] = tn;
        if (tn.rloc != null) { byRloc[tn.rloc] = tn; if (tn.isRouter && (tn.rloc & 1023) === 0) byRouterId[tn.rloc >> 10] = tn; }
      });
      var brRlocs = {}, brRouterIds = {};
      tnodes.forEach(function (tn) {
        tn.rts.forEach(function (rt) {
          if (!rt || rt['8'] === false || rt['1'] == null) return;
          if (!byRloc[rt['1']]) { brRlocs[rt['1']] = 1; brRouterIds[rt['2'] != null ? rt['2'] : (rt['1'] >> 10)] = 1; }
        });
      });
      var parentOf = {}, rssiOf = {}, lqiOf = {};
      tnodes.forEach(function (rn) {
        if (!rn.isRouter) return;
        rn.nbs.forEach(function (nb) {
          if (!nb || !nb['13']) return;
          var ch = (nb['0'] && byExt[String(nb['0'])]) || (nb['2'] != null && byRloc[nb['2']]) || null;
          if (ch && !ch.isRouter) {
            parentOf[ch.nid] = rn;
            var rs = okRssi(nb['6']) != null ? okRssi(nb['6']) : okRssi(nb['7']);
            if (rs != null) rssiOf[ch.nid] = rs;
            if (okLqi(nb['5']) != null) lqiOf[ch.nid] = okLqi(nb['5']);
          }
        });
      });
      tnodes.forEach(function (tn) {
        if (!tn.isRouter) {
          if (!parentOf[tn.nid] && tn.nbs.length) {
            var pnb = tn.nbs.filter(function (x) { return x && !x['13']; })[0] || tn.nbs[0];
            if (pnb) {
              var par = (pnb['0'] && byExt[String(pnb['0'])]) || (pnb['2'] != null && (byRloc[pnb['2']] || byRloc[pnb['2'] & 0xfc00])) || null;
              if (par && par !== tn) parentOf[tn.nid] = par;
              if (rssiOf[tn.nid] == null) rssiOf[tn.nid] = okRssi(pnb['7']) != null ? okRssi(pnb['7']) : okRssi(pnb['6']);
              if (lqiOf[tn.nid] == null && okLqi(pnb['5']) != null) lqiOf[tn.nid] = okLqi(pnb['5']);
            }
          }
          if (!parentOf[tn.nid] && tn.rloc != null && !brRlocs[tn.rloc & 0xfc00]) {
            var rpar = byRloc[tn.rloc & 0xfc00];
            if (rpar && rpar !== tn) parentOf[tn.nid] = rpar;
          }
          return;
        }
        var bestBr = null;
        tn.nbs.forEach(function (nb) {
          if (!nb || nb['13']) return;
          var known = (nb['0'] && byExt[String(nb['0'])]) || (nb['2'] != null && byRloc[nb['2']]);
          var isBr = (nb['2'] != null && brRlocs[nb['2']]) || (!known && nb['2'] != null && (nb['2'] & 1023) === 0);
          if (!isBr) return;
          var rs = okRssi(nb['6']) != null ? okRssi(nb['6']) : okRssi(nb['7']);
          if (!bestBr || (rs != null && (bestBr.rs == null || rs > bestBr.rs))) bestBr = { nb: nb, rs: rs };
        });
        if (bestBr) {
          rssiOf[tn.nid] = bestBr.rs;
          if (okLqi(bestBr.nb['5']) != null) lqiOf[tn.nid] = okLqi(bestBr.nb['5']);
          return;
        }
        var hop = null;
        tn.rts.forEach(function (rt) {
          if (hop || !rt || (!brRlocs[rt['1']] && !brRouterIds[rt['2']])) return;
          if (rt['3'] != null && rt['3'] < 63 && byRouterId[rt['3']] && byRouterId[rt['3']] !== tn) hop = byRouterId[rt['3']];
        });
        if (!hop && !tn.isLeader) {
          var bestR = null;
          tn.nbs.forEach(function (nb) {
            if (!nb || nb['13']) return;
            var cand = (nb['0'] && byExt[String(nb['0'])]) || (nb['2'] != null && byRloc[nb['2']]);
            if (!cand || !cand.isRouter || cand === tn) return;
            var rs2 = okRssi(nb['6']) != null ? okRssi(nb['6']) : okRssi(nb['7']);
            if (!bestR || (cand.isLeader && !bestR.cand.isLeader) || (rs2 != null && (bestR.rs == null || rs2 > bestR.rs))) bestR = { cand: cand, nb: nb, rs: rs2 };
          });
          if (bestR) hop = bestR.cand;
        }
        if (hop) {
          parentOf[tn.nid] = hop;
          tn.nbs.forEach(function (nb) {
            if (!nb) return;
            var match = (nb['0'] && hop.ext && String(nb['0']) === hop.ext) || (nb['2'] != null && hop.rloc != null && nb['2'] === hop.rloc);
            if (match) {
              rssiOf[tn.nid] = okRssi(nb['6']) != null ? okRssi(nb['6']) : okRssi(nb['7']);
              if (okLqi(nb['5']) != null) lqiOf[tn.nid] = okLqi(nb['5']);
            }
          });
        }
      });
      tnodes.forEach(function (tn) {
        var cur = parentOf[tn.nid], seen = {}; seen[tn.nid] = 1;
        while (cur) {
          if (seen[cur.nid]) { delete parentOf[tn.nid]; break; }
          seen[cur.nid] = 1; cur = parentOf[cur.nid];
        }
      });
      var applied = false;
      tnodes.forEach(function (tn) {
        var d = tn.d; if (!d) return;
        applied = true;
        d.threadMesh = true; d.threadRole = true;
        if (tn.role != null) { d.router = tn.isRouter; d.threadLeader = tn.isLeader; }
        var par = parentOf[tn.nid] && parentOf[tn.nid].d;
        d.meshParent = par && par !== d && par.hub === d.hub ? par : null;
        if (rssiOf[tn.nid] != null) d.rssi = rssiOf[tn.nid];
        if (lqiOf[tn.nid] != null) { d.lqi = lqiOf[tn.nid]; d.lqiMax = lqiOf[tn.nid] <= 3 ? 3 : 255; }
      });
      if (applied) this._threadMeshOn = true;
    }
    // Which access point each mobile device is on. When it changes (someone walked to another room, came home, left)
    // the groups are rebuilt; the Zigbee mesh already loaded is drawn again, not asked for again.
    _mobSig() {
      var self = this;
      return (this._devs || []).filter(function (d) { return d.p === 'mobile_app'; }).map(function (d) { var c = self._conn(d.trk); return d.id + '=' + (c && c.via && c.home !== false ? c.via : ''); }).join('|');
    }
    _roam() {
      if (this._mobSig() === this._mobKey) return false;
      this._remodel(); return true;
    }
    // build the model again and draw it, keeping the Zigbee mesh that was already loaded
    // ---- the user's answers (is this one device?) are kept with their Home Assistant user, so every browser sees them
    async _loadAnswers() {
      this._ans = { dup: {} };
      if (this._hass.demo) return;
      try { var r = await this._hass.callWS({ type: 'frontend/get_user_data', key: 'connection_map_card' }); if (r && r.value && r.value.dup) this._ans = { dup: Object.assign({}, r.value.dup) }; return; } catch (e) { /* fall back to this browser */ }
      try { var raw = JSON.parse(localStorage.getItem('connection-map-card') || '{}'); if (raw && raw.dup) this._ans = { dup: raw.dup }; } catch (e) { /* no storage */ }
    }
    _saveAnswers() {
      if (this._hass.demo) return;
      var v = { dup: this._ans.dup };
      try { localStorage.setItem('connection-map-card', JSON.stringify(v)); } catch (e) { /* no storage */ }
      try { var p = this._hass.callWS({ type: 'frontend/set_user_data', key: 'connection_map_card', value: v }); if (p && p.catch) p.catch(function () { }); } catch (e) { /* kept in this browser only */ }
    }
    _modal(html) { var m = this._$('modal'); m.innerHTML = '<div class="dlg">' + html + '</div>'; m.style.display = 'flex'; var b = m.querySelector('button'); if (b) b.focus(); return m; }
    _closeModal() { var m = this._$('modal'); m.style.display = 'none'; m.innerHTML = ''; }
    // Two entries that look like one device: the user decides, one pair at a time
    _dupAsk(i) {
      var self = this, t = this._t.bind(this), list = this._dupPending || [];
      if (!list.length) { this._closeModal(); return; }
      i = Math.max(0, Math.min(i, list.length - 1)); var q = list[i];
      var one = function (x) { return '<div class="one"><b>' + esc(x.n) + '</b><dl class="kv"><dt>' + esc(t('integration')) + '</dt><dd>' + esc(x.as) + '</dd>' + (x.mo ? '<dt>' + esc(t('model')) + '</dt><dd>' + esc(x.mo) + '</dd>' : '') + (x.a ? '<dt>' + esc(t('area')) + '</dt><dd>' + esc(x.a) + '</dd>' : '') + '<dt>' + esc(t('dupGroup')) + '</dt><dd>' + esc(x.g) + '</dd></dl></div>'; };
      var m = this._modal('<h2>' + esc(t('dupTitle')) + (list.length > 1 ? ' · ' + (i + 1) + ' ' + esc(t('dupOf')) + ' ' + list.length : '') + '</h2><p>' + esc(t(q.why === 'app' ? 'dupWhyApp' : 'dupWhyName')) + '</p>' +
        '<div class="pair">' + one(q.a) + one(q.b) + '</div><div class="acts"><button class="btn go" id="dSame">' + esc(t('dupSame')) + '</button><button class="btn" id="dDiff">' + esc(t('dupDiff')) + '</button><button class="btn" id="dLater">' + esc(t('dupLater')) + '</button></div>');
      var answer = function (v) { self._ans.dup[q.key] = v; self._saveAnswers(); self._remodel(); self._dupAsk(i); };
      m.querySelector('#dSame').onclick = function () { answer(true); };
      m.querySelector('#dDiff').onclick = function () { answer(false); };
      m.querySelector('#dLater').onclick = function () { if (i + 1 < list.length) self._dupAsk(i + 1); else self._closeModal(); };
      m.onclick = function (e) { if (e.target === m) self._closeModal(); };
    }
    // Merge by hand: for the same device set up twice under names the card would never connect
    _mergeDialog(d) {
      var self = this, t = this._t.bind(this);
      var m = this._modal('<h2>' + esc(t('mergeTitle')) + '</h2><p><b>' + esc(d.n) + '</b> · ' + esc(this._intName(d.p)) + '</p><input id="mgQ" type="search" placeholder="' + esc(t('mergeSearch')) + '"><div class="list" id="mgList"></div><p>' + esc(t('mergeHint')) + '</p><div class="acts"><button class="btn" id="mgClose">' + esc(t('close')) + '</button></div>');
      var q = m.querySelector('#mgQ'), list = m.querySelector('#mgList');
      var fill = function () {
        var k = q.value.trim().toLowerCase();
        var rows = self._devs.filter(function (x) { return x !== d && (!k || (x.n + ' ' + x.mo + ' ' + x.a + ' ' + self._intName(x.p)).toLowerCase().indexOf(k) >= 0); })
          .sort(function (a, b) { return a.n.localeCompare(b.n); }).slice(0, 60);
        list.innerHTML = rows.map(function (x) { return '<button class="item" data-mid="' + esc(x.id) + '"><i style="background:' + self._M[x.hub.m] + '"></i><span class="nm">' + esc(x.n) + '</span><small>' + esc(self._intName(x.p)) + (x.a ? ' · ' + esc(x.a) : '') + '</small></button>'; }).join('') || '<p>' + esc(t('mergeNone')) + '</p>';
        list.querySelectorAll('[data-mid]').forEach(function (b) {
          b.onclick = function () {
            self._ans.dup[[d.id, b.dataset.mid].sort().join('|')] = true; self._saveAnswers(); self._closeModal(); self._remodel();
            var kept = self._devs.filter(function (x) { return x.id === d.id || x.id === b.dataset.mid; })[0]; if (kept) self._selDev(kept);
          };
        });
      };
      q.addEventListener('input', fill); fill(); q.focus();
      m.querySelector('#mgClose').onclick = function () { self._closeModal(); };
      m.onclick = function (e) { if (e.target === m) self._closeModal(); };
    }
    // ---- diagnostics: what the card found and how it classified it, with nothing that identifies the home
    _diagnostics() {
      var self = this, H = this._hass || {}, cfg = this._given || {}, hubs = this._hubs || [], devs = this._devs || [], man = this._man || {};
      var ENUM = ['layout', 'sort', 'language', 'demo', 'merge_duplicates', 'core_size'], conf = {};
      Object.keys(cfg).sort().forEach(function (k) {
        var v = cfg[k];
        conf[k] = typeof v === 'boolean' || typeof v === 'number' ? v : typeof v === 'string' ? (ENUM.indexOf(k) >= 0 ? v : '<text>') : Array.isArray(v) ? v.length + ' items'
          : v && typeof v === 'object' ? (['colors', 'lines', 'sizes'].indexOf(k) >= 0 ? v : Object.keys(v).length + ' entries') : String(v);
      });
      var ints = {};
      devs.forEach(function (d) { var i = ints[d.p] = ints[d.p] || { iot_class: (man[d.p] || {}).iot_class || null, type: (man[d.p] || {}).integration_type || null, devices: 0 }; i.devices++; if (d.svc) i.services = (i.services || 0) + 1; if (d.bare) i.no_entities = (i.no_entities || 0) + 1; if (d.entity || d.integration) i.entity_only = (i.entity_only || 0) + 1; if (d.off) i.offline = (i.offline || 0) + 1; if (d.also && d.also.length) i.merged = (i.merged || 0) + d.also.length; });
      var ci = this._coordInfo, port = (ci && ci.port) || '';
      return {
        card: VERSION, home_assistant: (H.config && H.config.version) || null, language: H.language || null, user_is_admin: !!(H.user && H.user.is_admin), screen: (this._$('map').getBoundingClientRect().width | 0) + 'px',
        config: conf, option_notes: this._optNotes || [],
        totals: { devices: devs.length, groups: hubs.length, offline: devs.filter(function (d) { return d.off; }).length, routers: (this._routers || []).length, access_points_not_drawn: (this._offMap || []).length, labels_hidden: this._hiddenNames || 0, link_problems: this._linkProblems || 0 },
        groups: hubs.map(function (h) { return { integration: h.p || null, kind: h.kind, medium: h.m, devices: h.dv.length, services: h.dv.filter(function (d) { return d.svc; }).length,
          flags: ['own', 'plain', 'bt', 'rx', 'thread', 'otbr', 'direct', 'tree'].filter(function (k) { return h[k]; }).concat(h.areas && h.areas.length ? ['areas:' + h.areas.length] : []),
          link: h.from && h.from.router ? 'access point' : h.direct ? 'home assistant' : h.m }; }),
        integrations: ints,
        sources: { integration_list: Object.keys(man).length > 0, entity_sources: Object.keys(this._src || {}).length > 0, bluetooth: !!this._bt, matter: !!this._matter, unifi_insights: !!this._uiClients, zha: !!this._hasZha, zigbee_mesh: !!(this._rawMesh || this._rawZha), thread_mesh: !!this._rawThread,
          otbr: ((H.config && H.config.components) || []).indexOf('otbr') >= 0, stick_role: this._otbr ? 'thread border router' : this._coordFromDev ? 'zigbee coordinator' : 'none',
          zigbee2mqtt_adapter: !port ? null : /^(tcp|socket):/i.test(port) ? 'network' : 'serial' },
        duplicates: { mode: cfg.merge_duplicates == null ? 'ask' : cfg.merge_duplicates, merged: devs.reduce(function (n, d) { return n + ((d.also && d.also.length) || 0); }, 0), waiting_for_an_answer: (this._dupPending || []).length, answers: Object.keys((this._ans && this._ans.dup) || {}).length },
        skipped_devices: this._skipped || [], error: this._error || null
      };
    }
    _diagDialog() {
      var self = this, t = this._t.bind(this), text = '';
      try { text = JSON.stringify(this._diagnostics(), null, 1); } catch (e) { text = 'diagnostics failed: ' + e; }
      var m = this._modal('<h2>' + esc(t('diagTitle')) + '</h2><p>' + esc(t('diagHint')) + '</p><textarea readonly id="dgText"></textarea><div class="acts"><button class="btn go" id="dgCopy">' + esc(t('diagCopy')) + '</button><button class="btn" id="dgClose">' + esc(t('close')) + '</button></div>');
      var ta = m.querySelector('#dgText'); ta.value = '```json\n' + text + '\n```';
      m.querySelector('#dgCopy').onclick = function () {
        var done = function () { m.querySelector('#dgCopy').textContent = t('diagCopied'); };
        ta.focus(); ta.select();
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, function () { document.execCommand('copy'); done(); }); else { document.execCommand('copy'); done(); } } catch (e) { /* the text is selected: copy by hand */ }
      };
      m.querySelector('#dgClose').onclick = function () { self._closeModal(); };
      m.onclick = function (e) { if (e.target === m) self._closeModal(); };
    }
    _remodel() {
      this._mesh = false; this._threadMeshOn = false;
      this._model();
      if (this._cfg.show_mesh !== false) {
        if (this._rawMesh) this._applyMesh(this._rawMesh);
        if (this._rawZha) this._applyZhaMesh(this._rawZha);
        if (this._rawThread) this._applyThreadMesh(this._rawThread);
      }
      if (this._S && this._S.sel && !this._S.sel.core) this._S.sel = null;
      this._render(); if (this._S) this._list();
    }
    // the button on the map wins over the configuration until the configuration changes
    _physical() { return this._S && this._S.physical != null ? !!this._S.physical : !!this._cfg.physical_only; }
    _applyMesh(v) {
      this._rawMesh = v;
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
    _coreText() { var e = this._root && this._root.getElementById('coreHost'); if (e) e.textContent = this._sizes().core < 48 ? '' : this._hostShort(); }
    // Normalise what different router integrations report about a client:
    //   Huawei Mesh: connected_via + interface_type (LAN / 2.4GHz / 5GHz)
    //   FRITZ!Box:   connected_to + connection_type (LAN / WLAN) + ssid
    //   UniFi:       ap_mac (-> AP device) + essid + radio (ng / na / 6e); wired clients have neither
    _conn(eid) {
      if (!eid || !this._hass) return null;
      if (eid.indexOf('matter:') === 0) {
        var md = this._matter && this._matter[eid.slice(7)]; if (!md) return null;
        return { via: null, iface: '', wired: md.net === 'ethernet', wifi: md.net === 'wifi', ssid: md.name || null, rssi: null, ip: md.ip || null, home: true };
      }
      if (eid.indexOf('ui:') === 0) {
        var uic = (this._uiClients && this._uiClients[eid]) || (this._uiInfra && this._uiInfra[eid.slice(3)]);
        if (!uic) return null;
        var uvia = (uic.viaMac && this._macName && this._macName[uic.viaMac]) || uic.via || null;
        return { via: uvia, iface: uic.wired ? 'LAN' : '', wired: !!uic.wired, wifi: !!uic.wifi, ssid: uic.netName || null, rssi: null, ip: uic.ip || null, port: uic.port || null, speed: uic.speed || null, home: uic.home !== false };
      }
      if (eid.indexOf('uplink:') === 0) {
        var um = eid.slice(7), uv = (this._macName && this._macName[um]) || um;
        return { via: uv, iface: 'LAN', wired: true, wifi: false, ssid: null, rssi: null, ip: null, port: null, speed: null, home: true };
      }
      var s = this._hass.states[eid]; if (!s) return null; var a = s.attributes || {};
      var ent = (this._hass.entities || {})[eid] || {}, plat = ent.platform;
      // Netgear / Orbi keep this in separate sensors of the same client: access point MAC, link type and SSID
      var ng = plat === 'netgear' && this._ng && this._ng[ent.device_id];
      if (ng) {
        var S2 = this._hass.states, val = function (k) { var x = ng[k] && S2[ng[k]]; return x && x.state !== 'unavailable' && x.state !== 'unknown' ? x.state : ''; };
        a = Object.assign({}, a); if (val('ap')) a.ap_mac = val('ap').replace(/-/g, ':'); if (val('link')) a.connection_type = val('link'); if (val('ssid')) a.ssid = val('ssid');
      }
      var raw = String(a.interface_type || a.connection_type || a.connection || '').trim();
      var band = { ng: '2.4 GHz', na: '5 GHz', '6e': '6 GHz', '6g': '6 GHz' }[String(a.radio || '').toLowerCase()] || '';
      if (/2[.,]?4\s*g/i.test(raw)) band = '2.4 GHz'; else if (/(^|[^\d.])5\s*g/i.test(raw)) band = '5 GHz'; else if (/(^|[^\d.])6\s*g/i.test(raw)) band = '6 GHz';
      var wired = a.is_wired === true || /^(lan|eth|ethernet|wired|cable)\b/i.test(raw);
      if (!raw && !band && plat === 'unifi' && !a.essid && !a.ap_mac && s.state === 'home') wired = true;
      var via = a.connected_via || a.connected_to || a.ap_name || a.access_point || null, hopMac = a.ap_mac || a.sw_mac;
      if (!via && !hopMac && this._gw && this._gw[plat]) via = this._gw[plat]; // a gateway that says nothing else: its clients are on it
      if (!via && hopMac) via = (this._macName || {})[String(hopMac).toLowerCase()] || hopMac;
      var wifi = !wired && !!(band || /w-?lan|wi-?fi|wireless|802\.11/i.test(raw) || a.essid || a.ssid);
      var macL = a.mac ? String(a.mac).toLowerCase() : '', uiEx = macL && this._uiByMac ? this._uiByMac[macL] : null;
      if (uiEx && !via) via = (uiEx.viaMac && this._macName && this._macName[uiEx.viaMac]) || uiEx.via || null;
      return {
        via: via, iface: wired ? 'LAN' : band, wired: wired, wifi: wifi, ssid: a.essid || a.ssid || null,
        rssi: a.rssi || a.signal_strength || null, ip: a.ip || a.ip_address || (uiEx && uiEx.ip) || null,
        port: a.sw_port || (uiEx && uiEx.port) || null, speed: a.wired_rate_mbps || (uiEx && uiEx.speed) || null, home: s.state === 'home'
      };
    }
    _ifaceText(c) {
      var t = this._t.bind(this); if (!c) return '';
      var base = c.wired ? t('wired') : c.wifi ? t('wifi') + (c.iface ? ' ' + c.iface : '') : '';
      var sp = c.speed ? (c.speed >= 1000 ? (c.speed / 1000) + ' Gbps' : c.speed + ' Mbps') : '';
      var pt = c.port ? t('port') + ' ' + c.port : '';
      return [base, sp, pt].filter(Boolean).join(' · ');
    }
    _hubConn(h) {
      // a hub's own connection, or the most common one among its devices
      if (h.trk) return this._conn(h.trk);
      if (h.p === 'mobile_app') return h.apHint ? this._conn(h.dv[0] && h.dv[0].trk) : null; // one group of mobile devices per access point
      var cnt = {}, best = null, self = this;
      h.dv.forEach(function (d) { var c = self._conn(d.trk); if (c && c.via) { cnt[c.via] = (cnt[c.via] || 0) + 1; if (!best || cnt[c.via] > cnt[best.via]) best = c; } });
      return best;
    }
    _mname(m) {
      if (m === 'local' && this._router) return this._router.n;
      if (m === 'radio' && this._coord) return this._coord;
      return this._t(m);
    }

    _intName(p) {
      var n = (this._cfg && this._cfg.names) || {};
      if (n[p]) return n[p];
      if (p === 'mobile_app') return this._t('mobile');
      if (SHORT[p]) return SHORT[p];
      return (this._man[p] && this._man[p].name) || p.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }
    _medium(p) {
      var o = (this._cfg && this._cfg.overrides) || {};
      if (o[p] === 'cloud' || o[p] === 'local' || o[p] === 'radio') return o[p];
      if (RADIO.indexOf(p) >= 0) return 'radio';
      var iot = this._man[p] && this._man[p].iot_class;
      if (iot) return iot.indexOf('cloud') === 0 ? 'cloud' : 'local';
      return CLOUD_GUESS.indexOf(p) >= 0 ? 'cloud' : 'local';
    }

    // A map that fails to build must not leave an empty card: the error is shown, and what was drawn stays.
    _model() { try { this._modelRaw(); this._modelBad = false; } catch (e) { this._modelBad = true; this._fail('model', e); } }
    _render() {
      if (this._modelBad) return;
      try { this._renderRaw(); if (this._error) { this._error = null; this._note(); } } catch (e) { this._fail(this._inLayout ? 'layout' : 'draw', e); }
    }
    _fail(where, e) {
      this._error = { where: where, message: String((e && e.message) || e).slice(0, 300), stack: String((e && e.stack) || '').split('\n').slice(0, 4).join(' | ').slice(0, 600) };
      console.error('connection-map-card', where, e);
      try { this._note(); var p = this._$('loading'); if (p) p.textContent = this._t('errTitle') + ' ' + this._error.message; } catch (x) { /* nothing to show it in yet */ }
    }
    _modelRaw() {
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
      // Z-Wave: Home Assistant does not link the nodes to their controller, but every node is identified as
      // "<network>-<node>" and the controller is node 1. With that, the controller (the USB stick, a Connect ZWA-2) is
      // drawn as the hub of its network, the way a Zigbee2MQTT bridge or a Hue Bridge is.
      var zwHome = {}, zwCtrl = {}, zwNodes = {};
      Object.keys(devices).forEach(function (k) {
        (devices[k].identifiers || []).forEach(function (i) {
          var m = i[0] === 'zwave_js' && /^(\d+)-(\d+)$/.exec(String(i[1])); if (!m || devices[k].disabled_by) return;
          zwHome[k] = m[1]; zwNodes[m[1]] = (zwNodes[m[1]] || 0) + 1; if (m[2] === '1') zwCtrl[m[1]] = devices[k];
        });
      });
      function zwHub(id) { var c = zwCtrl[zwHome[id]]; return c && zwNodes[zwHome[id]] > 1 ? c : null; }
      function platOf(id) { return primary(byDev[id] || []) || (((devices[id] || {}).identifiers || [])[0] || [])[0] || ''; }
      function isHubDevice(v) { return v && !v.disabled_by && ((children[v.id] || 0) >= 2 || (byDev[v.id] || []).length <= 5); }
      var hubs = {}, devs = [], routers = [], routerByMac = {}, coords = [];
      this._z2mBridge = null;
      var macName = {}, apMacs = {};
      Object.keys(devices).forEach(function (id) {
        var d = devices[id]; if (d.disabled_by) return;
        var p0 = platOf(id);
        (d.connections || []).forEach(function (c) {
          if (c[0] === 'mac') { var ml = String(c[1]).toLowerCase(); if (p0 === 'unifi' || !macName[ml]) macName[ml] = (d.name_by_user || d.name); }
        });
      });
      this._macName = macName;
      // device_tracker entities from router integrations (plus UniFi Insights topology clients) tell which node each client uses
      var trk = [], seenTrkMac = {};
      Object.keys(entities).forEach(function (eid) {
        var e = entities[eid];
        if ((e.platform === 'unifi' || e.platform === 'unifi_insights') && /_uplink_mac$/.test(eid) && H.states[eid] && /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(H.states[eid].state)) {
          apMacs[H.states[eid].state.toLowerCase()] = 1;
        }
        if (eid.indexOf('device_tracker.') === 0 && ROUTER_INTS.indexOf(e.platform) >= 0) {
          trk.push(eid);
          var a = (H.states[eid] || {}).attributes || {};
          if (a.mac && H.states[eid]) seenTrkMac[String(a.mac).toLowerCase()] = 1;
          if (a.ap_mac) apMacs[String(a.ap_mac).toLowerCase()] = 1;
          if (a.sw_mac) apMacs[String(a.sw_mac).toLowerCase()] = 1;
        }
      });
      Object.keys(this._uiInfra || {}).forEach(function (k) { var r = self._uiInfra[k]; if (r.mac) apMacs[r.mac] = 1; });
      Object.keys(this._uiClients || {}).forEach(function (uid) { var c = self._uiClients[uid]; if (!c.mac || !seenTrkMac[c.mac]) trk.push(uid); });
      this._trk = trk;
      var ng = this._ng = {}, ngAps = {};
      Object.keys(entities).forEach(function (eid) {
        var e = entities[eid]; if (e.platform !== 'netgear' || !e.device_id || eid.indexOf('sensor.') !== 0) return;
        var k = e.translation_key === 'access_point_mac' || /_access_point_mac$/.test(eid) ? 'ap' : e.translation_key === 'link_type' || /_link_type$/.test(eid) ? 'link' : e.translation_key === 'ssid' || /_ssid$/.test(eid) ? 'ssid' : '';
        if (!k) return; (ng[e.device_id] = ng[e.device_id] || {})[k] = eid;
        if (k === 'ap' && H.states[eid] && /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.test(H.states[eid].state)) ngAps[H.states[eid].state.toLowerCase().replace(/-/g, ':')] = 1;
      });
      this._hasZha = Object.keys(entities).some(function (k) { return entities[k].platform === 'zha'; });
      // A Connect ZBT / SkyConnect stick is a Zigbee coordinator or a Thread border router, depending on its firmware,
      // and the device registry does not say which. It is taken as the Thread border router when OpenThread Border
      // Router is set up and no Zigbee stack can be using the stick: there is no Zigbee at all, or Zigbee2MQTT says
      // (through its bridge info) that its adapter is another one, and there is no ZHA. Otherwise it is the coordinator.
      var stick = null, hasZ2m = false;
      Object.keys(devices).forEach(function (k) {
        var d = devices[k]; if (d.disabled_by) return;
        if (/zigbee2mqtt/i.test(d.manufacturer || '') && (byDev[k] || []).some(function (e) { return e.platform === 'mqtt'; })) hasZ2m = true;
        if (!stick && COORD_INTS.indexOf(primary(byDev[k] || []) || ((d.identifiers || [])[0] || [])[0]) >= 0) stick = String(d.name_by_user || d.name || '').trim().replace(/\s*\([^)]*\)\s*$/, '').replace(/^Home Assistant\s+/, '');
      });
      var ad = this._coordInfo && this._coordInfo.port ? this._coordInfo : null, net = ad && /^(?:tcp|socket):\/\/([^:/]+)/i.exec(ad.port);
      var z2mOnStick = !ad ? null : net ? false : /zbt|skyconnect|sky_connect|nabu.?casa|yellow/i.test(ad.port) ? true : null;
      var otbr = ((H.config && H.config.components) || []).indexOf('otbr') >= 0;
      var stickZigbee = !!stick && (this._hasZha || (hasZ2m ? z2mOnStick !== false : !otbr)); // Zigbee2MQTT on another adapter: not its coordinator either way
      this._otbr = stick && otbr && !stickZigbee ? stick : null;
      // a network coordinator (SLZB-06 and the like) is named after the device Home Assistant knows at that address
      var netName = '';
      if (net) Object.keys(devices).forEach(function (k) { var u = devices[k].configuration_url, h = ''; try { h = u ? new URL(u).hostname : ''; } catch (e) { h = ''; } if (!netName && h === net[1]) netName = String(devices[k].model || devices[k].name_by_user || devices[k].name || '').trim(); });
      function slug(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }
      function trkMeta(eid) {
        if (eid.indexOf('ui:') === 0) {
          var u = self._uiClients && self._uiClients[eid];
          return u ? { devId: u.haDevId || null, mac: u.mac, ip: u.ip, ts: slug(u.name) } : { devId: null, mac: null, ip: null, ts: '' };
        }
        var a = (H.states[eid] || {}).attributes || {};
        return { devId: null, mac: a.mac ? String(a.mac).toLowerCase() : null, ip: a.ip || a.ip_address || null, ts: eid.slice(15) };
      }
      function findTrk(dev) {
        if (!dev || dev.entry_type === 'service') return null;
        var md = self._matter && self._matter[dev.id];
        if (!trk.length) { findTrk.sure = false; return md && md.net === 'wifi' ? 'matter:' + dev.id : null; }
        var best = null;
        var macs = (dev.connections || []).filter(function (c) { return c[0] === 'mac'; }).map(function (c) { return String(c[1]).toLowerCase(); });
        if (md && md.mac && macs.indexOf(md.mac) < 0) macs.push(md.mac);
        var host = null; try { host = dev.configuration_url ? new URL(dev.configuration_url).hostname : null; } catch (e) { host = null; }
        var ips = [host, md && md.ip].filter(Boolean);
        trk.forEach(function (eid) {
          if (best) return; var tm = trkMeta(eid);
          if (tm.devId && tm.devId === dev.id) best = eid;
          else if (tm.mac && macs.indexOf(tm.mac) >= 0) best = eid;
          else if (tm.ip && ips.indexOf(tm.ip) >= 0) best = eid;
        });
        findTrk.sure = !!best;
        var ds = slug(dev.name_by_user || dev.name), dt = ds.split('_').filter(Boolean);
        if (!best && ds) trk.forEach(function (eid) {
          if (best) return; var tm = trkMeta(eid); if (!tm.ts) return;
          var ts = tm.ts, tt = ts.split('_');
          if (ts === ds || (dt.length >= 2 && dt.every(function (x) { return tt.indexOf(x) >= 0; })) ||
            (dt.length === 1 && dt[0].length >= 5 && tt.indexOf(dt[0]) >= 0 && tt.length <= 3)) best = eid;
        });
        if (!best && md && md.net === 'wifi') best = 'matter:' + dev.id;
        return best;
      }
      this._findTrk = findTrk;
      function mk(id, d, es, p, hub) {
        var x = {
          id: id, n: (d.name_by_user || d.name || id).trim(), mo: [d.manufacturer, d.model].filter(Boolean).join(' · '), mf: String(d.manufacturer || '').trim(),
          a: d.area_id && areas[d.area_id] ? areas[d.area_id].name : '', p: p, hub: hub, ents: es.filter(function (e) { return !e.hidden; }).map(function (e) { return e.entity_id; })
        };
        if (!x.ents.length) x.ents = es.map(function (e) { return e.entity_id; });
        var ie = (d.identifiers || []).map(function (i) { return String(i[1] || ''); }).filter(function (s) { return s.indexOf('zigbee2mqtt_0x') === 0; })[0];
        x.ieee = ie ? ie.slice(12) : null;
        x.trk = x.ieee ? null : findTrk(d); x.trkSure = !!x.trk && findTrk.sure; x.also = []; x.bare = !es.length; x.dis = !!d.disabled_by;
        x.svc = d.entry_type === 'service' || ['service', 'virtual', 'system', 'entity', 'helper'].indexOf((self._man[p] || {}).integration_type) >= 0;
        // the companion app reports how the phone is connected (Android: network_type, iOS: connection_type)
        if (p === 'mobile_app') x.net = (es.filter(function (e) { return /^sensor\..*_(network|connection)_type$/.test(e.entity_id); })[0] || {}).entity_id || null;
        // battery devices sleep between reports: see _status
        x.battery = es.some(function (e) { var a = (H.states[e.entity_id] || {}).attributes || {}; return a.device_class === 'battery' || /_battery(_level)?$/.test(e.entity_id); });
        hub.dv.push(x); devs.push(x);
        return x;
      }
      var byConn = {};
      Object.keys(devices).forEach(function (k) { (devices[k].connections || []).forEach(function (c) { if (c[0] === 'mac' || c[0] === 'bluetooth') byConn[String(c[1]).toLowerCase()] = devices[k]; }); });
      function isBt(d) { var c = d.connections || []; return c.some(function (x) { return x[0] === 'bluetooth'; }) && !c.some(function (x) { return x[0] === 'mac'; }); }
      // A desktop computer running the companion app: named by the user (computers: [...]), or a Mac that is not a laptop
      // (iMac, Mac mini, Mac Pro; the newer "Mac14,3" style models only when the app reports no battery).
      var pcNames = (Array.isArray(cfg.computers) ? cfg.computers : []).map(function (x) { return String(x).trim().toLowerCase(); });
      function isComputer(d, es) {
        if (pcNames.indexOf(String(d.name_by_user || d.name || '').trim().toLowerCase()) >= 0 || pcNames.indexOf(d.id) >= 0) return true;
        var mo = String(d.model || '');
        if (/^(imac|macmini|mac ?mini|macpro|mac ?pro|mac ?studio)/i.test(mo)) return true;
        return /^mac\d/i.test(mo) && !es.some(function (e) { return /battery/.test(e.entity_id); });
      }
      function hubFor(key, name, medium, kind, p) {
        if (!hubs[key]) hubs[key] = { key: key, n: name, m: medium, kind: kind, p: p, dv: [] };
        return hubs[key];
      }
      var tbrDev = null, hasThreadMat = false, threadFabs = [];
      if (cfg.thread_via_border_router && self._matter && self._medium('matter') === 'local' && cfg.exclude_integrations.indexOf('matter') < 0) {
        Object.keys(self._matter).forEach(function (mid) {
          var md = self._matter[mid], dd = devices[mid];
          if (md && md.net === 'thread' && dd && !dd.disabled_by && cfg.exclude_devices.indexOf(mid) < 0) {
            hasThreadMat = true;
            (md.fabs || []).forEach(function (fb) { if (threadFabs.indexOf(fb) < 0) threadFabs.push(fb); });
          }
        });
      }
      if (hasThreadMat) {
        if (typeof cfg.thread_via_border_router === 'string' && cfg.thread_via_border_router.trim()) {
          var qTbr = cfg.thread_via_border_router.trim().toLowerCase();
          Object.keys(devices).forEach(function (k) {
            var dd = devices[k];
            if (tbrDev || dd.disabled_by || dd.entry_type === 'service' || cfg.exclude_devices.indexOf(k) >= 0) return;
            var dp0 = primary(byDev[k] || []) || platOf(k);
            if (ROUTER_INTS.indexOf(dp0) >= 0 || COORD_INTS.indexOf(dp0) >= 0) return;
            if (k.toLowerCase() === qTbr || String(dd.name_by_user || dd.name || '').trim().toLowerCase() === qTbr) tbrDev = dd;
          });
        } else if (!self._otbr) {
          var tbrCands = Object.keys(devices).map(function (k) { return devices[k]; }).filter(function (dd) {
            if (dd.disabled_by || dd.entry_type === 'service' || cfg.exclude_devices.indexOf(dd.id) >= 0) return false;
            var dp = primary(byDev[dd.id] || []) || platOf(dd.id), mm = (dd.manufacturer || '') + ' ' + (dd.model || '');
            if (!dp || SKIP.indexOf(dp) >= 0 || cfg.exclude_integrations.indexOf(dp) >= 0 || ROUTER_INTS.indexOf(dp) >= 0 || COORD_INTS.indexOf(dp) >= 0 || dp === 'mobile_app') return false;
            return (dp === 'apple_tv' && (!dd.model || /4k|homepod/i.test(dd.model))) ||
              /homepod|apple\s*tv\s*4k|nest\s*(hub\s*(2nd|max)|wifi\s*pro)|eero\s*(6|pro|max)/i.test(mm);
          });
          if (tbrCands.length > 1 && threadFabs.length) {
            var fabStr = threadFabs.join(' ');
            var narrowed = tbrCands.filter(function (dd) {
              var mm = (dd.manufacturer || '') + ' ' + (dd.model || '') + ' ' + (platOf(dd.id) || '');
              return (/apple/i.test(fabStr) && /apple|homepod/i.test(mm)) || (/google|nest/i.test(fabStr) && /google|nest/i.test(mm)) || (/amazon|eero/i.test(fabStr) && /amazon|eero/i.test(mm));
            });
            if (narrowed.length) tbrCands = narrowed;
          }
          if (tbrCands.length === 1) tbrDev = tbrCands[0];
        }
      }
      var hasUnifiHw = Object.keys(devices).some(function (k) {
        var dk = devices[k]; if (dk.disabled_by || dk.entry_type === 'service') return false;
        var pk = platOf(k); if (pk !== 'unifi' && pk !== 'unifi_insights') return false;
        if (/^(wifi network|unifi firewall|firewall)/i.test(dk.model || '')) return false;
        var ek = byDev[k] || [];
        if (ek.some(function (e) { return e.entity_id.indexOf('device_tracker.') === 0; })) return false;
        return !!(dk.model || ek.length);
      });
      var skipped = this._skipped = [];
      this._nDis = 0; var incDis = !!cfg.show_disabled || !!(this._S && this._S.show === 'dis');
      var one = function (id) {
        var d = devices[id];
        if (cfg.exclude_devices.indexOf(id) >= 0) return;
        if (d.entry_type === 'service' && d.via_device_id) return; // virtual rooms/zones/groups exposed by a hub
        // A device switched off in Home Assistant ("Enable device") is still set up there: it is only drawn on request
        var dis = !!d.disabled_by, es = dis ? [] : (byDev[id] || []), p = primary(es), bare = false;
        if (dis) {
          var dp = platOf(id);
          if (!dp || d.entry_type === 'service' || ROUTER_INTS.indexOf(dp) >= 0 || COORD_INTS.indexOf(dp) >= 0 || SKIP.indexOf(dp) >= 0 || cfg.exclude_integrations.indexOf(dp) >= 0) return;
          self._nDis++; if (!incDis) return;
        }
        if (!p) {
          // No entities (the integration creates none for it, or they are all disabled): a remote that only sends events,
          // a lock the integration cannot control. It is still a device of that integration.
          p = platOf(id); bare = true;
          if (es.length || !p) return;
          if (!dis && ROUTER_INTS.indexOf(p) < 0 && (cfg.devices_without_entities === false || d.entry_type === 'service' || p === 'bluetooth')) return; // a gateway without entities is still the gateway
        }
        var nm = (d.name_by_user || d.name || id).trim();
        if (COORD_INTS.indexOf(p) >= 0) { coords.push(nm.replace(/\s*\([^)]*\)\s*$/, '').replace(/^Home Assistant\s+/, '')); return; }
        if (p === 'mqtt' && /zigbee2mqtt/i.test(d.manufacturer || '')) self._z2mBridge = d;
        var doms = es.map(function (e) { return e.entity_id.split('.')[0]; });
        if (!bare && doms.every(function (x) { return x === 'update'; })) return;
        if (!bare && !cfg.show_trackers && p !== 'mobile_app' && doms.every(function (x) { return x === 'device_tracker' || x === 'update'; })) return;
        if (SKIP.indexOf(p) >= 0 || cfg.exclude_integrations.indexOf(p) >= 0 || p === 'unifi_wan') return;
        // UniFi registers WLANs and firewall rules as service entries, and every client as a device (with 0 entities when
        // trackers are disabled, or a block switch alongside its tracker). Only real gateways, switches and APs are network nodes.
        if (p === 'unifi' || p === 'unifi_insights') {
          var rmacs = (d.connections || []).filter(function (c) { return c[0] === 'mac'; }).map(function (c) { return String(c[1]).toLowerCase(); });
          if (d.entry_type === 'service' || /^(wifi network|unifi firewall|firewall)/i.test(d.model || '') || (!d.name && !d.model && !rmacs.length)) return;
          var isInfra = rmacs.some(function (m) { return !!apMacs[m]; });
          if (!isInfra && (doms.indexOf('device_tracker') >= 0 || (bare && !d.model && hasUnifiHw))) {
            if (!cfg.show_trackers || (bare && cfg.devices_without_entities === false)) return;
          } else {
            var rmac = rmacs[0] || null;
            var isSw = !!(rmac && self._uiInfra && self._uiInfra[rmac] && self._uiInfra[rmac].kind === 'switch') ||
              (/\b(usw|usmini|switch|flex\s*mini|crs\d|css\d|tl-sg|gs\d{3})\b/i.test((d.model || '') + ' ' + nm) && !/\b(ap|u[67]|uap|wifi|wlan)\b/i.test(nm));
            var upEnt = (es.filter(function (e) { return /_uplink_mac$/.test(e.entity_id); })[0] || {}).entity_id || null;
            if (rmac && routerByMac[rmac]) {
              var ex = routerByMac[rmac];
              if (p === 'unifi' && ex.p !== 'unifi') { ex.id = id; ex.n = nm; ex.p = p; }
              if (isSw) ex.sw = true;
              if (upEnt && !ex.uplinkEnt) ex.uplinkEnt = upEnt;
              es.forEach(function (e) { if (ex.ents.indexOf(e.entity_id) < 0) ex.ents.push(e.entity_id); });
              return;
            }
            var rObj = { id: id, n: nm, p: p, mac: rmac, sw: isSw, uplinkEnt: upEnt, ents: es.map(function (e) { return e.entity_id; }) };
            routers.push(rObj); if (rmac) routerByMac[rmac] = rObj;
            return;
          }
        } else if (CLIENTS_AS_DEVICES.indexOf(p) >= 0 && d.via_device_id && !(d.connections || []).some(function (c) { return c[0] === 'mac' && ngAps[String(c[1]).toLowerCase()]; })) { if (!cfg.show_trackers) return; }
        else if (ROUTER_INTS.indexOf(p) >= 0) {
          var isSw2 = /\b(usw|usmini|switch|crs\d|css\d|tl-sg|gs\d{3})\b/i.test((d.model || '') + ' ' + nm) && !/\b(ap|wifi|wlan)\b/i.test(nm);
          routers.push({ id: id, n: nm, p: p, sw: isSw2, ents: es.map(function (e) { return e.entity_id; }) }); return;
        }
        if ((children[id] || 0) > 0 && isHubDevice(d)) return; // the hub itself is drawn as a hub node
        if (zwHub(id) === d || (tbrDev && id === tbrDev.id)) return; // so is a Z-Wave controller or LAN Thread border router
        var v = d.via_device_id ? devices[d.via_device_id] : null;
        if (v && ROUTER_INTS.indexOf(platOf(v.id)) >= 0) v = null; // "via the router" is the network, not a hub
        var zw = !v && zwHub(id); if (zw) v = zw;
        var medium = self._medium(p);
        if (p === 'mqtt' && v && /zigbee2mqtt/i.test((v.manufacturer || '') + ' ' + (v.name || ''))) medium = 'radio';
        // integrations that report their own connection mode (e.g. Bambu Lab: "Bambu Cloud" vs local MQTT)
        var cm = es.filter(function (e) { return /_mqtt_connection_mode$/.test(e.entity_id); })[0];
        if (cm && /cloud/i.test((H.states[cm.entity_id] || {}).state || '')) medium = 'cloud';
        var hub, rssi = null;
        if (v && (zw || isHubDevice(v))) {
          var vp = primary(byDev[v.id] || []) || p;
          if (medium !== 'radio') medium = self._medium(vp);
          hub = hubFor('dev:' + v.id, (v.name_by_user || (zw ? String(v.name || '').replace(/^Home Assistant\s+/, '') : v.name) || 'Hub'), medium, 'hub', p);
          hub.devId = v.id; hub.sub = self._intName(p); if (!hub.trk) hub.trk = findTrk(v);
          if (!hub.ents) { hub.mo = [v.manufacturer, v.model].filter(Boolean).join(' · '); hub.ents = (byDev[v.id] || []).filter(function (e) { return !e.hidden; }).map(function (e) { return e.entity_id; }); }
        } else if (medium === 'local' && !((cfg.overrides || {})[p]) && isBt(d)) {
          // registered by its Bluetooth address and not by a network one: it is a radio device, whatever its integration says.
          // If Home Assistant told us which receiver hears it best, it is drawn behind that adapter or proxy.
          var ba = String(d.connections.filter(function (c) { return c[0] === 'bluetooth'; })[0][1]).toLowerCase(), heard = self._bt && self._bt.adv[ba];
          if (heard) {
            var scn = self._bt.sc[heard.source] || {}, pd = byConn[heard.source];
            hub = hubFor('bt:' + heard.source, String((pd && (pd.name_by_user || pd.name)) || scn.name || heard.source).replace(/\s*\(([0-9a-f]{2}:){5}[0-9a-f]{2}\)\s*$/i, ''), 'radio', 'other', null);
            hub.sub = t(scn.scanner_type === 'remote' ? 'btProxy' : 'btAdapter'); hub.rx = true; rssi = heard.rssi;
            if (pd && !hub.trk) hub.trk = findTrk(pd);
          } else hub = hubFor('bt', t('bluetooth'), 'radio', 'other', null);
          hub.bt = hub.own = true;
        } else if (p === 'matter' && medium === 'local' && self._matter && self._matter[id] && self._matter[id].net === 'thread') {
          var mat = self._matter[id];
          if (tbrDev) {
            var tbrMed = self._medium(primary(byDev[tbrDev.id] || []) || platOf(tbrDev.id));
            if (tbrMed === 'radio') tbrMed = 'local';
            hub = hubFor('dev:' + tbrDev.id, (tbrDev.name_by_user || tbrDev.name || 'Thread').trim(), tbrMed, 'hub', p);
            hub.devId = tbrDev.id; hub.thread = true; hub.net = mat.name || hub.net || '';
            hub.sub = [t('threadBr'), hub.net].filter(Boolean).join(' · ') || self._intName(p);
            if (!hub.trk) hub.trk = findTrk(tbrDev);
            if (!hub.ents) { hub.mo = [tbrDev.manufacturer, tbrDev.model].filter(Boolean).join(' · '); hub.ents = (byDev[tbrDev.id] || []).filter(function (e) { return !e.hidden; }).map(function (e) { return e.entity_id; }); }
          } else {
            hub = hubFor('thread', self._otbr || 'Thread', 'radio', 'other', null); hub.thread = hub.own = true; hub.net = mat.name || hub.net || '';
            hub.otbr = !!self._otbr; hub.sub = hub.otbr ? t('threadBr') + (hub.net ? ' · ' + hub.net : '') : hub.net;
          }
        } else {
          // phones and tablets roam: each one is drawn on the access point it is on right now (see _mobSig)
          var ap = ''; if (p === 'mobile_app' && medium === 'local') { var mc = self._conn(findTrk(d)); ap = mc && mc.via && mc.home !== false ? String(mc.via) : ''; }
          // the companion app also runs on desktop computers, which are not "mobile devices": a group of their own
          var pc = p === 'mobile_app' && isComputer(d, es), hn = pc ? ((cfg.names || {}).computers || t('computers')) : self._intName(p);
          hub = hubFor('int:' + p + (pc ? '-pc' : '') + ':' + medium + (ap ? '@' + ap : ''), hn, medium, 'int', p); if (ap) hub.apHint = ap;
          if (pc) hub.pc = true;
          hub.sub = hn;
        }
        // only Zigbee goes through the Zigbee coordinator: Z-Wave, EnOcean, 433 MHz... have a radio of their own
        if (hub.m === 'radio' && !hub.own && ZIGBEE.indexOf(p) < 0 && p !== 'mqtt') hub.own = hub.plain = true;
        var made = mk(id, d, es, p, hub); if (hub.own && !hub.plain) made.via = self._intName(p); if (rssi != null) made.rssi = rssi;
        if (p === 'matter' && self._matter && self._matter[id] && self._matter[id].net === 'thread') {
          made.router = /router|routing/i.test(self._matter[id].type || '');
          made.threadRole = !!self._matter[id].type;
        }
      };
      Object.keys(devices).forEach(function (id) {
        try { one(id); } catch (e) { skipped.push({ integration: platOf(id) || '?', error: String((e && e.message) || e).slice(0, 160) }); }
      });
      // One physical device is often set up through several integrations, each with its own entry in the device registry:
      // a TV through its own integration and through the companion app, for example. They are drawn as one dot.
      // Two entries are the same device when the router knows them by the same address, or when one of them is the
      // companion app and it has the same name as the other, or was matched to the same client of the router.
      var dupMode = cfg.merge_duplicates === false || cfg.merge_duplicates === 'off' ? 'off' : cfg.merge_duplicates === 'auto' ? 'auto' : 'ask', answers = (this._ans && this._ans.dup) || {}, pending = this._dupPending = [];
      if (dupMode !== 'off') {
        var groups = [], gOf = {};
        var join = function (a, b) {
          var ga = gOf[a.id], gb = gOf[b.id];
          if (ga && gb) { if (ga !== gb) { gb.forEach(function (x) { ga.push(x); gOf[x.id] = ga; }); gb.length = 0; } }
          else if (ga) { ga.push(b); gOf[b.id] = ga; } else if (gb) { gb.push(a); gOf[a.id] = gb; }
          else { var g = [a, b]; groups.push(g); gOf[a.id] = gOf[b.id] = g; }
        };
        // Two entries known to the router by the same address are the same device: merged without asking. Entries that
        // only look alike (same name) are a suspicion: the user is asked once, and the answer is remembered.
        var brief = function (x) { return { id: x.id, n: x.n, as: self._intName(x.p), mo: x.mo, a: x.a, g: x.hub.n }; };
        var suspect = function (a, b, why) {
          if (gOf[a.id] && gOf[a.id] === gOf[b.id]) return;
          var key = [a.id, b.id].sort().join('|');
          if (dupMode === 'auto' || answers[key] === true) join(a, b);
          else if (answers[key] !== false && !pending.some(function (q) { return q.key === key; })) pending.push({ key: key, why: why, a: brief(a), b: brief(b) });
        };
        var byTrk = {}, byName = {}, byBase = {};
        devs.forEach(function (x) {
          if (x.trk && x.trkSure) { if (!byTrk[x.trk]) byTrk[x.trk] = x; else if (answers[[byTrk[x.trk].id, x.id].sort().join('|')] !== false) join(byTrk[x.trk], x); }
          if (x.p !== 'mobile_app') (byName[slug(x.n)] = byName[slug(x.n)] || []).push(x);
          if (x.p !== 'mobile_app' && !x.svc) { var bk = slug(x.n.replace(/\s*\([^)]*\)\s*$/, '')); if (bk) (byBase[bk] = byBase[bk] || []).push(x); }
        });
        devs.forEach(function (x) {
          if (x.p !== 'mobile_app') return;
          var same = (byName[slug(x.n)] || [])[0] || (x.trk && devs.filter(function (y) { return y !== x && y.p !== 'mobile_app' && y.trk === x.trk; })[0]);
          if (same) suspect(same, x, 'app');
        });
        // The same thing through two integrations of the same maker (a TV through its local integration and through the
        // maker's cloud): the same name, give or take a model in brackets. A shared name alone is not enough ("Living
        // room" can be a speaker and a thermostat), so the makers must agree, or the name must be a specific one.
        Object.keys(byBase).forEach(function (k) {
          var l = byBase[k]; if (l.length < 2) return;
          for (var i = 0; i < l.length; i++) for (var j = i + 1; j < l.length; j++) {
            var a = l[i], b = l[j]; if (a.p === b.p) continue;
            var ma = a.mf.split(/\s+/)[0].toLowerCase(), mb = b.mf.split(/\s+/)[0].toLowerCase();
            if (ma && mb ? ma === mb : (k.split('_').length >= 3 || /\d/.test(k))) suspect(a, b, 'name');
          }
        });
        Object.keys(answers).forEach(function (key) {
          if (answers[key] !== true) return;
          var ids = key.split('|'), a = devs.filter(function (x) { return x.id === ids[0]; })[0], b = devs.filter(function (x) { return x.id === ids[1]; })[0];
          if (a && b && !(gOf[a.id] && gOf[a.id] === gOf[b.id])) join(a, b);
        });
        groups.forEach(function (g) {
          if (g.length < 2) return;
          // the entry that stays is the one Home Assistant controls the device through, not the app running on it
          var main = g.slice().sort(function (a, b) { return (a.p === 'mobile_app') - (b.p === 'mobile_app') || (a.hub.m === 'cloud') - (b.hub.m === 'cloud') || b.ents.length - a.ents.length; })[0]; // local before cloud
          g.forEach(function (o) {
            if (o === main) return;
            main.also.push({ id: o.id, n: o.n, as: self._intName(o.p) });
            if (o.p === 'mobile_app') { main.app = true; main.net = main.net || o.net; }
            if (!main.trk) { main.trk = o.trk; main.trkSure = o.trkSure; }
            if (!main.a) main.a = o.a;
            o.hub.dv.splice(o.hub.dv.indexOf(o), 1); devs.splice(devs.indexOf(o), 1);
          });
        });
      }
      // MQTT entities configured by hand without a device block have no device: draw each one as its own dot.
      // The same goes for any integration that talks to devices or hubs but gives its entities no device (Obihai, some
      // custom integrations): each thing you can operate is a dot, and its plain sensors are one dot for the integration.
      var src = this._src || {}, loose = {}, ACT = ['light', 'switch', 'cover', 'climate', 'fan', 'lock', 'media_player', 'vacuum', 'camera', 'humidifier', 'water_heater', 'siren', 'valve', 'alarm_control_panel', 'remote', 'lawn_mower'];
      var wants = function (plat) {
        if (!plat || cfg.exclude_integrations.indexOf(plat) >= 0) return false;
        if (plat === 'mqtt') return cfg.mqtt_entities !== false;
        var m = self._man[plat]; // needs the integration list (admin); "hub" is what an integration is when it does not say
        return cfg.entities_without_device !== false && !!m && ['device', 'hub'].indexOf(m.integration_type || 'hub') >= 0 && SKIP.indexOf(plat) < 0 && ROUTER_INTS.indexOf(plat) < 0 && COORD_INTS.indexOf(plat) < 0 && plat !== 'mobile_app';
      };
      Object.keys(entities).forEach(function (eid) { var e = entities[eid]; if (!e.device_id && wants(e.platform)) loose[eid] = e.platform; });
      Object.keys(src).forEach(function (eid) { if (!loose[eid] && src[eid] && !(entities[eid] && (entities[eid].device_id || entities[eid].platform)) && wants(src[eid].domain)) loose[eid] = src[eid].domain; });
      var rest = {};
      Object.keys(loose).sort().forEach(function (eid) {
        var e = entities[eid] || {}, st = H.states[eid], plat = loose[eid];
        if (e.hidden || (!st && !entities[eid]) || cfg.exclude_devices.indexOf('entity:' + eid) >= 0 || cfg.exclude_devices.indexOf(eid) >= 0) return;
        if (plat !== 'mqtt' && ACT.indexOf(eid.split('.')[0]) < 0) { (rest[plat] = rest[plat] || []).push(eid); return; }
        var med = self._medium(plat), hub = hubFor('int:' + plat + ':' + med, self._intName(plat), med, 'int', plat);
        hub.sub = self._intName(plat);
        var x = { id: 'entity:' + eid, entity: eid, n: String((st && st.attributes && st.attributes.friendly_name) || e.name || eid).trim(), mo: plat === 'mqtt' ? t('mqttManual') : '',
          a: e.area_id && areas[e.area_id] ? areas[e.area_id].name : '', p: plat, hub: hub, ents: [eid], ieee: null, trk: null };
        hub.dv.push(x); devs.push(x);
      });
      Object.keys(rest).sort().forEach(function (plat) {
        var med = self._medium(plat), hub = hubFor('int:' + plat + ':' + med, self._intName(plat), med, 'int', plat), list = rest[plat];
        hub.sub = self._intName(plat);
        var x = { id: 'entities:' + plat, integration: plat, entity: list.length === 1 ? list[0] : null, n: self._intName(plat), mo: list.length + ' ' + t('nEntities'), a: '', p: plat, hub: hub, ents: list, ieee: null, trk: null };
        hub.dv.push(x); devs.push(x);
      });
      // Physical devices only: no accounts, no online services, no loose sensors of an integration. What is left is
      // what you could put your hand on.
      if (this._physical()) devs.slice().forEach(function (x) {
        if (!x.svc && !x.integration) return;
        x.hub.dv.splice(x.hub.dv.indexOf(x), 1); devs.splice(devs.indexOf(x), 1);
      });
      // A parent that is just another device of the same integration (a power strip and its outlets) is not a bridge.
      // When the integration has at least as many devices of its own, the parent and its children are drawn inside the integration's group.
      Object.keys(hubs).forEach(function (k) {
        var h = hubs[k]; if (h.kind !== 'hub') return;
        var es = byDev[h.devId] || [], g = hubs['int:' + h.p + ':' + h.m];
        if (!g || platOf(h.devId) !== h.p || g.dv.length < h.dv.length) return;
        var par = mk(h.devId, devices[h.devId], es, h.p, g); par.router = true;
        h.dv.forEach(function (d) { d.hub = g; d.meshParent = par; g.dv.push(d); });
        delete hubs[k];
      });
      routers.forEach(function (r) {
        if (r.mac && self._uiInfra && self._uiInfra[r.mac] && self._uiInfra[r.mac].via) r.trk = 'ui:' + r.mac;
        else r.trk = findTrk(devices[r.id]);
        if (!r.trk && r.uplinkEnt && H.states[r.uplinkEnt] && /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(H.states[r.uplinkEnt].state)) r.trk = 'uplink:' + H.states[r.uplinkEnt].state.toLowerCase();
      });
      this._routers = routers;
      var gws = this._gw = {}; // the gateway of the integrations that only say "this is one of my clients"
      routers.forEach(function (r) { if (r.p === 'sagemcom_fast' && !(devices[r.id] || {}).via_device_id) gws[r.p] = r.n; });
      // The main router: the one the user names (main_router: a device name or an integration); otherwise one that is
      // not itself a switch or downstream of another router, and among those the one whose name says so.
      var want = String(cfg.main_router || '').trim().toLowerCase();
      var up = routers.filter(function (r) {
        if (r.sw) return false;
        if (!r.trk) return true;
        if (r.trk.indexOf('uplink:') === 0 || r.trk.indexOf('ui:') === 0) return false;
        return !((entities[r.trk] || {}).platform && entities[r.trk].platform !== r.p);
      });
      if (!up.length) up = routers;
      this._router = (want && routers.filter(function (r) { return r.n.toLowerCase() === want || r.p === want; })[0]) ||
        up.filter(function (r) { return /primary|main|principal|gateway|router|udm|dream|ucg|usg|fritz!?\s?box|box/i.test(r.n); })[0] || up[0] || null;
      var haIps = this._haIps || [];
      if (haIps.length) this._haTrk = trk.filter(function (eid) { var c = self._conn(eid); return c && c.ip && haIps.indexOf(c.ip) >= 0; })[0] || this._haTrk || null;
      // a mobile group "on" the main router, or on something that is not one of the access points, is the plain one
      Object.keys(hubs).forEach(function (k) {
        var h = hubs[k]; if (!h.apHint) return;
        if (routers.some(function (r) { return r.n === h.apHint && r !== self._router; })) return;
        var base = hubFor('int:mobile_app' + (h.pc ? '-pc' : '') + ':' + h.m, h.n, h.m, 'int', 'mobile_app'); base.sub = h.sub; if (h.pc) base.pc = true;
        h.dv.forEach(function (d) { d.hub = base; base.dv.push(d); }); delete hubs[k];
      });
      if (this._router && cfg.router_name) this._router.n = cfg.router_name;
      this._coord = cfg.coordinator_name || (stickZigbee && coords[0]) || netName || (ad && (ad.name || ad.type)) || null;
      this._coordFromDev = stickZigbee && !!coords[0];
      // Merge small integration groups into one "other" node per medium.
      var small = Math.max(0, cfg.group_small | 0);
      // big installations: fold more tiny integrations together so the map stays readable
      // only groups of real devices count towards a crowded map: services are folded on their own anyway
      var virtual = function (h) { return h.dv.length > 0 && h.dv.every(function (d) { return d.svc; }); };
      var intCount = Object.keys(hubs).filter(function (k) { return hubs[k].kind === 'int' && !virtual(hubs[k]); }).length;
      if (cfg.group_small == null || cfg.group_small === 1) { if (intCount > 30) small = Math.max(small, 3); else if (intCount > 18) small = Math.max(small, 2); }
      Object.keys(hubs).forEach(function (k) {
        var h = hubs[k];
        if (h.kind === 'int' && h.dv.length <= small && h.m !== 'radio' && h.p !== 'mobile_app') {
          // services (a Spotify account, a translation API) and things in the house (an air conditioner that reports
          // through its maker's cloud) are different kinds of connection: they are never folded into the same group
          var vs = cfg.separate_services !== false && virtual(h); // separate_services: false folds everything into one group per side
          var o = hubFor('other:' + h.m + (vs ? ':svc' : ''), t(h.m === 'cloud' ? (vs || cfg.separate_services === false ? 'otherCloud' : 'otherCloudDev') : h.m === 'radio' ? 'otherRadio' : (vs ? 'otherLocalSvc' : 'otherLocal')), h.m, 'other', null);
          h.dv.forEach(function (d) { d.hub = o; d.via = self._intName(h.p); o.dv.push(d); });
          delete hubs[k];
        }
      });
      this._hubs = Object.keys(hubs).map(function (k) { return hubs[k]; }).filter(function (h) { return h.dv.length; });
      var rename = cfg.names || {};
      this._hubs.forEach(function (h) { if (rename[h.n]) h.n = rename[h.n]; });
      var byName = cfg.sort === 'name';
      this._hubs.forEach(function (h) { h.dv.sort(function (a, b) { return (byName ? 0 : (a.a || '~').localeCompare(b.a || '~')) || a.n.localeCompare(b.n); }); });
      this._devs = devs;
      this._mobKey = this._mobSig();
      this._status();
    }

    _status() {
      // a bridge is a device too: with all its own entities unavailable, it is offline
      var S0 = this._hass.states, self = this; (this._hubs || []).forEach(function (h) { var live = (h.ents || []).filter(function (e) { return !!S0[e]; }); h.off = live.length > 0 && live.every(function (e) { return S0[e].state === 'unavailable'; }); });
      var S = this._hass.states, now = Date.now(), win = Math.max(0, parseFloat(this._cfg.recent_hours) || 0) * 3600000;
      (this._devs || []).concat(this._routers || []).forEach(function (d) {
        var st = d.ents.filter(function (e) { return !!S[e]; }).map(function (e) { return S[e].state; }); // an entity without a state (disabled) says nothing
        d.off = st.length > 0 && st.every(function (s) { return s === 'unavailable'; });
        // A battery device that stopped answering a short while ago is probably asleep, not gone: for a while it is
        // "seen recently" (yellow) instead of offline (red). The time comes from when its entities became unavailable.
        d.recent = false; d.seen = null;
        if (d.off && d.battery && win > 0) {
          var when = 0; d.ents.forEach(function (e) { var x = S[e] && Date.parse(S[e].last_changed); if (x && x > when) when = x; });
          if (when && now - when < win) { d.recent = true; d.off = false; d.seen = when; }
        }
        var uiAway = d.trk && d.trk.indexOf('ui:') === 0 ? self._conn(d.trk) : null;
        d.away = !d.off && (uiAway ? uiAway.home === false : (!!d.trk && !!S[d.trk] && S[d.trk].state === 'not_home'));
        // a phone or tablet on mobile data, or away from the home network, reaches Home Assistant over the internet
        d.cell = !d.off && !!d.net && !!S[d.net] && /cell|mobile/i.test(S[d.net].state);
        d.remote = (d.p === 'mobile_app' && (d.cell || d.away)) || (!!d.app && d.cell); if (d.remote) d.away = true;
      });
    }

    _layout() {
      var hubs = this._hubs, C = { x: 0, y: 0 }, me = this, Z = this._sz = this._sizes(), old = this._vb0;
      var sp = Math.max(15, Z.dev * 2 + 2.6), r0 = Math.max(34, Z.hub + Z.dev + 6), dist = Math.max(140, Z.core + Z.net + 56);
      var compact = this._compact();
      hubs.forEach(function (h) {
        if (compact) { h.tree = false; h.dv.forEach(function (d) { d.rx = 0; d.ry = 0; d.ang = 0; }); h.outer = Z.hub - Z.dev + 3; h.w = Z.hub * 2 + 64; return; }
        h.dv.forEach(function (d) { d.rx = null; d.ry = null; });
        // devices that reach the hub through a mesh router are drawn next to that router
        // small meshes are drawn as a tree (children next to their router); big ones stay on rings, ordered by router
        // Optional: the devices of a hub grouped by area, hub -> area -> devices, for areas with more than one device.
        // A Zigbee mesh keeps its own shape (who repeats for whom) instead.
        h.areas = []; h.dv.forEach(function (d) { d.parentNode = null; });
        if (me._cfg.group_by_area && !h.dv.some(function (d) { return d.meshParent && (d.ieee || d.threadMesh); })) {
          // a device with children of its own (a power strip) keeps its family and stays outside the area nodes
          var isParent = {}; h.dv.forEach(function (d) { if (d.meshParent) isParent[d.meshParent.id] = 1; });
          var byArea = {}; h.dv.forEach(function (d) { if (d.a && !d.meshParent && !isParent[d.id]) (byArea[d.a] = byArea[d.a] || []).push(d); });
          Object.keys(byArea).sort().forEach(function (a) { if (byArea[a].length > 1) h.areas.push({ id: 'area:' + a, n: a, isArea: true, list: byArea[a], hub: h }); });
        }
        h.tree = h.dv.length <= 30 || h.areas.length > 0;
        if (h.tree) {
          // Tree: a device with children (a mesh router, a power strip) sits on a ring and its children on the next ring
          // out, inside the slice of the circle that belongs to it. Every dot has its own place, so dots never collide,
          // and the lines of one family never cross those of another.
          var kids = {}, used = {}, tops = [];
          h.areas.forEach(function (ar) { kids[ar.id] = []; tops.push(ar); ar.list.forEach(function (d) { used[d.id] = 1; kids[d.id] = []; }); });
          var rowsOf = function (ar) { var n = ar.list.length; return n <= 5 ? 1 : n <= 14 ? 2 : n <= 30 ? 3 : 4; };
          var grow = function (d, depth) { kids[d.id] = depth >= 8 ? [] : h.dv.filter(function (c) { return c.meshParent === d && !used[c.id]; }); kids[d.id].forEach(function (c) { used[c.id] = 1; }); kids[d.id].forEach(function (c) { grow(c, depth + 1); }); };
          h.dv.forEach(function (d) { if (!used[d.id] && (!d.meshParent || h.dv.indexOf(d.meshParent) < 0)) { used[d.id] = 1; tops.push(d); } });
          tops.forEach(function (d) { grow(d, 0); });
          h.dv.forEach(function (d) { if (!used[d.id]) { used[d.id] = 1; tops.push(d); grow(d, 0); } }); // a loop of parents: start it somewhere
          var lane = Z.dev * 2 + 7; // width of the free lane, in map units
          var rb = r0, need = function (d, L) { var own = sp / (rb + L * sp), sum = 0;
            if (d.isArea) return Math.max(own, (Math.ceil(d.list.length / rowsOf(d)) + (rowsOf(d) > 1 ? 0.5 : 0)) * sp / (rb + (L + 1) * sp)); kids[d.id].forEach(function (c) { sum += need(c, L + 1); }); return Math.max(own, sum); };
          var total = 0, it = 0;
          var room = 2 * Math.PI;
          do { total = 0; tops.forEach(function (d) { total += need(d, 0); }); room = 2 * Math.PI - lane / rb; if (total > room) rb *= total / room * 1.02; } while (total > room && it++ < 12);
          room = 2 * Math.PI - lane / rb;
          var scale = Math.max(1, room / total), deep = 0;
          var place = function (d, L, a0, slot) {
            var a = a0 + slot / 2, rad = rb + L * sp; d.ang = a; d.rx = rad * Math.cos(a); d.ry = rad * Math.sin(a); deep = Math.max(deep, L);
            if (d.isArea) { // its devices in rows behind it, inside its slice
              var rows = rowsOf(d), per = Math.ceil(d.list.length / rows);
              for (var q = 0; q < rows; q++) {
                var part = d.list.slice(q * per, (q + 1) * per), rr = rb + (L + 1 + q) * sp, st = sp / rr;
                part.forEach(function (c, k) { var ca = a + (k - (part.length - 1) / 2 + (rows > 1 ? (q % 2 ? 0.25 : -0.25) : 0)) * st; c.ang = ca; c.rx = rr * Math.cos(ca); c.ry = rr * Math.sin(ca); c.parentNode = d; });
                if (part.length) deep = Math.max(deep, L + 1 + q);
              }
              d.far = rb + (L + rows) * sp; return;
            }
            var sum = 0; kids[d.id].forEach(function (c) { sum += need(c, L + 1); });
            var cur = a - sum / 2; kids[d.id].forEach(function (c) { var w = need(c, L + 1); place(c, L + 1, cur, w); cur += w; });
          };
          var a1 = lane / rb / 2; // the lane is centred on angle 0
          tops.forEach(function (d) { var w = need(d, 0) * scale; place(d, 0, a1, w); a1 += w; });
          h.outer = rb + deep * sp;
        } else {
          var top = h.dv.slice().sort(function (x, y) { var px = x.meshParent ? x.meshParent.n : (x.router ? x.n : ''), py = y.meshParent ? y.meshParent.n : (y.router ? y.n : ''); return px === py ? (x.router ? -1 : 0) - (y.router ? -1 : 0) : (px < py ? -1 : 1); });
          var i = 0, ring = 0; h.outer = r0 - 4;
          while (i < top.length) {
            var rad = r0 + ring * sp, lane2 = (Z.dev * 2 + 7) / rad, cap = Math.max(1, Math.floor((2 * Math.PI - lane2) * rad / sp)), n = Math.min(cap, top.length - i);
            top.slice(i, i + n).forEach(function (d, k) { var a = lane2 / 2 + ((k + 0.5) / n) * (2 * Math.PI - lane2); d.ang = a; d.rx = rad * Math.cos(a); d.ry = rad * Math.sin(a); });
            i += n; ring++; h.outer = rad;
          }
        }
        h.dv.forEach(function (d) { if (d.rx == null) { d.ang = Math.PI / 2; d.rx = 0; d.ry = h.outer + sp; h.outer += sp; } });
        h.w = h.outer * 2 + 70;
      });
      var order = ['cloud', 'local', 'radio'], groups = {}, W = 0;
      order.forEach(function (m) { groups[m] = hubs.filter(function (h) { return h.m === m; }).sort(function (a, b) { return b.dv.length - a.dv.length; }); });
      order.forEach(function (m) { groups[m].w = groups[m].reduce(function (s, h) { return s + h.w; }, 0); W += groups[m].w; });
      var present = order.filter(function (m) { return groups[m].length; }), gap = 18, avail = 360 - gap * present.length;
      var spans = {}; present.forEach(function (m) { spans[m] = Math.max(55, avail * groups[m].w / W); });
      var tot = present.reduce(function (s, m) { return s + spans[m]; }, 0);
      present.forEach(function (m) { spans[m] = Math.min(240, spans[m] * avail / tot); });
      gap = (360 - present.reduce(function (s, m) { return s + spans[m]; }, 0)) / present.length; // room left over becomes space between sectors
      // One sector only (for example a home with nothing but its local network): its node goes to the centre of the map,
      // with its hubs all around it, and Home Assistant moves out into the free space. Nothing stands between the node
      // and that space, so there is room there for the access points too.
      var radioMix0 = !!this._coord && hubs.some(function (x) { return x.m === 'radio' && !x.own; }) && hubs.some(function (x) { return x.own; });
      var single = present.length === 1 && !(present[0] === 'radio' && radioMix0), gapMid = 180, apR0 = Z.net * 0.72, coreD = Z.core * 1.25 + Z.net + 46;
      if (single) {
        var noHub = 0;
        if (present[0] === 'local') (this._routers || []).forEach(function (r) { if (r !== me._router && !hubs.some(function (h) { var c = me._hubConn(h); return h.m === 'local' && c && c.via === r.n; })) noHub++; });
        gap = Math.min(170, 2 * Math.asin(Math.min(1, (Z.core * 1.25 + 14) / coreD)) * 180 / Math.PI + 14 + 24 * Math.min(6, noHub));
        spans[present[0]] = 360 - gap;
      }
      var start, mnodes, rn, loc, ringR = 0, banned = {}, again = true, pass = 0, lonely = [], self = this;
      var core = this._core = single ? { x: coreD * Math.cos(deg(gapMid)), y: coreD * Math.sin(deg(gapMid)) } : { x: 0, y: 0 };
      var allAps = (this._routers || []).filter(function (r) { return r !== me._router; }).slice(0, 12).map(function (r) { return r.n; });
      var radioMixed = !!this._coord && hubs.some(function (x) { return x.m === 'radio' && !x.own; });
      // Rule: two links never cross, and a link never runs over a bubble that is not one of its ends.
      // The sectors are laid out for that, and every access point is then checked against it. One that has no clean place
      // is dropped from the map (its hubs hang from the router, where a fan of links cannot cross) and the layout is redone.
      function hit(a, b, c, d) { // do the segments a-b and c-d cross? (sharing an end is not crossing)
        if (a === c || a === d || b === c || b === d) return false;
        function w(p, q, r) { return (r.y - p.y) * (q.x - p.x) - (q.y - p.y) * (r.x - p.x); }
        return w(a, b, c) * w(a, b, d) < 0 && w(c, d, a) * w(c, d, b) < 0;
      }
      function over(a, b, o, r) { // does the segment a-b run over the disc (o, r)?
        if (a === o || b === o) return false;
        var dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((o.x - a.x) * dx + (o.y - a.y) * dy) / L));
        var px = o.x - a.x - t * dx, py = o.y - a.y - t * dy; return px * px + py * py < r * r;
      }
      function links() {
        var E = []; Object.keys(mnodes).forEach(function (k) { E.push([core, mnodes[k]]); });
        Object.keys(rn).forEach(function (k) { if (rn[k].router) E.push([loc, rn[k]]); });
        hubs.forEach(function (h) { E.push([h.from, h]); });
        return E;
      }
      function discs() {
        var D = [[core, Z.core * 1.25]]; Object.keys(mnodes).forEach(function (k) { D.push([mnodes[k], mnodes[k].r + 3]); });
        Object.keys(rn).forEach(function (k) { if (rn[k].router) D.push([rn[k], rn[k].r + 3]); });
        hubs.forEach(function (h) { D.push([h, h.outer + Z.dev + 1]); });
        return D;
      }
      function problems(mine) { // problems caused by a set of links (all of them when none is given)
        var E = links(), D = discs(), n = 0;
        (mine || E).forEach(function (e) {
          E.forEach(function (f) { if (f !== e && !(e[0] === f[0] && e[1] === f[1]) && hit(e[0], e[1], f[0], f[1])) n++; });
          D.forEach(function (d) { if (over(e[0], e[1], d[0], d[1])) n++; });
        });
        return n;
      }
      function around(node) { // problems caused by a node being where it is: its own links, other links running over it, bubbles touching it
        var n = problems(links().filter(function (e) { return e[0] === node || e[1] === node; }));
        links().forEach(function (e) { if (over(e[0], e[1], node, node.r + 3)) n++; });
        discs().forEach(function (d) { if (d[0] !== node && Math.sqrt((d[0].x - node.x) * (d[0].x - node.x) + (d[0].y - node.y) * (d[0].y - node.y)) < d[1] + node.r + 4) n++; });
        return n;
      }
      while (again && pass++ < 8) {
      again = false; start = single ? gapMid + gap / 2 : -90 - (spans.cloud || 0) / 2; mnodes = {}; lonely = [];
      var apNames = allAps.filter(function (k) { return !banned[k]; });
      hubs.forEach(function (h) { h.ap = ''; });
      present.forEach(function (m) {
        var span = spans[m], g = groups[m];
        var maxOuter = g.reduce(function (s, h) { return Math.max(s, h.outer); }, 0);
        var R = single ? Math.max(170, g.w / deg(span), Z.net + apR0 + 96 + maxOuter)
          : Math.max(dist + 110, g.w / deg(span), dist + Z.net + 47 + maxOuter); // never closer to the centre than the medium node + the biggest cluster
        ringR = R;
        var totalDeg = g.w / R * 180 / Math.PI, scale = Math.min(1, span / totalDeg);
        var a = start + (span - totalDeg * scale) / 2, mid = start + span / 2;
        // centre the heaviest hubs in the sector, smaller ones towards the edges
        var arranged = [];
        if (m === 'local' && apNames.length) {
          // Hubs on the main router go in the middle of the sector, in front of the router. The hubs of each access point
          // stay together and go to the sides, so a link from the router never runs across an access point's hubs.
          var by = {}, centred = function (l) { var o = []; l.forEach(function (h, i) { if (i % 2) o.push(h); else o.unshift(h); }); return o; };
          g.forEach(function (h) { var c = me._hubConn(h); h.ap = c && c.via && apNames.indexOf(c.via) >= 0 ? c.via : ''; (by[h.ap] = by[h.ap] || []).push(h); });
          var left = [], right = [];
          Object.keys(by).filter(function (k) { return k; }).sort(function (x, y) { return by[y].length - by[x].length || (x < y ? -1 : 1); })
            .forEach(function (k, i) { if (i % 2) right = right.concat(centred(by[k])); else left = centred(by[k]).concat(left); });
          arranged = left.concat(centred(by[''] || []), right);
        } else { g.forEach(function (h, i) { if (h.own) return; if (i % 2) arranged.push(h); else arranged.unshift(h); }); g.forEach(function (h) { if (h.own) arranged.push(h); }); }
        arranged.forEach(function (h) {
          var aw = h.w / R * 180 / Math.PI * scale;
          var ac = a + aw / 2; a += aw;
          var rr = R + (arranged.length > 4 && arranged.indexOf(h) % 2 ? h.outer * 0.9 : 0);
          h.x = C.x + rr * Math.cos(deg(ac)); h.y = C.y + rr * Math.sin(deg(ac)); h.ac = ac;
          h.dv.forEach(function (d) { d.x = h.x + d.rx; d.y = h.y + d.ry; });
        });
        // Bluetooth and Thread groups link straight to the centre when the radio node is a Zigbee coordinator:
        // the coordinator then sits in front of its own hubs, clear of those links
        var ownH = arranged.filter(function (h) { return h.own; }), reg = arranged.filter(function (h) { return !h.own; });
        if (!single && m === 'radio' && me._coord && ownH.length && reg.length) {
          mid = Math.min(reg.reduce(function (s2, h) { return s2 + h.ac; }, 0) / reg.length, Math.min.apply(null, ownH.map(function (h) { return h.ac; })) - 18);
        }
        var g0 = m === 'local' && apNames.length ? arranged.filter(function (h) { return !h.ap; }) : [];
        if (g0.length && !single) mid = (g0[0].ac + g0[g0.length - 1].ac) / 2; // the router sits in front of its own hubs
        var nd = single ? 0 : dist;
        mnodes[m] = { m: m, x: C.x + nd * Math.cos(deg(mid)), y: C.y + nd * Math.sin(deg(mid)), r: Z.net, ac: single ? gapMid + 180 : mid, lo: start, hi: start + span };
        start += span + gap;
      });
      loc = mnodes.local; rn = {};
      if (this._router && loc) rn[this._router.n] = loc;
      hubs.forEach(function (h) { h.direct = !!(h.own && radioMixed); h.from = h.direct ? core : mnodes[h.m]; });
      var apR = Z.net * 0.72, rb = single ? 0 : dist, ring = rb + (single ? Z.net + apR + 62 : 75);
      hubs.forEach(function (h) { if (h.ap) ring = Math.min(ring, Math.sqrt(h.x * h.x + h.y * h.y) - h.outer - 34); });
      ring = Math.max(ring, rb + Z.net + apR + 12);
      if (loc) (this._routers || []).forEach(function (r) {
        if (allAps.indexOf(r.n) < 0) return;
        var hs = hubs.filter(function (h) { return h.ap === r.n; }), node = { r: apR, router: r };
        if (!hs.length) { lonely.push(node); return; }
        // all access points on one ring, each in front of its own hubs
        var a = hs.reduce(function (s2, h) { return s2 + h.ac; }, 0) / hs.length;
        node.ac = a; node.x = ring * Math.cos(deg(a)); node.y = ring * Math.sin(deg(a)); rn[r.n] = node;
        hs.forEach(function (h) { h.from = node; });
        if (around(node) !== 0) { banned[r.n] = 1; again = true; }
      });
      }
      // Access points without hubs of their own are drawn only where there is a clean place: the free space next to the
      // local sector first (all of it: with few sectors there is a lot), then beside the router. Otherwise they stay off
      // the map, the warning under the map says so, and the router's panel lists them all anyway.
      lonely.forEach(function (node) {
        var cand = [], ia = loc.ac + 180, q = Z.net + apR + 16, ok = false;
        var step = 2 * Math.asin(Math.min(1, (apR + 9) / ring)) * 180 / Math.PI, half = gap / 2, slots = [];
        if (half < step * 1.5) slots = [half]; else for (var o1 = step * 0.75; o1 <= half - step * 0.4; o1 += step) slots.push(o1);
        if (single) { // around the centre node: anywhere in the free wedge, beside Home Assistant
          slots = []; for (var o2 = 9; o2 <= gap / 2; o2 += 9) slots.push(o2);
          [ringR, ring, coreD, (ring + ringR) / 2].forEach(function (rad) { slots.forEach(function (o1) { [loc.lo - o1, loc.lo - gap + o1].forEach(function (a) { cand.push([rad * Math.cos(deg(a)), rad * Math.sin(deg(a)), a]); }); }); });
        } else [ring, ring + 2 * apR + 16, ring - 40].forEach(function (rad) { slots.forEach(function (o1) { [loc.hi + o1, loc.lo - o1].forEach(function (a) { cand.push([rad * Math.cos(deg(a)), rad * Math.sin(deg(a)), a]); }); }); });
        if (!single) [40, -40, 75, -75].forEach(function (o) { cand.push([loc.x + q * Math.cos(deg(ia + o)), loc.y + q * Math.sin(deg(ia + o)), loc.ac]); });
        rn[node.router.n] = node;
        cand.forEach(function (c) { if (ok) return; node.x = c[0]; node.y = c[1]; node.ac = c[2]; ok = around(node) === 0; });
        if (!ok) delete rn[node.router.n];
      });
      // last line of defence: whatever still crosses is attached one level up, where it cannot cross
      if (problems()) { hubs.forEach(function (h) { if (h.from.router) { h.from = loc; h.ap = ''; } }); Object.keys(rn).forEach(function (k) { if (rn[k].router) delete rn[k]; }); }
      if (problems()) { hubs.forEach(function (h) { if (h.direct) { h.direct = false; h.from = mnodes[h.m]; } }); }
      // every group was laid out with a free lane at angle 0: turn it so the lane points at the group's own link,
      // which then reaches the bubble without running over its dots or their lines
      if (!compact) hubs.forEach(function (h) {
        var th = Math.atan2(h.from.y - h.y, h.from.x - h.x), co = Math.cos(th), si = Math.sin(th);
        h.dv.concat(h.areas || []).forEach(function (d) { var x = d.rx, y = d.ry; d.rx = x * co - y * si; d.ry = x * si + y * co; d.ang = (d.ang || 0) + th; d.x = h.x + d.rx; d.y = h.y + d.ry; });
      });
      this._mnodes = mnodes; this._rnodes = rn;
      // routers and access points that exist but are not on the map (no clean place, or more than the map draws)
      this._offMap = loc ? (this._routers || []).filter(function (r) { return r !== me._router && !rn[r.n]; }).map(function (r) { return r.n; }) : [];
      this._linkProblems = problems();
      var cb = Z.core * 1.25 + 30, minX = Math.min(-110, core.x - cb), minY = Math.min(-110, core.y - cb), maxX = Math.max(110, core.x + cb), maxY = Math.max(110, core.y + cb);
      Object.keys(rn).forEach(function (k) { var n = rn[k]; minX = Math.min(minX, n.x - 90); maxX = Math.max(maxX, n.x + 90); minY = Math.min(minY, n.y - 60); maxY = Math.max(maxY, n.y + 60); });
      hubs.forEach(function (h) { var p = h.outer + 70; minX = Math.min(minX, h.x - p - 40); maxX = Math.max(maxX, h.x + p + 40); minY = Math.min(minY, h.y - p); maxY = Math.max(maxY, h.y + p); });
      this._vb0 = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
      // keep the user's zoom/pan when the map is redrawn, unless they were looking at the whole map
      var v = this._vb;
      if (!v || (old && Math.abs(v.x - old.x) + Math.abs(v.y - old.y) + Math.abs(v.w - old.w) + Math.abs(v.h - old.h) < 1)) this._vb = Object.assign({}, this._vb0);
    }

    _renderRaw() {
      var self = this, t = this._t.bind(this), svg = this._$('svg');
      var M = { cloud: 'var(--cm-cloud)', local: 'var(--cm-local)', radio: 'var(--cm-radio)', core: 'var(--cm-core)' };
      this._M = M;
      this._$('q').placeholder = t('search');
      var sh = this._$('show'), shv = (this._S && this._S.show) || '';
      sh.innerHTML = [['', 'showAll'], ['off', 'onlyOffline'], ['bare', 'onlyBare']].concat(this._nDis ? [['dis', 'onlyDisabled']] : []).map(function (o) { return '<option value="' + o[0] + '">' + esc(t(o[1])) + '</option>'; }).join(''); sh.value = shv; sh.setAttribute('aria-label', t('status'));
      var pb = this._$('physBtn'); pb.textContent = t('onlyPhysical'); pb.title = t('onlyPhysicalTip'); pb.setAttribute('aria-pressed', this._physical());
      this._$('legend').innerHTML = ['cloud', 'local', 'radio'].map(function (m) { return '<span><i style="background:' + M[m] + '"></i>' + esc(t(m)) + '</span>'; }).join('') +
        '<span><i style="border:2px solid var(--cm-bad)"></i>' + esc(t('offline')) + '</span>' +
        '<span><i style="border:2px solid var(--cm-recent)"></i>' + esc(t('recent')) + '</span>' +
        '<span><i style="border:2px dashed var(--cm-away)"></i>' + esc(t('away')) + '</span>' +
        ((this._devs || []).some(function (d) { return d.bare && !d.dis; }) ? '<span><i style="background:var(--cm-bare);opacity:.6"></i>' + esc(t('bare')) + '</span>' : '') +
        ((this._devs || []).some(function (d) { return d.dis; }) ? '<span><i style="border:2px dotted var(--cm-bare)"></i>' + esc(t('disabled')) + '</span>' : '') +
        '<span><svg width="26" height="8"><line x1="2" y1="4" x2="24" y2="4" stroke="var(--cm-local)" style="' + this._lineCss.cable + '"/></svg>' + esc(t('cable')) + '</span>' +
        '<span><svg width="26" height="8"><line x1="2" y1="4" x2="24" y2="4" stroke="var(--cm-local)" style="' + this._lineCss.wifi + '"/></svg>' + esc(t('wifi')) + '</span>';
      this._$('zlay').title = t('layoutBtn'); this._$('zexp').title = t('exportBtn'); this._$('zexp').style.display = this._cfg.show_export === false ? 'none' : '';
      this._$('zin').title = t('zoomIn'); this._$('zout').title = t('zoomOut'); this._$('zfit').title = t('fit');
      if (!this._devs.length) { this._$('panel').innerHTML = '<div class="msg">' + esc(t('nodata')) + '</div>'; return; }
      this._inLayout = true; this._layout(); this._inLayout = false;
      svg.innerHTML = ''; svg.classList.remove('foc'); this._on = [];
      // pointing at (or tabbing to) something: highlight its path and show a tooltip. Touch has no hover: a tap selects.
      function hov(g, target, x, y, tip) {
        function inn() { var a = tip(); self._focus(target); self._tip(x, y, a[0], a[1]); }
        g.addEventListener('pointerenter', function (e) { if (e.pointerType === 'touch' || (self._drag && self._drag.on)) return; inn(); });
        g.addEventListener('pointerleave', function () { self._unfocus(); });
        g.addEventListener('focus', function () { if (g.matches(':focus-visible')) inn(); });
        g.addEventListener('blur', function () { self._unfocus(); });
      }
      function el(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; }
      var gE = el('g'), gS = el('g'), gN = el('g'), gH = el('g'), gD = el('g'), Z = this._sz;
      this._gL = el('g');
      this._edges = [];
      var core = this._core;
      // Labels keep their size on screen, so how much room they need depends on the zoom: every label is registered here
      // and _declutter() moves or hides the ones that would be drawn over a node or over another label.
      var labs = this._labs = [], elabs = this._elabs = [], obst = this._obst = [];
      // link labels sit at ~40% of the way out, away from the crowded node at either end
      function lbl(x1, y1, x2, y2, txt, f) { if (!txt) return; f = f || 0.42; var e = el('text', { 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'class': 'elbl' }, gE); e.textContent = txt; elabs.push({ e: e, x1: x1, y1: y1, x2: x2, y2: y2, f: f }); }
      // two-line node label (name + subtitle) next to a node of radius rad; pri: lower numbers get their place first
      function tlabel(g, cx, cy, rad, below, name, sub, small, pri, alias) {
        var tx = el('text', { 'text-anchor': 'middle', 'class': 'tl' }, g);
        var a = document.createElementNS(NS, 'tspan'); a.setAttribute('class', 'lbl' + (small ? ' small' : ''));
        a.textContent = name; tx.appendChild(a); if (alias) a.setAttribute('data-anon', alias);
        var b = null;
        if (sub) { b = document.createElementNS(NS, 'tspan'); b.setAttribute('class', 'sub'); b.setAttribute('dy', '1.3em'); b.textContent = sub; tx.appendChild(b); }
        labs.push({ tx: tx, a: a, b: b, cx: cx, cy: cy, rad: rad, below: below, pri: pri || 0 });
        return tx;
      }
      function short(c) { return c ? (c.wired ? t('cable') : c.wifi ? (c.iface || t('wifi')) : '') : ''; }
      // a moving dash on top of every link: data flowing towards Home Assistant (x1 is always the side closer to the centre)
      var first = !this._entered, anim = this._cfg.animations !== false;
      function flow(x1, y1, x2, y2, col) { if (anim) el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': 'flow', stroke: col }, gE); }
      Object.keys(this._mnodes).forEach(function (m) {
        var n = self._mnodes[m], c = m === 'local' ? self._conn(self._haTrk) : null;
        n.edge = el('line', { x1: core.x, y1: core.y, x2: n.x, y2: n.y, 'class': 'edge l-' + m + (c && c.wifi ? ' wifi' : ''), stroke: M[m] }, gE);
        flow(core.x, core.y, n.x, n.y, M[m]);
        if (c) lbl(core.x, core.y, n.x, n.y, short(c), 0.5);
      });
      Object.keys(this._rnodes || {}).forEach(function (k) {
        var n = self._rnodes[k]; if (!n.router) return; var p = self._mnodes.local, c = self._conn(n.router.trk);
        n.edge = el('line', { x1: p.x, y1: p.y, x2: n.x, y2: n.y, 'class': 'edge l-local' + (c && c.wifi ? ' wifi' : ''), stroke: M.local }, gE);
        flow(p.x, p.y, n.x, n.y, M.local);
        if (c) lbl(p.x, p.y, n.x, n.y, short(c), 0.62);
      });
      this._hubs.forEach(function (h) {
        var n = self._mnodes[h.m], c = null;
        if (h.m === 'local') c = self._hubConn(h);
        n = h.from;
        h.edge = el('line', { x1: n.x, y1: n.y, x2: h.x, y2: h.y, 'class': 'edge l-' + h.m + (c && c.wifi ? ' wifi' : ''), stroke: M[h.m] }, gE);
        flow(n.x, n.y, h.x, h.y, M[h.m]);
        if (c && h.trk) lbl(n.x, n.y, h.x, h.y, short(c));
      });
      var compact = this._compact(), anon = { hub: 0, ap: 0 };
      this._$('zlay').classList.toggle('on', compact);
      this._devs.forEach(function (d, i) {
        d.g = null; d.spoke = null; d.lab = null;
        if (compact) return;
        var tree = d.meshParent && d.meshParent.x != null && d.hub.tree;
        var from = d.parentNode && d.parentNode.x != null ? d.parentNode : tree ? d.meshParent : d.hub;
        d.spoke = el('line', { x1: from.x, y1: from.y, x2: d.x, y2: d.y, 'class': 'spoke' + (tree && (d.ieee || d.threadMesh) ? ' meshl' + (d.hub.m === 'local' ? ' l-local' : '') : '') }, gS);
        var g = el('g', { 'class': 'dev' + (first ? ' enter' : ''), tabindex: 0, role: 'button', 'aria-label': d.n, style: first ? 'animation-delay:' + Math.min(1100, 250 + i * 6) + 'ms' : '' }, gD);
        d.lab = null;
        if (d.router) el('circle', { cx: d.x, cy: d.y, r: Z.dev + 3.8, fill: 'none', stroke: M[d.hub.m], 'stroke-width': 1.6, 'class': 'rring' }, g);
        el('circle', { cx: d.x, cy: d.y, r: Z.dev, fill: M[d.hub.m] }, g); d.g = g;
        g.addEventListener('click', function (e) { e.stopPropagation(); self._selDev(d); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._selDev(d); });
        hov(g, d, d.x, d.y, function () { return [d.n, [d.off ? t('offline') : d.recent ? t('recent') + ' · ' + self._ago(d.seen) : d.remote ? t('remote') : d.away ? t('away') : d.dis ? t('disabled') : d.bare ? t('bare') : '', d.a, d.hub.kind === 'hub' ? d.hub.n : (d.via || self._intName(d.p))].filter(Boolean).join(' · ')]; });
      });
      // core
      var gc = el('g', { 'class': 'mnode', tabindex: 0, role: 'button', 'aria-label': 'Home Assistant' }, gN); this._coreG = gc;
      var cr = Z.core, small = cr < 48, cf = cr / 56; // a small centre only says "HA": version and host stay in the side panel
      gc.setAttribute('transform', 'translate(' + core.x + ' ' + core.y + ')');
      el('circle', { cx: 0, cy: 0, r: cr * 1.25, fill: 'none', stroke: M.core, 'stroke-width': 2, 'class': 'pulse' }, gc);
      el('circle', { cx: 0, cy: 0, r: cr, fill: M.core }, gc);
      var tc = el('text', { x: 0, y: small ? cr * 0.18 : -2 * cf, 'text-anchor': 'middle', 'class': 'lbl', style: 'fill:#fff;font-size:' + (small ? cr * 0.5 : 14 * cf) + 'px' }, gc); tc.textContent = small ? 'HA' : 'Home Assistant';
      var ts = el('text', { x: 0, y: 15 * cf, 'text-anchor': 'middle', style: 'fill:rgba(255,255,255,.88);font-size:' + (10.5 * cf) + 'px' }, gc); ts.setAttribute('data-anon', ''); ts.textContent = small ? '' : (this._hass.config && this._hass.config.version) || '';
      var th = el('text', { x: 0, y: 31 * cf, 'text-anchor': 'middle', id: 'coreHost', style: 'fill:rgba(255,255,255,.88);font-size:' + (10.5 * cf) + 'px' }, gc); th.setAttribute('data-anon', ''); th.textContent = small ? '' : this._hostShort();
      gc.addEventListener('click', function (e) { e.stopPropagation(); self._selCore(); });
      gc.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._selCore(); });
      hov(gc, { core: true }, core.x, core.y - cr, function () { return ['Home Assistant', [(self._hass.config && self._hass.config.version) || '', self._hostShort()].filter(Boolean).join(' · ')]; });
      Object.keys(this._mnodes).forEach(function (m) {
        var n = self._mnodes[m], g = el('g', { 'class': 'mnode', tabindex: 0, role: 'button' }, gN); n.g = g;
        var down = m === 'local' && self._routers && self._routers.length && self._routers.every(function (r) { return r.off; });
        el('circle', { cx: n.x, cy: n.y, r: n.r, 'class': 'disc', stroke: down ? 'var(--cm-bad)' : M[m] }, g);
        var ic = el('text', { x: n.x, y: n.y + n.r * 0.14, 'text-anchor': 'middle', style: 'font-size:' + (n.r * 0.39) + 'px;font-weight:700;fill:' + M[m] }, g);
        ic.textContent = m === 'cloud' ? 'WWW' : m === 'local' ? (self._router && !(self._routers && self._routers.some(function (x) { return x.sw; })) ? 'Wi-Fi' : 'LAN') : (self._coord ? 'USB' : 'RF');
        var below = Math.sin(deg(n.ac)) >= 0;
        var name = self._mname(m), sub = t(m + 'Sub');
        if (m === 'local' && self._router) sub = self._intName(self._router.p) + (self._routers.length > 1 ? ' · ' + self._routers.length + ' ' + t('meshNodes') : '');
        if (m === 'radio' && self._coord) sub = t('coordinator');
        else if (m === 'radio' && self._hubs.every(function (x) { return x.m !== 'radio' || x.own; })) sub = self._hubs.filter(function (x) { return x.m === 'radio'; }).map(function (x) { return x.bt ? t('bluetooth') : x.thread ? 'Thread' : self._intName(x.p); }).filter(function (v, i, l) { return v && l.indexOf(v) === i; }).slice(0, 3).join(' · ');
        tlabel(g, n.x, n.y, n.r + 2, below, name.length > 30 ? name.slice(0, 29) + '…' : name, sub, false, 0, m === 'local' && self._router ? 'Router' : '');
        obst.push({ x: n.x, y: n.y, r: n.r + 2 });
        function pick() { if (m === 'local' && self._router) self._selRouter(self._router); else self._selMedium(m); }
        g.setAttribute('aria-label', name);
        g.addEventListener('click', function (e) { e.stopPropagation(); pick(); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter') pick(); });
        hov(g, { node: n }, n.x, n.y - n.r, function () { return [name, sub]; });
      });
      Object.keys(this._rnodes || {}).forEach(function (k) {
        var n = self._rnodes[k]; if (!n.router) return; var r = n.router, tag = r.sw ? 'SW' : 'AP';
        var g = el('g', { 'class': 'mnode', tabindex: 0, role: 'button', 'aria-label': r.n }, gN); n.g = g;
        el('circle', { cx: n.x, cy: n.y, r: n.r, 'class': 'disc', stroke: r.off ? 'var(--cm-bad)' : M.local }, g);
        var ic = el('text', { x: n.x, y: n.y + n.r * 0.17, 'text-anchor': 'middle', style: 'font-size:' + (n.r * 0.47) + 'px;font-weight:700;fill:' + M.local }, g); ic.textContent = tag;
        var below = Math.sin(deg(n.ac)) >= 0;
        tlabel(g, n.x, n.y, n.r + 2, below, r.n, '', true, 1, tag + ' ' + (++anon.ap));
        obst.push({ x: n.x, y: n.y, r: n.r + 2 });
        g.addEventListener('click', function (e) { e.stopPropagation(); self._selRouter(r); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._selRouter(r); });
        hov(g, { node: n }, n.x, n.y - n.r, function () { return [r.n, r.off ? t('offline') : t(r.sw ? 'switchDesc' : 'routerDesc')]; });
      });
      // area nodes: a small ring between the hub and the devices of that area; its name goes outside the group
      this._alabs = [];
      if (!compact) this._hubs.forEach(function (h) {
        (h.areas || []).forEach(function (ar) {
          el('line', { x1: h.x, y1: h.y, x2: ar.x, y2: ar.y, 'class': 'spoke' }, gS);
          var g = el('g', { role: 'button', tabindex: 0, 'aria-label': ar.n }, gD);
          el('circle', { cx: ar.x, cy: ar.y, r: Z.dev * 0.62, 'class': 'anode', stroke: M[h.m] }, g);
          var tx = el('text', { 'class': 'dl al' }, self._gL); tx.textContent = ar.n.length > 20 ? ar.n.slice(0, 19) + '…' : ar.n; ar.lab = tx; self._alabs.push(ar);
          var pick = function (e) { e.stopPropagation(); var S = self._S, on = S.area === ar.n ? '' : ar.n; S.area = on; self._$('area').value = on; self._apply(); self._list(); };
          g.addEventListener('click', pick); g.addEventListener('keydown', function (e) { if (e.key === 'Enter') pick(e); });
          g.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') self._tip(ar.x, ar.y, ar.n, ar.list.length + ' ' + t('areaTip')); });
          g.addEventListener('pointerleave', function () { self._$('tip').style.display = 'none'; });
        });
      });
      this._hubs.forEach(function (h, i) {
        var g = el('g', { 'class': 'hub' + (first ? ' enter' : ''), tabindex: 0, role: 'button', 'aria-label': h.n, style: first ? 'animation-delay:' + (80 + i * 45) + 'ms' : '' }, gH);
        el('circle', { cx: h.x, cy: h.y, r: Z.hub, 'class': 'disc', stroke: M[h.m] }, g);
        var c = el('text', { x: h.x, y: h.y + Z.hub * 0.22, 'text-anchor': 'middle', style: 'font-size:' + (Z.hub * 0.59) + 'px;font-weight:700;fill:' + M[h.m] }, g); c.textContent = h.dv.length;
        h.badge = null;
        if (compact) { // offline devices cannot be seen as red dots here: a red counter on the bubble says how many
          var bx = h.x + Z.hub * 0.72, by = h.y - Z.hub * 0.72, bg2 = el('g', { style: 'display:none' }, g);
          el('circle', { cx: bx, cy: by, r: Z.hub * 0.42, 'class': 'badge' }, bg2); h.badge = el('text', { x: bx, y: by + Z.hub * 0.16, 'text-anchor': 'middle', 'class': 'badget', style: 'font-size:' + (Z.hub * 0.46) + 'px' }, bg2);
        }
        var below = Math.sin(deg(h.ac)) > -0.35;
        tlabel(g, h.x, h.y, h.outer + Z.dev + 1, below, h.n.length > 26 ? h.n.slice(0, 25) + '…' : h.n, h.kind === 'hub' || (h.own && !h.plain) ? h.sub : '', false, 2 + i / 1000, h.kind === 'hub' || h.rx ? 'Hub ' + (++anon.hub) : '');
        if (h.thread && h.sub) g.lastChild.lastChild.setAttribute('data-anon', h.otbr || h.devId ? t('threadBr') : ''); // the Thread network's name is the home's own
        obst.push({ x: h.x, y: h.y, r: h.outer + Z.dev + 1, hr: Z.hub + 2 });
        h.g = g;
        g.addEventListener('click', function (e) { e.stopPropagation(); self._selHub(h); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter') self._selHub(h); });
        hov(g, h, h.x, h.y - Z.hub, function () { var off = h.dv.filter(function (d) { return d.off; }).length; return [h.n, [h.kind === 'hub' || (h.own && !h.plain) ? h.sub : '', h.dv.length + ' ' + t('devices'), off ? off + ' ' + t('offline').toLowerCase() : ''].filter(Boolean).join(' · ')]; });
      });
      obst.push({ x: core.x, y: core.y, r: cr * 1.25 + 2, hr: cr + 2 });
      this._miniDraw();
      if (first) this._fit(); else this._setVB();
      this._declutter();
      this._entered = true;
      this._wire();
      this._filters();
      this._marks();
    }

    _wire() {
      if (this._wired) return; this._wired = true;
      var self = this, svg = this._$('svg'), drag = { on: false, moved: false };
      this._drag = drag;
      this._$('zlay').onclick = function () { self._S.layout = self._compact() ? 'detailed' : 'compact'; self._vb = null; self._render(); };
      this._$('zexp').onclick = function (e) {
        e.stopPropagation(); var m = self._$('xmenu'), t = self._t.bind(self);
        if (m.style.display === 'flex') { m.style.display = 'none'; return; }
        var hasTh = !!(self._matter && Object.keys(self._matter).some(function (k) { return self._matter[k] && self._matter[k].net === 'thread'; }));
        var hasMeshSrc = self._cfg.show_mesh !== false && !!(self._z2mBridge || self._hasZha || hasTh);
        m.innerHTML = '<button class="btn" id="xa">' + esc(t('exportAnon')) + '</button><button class="btn" id="xf">' + esc(t('exportFull')) + '</button><p>' + esc(t('exportHint')) + '</p>' +
          '<button class="btn" id="xd">' + esc(t('diagBtn')) + '</button>' +
          (hasMeshSrc ? '<button class="btn" id="xm">' + esc(t(self._meshBusy ? 'meshRefreshing' : 'meshRefresh')) + '</button>' : '') +
          (Object.keys((self._ans && self._ans.dup) || {}).length ? '<button class="btn" id="xr">' + esc(t('dupReset')) + '</button>' : '');
        m.style.display = 'flex';
        m.querySelector('#xa').onclick = function () { m.style.display = 'none'; self._export(true); };
        m.querySelector('#xf').onclick = function () { m.style.display = 'none'; self._export(false); };
        m.querySelector('#xd').onclick = function () { m.style.display = 'none'; self._diagDialog(); };
        var xm = m.querySelector('#xm'); if (xm) xm.onclick = function () {
          if (self._meshBusy) return;
          xm.textContent = t('meshRefreshing'); self._meshBusy = true;
          self._refreshMeshes(true).then(function () { self._meshBusy = false; m.style.display = 'none'; }, function () { self._meshBusy = false; m.style.display = 'none'; });
        };
        var xr = m.querySelector('#xr'); if (xr) xr.onclick = function () { m.style.display = 'none'; self._ans.dup = {}; self._saveAnswers(); self._remodel(); };
      };
      this._$('map').addEventListener('click', function () { self._$('xmenu').style.display = 'none'; });
      this._$('zin').onclick = function () { self._zoom(0.75); };
      this._$('zout').onclick = function () { self._zoom(1.33); };
      this._$('zfit').onclick = function () { self._fit(); };
      svg.addEventListener('wheel', function (e) { e.preventDefault(); var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var s = p.matrixTransform(svg.getScreenCTM().inverse()); self._zoom(e.deltaY > 0 ? 1.12 : 0.89, s.x, s.y); }, { passive: false });
      svg.addEventListener('pointerdown', function (e) { drag.on = true; drag.moved = false; drag.x = e.clientX; drag.y = e.clientY; drag.vb = Object.assign({}, self._vb); });
      window.addEventListener('pointermove', function (e) {
        if (!drag.on) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true; if (!drag.moved) return;
        var sc = 1 / (self._k || (svg.getBoundingClientRect().width / self._vb.w) || 1); self._vb.x = drag.vb.x - dx * sc; self._vb.y = drag.vb.y - dy * sc; self._setVB();
        self._$('tip').style.display = 'none';
      });
      window.addEventListener('pointerup', function () { if (drag.on && drag.moved) setTimeout(function () { self._declutter(); }, 30); drag.on = false; setTimeout(function () { drag.moved = false; }, 0); });
      // taps anywhere pick the nearest device or hub within ~24 px, so tiny dots are easy to hit on a phone
      svg.addEventListener('click', function (e) {
        if (drag.moved) return;
        var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var s = p.matrixTransform(svg.getScreenCTM().inverse());
        var bd = 24 / (self._k || 1), best = null;
        (self._devs || []).forEach(function (d) { if (d.x == null || d.vis === false) return; var dd = Math.sqrt((d.x - s.x) * (d.x - s.x) + (d.y - s.y) * (d.y - s.y)); if (dd < bd) { bd = dd; best = { d: d }; } });
        (self._hubs || []).forEach(function (h) { if (Math.sqrt((h.x - s.x) * (h.x - s.x) + (h.y - s.y) * (h.y - s.y)) <= self._sz.hub + 3) best = { h: h }; }); // inside a hub disc wins
        if (best && best.d) self._selDev(best.d); else if (best && best.h) self._selHub(best.h); else self._reset();
      });
      this._$('q').addEventListener('input', function (e) { self._S.q = e.target.value.trim().toLowerCase(); self._apply(); self._list(); });
      this._$('area').onchange = function (e) { self._S.area = e.target.value; self._apply(); self._list(); };
      this._$('physBtn').onclick = function () { self._S.physical = !self._physical(); self._vb = null; self._remodel(); };
      this._$('show').onchange = function (e) {
        var was = self._S.show; self._S.show = e.target.value;
        // disabled devices are only part of the map while they are asked for, unless show_disabled keeps them
        if ((was === 'dis') !== (self._S.show === 'dis') && !self._cfg.show_disabled) { self._vb = null; self._remodel(); }
        self._apply(); self._list();
      };
    }
    _setVB() {
      var v = this._vb, svg = this._$('svg'); svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
      var r = svg.getBoundingClientRect(), k = r.width && v.w ? Math.min(r.width / v.w, (r.height || r.width) / v.h) : 1;
      this._k = k || 1; svg.style.setProperty('--k', this._k.toFixed(4));
      // what is really on screen (the viewBox is letterboxed to keep its proportions)
      var vw = r.width / this._k, vh = (r.height || r.width) / this._k;
      this._view = { x: v.x + v.w / 2 - vw / 2, y: v.y + v.h / 2 - vh / 2, w: vw, h: vh };
      this._miniView();
      // labels change size relative to the map when the zoom changes, and device names depend on what is in view: place them again
      var zoomed = Math.abs(this._k - (this._dk || 0)) > this._k * 0.02;
      if (this._labs && (zoomed || this._dlOn || this._k >= this._dlMin()) && !this._dq) {
        var self = this; this._dq = true;
        if (zoomed) requestAnimationFrame(function () { self._dq = false; self._declutter(); });
        else setTimeout(function () { self._dq = false; self._declutter(); }, 140);
      }
    }
    // device names need about 26 px between neighbouring dots
    // compact map: every hub or integration is one bubble with its number of devices; the devices are in the side panel
    _compact() { return ((this._S && this._S.layout) || this._cfg.layout) === 'compact'; }
    // Save what is on screen as a PNG. Without names: hubs, routers, access points and devices are numbered, so the
    // image says nothing about the home it comes from (integration names stay: "Philips Hue" is not private).
    _exportSvg(anon) {
      var svg = this._$('svg'), r = svg.getBoundingClientRect(), clone = svg.cloneNode(true);
      var src = svg.querySelectorAll('*'), dst = clone.querySelectorAll('*');
      var P = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'display', 'font-size', 'font-weight', 'font-family', 'paint-order', 'text-anchor', 'dominant-baseline'];
      for (var i = 0; i < src.length; i++) {
        var cs = getComputedStyle(src[i]), st = '';
        P.forEach(function (p) { st += p + ':' + cs.getPropertyValue(p) + ';'; });
        dst[i].setAttribute('style', st + 'animation:none;transition:none'); dst[i].removeAttribute('class'); dst[i].removeAttribute('aria-label'); dst[i].removeAttribute('tabindex');
        if (src[i].classList.contains('flow') || src[i].classList.contains('pulse') || (anon && src[i].classList.contains('dl'))) dst[i].setAttribute('style', 'display:none');
        if (anon && src[i].hasAttribute('data-anon')) dst[i].textContent = src[i].getAttribute('data-anon');
        if (anon && src[i].classList.contains('dl')) dst[i].textContent = '';
      }
      var bg = getComputedStyle(this._root.querySelector('ha-card')).getPropertyValue('--cm-bg').trim() || '#fff', v = this._vb;
      var probe = document.createElement('i'); probe.style.cssText = 'display:none;color:' + bg; this._root.appendChild(probe); bg = getComputedStyle(probe).color || '#fff'; probe.remove();
      var back = document.createElementNS(NS, 'rect'); back.setAttribute('x', v.x - v.w); back.setAttribute('y', v.y - v.h); back.setAttribute('width', v.w * 3); back.setAttribute('height', v.h * 3); back.setAttribute('fill', bg);
      clone.insertBefore(back, clone.firstChild);
      clone.setAttribute('xmlns', NS); clone.setAttribute('width', r.width); clone.setAttribute('height', r.height); clone.removeAttribute('id'); clone.removeAttribute('style');
      return { text: new XMLSerializer().serializeToString(clone), w: r.width, h: r.height, bg: bg };
    }
    _export(anon) {
      var self = this, x = this._exportSvg(anon), r = { width: x.w, height: x.h }, bg = x.bg;
      var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(x.text), img = new Image(), sc = 2;
      return new Promise(function (done) {
        img.onload = function () {
          var cv = document.createElement('canvas'); cv.width = Math.round(r.width * sc); cv.height = Math.round(r.height * sc);
          var cx = cv.getContext('2d'); cx.fillStyle = bg; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0, cv.width, cv.height);
          cv.toBlob(function (blob) {
            self._lastExport = { w: cv.width, h: cv.height, bytes: blob ? blob.size : 0 };
            if (blob) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'connection-map.png'; self._root.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000); }
            done(self._lastExport);
          }, 'image/png');
        };
        img.onerror = function () { self._lastExport = null; done(null); };
        img.src = url;
      });
    }
    _dlMin() { var z = this._sz || this._sizes(); return 26 / Math.max(15, z.dev * 2 + 2.6); }
    // Overview: the whole map in a corner with the visible part marked. Click or drag on it to move.
    _miniDraw() {
      var mini = this._$('mini'), v = this._vb0, M = this._M, self = this;
      if (this._cfg.minimap === false || !v) { mini.innerHTML = ''; mini.style.display = 'none'; return; }
      var h = '<svg viewBox="' + [v.x, v.y, v.w, v.h].join(' ') + '">';
      this._hubs.forEach(function (x) { if (x.from) h += '<line x1="' + x.from.x + '" y1="' + x.from.y + '" x2="' + x.x + '" y2="' + x.y + '" stroke="' + M[x.m] + '" stroke-width="3" stroke-opacity=".45"/>'; });
      Object.keys(this._mnodes).forEach(function (m) { var n = self._mnodes[m]; h += '<line x1="' + self._core.x + '" y1="' + self._core.y + '" x2="' + n.x + '" y2="' + n.y + '" stroke="' + M[m] + '" stroke-width="3" stroke-opacity=".45"/><circle cx="' + n.x + '" cy="' + n.y + '" r="' + n.r + '" fill="' + M[m] + '"/>'; });
      this._hubs.forEach(function (x) { h += '<circle cx="' + x.x + '" cy="' + x.y + '" r="' + (x.outer + 4) + '" fill="' + M[x.m] + '" fill-opacity=".5"/>'; });
      h += '<circle cx="' + this._core.x + '" cy="' + this._core.y + '" r="' + (this._sz.core * 1.1) + '" fill="' + M.core + '"/><rect class="view" id="miniView"/></svg>';
      mini.innerHTML = h;
      if (this._miniWired) return; this._miniWired = true;
      var down = false;
      function go(e) {
        var sv = mini.querySelector('svg'); if (!sv) return; var p = sv.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; var q = p.matrixTransform(sv.getScreenCTM().inverse());
        self._vb.x = q.x - self._vb.w / 2; self._vb.y = q.y - self._vb.h / 2; self._setVB();
      }
      mini.addEventListener('pointerdown', function (e) { e.stopPropagation(); down = true; try { mini.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ } go(e); });
      mini.addEventListener('pointermove', function (e) { if (down) go(e); });
      mini.addEventListener('pointerup', function () { down = false; });
      mini.addEventListener('pointercancel', function () { down = false; });
      mini.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    _miniView() {
      var mini = this._$('mini'), r = mini && mini.querySelector('#miniView'), v = this._view, a = this._vb0;
      if (!r || !v || !a) return;
      var tol = Math.max(a.w, a.h) * 0.03;
      var all = v.x <= a.x + tol && v.y <= a.y + tol && v.x + v.w >= a.x + a.w - tol && v.y + v.h >= a.y + a.h - tol;
      mini.style.display = all ? 'none' : 'block';
      var x0 = Math.max(a.x, v.x), y0 = Math.max(a.y, v.y), x1 = Math.min(a.x + a.w, v.x + v.w), y1 = Math.min(a.y + a.h, v.y + v.h);
      r.setAttribute('x', x0); r.setAttribute('y', y0); r.setAttribute('width', Math.max(0, x1 - x0)); r.setAttribute('height', Math.max(0, y1 - y0));
    }
    // narrow screens: taller map, starting zoomed in on Home Assistant so labels and dots are usable
    _fit() {
      var svg = this._$('svg'), W = this._$('map').getBoundingClientRect().width || 800, v0 = this._vb0;
      if (W < 600 && !this._mapHeight() && !this._isGridFill()) {
        var H = Math.round(Math.min(window.innerHeight * 0.68, 640)); svg.style.height = H + 'px';
        var w = v0.w * 0.58, h = w * H / W; var co = this._core || { x: 0, y: 0 }; this._vb = { x: co.x / 2 - w / 2, y: co.y / 2 - h / 2 + 30, w: w, h: h };
      } else { svg.style.height = ''; this._vb = Object.assign({}, v0); }
      this._setVB();
    }
    // No label may be drawn over a node or over another label. Node labels try below / above / right / left of their node,
    // then the same without the subtitle; link labels slide along their link. A label with no free place is hidden
    // (the name is still in the tooltip and in the side panel) and comes back when zooming in makes room.
    _declutter() {
      var k = this._k || 1, pad = 2 / k, obst = this._obst || [], placed = [], hiddenNames = 0;
      // the zoom buttons and the overview map float over the map: no label goes under them
      var svg0 = this._$('svg'), ctm = svg0.getScreenCTM && svg0.getScreenCTM(), root0 = this._root;
      if (ctm) ['.zoom', '#mini'].forEach(function (q) {
        var e = root0.querySelector(q), b = e && e.getBoundingClientRect(); if (!b || !b.width) return;
        var inv = ctm.inverse(), p1 = svg0.createSVGPoint(), p2 = svg0.createSVGPoint(); p1.x = b.left; p1.y = b.top; p2.x = b.right; p2.y = b.bottom;
        p1 = p1.matrixTransform(inv); p2 = p2.matrixTransform(inv); placed.push({ x0: p1.x, y0: p1.y, x1: p2.x, y1: p2.y });
      });
      this._dk = k;
      function box(e) { var b; try { b = e.getBBox(); } catch (err) { return null; } return b && b.width ? { x0: b.x - pad, y0: b.y - pad, x1: b.x + b.width + pad, y1: b.y + b.height + pad } : null; }
      function free(r, inner) {
        if (!r) return false;
        for (var i = 0; i < obst.length; i++) {
          var o = obst[i], rr = inner ? (o.hr || o.r) : o.r, dx = o.x - Math.max(r.x0, Math.min(o.x, r.x1)), dy = o.y - Math.max(r.y0, Math.min(o.y, r.y1));
          if (dx * dx + dy * dy < rr * rr) return false;
        }
        for (var j = 0; j < placed.length; j++) { var p = placed[j]; if (r.x0 < p.x1 && r.x1 > p.x0 && r.y0 < p.y1 && r.y1 > p.y0) return false; }
        return true;
      }
      // mode: two letters, vertical (b below, a above, m middle) and horizontal (c centred, r right, l left)
      function put(L, mode, sub) {
        var v = mode[0], h = mode[1], gap = 6 / k, d = v !== 'm' && h !== 'c' ? 0.72 : 1, off = (L.rad + gap) * d;
        var x = h === 'r' ? L.cx + off : h === 'l' ? L.cx - off : L.cx;
        var y = v === 'b' ? L.cy + off : v === 'a' ? L.cy - off : L.cy;
        L.tx.setAttribute('class', 'tl' + (v === 'b' ? ' below' : ''));
        L.tx.setAttribute('text-anchor', h === 'r' ? 'start' : h === 'l' ? 'end' : 'middle');
        L.tx.setAttribute('x', x); L.tx.setAttribute('y', y); L.a.setAttribute('x', x);
        var dy = v === 'a' ? (sub ? '-1.3em' : '') : v === 'm' ? (sub ? '-.3em' : '.35em') : '';
        if (dy) L.a.setAttribute('dy', dy); else L.a.removeAttribute('dy');
        if (L.b) { L.b.setAttribute('x', x); L.b.style.display = sub ? '' : 'none'; }
      }
      (this._labs || []).slice().sort(function (a, b) { return a.pri - b.pri; }).forEach(function (L) {
        L.tx.style.display = '';
        var modes = L.below ? ['bc', 'ac', 'mr', 'ml', 'br', 'bl', 'ar', 'al'] : ['ac', 'bc', 'mr', 'ml', 'ar', 'al', 'br', 'bl'], r = null;
        [true, false].forEach(function (sub) {
          if (r || (!sub && !L.b)) return;
          modes.forEach(function (m) { if (r) return; put(L, m, sub && !!L.b); var b = box(L.tx); if (free(b)) r = b; });
        });
        if (r) placed.push(r); else { L.tx.style.display = 'none'; hiddenNames++; }
      });
      (this._elabs || []).forEach(function (E) {
        E.e.style.display = '';
        var r = null;
        [E.f, 0.5, 0.35, 0.6, 0.28, 0.7, 0.8].forEach(function (f) {
          if (r) return;
          E.e.setAttribute('x', E.x1 + (E.x2 - E.x1) * f); E.e.setAttribute('y', E.y1 + (E.y2 - E.y1) * f);
          var b = box(E.e); if (free(b)) r = b;
        });
        if (r) placed.push(r); else { E.e.style.display = 'none'; hiddenNames++; }
      });
      // Semantic zoom: once neighbouring dots are far enough apart on screen, the devices in view get their names,
      // pointing away from their hub. A name that would touch a dot, a node or another label is left out.
      var v = this._view, Z = this._sz, self = this, devs = this._devs || [];
      var on = this._cfg.device_labels !== false && !this._compact() && v && k >= this._dlMin();
      var seen = on ? devs.filter(function (d) { return d.x != null && d.vis !== false && d.x > v.x && d.x < v.x + v.w && d.y > v.y && d.y < v.y + v.h; }) : [];
      if (seen.length > 260) seen = [];
      this._dlOn = seen.length > 0;
      devs.forEach(function (d) { if (d.lab) d.lab.style.display = 'none'; });
      // every dot in or near the view is in the way of a name, whether it gets a name itself or not
      var alabs = (this._compact() ? [] : this._alabs || []).filter(function (ar) { return ar.lab && ar.lab.isConnected; });
      if (seen.length || alabs.length) devs.forEach(function (d) {
        if (d.x == null || !d.g || (!alabs.length && (d.x < v.x - 60 || d.x > v.x + v.w + 60 || d.y < v.y - 60 || d.y > v.y + v.h + 60))) return; // area names are placed all over the map
        var rr = d.router ? Z.dev + 4.6 : Z.dev + 0.8; placed.push({ x0: d.x - rr, y0: d.y - rr, x1: d.x + rr, y1: d.y + rr, d: d });
      });
      alabs.forEach(function (ar) { var q = Z.dev * 0.62 + 1.5; placed.push({ x0: ar.x - q, y0: ar.y - q, x1: ar.x + q, y1: ar.y + q }); });
      // the name of an area goes just outside its devices, pointing away from the hub
      alabs.forEach(function (ar) {
        var h = ar.hub, ux = Math.cos(ar.ang), uy = Math.sin(ar.ang), rad = ar.far + Z.dev + 5 / k, e = ar.lab;
        e.style.display = '';
        e.setAttribute('text-anchor', ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle');
        e.setAttribute('x', h.x + rad * ux); e.setAttribute('y', h.y + rad * uy + (Math.abs(ux) <= 0.35 ? (uy > 0 ? 6 : -6) / k : 0));
        var b = box(e); if (free(b, true)) placed.push(b); else e.style.display = 'none';
      });
      seen.forEach(function (d) {
        if (!d.lab) { d.lab = document.createElementNS(NS, 'text'); d.lab.setAttribute('class', 'dl'); d.lab.textContent = d.n.length > 22 ? d.n.slice(0, 21) + '…' : d.n; self._gL.appendChild(d.lab); }
        var right = d.x >= d.hub.x, r = null, me = placed.filter(function (p) { return p.d === d; })[0];
        d.lab.style.display = '';
        [right, !right].forEach(function (rt) {
          if (r) return;
          d.lab.setAttribute('text-anchor', rt ? 'start' : 'end'); d.lab.setAttribute('x', d.x + (rt ? 1 : -1) * (Z.dev + 4 / k)); d.lab.setAttribute('y', d.y);
          var b = box(d.lab); if (!b) return;
          var mx0 = me.x0, mx1 = me.x1; me.x0 = me.x1 = 1e9; // its own dot is not an obstacle
          if (free(b, true)) r = b;
          me.x0 = mx0; me.x1 = mx1;
        });
        if (r) placed.push(r); else d.lab.style.display = 'none';
      });
      this._hiddenNames = hiddenNames; this._note();
    }
    // Anything left off the map for lack of room is said out loud, under the map.
    _note() {
      var t = this._t.bind(this), self = this, el = this._$('note'), a = (this._offMap || []).length, n = this._hiddenNames || 0, h = '';
      var er = this._error, sk = (this._skipped || []).length, du = (this._dupPending || []).length;
      if (er) h += '<div><span>⚠ ' + esc(t('errTitle')) + ' ' + esc(t('errHint')) + '</span><button id="noteDiag">' + esc(t('details')) + '</button></div>';
      if (sk) h += '<div><span>⚠ ' + (sk === 1 ? esc(t('skipped1')) : sk + ' ' + esc(t('skipped'))) + '</span><button id="noteDiag2">' + esc(t('details')) + '</button></div>';
      if (du) h += '<div><span>⚠ ' + (du === 1 ? esc(t('dupNote1')) : du * 2 + ' ' + esc(t('dupNote'))) + '</span><button id="noteDup">' + esc(t('dupReview')) + '</button></div>';
      if (a) h += '<div><span>⚠ ' + (a === 1 ? esc(t('noRoomAp1')) : a + ' ' + esc(t('noRoomAp'))) + '</span><button id="noteAp">' + esc(t('noRoomSee')) + '</button></div>';
      if (n) h += '<div><span>⚠ ' + (n === 1 ? esc(t('noRoomName1')) : n + ' ' + esc(t('noRoomName'))) + '</span><button id="noteZoom">' + esc(t('noRoomZoom')) + '</button></div>';
      if (el.innerHTML !== h) el.innerHTML = h;
      el.style.display = h ? 'block' : 'none';
      var b1 = el.querySelector('#noteAp'), b2 = el.querySelector('#noteZoom');
      ['#noteDiag', '#noteDiag2'].forEach(function (q) { var b = el.querySelector(q); if (b) b.onclick = function () { self._diagDialog(); }; });
      var b3 = el.querySelector('#noteDup'); if (b3) b3.onclick = function () { self._dupAsk(0); };
      if (b1) b1.onclick = function () { self._selRouter(self._router); };
      if (b2) b2.onclick = function () { self._zoom(0.7); };
    }
    _zoom(f, cx, cy) {
      var v = this._vb; if (cx == null) { cx = v.x + v.w / 2; cy = v.y + v.h / 2; }
      var nw = Math.min(this._vb0.w * 1.6, Math.max(this._vb0.w * 0.15, v.w * f)), k = nw / v.w;
      this._vb = { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, w: nw, h: v.h * k }; this._setVB();
    }
    _tip(x, y, title, sub) {
      var svg = this._$('svg'), pt = svg.createSVGPoint(); pt.x = x; pt.y = y; var s = pt.matrixTransform(svg.getScreenCTM());
      var b = this._$('map').getBoundingClientRect(), tip = this._$('tip');
      tip.style.left = (s.x - b.left) + 'px'; tip.style.top = (s.y - b.top) + 'px';
      tip.innerHTML = '<b>' + esc(title) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : ''); tip.style.display = 'block';
    }
    // Highlight a device, hub or network node together with everything on its path to Home Assistant; the rest fades.
    _focus(tg) {
      clearTimeout(this._ft); this._unmark();
      if (!tg || tg.core) { this._$('svg').classList.remove('foc'); return; }
      var self = this, on = [this._coreG];
      function dev(d) { on.push(d.g, d.spoke); var p = d.meshParent, n = 0; while (p && n++ < 6) { on.push(p.g, p.spoke); p = p.meshParent; } }
      function hub(h) { on.push(h.g, h.edge); if (h.from) on.push(h.from.g, h.from.edge); var m = h.direct ? null : self._mnodes[h.m]; if (m) on.push(m.g, m.edge); }
      var own = tg.node ? tg.node.g : tg.g;
      if (tg.dv) { tg.dv.forEach(dev); hub(tg); }
      else if (tg.node) {
        var n = tg.node, loc = this._mnodes.local; on.push(n.g, n.edge);
        if (n.router && loc) on.push(loc.g, loc.edge);
        if (n === loc) Object.keys(this._rnodes || {}).forEach(function (k) { on.push(self._rnodes[k].g, self._rnodes[k].edge); });
        this._hubs.forEach(function (h) { if (n.router ? h.from === n : h.m === n.m) { h.dv.forEach(dev); hub(h); } });
      } else if (tg.hub) { dev(tg); hub(tg.hub); }
      else return;
      on.forEach(function (e) { if (e) e.classList.add('on'); });
      if (own) own.classList.add('hov');
      this._on = on; this._hov = own; this._$('svg').classList.add('foc');
    }
    _unmark() { (this._on || []).forEach(function (e) { if (e) e.classList.remove('on'); }); this._on = []; if (this._hov) this._hov.classList.remove('hov'); this._hov = null; }
    _unfocus() {
      var self = this; clearTimeout(this._ft);
      this._ft = setTimeout(function () { self._unmark(); self._$('svg').classList.remove('foc'); self._$('tip').style.display = 'none'; }, 70);
    }

    _filters() {
      var self = this, t = this._t.bind(this), M = this._M;
      this._S = this._S || { med: { cloud: true, local: true, radio: true }, q: '', area: '', show: '', sel: null, sort: this._cfg.sort === 'name' ? 'name' : 'area' };
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
    _ago(ts) { var m = Math.max(1, Math.round((Date.now() - ts) / 60000)); return this._t('ago').replace('{t}', m < 90 ? m + ' min' : Math.round(m / 60) + ' h'); }
    _marks() {
      if (!this._devs || !this._S) return;
      var t = this._t.bind(this);
      this._devs.forEach(function (d) { if (d.g) { d.g.classList.toggle('offline', !!d.off); d.g.classList.toggle('recent', !!d.recent); d.g.classList.toggle('away', !!d.away && !d.recent); d.g.classList.toggle('bare', !!d.bare && !d.dis && !d.off && !d.recent && !d.away); d.g.classList.toggle('disabled', !!d.dis); } });
      (this._hubs || []).forEach(function (h) { if (h.g) h.g.classList.toggle('offline', !!h.off); });
      (this._hubs || []).forEach(function (h) { if (!h.badge) return; var o = h.dv.filter(function (d) { return d.off; }).length; h.badge.textContent = o; h.badge.parentNode.style.display = o ? '' : 'none'; });
      var ob = this._$('offStat'), n = this._devs.filter(function (d) { return d.off; }).length;
      if (ob) ob.innerHTML = '<i style="border:2px solid var(--cm-bad)"></i>' + esc(t('offline')) + ' <b class="off">' + n + '</b>';
      this._apply();
      if (!this._S.sel) this._list();
    }
    _vis(d) { var S = this._S; return S.med[d.hub.m] && (S.show === 'off' ? (d.off || d.recent) : S.show === 'bare' ? (!!d.bare && !d.dis) : S.show === 'dis' ? !!d.dis : true) && (!S.area || d.a === S.area) && (!S.q || (d.n + ' ' + d.mo + ' ' + d.a + ' ' + d.hub.n + ' ' + (d.hub.sub || '') + ' ' + (d.via || '')).toLowerCase().indexOf(S.q) >= 0); }
    _apply() {
      var self = this, S = this._S, f = S.q || S.area || S.show;
      this._devs.forEach(function (d) { d.vis = self._vis(d); if (d.g) { d.g.classList.toggle('dim', !d.vis); d.spoke.classList.toggle('dim', !d.vis); } });
      this._hubs.forEach(function (h) { if (!h.g) return; var on = S.med[h.m] && (!f || h.dv.some(function (d) { return d.vis; })); h.g.classList.toggle('dim', !on); h.edge.classList.toggle('dim', !on); });
    }

    _item(d) {
      var M = this._M, t = this._t.bind(this);
      return '<button class="item' + (this._S.sel === d ? ' sel' : '') + '" data-id="' + esc(d.id) + '"><i style="' + (d.off ? 'border:2px solid var(--cm-bad)' : d.recent ? 'border:2px solid var(--cm-recent)' : d.away ? 'border:2px dashed var(--cm-away)' : d.dis ? 'border:2px dotted var(--cm-bare)' : d.bare ? 'background:var(--cm-bare);opacity:.6' : 'background:' + M[d.hub.m]) + '"></i><span class="nm">' + esc(d.n) + '</span><small class="' + (d.off ? 'off' : '') + '" style="' + (d.recent ? 'color:var(--cm-recent);font-weight:600' : d.away ? 'color:var(--cm-away)' : '') + '">' + (d.off ? esc(t('offline')) : d.recent ? esc(this._ago(d.seen)) : d.remote ? esc(t('remote')) : d.away ? esc(t('away')) : esc(d.hub.kind === 'other' ? (d.via || d.a || d.hub.n) : (d.a || d.hub.n))) + '</small></button>';
    }
    _bind() {
      var self = this, p = this._$('panel');
      // the list and the map are linked: pointing at a row highlights that device or hub on the map
      function link(b, target, pick) {
        if (!target) return;
        b.onclick = function () { self._unfocus(); pick(target); };
        b.onpointerenter = function (e) { if (e.pointerType === 'touch') return; self._focus(target); self._$('tip').style.display = 'none'; };
        b.onpointerleave = function () { self._unfocus(); };
      }
      p.querySelectorAll('.item[data-id]').forEach(function (b) { link(b, self._devs.find(function (d) { return d.id === b.dataset.id; }), function (d) { self._selDev(d); }); });
      p.querySelectorAll('[data-hub]').forEach(function (b) { link(b, self._hubs.find(function (h) { return h.key === b.dataset.hub; }), function (h) { self._selHub(h); }); });
      var bk = p.querySelector('#back'); if (bk) bk.onclick = function () { self._reset(); };
    }
    _route(arr) { return '<div class="route">' + arr.map(function (x, i) { return (i ? '<em>→</em>' : '') + '<span>' + esc(x) + '</span>'; }).join('') + '</div>'; }
    _pathOf(d) {
      var t = this._t.bind(this), r = [d.n], m = d.hub.m;
      if (d.hub.own && !d.hub.plain) {
        var tp = d.meshParent, tg = 0;
        while (tp && tg++ < 6) { r.push(tp.n + ' (' + t('repeater') + ')'); tp = tp.meshParent; }
        r.push(d.via || this._intName(d.p));
        if (d.hub.thread) r.push(d.hub.otbr ? d.hub.n + ' (' + t('threadBr') + ')' : 'Thread' + (d.hub.net ? ' (' + d.hub.net + ')' : ''));
        else if (d.hub.rx) {
          r.push(d.hub.n + ' (' + d.hub.sub + ')');
          var pc = this._conn(d.hub.trk), ph = this._ifaceText(pc); // a proxy is itself on the network
          if (pc && pc.via) { r.push(pc.via + (ph ? ' (' + ph + ')' : '')); if (this._router && pc.via !== this._router.n) r.push(this._router.n); }
        } else r.push(t('bluetooth'));
      } else if (m === 'radio') {
        var p = d.meshParent, guard = 0;
        while (p && guard++ < 6) { r.push(p.n + ' (' + t('repeater') + ')'); p = p.meshParent; }
        if (this._coord && !d.hub.own) r.push(this._coord);
        r.push(d.hub.kind === 'hub' ? d.hub.n : (d.via || this._intName(d.p)));
      } else if (d.remote) {
        r.push(this._intName(d.p)); if (d.cell) r.push(t('mobileData')); r.push(t('cloud'));
      } else {
        var lp = d.meshParent, lg = 0;
        while (lp && lg++ < 6) { r.push(lp.n + (d.threadMesh ? ' (' + t('repeater') + ')' : '')); lp = lp.meshParent; }
        if (d.hub.kind === 'hub') r.push(d.hub.n + (d.hub.thread ? ' (Thread)' : ''));
        var c = this._conn(d.trk) || (d.hub.kind === 'hub' ? this._conn(d.hub.trk) : null);
        var how = this._ifaceText(c), hop = c && c.via ? c.via + (how ? ' (' + how + ')' : '') : null;
        if (m === 'cloud') {
          if (hop) r.push(hop);
          r.push(d.via || this._intName(d.p)); r.push(t('cloud'));
        } else {
          r.push(d.via || this._intName(d.p));
          if (hop) { r.push(hop); if (this._router && c.via !== this._router.n) r.push(this._router.n); }
          else r.push(this._mname(m));
        }
      }
      r.push('Home Assistant');
      return r;
    }
    _clear() {
      (this._devs || []).forEach(function (d) { if (d.g) d.g.classList.remove('sel'); });
      (this._hubs || []).forEach(function (h) { if (h.g) h.g.classList.remove('sel'); if (h.edge) h.edge.classList.remove('hot'); });
      Object.keys(this._mnodes || {}).forEach(function (m) { var n = this._mnodes[m]; if (n.edge) n.edge.classList.remove('hot'); }, this);
      Object.keys(this._rnodes || {}).forEach(function (k) { var n = this._rnodes[k]; if (n.router && n.edge) n.edge.classList.remove('hot'); }, this);
    }
    _hot(h) {
      if (h.edge) h.edge.classList.add('hot'); var n = h.direct ? null : this._mnodes[h.m]; if (n && n.edge) n.edge.classList.add('hot');
      if (h.from && h.from.router && h.from.edge) h.from.edge.classList.add('hot');
    }
    _selRouter(r) {
      if (!r) return; var t = this._t.bind(this), self = this; this._S.sel = { router: r }; this._clear();
      var n = this._rnodes[r.n]; if (n && n.edge) n.edge.classList.add('hot'); if (this._mnodes.local && this._mnodes.local.edge) this._mnodes.local.edge.classList.add('hot');
      var items = [];
      this._hubs.forEach(function (h) { if (h.trk) { var c = self._conn(h.trk); if (c && c.via === r.n) items.push({ n: h.n, c: c, hub: h }); } });
      this._devs.forEach(function (d) { if (d.hub && d.hub.trk && d.trk === d.hub.trk) return; var c = self._conn(d.trk); if (c && c.via === r.n) items.push({ n: d.n, c: c, d: d }); });
      var ha = this._conn(this._haTrk); if (ha && ha.via === r.n) items.unshift({ n: 'Home Assistant', c: ha });
      var bc = this._conn(r.trk), others = r === this._router ? (this._routers || []).filter(function (x) { return x !== r; }) : [];
      this._$('panel').innerHTML = '<div class="eyebrow" style="color:' + this._M.local + '">' + esc(t('network')) + ' · ' + esc(this._intName(r.p)) + '</div><h2>' + esc(r.n) + '</h2><p>' + esc(r === this._router ? t('infraLocal') : t(r.sw ? 'switchDesc' : 'routerDesc')) + '</p>' +
        (bc ? '<dl class="kv"><dt>' + esc(t('backhaul')) + '</dt><dd>' + esc((bc.via ? bc.via + ' · ' : '') + this._ifaceText(bc)) + '</dd>' + (bc.ip ? '<dt>' + esc(t('ip')) + '</dt><dd>' + esc(bc.ip) + '</dd>' : '') + '</dl>' : '') +
        (others.length ? '<div class="list">' + others.map(function (x) { var xc = self._conn(x.trk), xsub = x.off ? t('offline') : (self._offMap || []).indexOf(x.n) >= 0 ? t('notDrawn') : [x.sw ? 'SW' : 'AP', xc ? self._ifaceText(xc) : ''].filter(Boolean).join(' · '); return '<button class="item" data-router="' + esc(x.n) + '"><i style="' + (x.off ? 'border:2px solid var(--cm-bad)' : 'background:' + self._M.local) + '"></i><span class="nm">' + esc(x.n) + '</span><small class="' + (x.off ? 'off' : '') + '">' + esc(xsub) + '</small></button>'; }).join('') + '</div>' : '') +
        '<div class="eyebrow" style="color:var(--cm-muted)">' + esc(t('connectedHere')) + ' · ' + items.length + '</div><div class="list">' +
        items.map(function (it) {
          var col = it.hub ? self._M[it.hub.m] : it.d ? self._M[it.d.hub.m] : self._M.core;
          return '<button class="item"' + (it.hub ? ' data-hub="' + esc(it.hub.key) + '"' : it.d ? ' data-id="' + esc(it.d.id) + '"' : '') + '><i style="background:' + col + '"></i><span class="nm">' + esc(it.n) + '</span><small>' + esc(self._ifaceText(it.c)) + '</small></button>';
        }).join('') + '</div><button class="btn" id="back">← ' + esc(t('back')) + '</button>';
      this._bind();
      this._$('panel').querySelectorAll('[data-router]').forEach(function (b) { b.onclick = function () { self._selRouter(self._routers.filter(function (x) { return x.n === b.dataset.router; })[0]); }; });
    }
    _list() {
      var S = this._S, t = this._t.bind(this), self = this;
      if (S.sel && S.sel.dv) return this._selHub(S.sel, true);
      if (S.sel) return;
      var f = S.q || S.area || S.show, vis = this._devs.filter(function (d) { return d.vis; });
      var html = '<div class="eyebrow" style="color:var(--cm-core)">' + esc(t('summary')) + '</div><h2>' + (f ? vis.length + ' ' + esc(t('found')) : this._devs.length + ' ' + esc(t('devices'))) + '</h2>';
      if (f) html += '<div class="list">' + (vis.map(function (d) { return self._item(d); }).join('') || '<p>' + esc(t('none')) + '</p>') + '</div>';
      else {
        var offs = this._devs.filter(function (d) { return d.off; }), recs = this._devs.filter(function (d) { return d.recent; });
        html += '<p>' + esc(t('summaryText')) + '</p><div class="list">' + this._hubs.slice().sort(function (a, b) { return b.dv.length - a.dv.length; }).map(function (h) {
          return '<button class="item" data-hub="' + esc(h.key) + '"><i style="background:' + self._M[h.m] + '"></i><span class="nm">' + esc(h.n) + '</span><small>' + h.dv.length + '</small></button>';
        }).join('') + '</div><div class="eyebrow off">' + esc(t('offlineNow')) + ' · ' + offs.length + '</div><div class="list">' + (offs.map(function (d) { return self._item(d); }).join('') || '<p>' + esc(t('allOnline')) + '</p>') + '</div>' +
          (recs.length ? '<div class="eyebrow" style="color:var(--cm-recent)">' + esc(t('recentNow')) + ' · ' + recs.length + '</div><div class="list">' + recs.map(function (d) { return self._item(d); }).join('') + '</div>' : '');
      }
      this._$('panel').innerHTML = html; this._bind();
    }
    _selHub(h, keep) {
      if (!h) return; var t = this._t.bind(this), self = this, S = this._S;
      if (!keep) S.sel = h; this._clear(); h.g.classList.add('sel'); this._hot(h);
      var f = S.q || S.area || S.show, list = h.dv.filter(function (d) { return !f || d.vis; }).sort(function (a, b) { return (S.sort === 'name' ? 0 : (a.a || '~').localeCompare(b.a || '~')) || a.n.localeCompare(b.n); }), off = h.dv.filter(function (d) { return d.off; }).length;
      var desc = h.thread ? t('threadDesc') : h.rx ? t('btHeard') : h.bt ? t('btDesc') : h.kind === 'hub' ? t('hubDesc') : h.kind === 'other' ? t('otherDesc') : t('intDesc');
      var route = h.own && !h.plain ? [t('device'), t('integration'), h.n, 'Home Assistant'] : h.plain ? [t('device'), h.n, 'Home Assistant'] : h.m === 'radio' ? [t('device'), this._coord || t('radio'), h.n, 'Home Assistant'] :
        h.kind === 'hub' ? [t('device'), h.n, h.thread ? this._intName(h.p) : h.sub, this._mname(h.m), 'Home Assistant'] : [t('device'), h.kind === 'other' ? t('integration') : h.n, this._mname(h.m), 'Home Assistant'];
      if (h.m === 'radio' && !h.own && this._mesh) desc += ' ' + t('meshNote');
      else if (h.thread && this._threadMeshOn) desc += ' ' + t('threadMeshNote');
      this._$('panel').innerHTML = '<div class="eyebrow" style="color:' + this._M[h.m] + '">' + esc(t(h.m)) + (h.kind === 'hub' ? ' · ' + esc(t('hub')) : '') + '</div><h2>' + esc(h.n) + '</h2>' + this._route(route) + '<p>' + esc(desc) + '</p>' +
        '<dl class="kv"><dt>' + esc(t('devices')) + '</dt><dd>' + h.dv.length + '</dd>' + (off ? '<dt>' + esc(t('offline')) + '</dt><dd class="off">' + off + '</dd>' : '') +
        (function () { var c = self._conn(h.trk); return c && c.via ? '<dt>' + esc(t('network')) + '</dt><dd>' + esc([c.via, self._ifaceText(c)].filter(Boolean).join(' · ')) + '</dd>' + (c.ip ? '<dt>' + esc(t('ip')) + '</dt><dd>' + esc(c.ip) + '</dd>' : '') : ''; })() + '</dl>' +
        (h.devId ? '<div class="list"><button class="item" id="hubdev"><i style="' + (h.off ? 'border:2px solid var(--cm-bad)' : 'background:' + this._M[h.m]) + '"></i><span class="nm">' + esc(h.n) + (h.mo ? ' · ' + esc(h.mo) : '') + '</span><small class="' + (h.off ? 'off' : '') + '">' + esc(h.off ? t('offline') : t('bridgeItself')) + '</small></button></div>' : '') +
        '<button class="btn" id="sort">' + esc(t(S.sort === 'name' ? 'sortName' : 'sortArea')) + '</button>' +
        '<div class="list">' + list.map(function (d) { return self._item(d); }).join('') + '</div><button class="btn" id="back">← ' + esc(t('back')) + '</button>';
      this._bind();
      var hd = this._$('panel').querySelector('#hubdev');
      if (hd) hd.onclick = function () { if (self._hass.demo) return; history.pushState(null, '', '/config/devices/device/' + h.devId); window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } })); };
      this._$('panel').querySelector('#sort').onclick = function () { S.sort = S.sort === 'name' ? 'area' : 'name'; self._selHub(h, true); };
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
      if (m === 'radio' && this._coord) {
        var ci = this._coordInfo;
        extra = '<p>' + esc(t('infraRadio')) + '</p>' + (ci ? '<dl class="kv">' + (ci.type ? '<dt>' + esc(t('coordinator')) + '</dt><dd>' + esc(ci.type) + '</dd>' : '') +
          (ci.fw ? '<dt>Firmware</dt><dd>' + esc(ci.fw) + '</dd>' : '') + (ci.port ? '<dt>Port</dt><dd style="word-break:break-all">' + esc(ci.port) + '</dd>' : '') + '</dl>' : '');
      }
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
        (d.also && d.also.length ? '<dt>' + esc(t('alsoAs')) + '</dt><dd>' + esc(d.also.map(function (o) { return o.as; }).filter(function (v, i, l) { return l.indexOf(v) === i; }).join(', ')) + '</dd>' : '') +
        (d.entity ? '<dt>' + esc(t('entity')) + '</dt><dd style="word-break:break-all">' + esc(d.entity) + '</dd>' : '') +
        '<dt>' + esc(t('status')) + '</dt><dd class="' + (d.off ? 'off' : '') + '" style="' + (d.recent ? 'color:var(--cm-recent);font-weight:600' : d.away ? 'color:var(--cm-away);font-weight:600' : '') + '">' + esc(d.dis ? t('disabledLong') : d.bare ? t('noEntities') : d.off ? t('offline') : d.recent ? t('recentLong') + ' ' + this._ago(d.seen) : d.remote ? t('remoteLong') : d.away ? t('awayLong') : t('online')) + '</dd>' +
        (d.meshParent && !d.ieee && !d.threadMesh ? '<dt>' + esc(t('parentDev')) + '</dt><dd>' + esc(d.meshParent.n) + '</dd>' : '') +
        (d.router != null && (d.ieee || d.threadRole) ? '<dt>' + esc(t('role')) + '</dt><dd>' + esc(d.threadLeader ? t('roleLeader') : d.router ? t('roleRouter') : t('roleEnd')) + '</dd>' : '') +
        (d.ieee && this._mesh ? '<dt>' + esc(t('connectedTo')) + '</dt><dd>' + esc(d.meshParent ? d.meshParent.n : (this._coord || t('coordinator'))) + '</dd>' : '') +
        (d.threadMesh && this._threadMeshOn ? '<dt>' + esc(t('connectedTo')) + '</dt><dd>' + esc(d.meshParent ? d.meshParent.n : (h.kind === 'hub' && h.thread ? h.n : h.otbr ? h.n : t('threadBr'))) + '</dd>' : '') +
        (d.lqi != null ? '<dt>' + esc(t('signal')) + '</dt><dd>' + d.lqi + ' / ' + (d.lqiMax || 255) + '</dd>' : '') +
        (d.rssi != null ? '<dt>' + esc(t('btSignal')) + '</dt><dd>' + esc(d.rssi) + ' dBm</dd>' : '') +
        (function () {
          var c = self._conn(d.trk), own = !!c; if (!c && h.kind === 'hub') c = self._conn(h.trk);
          if (!c || (!c.via && !c.ip && !c.ssid)) return '';
          var netTxt = [c.via, self._ifaceText(c), !c.via && c.ssid ? c.ssid : ''].filter(Boolean).join(' · ');
          return (netTxt ? '<dt>' + esc(t('network')) + '</dt><dd>' + esc((own ? '' : h.n + ' → ') + netTxt) + '</dd>' : '') + (own && c.ip ? '<dt>' + esc(t('ip')) + '</dt><dd>' + esc(c.ip) + '</dd>' : '');
        })() + '</dl>' +
        '<div class="eyebrow" style="color:var(--cm-muted)">' + esc(t('path')) + '</div>' + this._route(this._pathOf(d)) +
        '<button class="btn" id="open">' + esc(t(d.entity ? 'openEntity' : d.integration ? 'openIntegration' : 'open')) + '</button>' +
        (this._cfg.merge_duplicates === false || this._cfg.merge_duplicates === 'off' ? '' : '<button class="btn" id="mergeb">' + esc(t('mergeWith')) + '</button>' + (d.also && d.also.length ? '<button class="btn" id="splitb">' + esc(t('splitMerged')) + '</button>' : '')) + '<button class="btn" id="hubb">' + esc(t('seeAll')) + ' ' + esc(h.n) + '</button><button class="btn" id="back">← ' + esc(t('back')) + '</button>';
      this._bind();
      this._$('panel').querySelector('#open').onclick = function () {
        if (self._hass.demo) return;
        if (d.entity) { self.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: d.entity }, bubbles: true, composed: true })); return; }
        history.pushState(null, '', d.integration ? '/config/integrations/integration/' + d.integration : '/config/devices/device/' + d.id);
        window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
      };
      this._$('panel').querySelector('#hubb').onclick = function () { self._selHub(h); };
      var mb = this._$('panel').querySelector('#mergeb'), sb = this._$('panel').querySelector('#splitb');
      if (mb) mb.onclick = function () { self._mergeDialog(d); };
      if (sb) sb.onclick = function () {
        d.also.forEach(function (o) { self._ans.dup[[d.id, o.id].sort().join('|')] = false; });
        self._saveAnswers(); self._remodel(); var again = self._devs.filter(function (x) { return x.id === d.id; })[0]; if (again) self._selDev(again);
      };
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
      var hc = this._conn(this._haTrk);
      if (hc && hc.via) rows += '<dt>' + esc(t('network')) + '</dt><dd>' + esc([hc.via, this._ifaceText(hc)].filter(Boolean).join(' · ')) + '</dd>' + (hc.ip ? '<dt>' + esc(t('ip')) + '</dt><dd>' + esc(hc.ip) + '</dd>' : '');
      this._$('panel').innerHTML = '<div class="eyebrow" style="color:var(--cm-core)">' + esc(t('host')) + '</div><h2>Home Assistant</h2><p>' + esc(t('coreDesc')) + '</p><dl class="kv">' + rows + '</dl><button class="btn" id="back">← ' + esc(t('back')) + '</button>';
      this._bind();
    }
    _reset() { if (!this._S) return; this._S.sel = null; this._clear(); this._list(); }
  }

  // ---------------------------------------------------------------------------------------------------------------
  // Visual editor. Plain inputs, no Home Assistant components, so it does not depend on what the frontend has loaded.
  // A value equal to its default is removed from the configuration, to keep the YAML short.
  // Texts of the visual editor. Same rules as STR above.
  var ED = {
    en: {
      animations: 'Animations',
      auto: 'Automatic',
      away: 'Off the network',
      byArea: 'By area',
      byName: 'By name',
      cbare: 'No entities',
      cloud: 'Internet',
      colors: 'Colours',
      compact: 'Compact: one bubble per hub',
      computers: 'Desktop computers with the companion app (device names, separated by commas)',
      content: 'What is shown',
      coordinator_name: 'Name of the radio coordinator',
      core: 'Home Assistant',
      crecent: 'Seen recently',
      dashed: 'Dashed',
      demo: 'Demo installation',
      detailed: 'Detailed: every device is a dot',
      device_labels: 'Device names when zoomed in',
      devices_without_entities: 'Devices that have no entities',
      dotted: 'Dotted',
      dupAsk: 'Ask me',
      dupAuto: 'Draw it once',
      dupOff: 'Leave both',
      entities_without_device: 'Entities of device integrations that have no device',
      exclude_integrations: 'Hidden integrations (domains, separated by commas)',
      general: 'General',
      group_by_area: 'Group the devices of each hub by area',
      group_small: 'Group integrations with this many devices or fewer',
      height: 'Map height in pixels (0: automatic)',
      language: 'Language',
      layout: 'Map',
      lcloud: 'Internet links',
      lines: 'Lines',
      llocal: 'Cable links',
      local: 'Local network',
      lradio: 'Radio links',
      lwifi: 'Wi-Fi links',
      merge_duplicates: 'A device that looks set up twice',
      minimap: 'Overview map when the whole map is not in view',
      mqtt_entities: 'MQTT entities without a device',
      none: 'None (my installation)',
      offline: 'Offline',
      physical_only: 'Physical devices only (no accounts, services or loose sensors)',
      separate_services: 'Keep services apart from devices in the "Other" groups',
      radio: 'Local radio',
      recent_hours: 'Hours a silent battery device counts as seen recently (0: never)',
      reset: 'Default',
      main_router: 'Main router (device name or integration), when the card picks the wrong one',
      router_name: 'Name of the local network node',
      score: 'Home Assistant',
      sdevice: 'Devices',
      show_disabled: 'Devices disabled in Home Assistant, in grey',
      show_export: 'Button to save the map as an image',
      show_mesh: 'Zigbee and Thread mesh routes',
      show_panel: 'Side panel',
      show_trackers: 'Devices that only have a device tracker',
      shub: 'Hubs and integrations',
      sizes: 'Bubble sizes',
      snetwork: 'Network nodes (router, coordinator, internet)',
      solid: 'Solid',
      sort: 'Order of the lists',
      thread_via_border_router: 'Branch Thread devices under their border router (e.g. Apple TV)',
      title: 'Title',
      width: 'Line width',
      yaml: 'names, overrides, exclude_devices and z2m_base_topic are edited in YAML.'
    },
    es: {
      animations: 'Animaciones',
      auto: 'Automático',
      away: 'Fuera de la red',
      byArea: 'Por pieza',
      byName: 'Por nombre',
      cbare: 'Sin entidades',
      cloud: 'Internet',
      colors: 'Colores',
      compact: 'Compacto: una burbuja por hub',
      computers: 'Computadores de escritorio con la app (nombres de equipo, separados por comas)',
      content: 'Qué se muestra',
      coordinator_name: 'Nombre del coordinador de radio',
      core: 'Home Assistant',
      crecent: 'Visto hace poco',
      dashed: 'Segmentada',
      demo: 'Instalación de demostración',
      detailed: 'Detallado: cada equipo es un punto',
      device_labels: 'Nombres de los equipos al acercar',
      devices_without_entities: 'Dispositivos que no tienen entidades',
      dotted: 'Punteada',
      dupAsk: 'Preguntarme',
      dupAuto: 'Dibujarlo una vez',
      dupOff: 'Dejar ambos',
      entities_without_device: 'Entidades sin dispositivo de integraciones de equipos',
      exclude_integrations: 'Integraciones ocultas (dominios, separados por comas)',
      general: 'General',
      group_by_area: 'Agrupar por pieza los equipos de cada hub',
      group_small: 'Agrupar integraciones con esta cantidad de equipos o menos',
      height: 'Alto del mapa en píxeles (0: automático)',
      language: 'Idioma',
      layout: 'Mapa',
      lcloud: 'Enlaces por internet',
      lines: 'Líneas',
      llocal: 'Enlaces por cable',
      local: 'Red local',
      lradio: 'Enlaces por radio',
      lwifi: 'Enlaces Wi-Fi',
      merge_duplicates: 'Un equipo que parece estar dos veces',
      minimap: 'Mini-mapa cuando no se ve el mapa completo',
      mqtt_entities: 'Entidades MQTT sin dispositivo',
      none: 'Ninguna (mi instalación)',
      offline: 'Sin conexión',
      physical_only: 'Solo equipos físicos (sin cuentas, servicios ni sensores sueltos)',
      separate_services: 'Mantener los servicios aparte de los equipos en los grupos "Otros"',
      radio: 'Radio local',
      recent_hours: 'Horas en que un equipo a batería sin respuesta cuenta como visto hace poco (0: nunca)',
      reset: 'Por defecto',
      main_router: 'Router principal (nombre del equipo o integración), si la tarjeta elige mal',
      router_name: 'Nombre del nodo de red local',
      score: 'Home Assistant',
      sdevice: 'Equipos',
      show_disabled: 'Equipos desactivados en Home Assistant, en gris',
      show_export: 'Botón para guardar el mapa como imagen',
      show_mesh: 'Rutas de la malla Zigbee y Thread',
      show_panel: 'Panel lateral',
      show_trackers: 'Equipos que solo tienen device tracker',
      shub: 'Hubs e integraciones',
      sizes: 'Tamaño de las burbujas',
      snetwork: 'Nodos de red (router, coordinador, internet)',
      solid: 'Continua',
      sort: 'Orden de las listas',
      thread_via_border_router: 'Agrupar equipos Thread bajo su border router (p. ej., Apple TV)',
      title: 'Título',
      width: 'Grosor de línea',
      yaml: 'names, overrides, exclude_devices y z2m_base_topic se editan en YAML.'
    }
  };
  var LINE = ['solid', 'dashed', 'dotted'];
  var FIELDS = [
    { sec: 'general' }, { p: 'title', k: 'text' }, { p: 'language', k: 'select', o: [['', 'auto'], ['en', 'English'], ['es', 'Español']], d: '' },
    { p: 'layout', k: 'select', o: [['detailed', 'detailed'], ['compact', 'compact']], d: 'detailed' }, { p: 'height', k: 'number', min: 0, max: 2400, d: 0 }, { p: 'group_by_area', k: 'bool', d: false }, { p: 'sort', k: 'select', o: [['area', 'byArea'], ['name', 'byName']], d: 'area' }, { p: 'show_panel', k: 'bool', d: true }, { p: 'animations', k: 'bool', d: true },
    { p: 'minimap', k: 'bool', d: true }, { p: 'show_export', k: 'bool', d: true }, { p: 'device_labels', k: 'bool', d: true },
    { sec: 'colors' }, { p: 'colors.cloud', k: 'color', d: '#7c5cff', l: 'cloud' }, { p: 'colors.local', k: 'color', d: '#0b8a77', l: 'local' }, { p: 'colors.radio', k: 'color', d: '#b86e00', l: 'radio' },
    { p: 'colors.core', k: 'color', d: '#03a9f4', l: 'core' }, { p: 'colors.offline', k: 'color', d: '#db4437', l: 'offline' }, { p: 'colors.away', k: 'color', d: '#a86400', l: 'away' }, { p: 'colors.recent', k: 'color', d: '#d9a900', l: 'crecent' }, { p: 'colors.no_entities', k: 'color', d: '#9e9e9e', l: 'cbare' },
    { sec: 'lines' }, { p: 'lines.cloud', k: 'select', o: LINE, d: 'dashed', l: 'lcloud' }, { p: 'lines.local', k: 'select', o: LINE, d: 'solid', l: 'llocal' },
    { p: 'lines.wifi', k: 'select', o: LINE, d: 'dotted', l: 'lwifi' }, { p: 'lines.radio', k: 'select', o: LINE, d: 'solid', l: 'lradio' }, { p: 'lines.width', k: 'range', min: 0.5, max: 6, step: 0.5, d: 2, l: 'width' },
    { sec: 'sizes' }, { p: 'sizes.core', k: 'range', min: 20, max: 80, step: 1, d: 56, l: 'score' }, { p: 'sizes.network', k: 'range', min: 16, max: 40, step: 1, d: 28, l: 'snetwork' },
    { p: 'sizes.hub', k: 'range', min: 14, max: 34, step: 1, d: 22, l: 'shub' }, { p: 'sizes.device', k: 'range', min: 3, max: 9, step: 0.2, d: 6.2, l: 'sdevice' },
    { sec: 'content' }, { p: 'physical_only', k: 'bool', d: false }, { p: 'group_small', k: 'number', min: 0, max: 20, d: 1 }, { p: 'separate_services', k: 'bool', d: true }, { p: 'thread_via_border_router', k: 'bool', d: false }, { p: 'show_trackers', k: 'bool', d: false }, { p: 'show_disabled', k: 'bool', d: false }, { p: 'show_mesh', k: 'bool', d: true }, { p: 'entities_without_device', k: 'bool', d: true }, { p: 'devices_without_entities', k: 'bool', d: true }, { p: 'merge_duplicates', k: 'select', o: [['ask', 'dupAsk'], ['auto', 'dupAuto'], ['off', 'dupOff']], d: 'ask' }, { p: 'recent_hours', k: 'number', min: 0, max: 720, d: 24 },
    { p: 'exclude_integrations', k: 'list' }, { p: 'computers', k: 'list' }, { p: 'main_router', k: 'text' }, { p: 'router_name', k: 'text' }, { p: 'coordinator_name', k: 'text' },
    { p: 'demo', k: 'select', o: [['', 'none'], ['unifi', 'UniFi'], ['fritz', 'FRITZ!Box'], ['large', '350']], d: '' }
  ];
  var ECSS = ':host{display:block}details{border:1px solid var(--divider-color,rgba(0,0,0,.12));border-radius:10px;margin:0 0 10px;padding:0 12px}' +
    'summary{cursor:pointer;font-weight:600;padding:11px 0;color:var(--primary-text-color)}details[open] summary{border-bottom:1px solid var(--divider-color,rgba(0,0,0,.12));margin-bottom:6px}' +
    '.row{display:flex;align-items:center;gap:10px;padding:7px 0;color:var(--primary-text-color);font-size:14px}.row>span:first-child{flex:1 1 auto;min-width:0}' +
    'input[type=text],input[type=number],select{font:inherit;font-size:14px;padding:6px 8px;border-radius:8px;border:1px solid var(--divider-color,rgba(0,0,0,.25));background:var(--card-background-color,#fff);color:var(--primary-text-color);min-width:0;width:170px;box-sizing:border-box}' +
    'input[type=number]{width:80px}input[type=range]{width:140px}input[type=color]{width:42px;height:30px;padding:0;border:1px solid var(--divider-color,rgba(0,0,0,.25));border-radius:8px;background:none}' +
    'input[type=checkbox]{width:18px;height:18px}output{width:34px;text-align:right;font-variant-numeric:tabular-nums;color:var(--secondary-text-color)}' +
    'button{font:inherit;font-size:12px;padding:4px 8px;border-radius:8px;border:1px solid var(--divider-color,rgba(0,0,0,.25));background:none;color:var(--secondary-text-color);cursor:pointer}' +
    'button[disabled]{opacity:.35;cursor:default}p{font-size:12px;color:var(--secondary-text-color);margin:4px 0 12px}' +
    '@media (max-width:480px){.row{flex-wrap:wrap}.row>span:first-child{flex-basis:100%}}';
  class ConnectionMapCardEditor extends HTMLElement {
    setConfig(c) { this._c = JSON.parse(JSON.stringify(c || {})); this._sync(); }
    set hass(h) { var first = !this._hass; this._hass = h; if (first) this._sync(); }
    _t(k) { var l = String((this._c && this._c.language) || (this._hass && this._hass.language) || 'en').slice(0, 2); return (ED[l] || ED.en)[k] || ED.en[k] || k; }
    _get(p) { var o = this._c; p.split('.').forEach(function (k) { o = o == null ? undefined : o[k]; }); return o; }
    _set(p, v) {
      var ks = p.split('.'), c = JSON.parse(JSON.stringify(this._c));
      if (ks.length === 1) { if (v === undefined) delete c[ks[0]]; else c[ks[0]] = v; }
      else { var o = Object.assign({}, c[ks[0]]); if (v === undefined) delete o[ks[1]]; else o[ks[1]] = v; if (Object.keys(o).length) c[ks[0]] = o; else delete c[ks[0]]; }
      if (ks[0] === 'sizes') delete c.core_size; // the old switch is replaced by the size itself
      this._c = c;
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: c }, bubbles: true, composed: true }));
      this._sync();
    }
    _build() {
      var self = this, t = this._t.bind(this), root = this.attachShadow({ mode: 'open' }), html = '<style>' + ECSS + '</style>', open = false;
      FIELDS.forEach(function (f, i) {
        if (f.sec) { html += (open ? '</details>' : '') + '<details' + (f.sec === 'general' ? ' open' : '') + '><summary>' + esc(t(f.sec)) + '</summary>'; open = true; return; }
        var id = 'f' + i, lab = esc(t(f.l || f.p)), c = '';
        if (f.k === 'bool') c = '<input type="checkbox" id="' + id + '">';
        else if (f.k === 'select') c = '<select id="' + id + '">' + f.o.map(function (o) { var v = Array.isArray(o) ? o[0] : o, n = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(v) + '">' + esc(ED.en[n] ? t(n) : n) + '</option>'; }).join('') + '</select>';
        else if (f.k === 'color') c = '<input type="color" id="' + id + '"><button id="' + id + 'r">' + esc(t('reset')) + '</button>';
        else if (f.k === 'range') c = '<input type="range" id="' + id + '" min="' + f.min + '" max="' + f.max + '" step="' + f.step + '"><output id="' + id + 'o"></output><button id="' + id + 'r">' + esc(t('reset')) + '</button>';
        else if (f.k === 'number') c = '<input type="number" id="' + id + '" min="' + f.min + '" max="' + f.max + '">';
        else c = '<input type="text" id="' + id + '">';
        html += '<label class="row"><span>' + lab + '</span>' + c + '</label>';
      });
      root.innerHTML = html + '</details><p>' + esc(t('yaml')) + '</p>';
      FIELDS.forEach(function (f, i) {
        if (f.sec) return; var e = root.getElementById('f' + i), r = root.getElementById('f' + i + 'r');
        function val() {
          if (f.k === 'bool') return e.checked === f.d ? undefined : e.checked;
          if (f.k === 'list') { var a = e.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean); return a.length ? a : undefined; }
          if (f.k === 'range' || f.k === 'number') { var n = parseFloat(e.value); return isNaN(n) || n === f.d ? undefined : n; }
          if (f.k === 'color') return e.value;
          return e.value === '' || e.value === f.d ? undefined : e.value;
        }
        e.addEventListener(f.k === 'text' || f.k === 'list' ? 'change' : 'input', function () { self._set(f.p, val()); });
        if (r) r.addEventListener('click', function (ev) { ev.preventDefault(); self._set(f.p, undefined); });
      });
      this._built = true;
    }
    // show the configuration in the inputs; the one being edited is left alone
    _sync() {
      if (!this._c || !this._hass) return; if (!this._built) this._build();
      var self = this, root = this.shadowRoot, act = root.activeElement;
      FIELDS.forEach(function (f, i) {
        if (f.sec) return; var e = root.getElementById('f' + i), r = root.getElementById('f' + i + 'r'), o = root.getElementById('f' + i + 'o'), v = self._get(f.p);
        if (f.p === 'sizes.core' && v === undefined && self._c.core_size === 'compact') v = 28;
        if (f.p === 'merge_duplicates') v = v === false ? 'off' : v === true ? undefined : v;
        if (r) r.disabled = v === undefined;
        if (e !== act) {
          if (f.k === 'bool') e.checked = v === undefined ? f.d : !!v;
          else if (f.k === 'list') e.value = Array.isArray(v) ? v.join(', ') : '';
          else if (f.k === 'color') e.value = /^#[0-9a-f]{6}$/i.test(String(v)) ? v : f.d;
          else e.value = v === undefined || v === null ? (f.d === undefined ? '' : f.d) : v;
        }
        if (o) o.textContent = e.value;
      });
    }
  }
  if (!customElements.get('connection-map-card-editor')) customElements.define('connection-map-card-editor', ConnectionMapCardEditor);

  if (!customElements.get('connection-map-card')) customElements.define('connection-map-card', ConnectionMapCard);
  window.__connectionMapCardTexts = function () { return { card: STR, editor: ED }; }; // for the tests: every language must have the texts of English
  window.customCards = window.customCards || [];
  window.customCards.push({ type: 'connection-map-card', name: 'Connection Map Card', description: 'Shows how every device reaches Home Assistant: cloud, local network, hubs and local radio.', preview: false, documentationURL: 'https://github.com/Ctuna89/ha-connection-map-card' });
  console.info('%c CONNECTION-MAP-CARD %c v' + VERSION + ' ', 'color:#fff;background:#0f9f8a;font-weight:700', 'color:#0f9f8a;background:#fff');
})();
