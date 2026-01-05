---
title: Getting Started with Meshtastic
author: River Trent, Jamie Cole
tags: [Tutorial]
---

Learn the basics of setting up and using Meshtastic devices on the SVMesh network.

## What is Meshtastic?

Meshtastic is an open-source project that enables low-power, long-range communication using LoRa radio technology. It's perfect for creating mesh networks that don't rely on cellular or internet infrastructure.

## Hardware Requirements

To get started with SVMesh, you'll need:

- A compatible Meshtastic device (T-Beam, Heltec, RAK, etc.)
- A battery or power source
- An antenna (915 MHz for North America)
- USB cable for initial setup

## Initial Setup

1. **Flash the firmware**: Download the latest Meshtastic firmware from [meshtastic.org](https://meshtastic.org)
2. **Install the app**: Get the Meshtastic mobile app (iOS or Android)
3. **Connect your device**: Use Bluetooth to pair with your device
4. **Configure settings**: Set your region to US and configure your node name

## Network Configuration

For optimal performance on the SVMesh network:

- Set your region to `US`
- Use the default channel for public communication
- Consider setting up a secondary encrypted channel for private messages
- Enable position sharing if you're comfortable with location data

## Best Practices

- Keep firmware updated
- Use a quality antenna mounted as high as possible
- Monitor battery levels if running on battery power
- Join the Discord to coordinate with other mesh users

## Troubleshooting

If you're having connectivity issues:

1. Check antenna connection
2. Verify region settings match (US/915MHz)
3. Ensure firmware is up to date
4. Check battery voltage
5. Try repositioning your device/antenna

## Next Steps

Once you're connected:

- Check out the [Channel Settings](/channel-settings) guide
- View network activity on our [Dashboards](/dashboards)
- Join the community on [Discord](https://discord.gg/svmesh)
