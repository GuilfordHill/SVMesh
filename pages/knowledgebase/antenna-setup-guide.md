---
title: Antenna Guide
author: thed4nm4n
tags: [Hardware, Tutorial]
---

A high-quality antenna is the single most effective way to improve radio performance. There are many well-built antennas available, each designed for different use cases and deployment scenarios. When selecting an antenna for your Meshtastic node, there are several important factors to consider.

### Directional Antennas

Directional antennas are strongly discouraged on the mesh. Mismatched transmit and receive patterns between nodes can introduce unexpected behavior and packet loss. For this reason, omni-directional antennas should be used to ensure consistent coverage and predictable mesh performance.

### Antenna Gain

Higher-gain antennas can transmit farther, but they do so by focusing energy into a narrower radiation pattern. For backbone nodes or solar-powered base stations installed at higher elevations, higher gain antennas may be appropriate. For mobile or portable nodes, lower-gain antennas in the 3–5 dB range are recommended, as they better accommodate changes in terrain, elevation, and orientation.

## Antenna Recommendations

### Outdoor

For outdoor installations, we recommend antennas with N-type connectors, as they provide better mechanical strength and built-in weather resistance.

Alfa produces a high-quality N-type antenna that has been well tested by members of the community and is known to be reliable. It is available from the [Rokland store](https://store.rokland.com/products/alfa-aoa-915-5acm-5-dbi-omni-outdoor-915mhz-802-11ah-mini-antenna-for-lora-halow-application). There are also reports of good performance from the [Slinkdsco fiberglass antenna](https://www.amazon.com/gp/product/B09N2H166D), though it has seen less widespread testing within the mesh.

### Indoor / Mobile

Portable and mobile nodes almost always use SMA connectors for their antennas. In this form factor, there are many viable options available.

Muzi Works is well known within the Meshtastic community and produces a high-quality [monopole whip antenna](https://muzi.works/products/whip-antenna-17cm). Solid-body antennas with bendable hinges are also common. While convenient, these antennas are known to attenuate signal when bent. They can still be a good option depending on the use case, but this behavior should be kept in mind when deploying them.

## Installation Tips

As with all Meshtastic deployments, height is critical, especially given the low transmit power used by these devices. Install base nodes as high as feasibly possible, and avoid placing objects within approximately 15 inches of the antenna’s radiating element to reduce reflections back into the antenna.

## Antenna Testing

The community commonly uses the [NanoVNA](https://nanovna.com/) to evaluate antenna performance, and as the mesh grows we expect to publish antenna test results in the Knowledgebase. While SWR measurements are useful, they do not tell the whole story. Real-world testing remains the most reliable way to determine whether an antenna performs well enough for a given deployment.
