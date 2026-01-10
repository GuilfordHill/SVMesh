---
title: "Recommended Settings"
subtitle: ""
heroImage: "tbeam.jpg"
attributionUrl: "https://meshtastic.org/"
---

# Recommended Settings

The Susquehanna Valley Mesh is currently operating on the default `LongFast` LoRa preset, so no additional channel configuration is required to connect at this time. This will change in the near future, as we are experiencing increased channel utilization and congestion on the current preset. Join us on our [socials](/socials) to stay informed as we begin planning and executing a migration to a new preset.

## Role Settings

Our [Knowledgebase](/knowledgebase/the-architecture-of-svmesh) contains a detailed explanation of node roles and how to determine which role best fits your deployment. Of all the settings listed on this page, selecting the correct role for your node is the most important step you can take to preserve overall mesh health.

::info[TL;DR]

- If your node is portable, indoors, or vehicle-mounted, use `CLIENT_MUTE`.
- If your node is installed outdoors above roof level, use `CLIENT_BASE`.
- If your node is mounted on a mountaintop or radio tower, coordinate with the community to determine whether it is suitable for `ROUTER`.

::info

## Broadcast Interval Settings

To maintain a healthy and usable mesh network, we recommend the following configuration settings for all nodes. This section covers settings that affect how frequently your node broadcasts telemetry data. These recommendations are designed to reduce channel utilization by minimizing unnecessary transmissions.

The values listed below are based on the collective experience of the Susquehanna Valley Mesh community and may change as the mesh continues to grow and evolve. Any updates to these recommendations will be announced on our socials.

We strongly encourage adherence to these settings. Approximately 75% of traffic on the SVmesh network consists of low-importance telemetry. The more nodes that follow these guidelines, the more stable and responsive the mesh will be for everyone.

### Device

| Option                      | Recommended Config | Notes                                                                                                      |
| --------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| NodeInfo broadcast interval | `14400` (4 hours)  | 2 hours should be considered the absolute minimum. Shorter intervals are acceptable for temporary testing. |

### Position

| Option                      | Recommended Config   | Notes                                           |
| --------------------------- | -------------------- | ----------------------------------------------- |
| Smart position enabled      | `True`               |                                                 |
| Position broadcast interval | `14400` (4 hours)    | 1 hour is acceptable for handheld nodes.        |
| GPS update interval         | `1800` (30 minutes)  |                                                 |
| Position flags              | Disable unused flags | Fixed nodes should disable most position flags. |

### LoRa

| Option         | Recommended Config | Notes                                                             |
| -------------- | ------------------ | ----------------------------------------------------------------- |
| Modem Preset   | `LONG_FAST`        | Will change in the near future                                    |
| Hop limit      | `5`                | Do not set higher than `6`.                                       |
| Frequency Slot | `20`               | Default value. Can also be set to `0`.                            |
| Ignore MQTT    | `True`             | Prevents MQTT saturation. Only disable if using a private broker. |
| OK to MQTT     | `True`             | Enable to appear on online tools. Disable to hide.                |

### Telemetry Modules

Only enable telemetry modules on solar-powered nodes or outdoor enclosures where health and environmental data is useful.

| Option                              | Recommended Config | Notes                                                      |
| ----------------------------------- | ------------------ | ---------------------------------------------------------- |
| Device metrics update interval      | `7200` (2 hours)   | Reduce to `1800` when testing new nodes.                   |
| Environment metrics update interval | `7200` (2 hours)   |                                                            |
| Power metrics module enabled        | `False`            | Intended for I²C power monitors, not onboard battery data. |

Please disable the `Environment metrics` and `Air Quality metrics` modules if you are not actively using the data they provide. If you operate a science node that needs to transmit frequent environmental measurements, avoid using the primary mesh frequency. Coordinate with the community to ensure appropriate coverage and channel planning in your operating area.

### Neighbor Info

| Option                | Recommended Config |
| --------------------- | ------------------ |
| Neighbor Info enabled | `False`            |

The Neighbor Info module has been significantly limited in newer firmware releases. For most deployments, we recommend disabling it entirely.

## Ignore List
The Susquehanna Valley Mesh maintains a [recommended ignore list](/knowledgebase/ignore-list) for nodes that are excessively transmitting on the mesh. We make repeated attempts to contact the owner of any node before adding it to the list. We highly recommend ignoring any nodes in your node database(s) that appear on the list. With the mesh growing at its current pace and the limited bandwidth available on these radio bands, it is critical that we reduce unnecessary transmit time wherever possible.

If you have any questions or need help configuring your node, connect with us on our [socials](/socials). The more we collaborate and follow shared guidelines, the stronger and more reliable the mesh becomes for everyone in the Valley.
