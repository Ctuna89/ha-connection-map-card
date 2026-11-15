# Changelog

## Unreleased

### Added

- **Z-Wave controller.** The controller of a Z-Wave network (a USB stick, a Connect ZWA-2) is drawn as the hub of its nodes, named after the adapter, the way a Zigbee2MQTT bridge or a Hue Bridge is. Before, it was one more dot in the Z-Wave group.

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
