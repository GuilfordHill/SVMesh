---
title: "Channel Settings"
subtitle: ""
heroImage: "tbeam.jpg"
attributionUrl: "https://meshtastic.org/"
---


# Channel Settings

The Susquehanna Valley Mesh uses MediumFast to improve performance across our network. This page includes radio settings to get connected to our mesh, as well as our recommended telemetry settings to lower bandwidth usage and further improve reliability.

## QR Settings

INSERT_QR_HERE

::info[QR Code Settings]
This QR code will set the following settings:

- MediumFast LoRa modem preset with frequency slot of 45

- Hop limit to 5

- `MediumFast` as primary channel (0) with default PSK of `AQ==`

- `LongFast` as secondary channel (1) with default PSK of `AQ==`

This will NOT change your node's network role (Client, Client_Mute, etc.)
::info


## Mobile App Manual Migration

To migrate to MediumFast using the app, you'll want to do the following:

1. Navigate to your node's settings and click on `LoRa`
   - Ensure `Use Modem Preset` is set to `True`
   - Set the `Modem Preset` to `MediumFast`
   - Set your `Hop Limit` to `5`
   - Set your `Frequency Slot` to `45`
   - Set `Ignore MQTT` to `True`
   - Set `OK to MQTT` to `True` if you want your node to show up on maps. Set to `False` if not.
   - Touch `Save` to commit the changes

2. Navigate to the channels setting tab
   - Ensure that your Primary channel (channel 0) has the channel name `MediumFast`. If that's not the case, touch the channel and rename it to `MediumFast`. Spelling matters, so be careful.
   - Make sure that your `PSK` is `AQ==`. This is the default PSK for all default channels.
   - This is optional, but set `LongFast` as your secondary channel with a PSK of `AQ==`. This will allow you to receive messages from bridged nodes who are piping messages from the `LongFast` nodes to the new modem preset.
   - Touch `Save` to commit the changes.


# Recommended Configuration Settings

In order to maintain a healthy mesh network, we recommend the following configuration settings for your Meshtastic devices.

These settings are intended to facilitate a stable and reliable mesh network. They are based on the collective experience of the Susquehanna Valley Mesh community and are subject to change as the mesh grows and evolves.

## Radio configuration

Starting with MediumFast, SVM will distribute recommended quarantine lists for nodes that are spamming the mesh. Obviously we will try to reach out repeatedly first. Currently 75% of traffic is telemetry, position, etc packets. With the mesh growing at the rate it is, we want to be very careful MediumFast doesn't get as clogged as LongFast currently is. 

### Device

Your handheld node's role should be CLIENT or CLIENT_MUTE. If you have any doubts, use one of these.
If you don't think your client will help out the mesh's coverage or is on a vehicle, use CLIENT_MUTE

If your node is on a mountain or tower, you can use role ROUTER
If you are within five miles of another node using ROUTER, do not use ROUTER. If you can see more than five ROUTER nodes within a few hops, don't use.
If your node is on a tall building, use role ROUTER_LATE
If your node is outside your house, use role CLIENT_BASE

|                      Option | Recommended Config        | Notes                                                                              |
| --------------------------: | :------------------------ |:---------------------------------------------------------------------------------- |
| NodeInfo broadcast interval | `14400` (4 hours)         | 2 hours should be absolute minimum. Fine to do less for temporary testing.         |

### Position

|                      Option | Recommended Config   | Notes                                           |
| --------------------------: | :------------------- | :---------------------------------------------- |
|      Smart position enabled | `True`               |                                                 |
| Position broadcast interval | `14400` (4 hour)     | 1 hour is fine for handheld.                    |
|         GPS update interval | `1800` (30 minutes)  |                                                 |
|              Position flags | Disable unused flags | Fixed nodes should disable almost all of these. |

### LoRa

|         Option | Recommended Config | Notes                                                                                            |
| -------------: | :----------------- | :----------------------------------------------------------------------------------------------- |
|   Modem Preset | MEDIUM_FAST        | This is the new fast network                                                                     |
|  ^^Hop limit^^ | `5`                | Please do not set this higher than `6`. :pray:                                                   |
| Frequency Slot | 45                 | This is the default. It equates to 913.125 MHz                                                   |
|    Ignore MQTT | `True`             | This is enabled on most `ROUTER` nodes in our mesh.                                              |
|     OK to MQTT | `True`             | Enable to show up on online tools. Disable to not.                                               |


## Module configuration

### Telemetry

Please only enable on solar or outside enclosure nodes where health data is useful.

|                              Option | Recommended Config | Notes                                                      |
| ----------------------------------: | :----------------- | :--------------------------------------------------------- |
|      Device metrics update interval | `7200` (2 hour)    | Change to `1800` when testing new nodes.                   |
| Environment metrics update interval | `7200` (2 hour)    |                                                            |
|        Power metrics module enabled | `False`            | This is for I²C power monitors, not onboard battery stats. |

Please disabling the `Environment metrics` / `Air Quality metrics` modules if you are not using the data.
If you are using a science node and need to send a lot of environmental data, please avoid using the main mesh frequency. You may wish to coordinate with SVM for coverage. 


### Neighbor Info

|                Option | Recommended Config |
| --------------------: | :----------------- |
| Neighbor Info enabled | `False`            |

Neighbor Info's functionality has been greatly limited in newer firmware versions. We recommend disabling it for most deployments.