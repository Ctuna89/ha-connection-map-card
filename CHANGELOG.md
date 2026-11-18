# Changelog

## 0.8.6 — 2026-11-18

Five contributions by [@HaniKazmi](https://github.com/HaniKazmi): [#18](https://github.com/Ctuna89/ha-connection-map-card/pull/18), [#20](https://github.com/Ctuna89/ha-connection-map-card/pull/20), [#21](https://github.com/Ctuna89/ha-connection-map-card/pull/21), [#24](https://github.com/Ctuna89/ha-connection-map-card/pull/24) and [#25](https://github.com/Ctuna89/ha-connection-map-card/pull/25). Everything in this release is their work. Thank you.

### Added

- `height`: the height of the map, in pixels or as a CSS length (`520`, `'70vh'`). Also in the visual editor.
- "Refresh mesh routes" in the ⤓ menu, when there is a Zigbee or Thread mesh.
- `thread_via_border_router` (off by default), for homes where Thread arrives through a border router on the network (Apple TV 4K, HomePod, Nest Hub, eero) and not through a stick on Home Assistant. With `true` the border router is found on its own when there is only one candidate; a device name picks it by hand. The Thread devices are then drawn behind that device, on the local network, and it is not drawn a second time as a client.
- `show_label_warning` (on by default): set it to `false` to hide the notice about labels hidden at the current zoom. The other notices (errors, devices that could not be read, duplicates, access points not drawn) always show.
- Devices with the same name in different areas are told apart as "Area · Name" on the map and in the lists.

### Changed

- The Zigbee and Thread mesh is kept in the browser, so repeaters are in place on the first draw. Zigbee2MQTT is asked for a new network scan every 4 hours at most (it used to be on every load, and takes 5 to 45 seconds over the air), Thread every hour, and right away when a device that is not in the saved mesh shows up.
- Sections views: the card now has a height of 14 rows by default and fills it, and the height control of the layout tab works (it was locked to "fit height"). **If the card is in a sections view, its height may change after updating**: set the rows you want in the layout tab.
- Changing an option that needs no new data (such as `show_mesh` or `physical_only`) redraws the map without loading everything again.
- Helper and system integrations are recognised from what Home Assistant says about them, not only from a fixed list, and are left out of the map. Home Assistant Cloud stays.
- A device is linked to a router client by name only when the match is unique. A device that shared its name with another could be shown on the wrong access point; it now shows none unless its MAC or IP address matches.

### Fixed

- A physical device with helper entities attached (a template or calibration sensor on an ESPHome or Shelly device) could disappear from the map.
- `physical_only` hid MQTT devices such as those of Zigbee2MQTT, and a Proxmox host whose guests were all hidden.
- Zigbee2MQTT groups and Proxmox storage pools were drawn as devices.
- Two devices with the same name in different areas were suspected of being one device.

## 0.8.5 — 2026-11-17

### Added

- Devices disabled in Home Assistant ("Enable device" switched off) can be seen: choose "Disabled only" in the status list, or set `show_disabled: true` to keep them on the map. They are drawn as grey dotted rings in the group of their integration. Disabled routers and access points are left out.
- Devices with no entities (all of them disabled, or none created) are drawn in grey, with their own entry in the legend, instead of looking like any device that is online. `colors: { no_entities: ... }` changes the colour, also in the visual editor.

### Changed

- The "Offline only" button is now a list: all devices, offline only, devices with no entities only, or disabled devices only. `devices_without_entities: false` still hides those for good.

## 0.8.4 — 2026-11-17

UniFi, by [@HaniKazmi](https://github.com/HaniKazmi) in [#12](https://github.com/Ctuna89/ha-connection-map-card/pull/12), tested on a Cloud Gateway Max, a USW Flex Mini and a U7 Pro XG. Thank you again.

### Added

- Network switches are drawn as `SW` nodes instead of `AP`, with their own description.
- UniFi Network: wired clients are placed behind their switch (`sw_mac`), with the port and the link speed. Switches and access points show their uplink when the uplink sensors are enabled.
- UniFi Insights (`unifi_insights`, HACS): the gateway, switches, access points and clients are read from its topology, so the map works without `device_tracker` entities. Needs that integration; details of the clients are kept in the browser so they are asked only once.
- The port and the link speed of a wired connection are shown wherever the connection is described.

### Fixed

- UniFi: clients were drawn as access points when their tracker was disabled (an entry with no entities, kept since 0.8.1) or when they had a "block" switch. So were Wi-Fi networks and firewall rules. Only gateways, switches and access points are network nodes now; other router integrations are not affected.
- A device registered by both UniFi Network and UniFi Insights is drawn once.
- A switch is never picked as the main router.

## 0.8.3 — 2026-11-17

Thread gets its own mesh. Everything in this release was contributed by [@HaniKazmi](https://github.com/HaniKazmi) in [#11](https://github.com/Ctuna89/ha-connection-map-card/pull/11). Thank you for the careful work.

### Added

- Thread mesh: with `show_mesh`, Matter devices on Thread are drawn behind the Thread router that repeats for them, with dashed links, the role of each one (leader, router, end device), the repeaters in the path to Home Assistant, and signal (RSSI and LQI). It comes from the Matter network diagnostics that Home Assistant already keeps; it needs an admin user.
- Matter devices on Wi-Fi are matched with the client the router reports (by MAC or IP), so they show their access point.

### Changed

- Thread devices are placed in the Thread group on the first draw, from their Thread entities and the Thread dataset, instead of asking each device: battery sensors that sleep are no longer woken up, which took 5 to 20 seconds each.
- Bluetooth and Matter details load side by side; one no longer waits for the other.

## 0.8.2 — 2026-11-17

### Added

- Desktop computers that run the companion app are drawn in a "Computers" group, not under "Mobile devices". iMac, Mac mini, Mac Pro and Macs that report no battery are recognised on their own; for anything else, list the device names in `computers` (YAML or the visual editor). `names: { computers: ... }` renames the group.

## 0.8.1 — 2026-11-16

### Added

- `separate_services` (default `true`). Set it to `false` to fold small integrations of services and of physical devices into one "Other …" group per side, as before 0.7.4, for a map with fewer nodes.
- Sagemcom F@st gateways (`sagemcom_fast`, the HACS integration for Bell, Sky and other providers' boxes) are recognised as routers: the gateway is drawn as the network node, its clients show cable or Wi-Fi, and the clients it lists are not mistaken for devices of the home ([#10](https://github.com/Ctuna89/ha-connection-map-card/issues/10)).
- `main_router`: the device name or the integration of the main router, for when the card picks the wrong one. Also in the visual editor.

### Fixed

- With two routers, the main one was chosen by its name alone, so a second router called "… Router" won over the provider's gateway. A router that is itself a client of another router is no longer picked as the main one.
- A router or gateway with no entities was left out of the map.

## 0.8.0 — 2026-11-16

The release that prepares 1.0: nothing is merged on a guess any more, and the card explains itself when something goes wrong.

### Added

- **Is this one device?** Two entries that only look alike (same name and maker, or the companion app on a device with the same name) are no longer merged on the card's own judgement. A notice under the map opens a question that shows both side by side; the answer is remembered for your Home Assistant user, on every browser, and can be asked again from the ⤓ menu. Entries the router knows by the same address are still merged without asking. `merge_duplicates` takes `ask` (default), `auto` or `off`.
- **Merge and split by hand.** The panel of a device has *Merge with another device…*, for the same device set up twice under names the card would never connect, and *Split merged devices*, which also undoes a merge the card made on its own. Both are remembered like the answers to the question.
- **Copy diagnostics**, in the ⤓ menu: what the card found and how it classified each group, with no names, addresses or entity IDs. Meant to be pasted in an issue.
- **A safety net.** If the map cannot be built from an unexpected piece of data, the card says so under the map and keeps the last map that worked, instead of going blank. A single device that cannot be read is left out, counted in the notice, and listed in the diagnostics.
- **Option names are stable from 1.0.** Options that were replaced keep working and are reported in the browser console, as are options the card does not know.

### Changed

- `merge_duplicates` now asks by default. Set `merge_duplicates: auto` for the behaviour of 0.7.x.
- Replaced options: `core_size: compact` → `sizes: { core: 28 }`; `mqtt_entities: false` → `entities_without_device: false`. Both keep working.
- The texts of the card and of the editor are one per line, in the same order in every language, with a test that fails when a language is missing one. See *Translating* in the README.
- README rewritten: how to use the map, options grouped by purpose, what needs an admin user, what to do when something looks wrong, and a new screenshot.

### Upgrading from 0.7.x

Devices that 0.7.x merged because of their name show up as two dots again, with a notice under the map asking whether they are one device. Answer once, or set `merge_duplicates: auto` to keep the old behaviour.

### Not verified on real hardware

The question, merging by hand and the diagnostics were tested with simulated installations and a simulated Home Assistant for storing the answers. If storing them with the user is not available, they are kept in the browser only.

## 0.7.5 — 2026-11-16

### Added

- **Physical devices only.** A "Physical only" button next to "Offline only", and the option `physical_only`, leave out accounts, online services and the loose sensors of an integration, so the map shows only things you could put your hand on. The counters and the groups are recalculated, and a group left empty disappears.

### Changed

- On a phone, the area selector takes a row of its own, and the two filter buttons share the next one.

### Limits

- What counts as a service is how each integration declares itself. A custom integration that does not say it is a service stays on the map in this mode.

### Not verified on real hardware

Tested with a simulated installation of accounts, services, devices and loose sensors, not on a real one.

## 0.7.4 — 2026-11-16

### Fixed

- **Mobile devices on the wrong access point.** All mobile devices were drawn on the main router, whatever access point they were on. Each one is now drawn on the access point it is on right now, in a "Mobile devices" group of its own per access point, and the map follows it when it roams to another one, comes home or leaves.
- **Services mixed with physical devices.** Small integrations folded into "Other cloud services" mixed accounts and APIs (Spotify, a translation service) with things in the house that report through their maker's cloud (an air conditioner, a litter box). They are folded separately now: services into "Other cloud services", devices into "Other cloud devices"; the same for local ones.
- **Groups of two or three devices lost.** Services no longer count towards a crowded map. Since 0.7.1 they pushed homes over the limit where groups of two or three devices get folded too, so a pair of air conditioners lost its own group.
- **The same device drawn twice.** A device seen through two integrations of one maker (a TV through its local integration and through SmartThings) is merged when the names match, give or take a model in brackets, and the makers agree. The local entry stays, and its panel says what else it is set up as.

### Limits

- A mobile device is placed by the client the router integration reports, matched to the device by name. If the names do not match, it stays on the main router.
- A service is recognised by how its integration declares itself. A custom integration that does not say it is a service is treated as a device.

### Not verified on real hardware

Built from reports with screenshots of one installation (Huawei mesh, Samsung TV with SmartThings, Tuya, Hisense) and tested with simulated copies of each case, not on the installation itself.

## 0.7.3 — 2026-11-15

### Fixed

- A Connect ZBT / SkyConnect stick was always taken as the Zigbee coordinator. The same stick can run Thread instead, and the device registry does not say which. It is now drawn as the **Thread border router** when OpenThread Border Router is set up and no Zigbee stack uses the stick (Zigbee2MQTT reports another adapter, or there is no Zigbee at all): the Thread group is named after it, and Zigbee hangs from its real coordinator.
- A network Zigbee coordinator (SLZB-06 and the like) is named after the device Home Assistant knows at its address, instead of "Network coordinator (IP)".
- When Zigbee2MQTT reports an adapter other than the stick, the stick is no longer shown as its coordinator, with or without Thread.
- A bridge could be shown as offline, with a red ring, when its own entities had no state at all (disabled entities). Offline now means its entities report unavailable; the same rule applies to every device.
- `group_by_area` did nothing in a group that had a power strip in it (TP-Link). Its single devices are grouped by area now, and each strip keeps its outlets next to it.

### Limits

- With ZHA and OpenThread Border Router both set up, the card cannot tell what the stick does and keeps it as the Zigbee coordinator. `coordinator_name` corrects the name by hand.
- Knowing which adapter Zigbee2MQTT uses needs an admin user.

### Not verified on real hardware

Built from a report of a home with a Connect ZBT-2 running OpenThread Border Router, Zigbee2MQTT on an SLZB-06 and Z-Wave on a Connect ZWA-2, and tested with a simulated copy of it. Not run on that installation yet.

## 0.7.2 — 2026-11-15

Three additions that came out of the reports on 0.7.1.

### Added

- **Z-Wave controller.** The controller of a Z-Wave network (a USB stick, a Connect ZWA-2) is drawn as the hub of its nodes, named after the adapter, the way a Zigbee2MQTT bridge or a Hue Bridge is. Before, it was one more dot in the Z-Wave group. The controller is recognised as node 1 of the network.
- **The bridge itself.** The panel of a hub lists the bridge as a device of its own, with its model and a link to its device page. A bridge whose own entities are all unavailable is shown as offline, with a red ring.
- **Group by area** (`group_by_area`, off by default): inside each hub, the devices of an area with more than one device hang from a small area node, hub → area → devices. Clicking the node filters the map to that area. A Zigbee mesh keeps its own shape instead. With this on, a hub with many areas takes more room on the map, and an area name is only drawn where it fits.

### Confirmed on real hardware

A user checked 0.7.1 against their installation: the TP-Link EP40 and its outlets, Lutron Pico remotes, Tuya locks, Obihai and a custom integration without devices all show up as intended.

### Not verified on real hardware

The three additions above were tested with simulated installations. The Z-Wave controller was built from a report of a Connect ZWA-2 that is node 1 of its network, but not run on it yet.

## 0.7.1 — 2026-11-15

Fixes from the reports that followed 0.7.0, most of them from one very thorough comparison of a real installation against the map.

### Added

- **Devices without entities** are drawn: a remote that only sends events (Lutron Pico), a lock its integration cannot control (Tuya). Their panel says they have no entities, and they are never reported offline (`devices_without_entities`).
- **Entities without a device**, for any integration that talks to devices or hubs and not only MQTT (Obihai, some custom integrations): each thing you can operate (light, switch, lock, …) is a dot, and the integration's plain sensors are one dot. Needs an admin user, since it relies on the integration list (`entities_without_device`).
- Two more rules, checked by the tests: **dots never sit on top of each other**, and **a group's own link reaches its bubble without running over its dots**.

### Fixed

- The outlets of a power strip, and the devices behind a Zigbee router in small meshes, could be drawn on top of neighbouring dots and of the group's bubble. A device with children now sits on a ring with its children on the next ring out, inside its own slice of the circle.
- The link of a group ran between its dots, and under some of them. Every group now keeps a free lane, turned towards its link.
- A two-outlet plug whose own entry has no entities (TP-Link EP40) was left as a separate hub instead of being drawn inside its integration's group.
- A device set up through several integrations was drawn once per integration, for example an Android TV through its own integration and through the companion app, or a phone known to two integrations. They are now one dot, and the panel says what else the device is set up as (`merge_duplicates`).
- In a home with many integrations, small groups are folded into "Other ..." to keep the map readable. That also swallowed Z-Wave (shown as "Other radio devices") and the phones (lost inside "Other local devices"). Radio integrations and mobile devices now always keep their own group.
- A phone whose companion app only has its device tracker enabled was not drawn at all.
- The path of a Z-Wave, EnOcean or 433 MHz device no longer goes through the Zigbee coordinator, and those groups link straight to Home Assistant when the radio node is a Zigbee coordinator.

### Not verified on real hardware

As with 0.7.0, this was tested with simulated installations built from the reports, not on the hardware itself. In particular: the TP-Link EP40, Lutron Pico remotes, Tuya locks, Obihai, and the merging of duplicated Android devices. Reports are welcome.

## 0.7.0 — 2026-11-15

This release starts from the feedback in the r/homeassistant thread and adds rules the map must keep, with a test suite to hold them.

### Rules of the map

- **Links never cross.** Two links never cross each other, and a link never runs over a bubble that is not one of its ends. Hubs on the main router sit in the middle of the local sector, each access point's hubs stay together at the sides, and no sector is wider than 240°. The layout checks itself: an access point with no clean place is left off the map and its hubs hang from the router.
- **Labels never overlap.** A label is never drawn over a bubble, over another label, or under the map's buttons. It moves to a free side of its node, drops its subtitle, or hides until zooming in makes room.
- **Nothing is left out silently.** A strip under the map says how many access points are not drawn and how many labels are hidden, with shortcuts to the router's panel and to zoom in. The router's panel marks the access points that are not drawn.
- **The free space is used.** With a single group (for example a home with only its local network) that group's node sits at the centre and Home Assistant moves to the side. Access points without hubs of their own are placed in whatever free space is left. Up to 12 access points are considered, instead of 6.

### Added

- **Visual editor** with a live preview: colours, line styles and width, bubble size per level, and what is shown.
- **Hover focus.** Pointing at a device, hub or network node enlarges it, keeps its whole path to Home Assistant bright and fades the rest. Tooltips have a second line (area, integration, counts, status). Rows in the side panel highlight their device or hub on the map. Network nodes and Home Assistant can be reached with the keyboard.
- **Device names** next to the dots when zoomed in far enough (`device_labels`).
- **Overview map** in the corner while part of the map is out of view; click or drag on it to move (`minimap`).
- **Compact map**: one bubble per hub or integration with its number of devices and a red counter for the ones offline. Set `layout: compact` or use the ◎ button on the map.
- **Save as an image**: the ⤓ button saves the view as a PNG, with or without names. Without names, hubs, routers, access points and devices are numbered, and the version, host and Thread network name are left out (`show_export`).
- **Bluetooth.** Devices registered by a Bluetooth address go to their own group in local radio instead of hanging from the router. For an admin user they are drawn behind the adapter or proxy that hears them best (for example an ESP32 running ESPHome), with their RSSI, and the path continues through the proxy's own Wi-Fi link.
- **Thread.** Matter devices whose diagnostics report Thread get their own group in local radio.
- **Seen recently.** A battery device that stopped answering less than 24 hours ago is shown in yellow, with how long ago, instead of offline (`recent_hours`).
- **MQTT entities without a device**, the ones written by hand in YAML, are drawn as one dot each; tapping one opens the entity (`mqtt_entities`).
- **NETGEAR / Orbi**: the access point, link type and SSID of each client are read from its sensors.
- **Mobile devices** on mobile data, or away from the home network, are shown reaching Home Assistant over the internet.
- New options: `sort`, `core_size`, `lines`, `sizes`, `layout`, `minimap`, `device_labels`, `show_export`, `recent_hours`, `mqtt_entities`. `colors` also accepts `core`, `offline`, `recent` and `away`.
- **Tests.** `npm test` loads the card in a headless browser and checks the rules above on the demo installations and on 150 random ones, plus the grouping, the new state, the export and the editor. A GitHub Actions workflow runs them on every push.

### Changed

- The companion app group is called **Mobile devices** instead of "Phones", since it also holds tablets and watches.
- Devices in the "Other cloud services" / "Other local devices" groups show their integration instead of the group's name.
- The list of a hub can be sorted by area or by name, with a button in the panel.
- A parent that is just another device of the same integration, such as a power strip and its outlets, is drawn inside its integration's group instead of as a separate hub.
- When the radio node is a Zigbee coordinator, Bluetooth and Thread groups link straight to Home Assistant, and the coordinator sits in front of its own hubs.
- Changes to look-only options are applied by drawing again, without rebuilding the model.
- README: steps to add the card from the UI, HACS / Marketplace, and how to run the tests.

### Fixed

- Changing the configuration of a card that was already loaded left it without reloading.
- A device that is "via" a router was drawn as if the router were its hub.
- With NETGEAR, every client known only to the router was treated as a network node.

### Not verified on real hardware

Everything in this release was tested with the demo installations and simulated data. Still to confirm on a real Home Assistant: the visual editor inside the card dialog, Bluetooth receivers and Thread (they depend on live answers from the server), NETGEAR / Orbi, and saving the image from the mobile app. Reports are welcome.
