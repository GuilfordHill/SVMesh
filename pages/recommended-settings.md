---
title: "Recommended Settings"
subtitle: ""
heroImage: "tbeam.jpg"
attributionUrl: "https://meshtastic.org/"
---

# Recommended Settings

The Susquehanna Valley Mesh is currently running on the default `LongFast` LoRa preset, so no further channel configuration is required to connect to the mesh. This will change in the near future, as we are experiencing high channel utilization and other congestion issues on the current preset. Join us on our [socials](/socials) to be notified when we start a migration to a new preset.

Alongside our upcoming preset migration, Susquehanna Valley Mesh will start distributing recommended ignore lists for nodes that are spamming the mesh. We will repeatedly attempt to reach out to the node(s) before adding them to the list. With the mesh growing at the rate it is, and the limited bandwidth available on these radio bands, it is imperative that we lower transmit time as much as possible.

## Role Settings

There is an excellent write-up on our [Knowledgebase](/knowledgebase/the-architecture-of-svmesh) that details how you should decide what role your node can fill. Out of all of the settings on this page, it is most important that you set the correct role for your device to preserve mesh health.

::info[TL;DR]

- If your node is portable, indoors, or on a vehicle, use `CLIENT_MUTE`.
- If your node is mounted above roof-level outdoors, use `CLIENT_BASE`.
- If your node is on a mountaintop or radio tower, coordinate with the community to see if it is suitable for `ROUTER`.
  ::info

## Broadcast Interval Settings

In order to maintain a healthy mesh network, we recommend the following configuration settings for your nodes. These settings are comprehensive, and are developed to lower channel utilization by reducing unnecessary transmits. They are based on the collective experience of the Susquehanna Valley Mesh community and are subject to change as the mesh grows and evolves. We will announce new recommended settings on our socials when they go live.

We highly recommend following these recommended settings, as 75% of traffic on the SVmesh network is low-importance telemetry. The more nodes that follow these guidelines, the more stable our mesh will be.

### Device

| Option                      | Recommended Config | Notes                                                                      |
| --------------------------- | ------------------ | -------------------------------------------------------------------------- |
| NodeInfo broadcast interval | `14400` (4 hours)  | 2 hours should be absolute minimum. Fine to do less for temporary testing. |

### Position

| Option                      | Recommended Config   | Notes                                           |
| --------------------------- | -------------------- | ----------------------------------------------- |
| Smart position enabled      | `True`               |                                                 |
| Position broadcast interval | `14400` (4 hour)     | 1 hour is fine for handheld.                    |
| GPS update interval         | `1800` (30 minutes)  |                                                 |
| Position flags              | Disable unused flags | Fixed nodes should disable almost all of these. |

### LoRa

| Option         | Recommended Config | Notes                                               |
| -------------- | ------------------ | --------------------------------------------------- |
| Modem Preset   | LONG_FAST          | Will change in the near future                      |
| ^^Hop limit^^  | `5`                | Please do not set this higher than `6`. :pray:      |
| Frequency Slot | 20                 | This is the default, can also set to `0`            |
| Ignore MQTT    | `True`             | This is enabled on most `ROUTER` nodes in our mesh. |
| OK to MQTT     | `True`             | Enable to show up on online tools. Disable to not.  |

### Telemetry Module

Please only enable on solar or outside enclosure nodes where health data is useful.

| Option                              | Recommended Config | Notes                                                      |
| ----------------------------------- | ------------------ | ---------------------------------------------------------- |
| Device metrics update interval      | `7200` (2 hour)    | Change to `1800` when testing new nodes.                   |
| Environment metrics update interval | `7200` (2 hour)    |                                                            |
| Power metrics module enabled        | `False`            | This is for I²C power monitors, not onboard battery stats. |

Please disable the `Environment metrics` / `Air Quality metrics` modules if you are not using the data.
If you are using a science node and need to send a lot of environmental data, please avoid using the main mesh frequency. You may wish to coordinate with SVM for coverage.

### Neighbor Info

| Option                | Recommended Config |
| --------------------- | ------------------ |
| Neighbor Info enabled | `False`            |

Neighbor Info's functionality has been greatly limited in newer firmware versions. We recommend disabling it for most deployments.

If you have any questions, feel free to connect with us on our [socials](/socials) and ask for help! The more we work together, the better the mesh for all of us in the Valley.
