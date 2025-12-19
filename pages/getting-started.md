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

These are not the only nodes available. There are nother devices on the market that provide different features that may suit your wants or needs better. Make sure to shop around for one that suits you and ask about it on our Discord if you have any questions.

### Development Boards

Development boards allow you to build your own node, if you purchase or fabricate an enclosure. There are two main categories of devboards, ESP32-based and nRF52-based. ESP32-based boards have WiFi support, so you can connect the node to your network to use it network-wide.These baords also have more on-board storage, meaning your database of nodes can be around 200 entries as opposed to nRF-based boards having roughly 80. These ESP32 boards consume far more power than nRF-based boards, however, so they are far more suitable for stationary use in a place with constant power. nRF-based boards sip power in comparison, making them more ideal for solar-based setups and portable nodes where battery life is of high importance. A full list of compatible development boards is available on [Meshtastic’s site](https://meshtastic.org/docs/hardware/devices/).

## Setting Up Your Device

::critical[Before Powering On Your Node]
Ensure any radio antennas are connected to your node before powering on for the first time! Radio modules can burn themselves out when trying to broadcast without an antenna connected, which can cause reduced transmit performance at best and total destruction of the internal circuits at worst.
::critical

::warning[Firmware Compatibility]
Make sure to download the correct firmware version for your specific hardware model. Installing incorrect firmware can render your device inoperable.
::warning

::info[Community Support]
Join our Discord server for real-time help with setup and configuration. Our community members are always happy to assist newcomers.
::info

Once you have your hardware, follow these steps to get connected to our network. We'll provide detailed instructions for flashing firmware, configuring your device, and joining our community channels.
