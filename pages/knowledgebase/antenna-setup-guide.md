---
title: Antenna Guide
author: thed4nm4n
tags: [Hardware, Tutorial]
---

A high-quality antenna is the best way to improve your radio performance. There are a number of high-quality antennas available, made for different use cases. There are a few important considerations to keep in mind when choosing an antenna for your Meshtastic node:

### Directional Antennas

Directional antennas are strongly discouraged on the network. Mismatched transmit and receive on nodes within the mesh can cause unexpected behavior or packet loss, so stick with an omni-directional antenna.

### Antenna Gain

Higher gain antennas transmit farther, but focus their energy in a narrower beam. For backbone nodes or solar base stations at higher elevations, higher gain is acceptable. Lower gain (3-5dB) antennas are recommended for mobile nodes to better account for differences in terrain and elevation.

## Antenna Recommendations

### Outdoor

We recommend using an antenna with an N-type connector, as these connectors have built-in weather resistance.
Alfa produces a high-quality N-type antenna, which can be found on the [Rokland store](https://store.rokland.com/products/alfa-aoa-915-5acm-5-dbi-omni-outdoor-915mhz-802-11ah-mini-antenna-for-lora-halow-application). It is well tested by members of the community and known to be reliable. There are reports that the [Slinkdsco fiberglass antenna](https://www.amazon.com/gp/product/B09N2H166D) is also good, but it is less tested within our mesh.

### Indoor / Mobile

Nodes on the portable side almost always use the SMA connector for their antennas. In this form factor, you can find plenty of options available. Muzi Works is well-known in the Meshtastic space, and makes a great [monopole whip antenna](https://muzi.works/products/whip-antenna-17cm). There are also solid-body antennas with a bendable hinge available, but these antennas are known to attenuate when you bend them. They are still a good option, depending on the use case, so keep them in mind.

## Installation Tips

As always, height is might with Meshtastic nodes, especially because they operate with such low transmit power. Get your base node as high up as you feasibly can, and avoid having any objects within ~15 inches of the antenna's transmit field to avoid reflections back into the antenna.

## Antenna Testing

The community uses the [NanoVNA](https://nanovna.com/) to measure antenna performance, and as we grow we expect to add antenna test results to our Knowledgebase. However, SWR is not everything when it comes to range. Real-world testing is the only true way to know if the performance is good enough for your use case.
