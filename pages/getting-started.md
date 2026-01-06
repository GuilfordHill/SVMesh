---
title: "Getting Started"
subtitle: "Learn how to connect to the Susquehanna Valley mesh network"
heroImage: "tbeam.jpg"
attributionUrl: "https://meshtastic.org/"
---

# Welcome to the mesh!

This guide is intended for first-time node buyers and new node owners looking to get their devices up and running on the mesh. It walks through the current options available for nodes, the initial setup process, and where to find help if you encounter issues along the way.

## What You'll Need

To participate in the mesh, you will need a node. A node is a device with a LoRa radio and a microcontroller capable of running the Meshtastic firmware. Pre-built nodes are available from reputable vendors such as [SeeedStudio](https://www.seeedstudio.com/) and [Muzi Works](https://muzi.works/). Alternatively, you can build your own node using development boards from manufacturers like [Heltec](https://heltec.org/) or [RAKWireless](https://www.rakwireless.com/en-us).

### Pre-built Nodes

The following list includes pre-built nodes that have been tested and used successfully by members of the community. These devices offer a range of features, so be sure to compare specifications, particularly battery life, display availability, and the presence of GPS or environmental sensors.

- **SeeedStudio SenseCAP Card Tracker T1000-E**: An excellent starter node. Compact form factor, good battery life, GPS, buzzer, and temperature sensor.
- **Muzi Works R1 Neo**: A premium mobile node featuring fast USB-C charging, GPS, battery safety management, and a built-in buzzer.
- **WisMesh Repeater Mini**: A turnkey option well suited for use as a client base node, with limited modularity for additional sensors.

These are not the only nodes available. Other devices on the market may better match your specific needs or preferences. We encourage you to explore available options and ask for input on our [socials](/socials) if you are unsure which device is right for you.

### Development Boards

Development boards allow you to build a custom node if you purchase or fabricate an enclosure. Broadly, these boards fall into two categories: ESP32-based and nRF52-based.

ESP32-based boards support WiFi connectivity, allowing nodes to connect to your local network. They also offer more onboard storage, typically supporting node databases of around 200 entries, compared to roughly 80 entries on nRF52-based boards. However, ESP32 boards consume significantly more power and are best suited for stationary deployments with consistent power.

nRF52-based boards are far more power efficient, making them ideal for portable nodes and solar-powered installations where battery life is a primary concern. A full list of compatible development boards can be found on [Meshtastic’s website](https://meshtastic.org/docs/hardware/devices/).

## Setting Up Your Node

Once you have your hardware, follow the steps below to get your node online.

::critical[Before Powering On Your Node]
Ensure that a radio antenna is connected to your node before powering it on for the first time. Transmitting without an antenna can damage the radio module, resulting in reduced performance or permanent hardware failure.
::critical

It is strongly recommended to flash your device with the latest firmware before first boot. To do so, visit the [Meshtastic web flasher](https://flasher.meshtastic.org/) and ensure you select the correct board for your device.

After flashing, power on your node. Before it can transmit, you must set your regulatory region. Connect to your node using the [Meshtastic web client](https://client.meshtastic.org/) or the Meshtastic companion app on your mobile device. Navigate to `Settings > LoRa` and set your region to `United States`. **After setting the region, the node will reboot and begin transmitting. Ensure your antenna remains connected.**

::warning[About HAM Mode]
A lot of newcomers get intrigued with running Meshtastic in HAM mode. Not only does this mode require an amateur license to use, it also is incompatible with our current mesh due to the lack of encryption. Do not enable HAM (Amateur radio) mode unless you know what you're doing.
::warning

Once the node has restarted, visit our [Recommended Settings](/recommended-settings) page to apply the current channel configuration required to join the mesh. After these settings are applied, your node will be fully connected and ready for use. If you have any questions, be sure to reach out on our [socials](/socials)! We are happy to help.
