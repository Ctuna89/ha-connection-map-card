# Connection Map Card

A Lovelace card that shows **how every device reaches Home Assistant**: through the cloud, over your local network (directly or through a hub such as a Hue Bridge, IKEA DIRIGERA or an Aqara hub), or over a local radio coordinator (Zigbee2MQTT, ZHA, Z-Wave).

Most network maps show one protocol at a time. This card draws all of them in one picture, so you can see at a glance which devices depend on the internet, which hub each one sits behind, and what is offline right now.

## Features

- **Zero configuration.** Hubs and bridges are detected from the device registry (`via_device`), and each integration is placed in the cloud or local group from its `iot_class`.
- **Your real infrastructure.** Routers and access points from router integrations (UniFi, FRITZ!Box, Huawei, TP-Link Omada, ASUSWRT, …) become the local network node, the Zigbee coordinator (Connect ZBT-1, SkyConnect, Yellow, …) becomes the radio node, and the centre shows the host (Home Assistant OS version, virtual machine or bare metal).
- **Wi-Fi or cable.** With a router integration that reports its clients (Huawei Mesh Router, UniFi, FRITZ!Box, …) every hub and device is attached to the access point it actually uses, with a solid line for Ethernet and a dotted line for Wi-Fi (2.4 / 5 GHz). Even Home Assistant's own link is shown.
- **Zigbee mesh (Zigbee2MQTT).** The card asks Zigbee2MQTT for its network map and shows which router (repeater) each device goes through, with its link quality (LQI).
- **Live status.** Offline devices (all entities `unavailable`) are outlined in red and listed in the side panel.
- **Click to explore.** Tap a device to see its full path, for example `Bedroom lamp → Hue Bridge → Philips Hue → Local network → Home Assistant`, and open its device page.
- **Filter and search** by connection type, area, name or model, or show only offline devices.
- **Zoom and pan** with the mouse wheel, by dragging, or with the buttons.
- Follows your Home Assistant theme, including dark mode.
- English and Spanish built in.

## Installation

### HACS (custom repository)

1. Open **HACS → ⋮ → Custom repositories**.
2. Add `https://github.com/Ctuna89/ha-connection-map-card` with type **Dashboard**.
3. Install **Connection Map Card** and reload your browser.

### Manual

1. Download `ha-connection-map-card.js` from the latest release.
2. Copy it to `config/www/`.
3. Add it as a dashboard resource: **Settings → Dashboards → ⋮ → Resources → Add**, URL `/local/ha-connection-map-card.js`, type **JavaScript module**.

## Usage

The card works best in a **panel** view, so it can use the full width:

```yaml
views:
  - title: Map
    path: map
    type: panel
    cards:
      - type: custom:connection-map-card
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | `Connection map` | Card title. |
| `group_small` | number | `1` | Integrations with this many devices or fewer (and no hub) are grouped into "Other cloud services" / "Other local devices". Use `0` to never group. |
| `exclude_integrations` | list | `[]` | Integration domains to hide, for example `[mobile_app, bambu_lab]`. |
| `exclude_devices` | list | `[]` | Device IDs to hide. |
| `show_trackers` | boolean | `false` | Show devices that only have `device_tracker` entities (for example, every phone and laptop your router reports). |
| `show_panel` | boolean | `true` | Show the side panel with the summary and details. |
| `colors` | map | | Override the colors: `cloud`, `local`, `radio`. |
| `show_mesh` | boolean | `true` | Load the Zigbee2MQTT network map to show routers/repeaters and link quality. |
| `z2m_base_topic` | string | `zigbee2mqtt` | Zigbee2MQTT MQTT base topic. |
| `router_name` | string | | Override the name shown for the local network node. |
| `coordinator_name` | string | | Override the name shown for the radio coordinator node. |
| `overrides` | map | `{}` | Force an integration into a group: `cloud`, `local` or `radio`. Example: `bambu_lab: cloud` for a printer that talks to Home Assistant through Bambu Cloud. |

```yaml
type: custom:connection-map-card
title: How my home is connected
group_small: 2
exclude_integrations:
  - mobile_app
colors:
  cloud: "#8b5cf6"
```

## How devices are classified

| Group | Rule |
| --- | --- |
| **Local radio** | The device belongs to a radio integration (ZHA, Z-Wave JS, deCONZ, Insteon, …) or is an MQTT device behind a Zigbee2MQTT bridge. |
| **Internet** | The integration's `iot_class` is `cloud_push` or `cloud_polling`. |
| **Local network** | Everything else (`local_push`, `local_polling`). |

A device is drawn behind a **hub** when it has a `via_device` and that parent device either has at least two children or looks like a bridge (few entities of its own). Virtual rooms and zones that some hubs expose (for example Hue rooms) are skipped.

Helpers and system integrations (template, group, Supervisor, Sun, Backup, HACS and similar) are ignored. Devices whose only entities are `update` entities are ignored as well.

### Network infrastructure

- **Router / Wi-Fi:** devices from router integrations are not drawn as dots. They become the local network node, and its panel lists every mesh node with its status.
- **Clients:** the router's `device_tracker` entities tell which access point each client uses (`connected_via`) and how (`interface_type`: LAN, 2.4 GHz, 5 GHz). Devices are matched to trackers by MAC address, by the IP in their configuration URL, or by name. Extra mesh nodes are drawn next to the main router, and a cloud device that is on your Wi-Fi shows that hop in its path too.
- **Coordinator:** a Connect ZBT-1 / SkyConnect / Yellow radio becomes the radio node.
- **Host:** on Home Assistant OS / Supervised installs the centre shows the OS version and whether it runs in a virtual machine (VirtualBox, Proxmox/KVM, Hyper-V, …) or on bare metal.
- **Zigbee mesh:** for Zigbee2MQTT the card requests the network map over MQTT (it publishes to `<base_topic>/bridge/request/networkmap`). Devices behind a router are drawn next to that router with a dashed orange line, and routers get an outer ring. Building the map can take a few seconds on large networks.

Host details and the Zigbee mesh need an admin user; for other users the card simply skips them.

The card reads the device and entity registries that the frontend already loads, so it works for non-admin users. The integration list used for cloud/local detection needs an admin user; for other users the card falls back to a built-in list of common cloud integrations.

## Contributing

Issues and pull requests are welcome. If a device ends up in the wrong group, open an issue with the integration name and, if possible, its `iot_class`.

## License

[MIT](LICENSE)
