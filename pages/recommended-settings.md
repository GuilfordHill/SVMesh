---
title: "Recommended Settings"
subtitle: ""
heroImage: "tbeam.jpg"
attributionUrl: "https://meshtastic.org/"
---

# Recommended Settings

The Susquehanna Valley Mesh is currently running on the default `LongFast` LoRa preset, so no further channel configuration is required to connect to the mesh. This will change in the near future, as we are experiencing high channel utilization and other congestion issues on the current preset. Join us on our [socials](/socials) to be notified when we start a migration to a new preset.

# Recommended Configuration Settings

In order to maintain a healthy mesh network, we recommend the following configuration settings for your Meshtastic devices.

These settings are intended to facilitate a stable and reliable mesh network. They are based on the collective experience of the Susquehanna Valley Mesh community and are subject to change as the mesh grows and evolves.

## Radio configuration

Starting with our upcoming preset migration, Susquehanna Valley Mesh will distribute recommended quarantine lists for nodes that are spamming the mesh. We will repeatedly attempt to reach out to the node(s) before adding to the list. Currently 75% of traffic is telemetry, position, and other data packets. With the mesh growing at the rate it is, and the limited bandwidth available on these radio bands, it is imperative that we lower transmit time as much as possible.

### Device

Your handheld node's role should be CLIENT or CLIENT_MUTE. If you have any doubts, use one of these.
If you don't think your client will help out the mesh's coverage or is on a vehicle, use CLIENT_MUTE.

If your node is on a mountain or tower, you can consider using the ROUTER role. However, even if this is true, you should still avoid ROUTER if:

- You are within five miles of another node using ROUTER.
- You can see more than five ROUTER nodes within 2-3 hops.

If your node is on a tall building (4+ stories), use role ROUTER_LATE.
If your node is outside your house, use role CLIENT_BASE, and make sure to favorite your daily carry node on this node as well to benefit from zero-hop forwarding.

|                      Option | Recommended Config | Notes                                                                      |
| --------------------------: | :----------------- | :------------------------------------------------------------------------- |
| NodeInfo broadcast interval | `14400` (4 hours)  | 2 hours should be absolute minimum. Fine to do less for temporary testing. |

### Position

|                      Option | Recommended Config   | Notes                                           |
| --------------------------: | :------------------- | :---------------------------------------------- |
|      Smart position enabled | `True`               |                                                 |
| Position broadcast interval | `14400` (4 hour)     | 1 hour is fine for handheld.                    |
|         GPS update interval | `1800` (30 minutes)  |                                                 |
|              Position flags | Disable unused flags | Fixed nodes should disable almost all of these. |

### LoRa

|         Option | Recommended Config | Notes                                               |
| -------------: | :----------------- | :-------------------------------------------------- |
|   Modem Preset | MEDIUM_FAST        | This is the new fast network                        |
|  ^^Hop limit^^ | `5`                | Please do not set this higher than `6`. :pray:      |
| Frequency Slot | 45                 | This is the default. It equates to 913.125 MHz      |
|    Ignore MQTT | `True`             | This is enabled on most `ROUTER` nodes in our mesh. |
|     OK to MQTT | `True`             | Enable to show up on online tools. Disable to not.  |

## Module configuration

### Telemetry

Please only enable on solar or outside enclosure nodes where health data is useful.

|                              Option | Recommended Config | Notes                                                      |
| ----------------------------------: | :----------------- | :--------------------------------------------------------- |
|      Device metrics update interval | `7200` (2 hour)    | Change to `1800` when testing new nodes.                   |
| Environment metrics update interval | `7200` (2 hour)    |                                                            |
|        Power metrics module enabled | `False`            | This is for I²C power monitors, not onboard battery stats. |

Please disable the `Environment metrics` / `Air Quality metrics` modules if you are not using the data.
If you are using a science node and need to send a lot of environmental data, please avoid using the main mesh frequency. You may wish to coordinate with SVM for coverage.

### Neighbor Info

|                Option | Recommended Config |
| --------------------: | :----------------- |
| Neighbor Info enabled | `False`            |

Neighbor Info's functionality has been greatly limited in newer firmware versions. We recommend disabling it for most deployments.
