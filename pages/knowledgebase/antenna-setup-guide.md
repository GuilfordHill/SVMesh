---
title: Antenna Setup Guide
author: Sam Lee
tags: [Hardware]
---

Proper antenna setup is crucial for optimal mesh network performance.

## Antenna Types

### Omnidirectional Antennas

- Best for general use and mobile setups
- 360-degree coverage
- Typical gain: 2-6 dBi

### Directional Antennas

- Focused signal in one direction
- Better for long-distance links
- Higher gain: 8-15+ dBi

## Installation Tips

1. **Height matters**: Every meter of elevation significantly improves range
2. **Line of sight**: Clear view improves performance dramatically
3. **Avoid metal**: Keep antennas away from metal objects
4. **Proper grounding**: Important for outdoor installations
5. **Weather protection**: Use weatherproof enclosures for outdoor nodes

## Common Mistakes

- Using indoor rubber duck antennas outdoors
- Poor cable quality causing signal loss
- Incorrect polarization (vertical vs horizontal)
- Mounting too close to obstructions

## Testing Your Setup

Use these methods to verify antenna performance:

- Monitor SNR (Signal-to-Noise Ratio) on received messages
- Check hop count to distant nodes
- Use the mesh map to see your coverage area
- Compare with other local nodes

## Recommended Antennas

For the SVMesh network (915 MHz):

- **Portable**: 2-3 dBi rubber duck
- **Fixed indoor**: 5 dBi omnidirectional
- **Fixed outdoor**: 8 dBi omnidirectional or directional
- **Long-range**: 15+ dBi directional Yagi

Contact the community on Discord for specific recommendations based on your location and use case.
