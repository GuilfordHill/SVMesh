---
title: "Getting Started"
subtitle: "Learn how to connect to the Susquehanna Valley mesh network"
heroImage: "tbeam.jpg"
attributionUrl: "https://meshtastic.org/"
---

# Welcome to the mesh!

This guide is intended for first-time node buyers looking to get their first node, and first-time node owners looking to get their devices up and running on the mesh. This guide will walk you through the choices on the market for nodes, getting your node online, how to change your node's name, and where to find help if you run into any issues.

## What You'll Need

To get on the mesh, you will need a node. A node is a device with a LoRa radio and microcontroller capable of running the Meshtastic firmware. There are pre-built nodes available from reputable sellers like [SeeedStudio](https://www.seeedstudio.com/) and [Muzi Works](https://muzi.works/), or you can order boards to build your own node from reputable sellers like [Heltec](https://heltec.org/) or [RAKWireless](https://www.rakwireless.com/en-us).

### Pre-built Nodes

The list below consists of pre-made nodes tried and tested by the community. These nodes include a variety of features, so take a look at a few and compare their specifications, most importantly battery life, the presence of a screen, and the presence of GPS or environmental sensors.

- **SeeedStudio SenseCAP Card Tracker T1000-E**: Excellent starter node. Small size, decent battery life, GPS, buzzer, temperature sensor.
- **Muzi Works R1 Neo**: Premium mobile node. 2-hour fast charge with USB-C, GPS, battery safety management, buzzer.
- **WisMesh Repeater Mini**: Turnkey solution for a client base node, with some modularity for sensors.

These are not the only nodes available. There are other devices on the market that provide different features that may suit your wants or needs better. Make sure to shop around for one that suits you and ask about it on our Discord if you have any questions.

### Development Boards

Development boards allow you to build your own node, if you purchase or fabricate an enclosure. There are two main categories of devboards, ESP32-based and nRF52-based. ESP32-based boards have WiFi support, so you can connect the node to your network to use it network-wide. These boards also have more on-board storage, meaning your database of nodes can be around 200 entries as opposed to nRF-based boards having roughly 80. These ESP32 boards consume far more power than nRF-based boards, however, so they are far more suitable for stationary use in a place with constant power. nRF-based boards sip power in comparison, making them more ideal for solar-based setups and portable nodes where battery life is of high importance. A full list of compatible development boards is available on [Meshtastic’s site](https://meshtastic.org/docs/hardware/devices/).

## Setting Up Your Node

Once you have your hardware, follow these steps to get your node online!

::critical[Before Powering On Your Node]
Ensure any radio antennas are connected to your node before powering on for the first time! Radio modules can burn themselves out when trying to broadcast without an antenna connected, which can cause reduced transmit performance at best and total destruction of the internal circuits at worst.
::critical

It is highly recommended to flash your device with the latest firmware before first boot. To do so, head to the [Meshtastic web flasher](https://flasher.meshtastic.org/), making sure you select the correct board for your node.

Now your device should be powered on and ready to go! Before you can talk, you must set your region. Connect to your node using the [Meshtastic web client](https://client.meshtastic.org/) or the Meshtastic companion app on your mobile device. Head to `Settings > LoRa`, and set your region to `US`. **After your region is set, your node will restart and begin transmitting. Make sure your antenna is connected!**

After your node reboots, you will have to head to our [Recommended Settings](/recommended-settings) page to get the latest channel settings to connect to our mesh. After your settings are set, you're good to go!
