---
title: The Architecture of SVMesh: Backbone, Base, and Ingress
author: thed4nm4n
tags: [Software, Tutorial, Deployment]
---

To optimize mesh topology, the Susquehanna Valley Mesh community has defined three primary node archetypes used across the network. These archetypes help members understand how their nodes contribute to the overall health of the mesh and how to best utilize bandwidth by assigning appropriate Meshtastic roles. The three archetypes are **backbone nodes**, **base nodes**, and **ingress nodes**.

## Backbone Nodes

Backbone nodes form the backhaul of the mesh. Using high-powered radios and advantageous placement, they establish long-distance links with other backbone nodes and are responsible for carrying traffic across large geographic areas. As the mesh continues to grow in both size and node count, these nodes become increasingly critical to overall performance.

SVMesh currently operates several backbone nodes deployed on radio towers throughout the valley and surrounding regions, made possible by community groups donating tower space. These nodes are primarily built on Nebra outdoor Helium miners, modified with custom 1W LoRa HATs for transmission and appropriate RF filtering. They are powered via PoE and, being Linux-based, can be accessed, monitored, and updated remotely.

Backbone nodes are ideally configured with the `ROUTER` role, as this grants them the highest priority for packet forwarding and routing decisions. As they are so critical to the mesh, backbone nodes require high uptime.

::critical[Consult The Community]
It is **strongly advised** to coordinate with the community through our [socials](/socials) before deploying a potential backbone node. Backbone nodes are critical infrastructure, and improper deployment can negatively impact overall mesh health.
::critical

## Base Nodes

Base nodes can be thought of as the equivalent of a home HAM radio tower. Their primary function is to bridge traffic between the backbone and a localized area populated by ingress nodes, ensuring packets reach the backbone as quickly as possible and that messages from the wider mesh are delivered back to local users.

Base nodes should be installed as high as practical on the property, ideally above roof level, to maximize signal quality to nearby backbone nodes. These nodes work best when configured in `CLIENT_BASE` mode. Nodes operating in `CLIENT_BASE` will forward packets from favorited nodes with a zero-hop penalty, effectively acting as remote transmitters for those ingress devices.

In areas with weaker coverage, particularly well-sited base nodes may also assist neighboring base nodes in reaching the backbone. If a base node has strong, direct links to multiple backbone nodes, `ROUTER_LATE` may be appropriate. However, community consultation is **still strongly recommended** before using this role.

## Ingress Nodes

Ingress nodes include portable devices, vehicle-mounted nodes, and indoor stationary nodes that users interact with via the web client or companion app. These nodes primarily serve as user interfaces to the mesh and contribute little to extending its effective range.

Because of this, ingress nodes are lowest priority for rebroadcasting traffic. We strongly recommend configuring these nodes as `CLIENT_MUTE`, which disables packet rebroadcasting and helps reduce overall channel utilization. If you operate multiple ingress nodes but do not have a nearby base node, consider configuring one ingress node as `CLIENT` and placing it in the best possible location, such as an attic or window, to act as a small-scale base. The remaining ingress nodes should remain in `CLIENT_MUTE`.

## Mesh Topology

When these archetypes are deployed correctly, packet flow through the mesh becomes both efficient and predictable. A packet sent from an ingress node is first received by the nearest base node. The base node forwards the packet to the backbone, where it can propagate quickly across long distances. Backbone nodes then relay the packet to other base nodes within their coverage areas, which in turn deliver the message to ingress nodes.

The flow can be visualized as follows:

```network-diagram
                                           ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
                                           │  Backbone  │──────►│    Base    │──────►│   Ingress   │
                                           │    Node    │       │    Node    │       │    Node    │
                                           └─────────────┘       └─────────────┘       └─────────────┘
                                                 ▲
                                                 │
                                                 │
                                                 ▼
 ┌─────────────┐       ┌─────────────┐        ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
 │   Ingress   │──────►│    Base    │──────►│  Backbone   │──────►│    Base    │──────►│   Ingress   │
 │    Node     │       │    Node    │       │    Node    │       │    Node    │       │    Node    │
 └─────────────┘       └─────────────┘        └─────────────┘       └─────────────┘       └─────────────┘
```

With the hop limit set to `5`, and zero-hop forwarding properly configured on base nodes, messages should be able to traverse at least three backbone nodes while still reliably delivering to base nodes and their associated ingress devices. Achieving this ideal behavior requires strong adherence to our [Recommended Settings](/recommended-settings). By configuring nodes consistently and cooperatively, we can continue to refine the mesh toward a more efficient and resilient topology.
