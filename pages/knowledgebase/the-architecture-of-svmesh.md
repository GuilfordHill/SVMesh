---
title: The Architecture of SVMesh: Backbone, Base, and Ingress
author: thed4nm4n
tags: [Software, Tutorial, Deployment]
---

To optimize mesh topology, the Susquehanna Valley Mesh community has created three main archetypes for nodes on our network. These archetypes are designed to help members understand how their nodes contribute to the wider mesh, and how to optimize bandwidth use by assigning these archetypes Meshtastic roles that best suit their use case. These three archetypes are **backbone nodes**, **base nodes**, and **ingress nodes**.

## Backbone Nodes

These nodes serve as the backhaul for our mesh. Using high-powered radios, they can connect directly with other backbone nodes, serving packets long distances. These nodes become more and more critical every day, as our mesh is growing not only in number but in physical area.

SVmesh currently has a number of backbone nodes deployed on radio towers throughout the valley and beyond, thanks to various community groups donating tower space. These nodes are mainly based off of the Nebra outdoor Helium miner, with a custom-made 1W LoRa hat for transmission alongside RF filters. These nodes are powered via PoE, and as they are Linux-based, can be accessed and updated remotely.

These nodes are perfectly suited for the `ROUTER` role, as they should be the first to rebroadcast new packets on the mesh.

::critical[Consult The Community]
It is strongly advised to coordinate with the community on our [socials](/socials) when deploying possible backbone nodes. These nodes are critical infrastructure and care must be taken to preserve mesh health.
::critical

## Base Nodes

Base nodes can be paralleled to a home HAM radio tower. These nodes are aimed at bridging packets from a small area with ingress nodes to the backbone, getting their packets onto the mesh as fast as possible. As such, they should be placed high up on the property, preferably above roof level to maximize signal strength to the backbone. These nodes work best in `CLIENT_BASE` mode. Nodes in `CLIENT_BASE` will forward packets from favorited nodes with a zero-hop penalty, turning them, in essence, to remote antennas, bringing them even closer to the HAM tower analogy.

In edge cases, uniquely well-placed base nodes may also assist other nearby base nodes in connecting to the backbone. If you find your base node is in a very good position with direct connections to more than one backbone node, you can consider using `ROUTER_LATE`, but it is **still advised** to consult with the community before doing so.

## Ingress Nodes

Ingress nodes are the portable nodes, vehicle nodes, or indoor stationary nodes that you connect to via the web client or companion app to interface with the mesh. These devices do little for extending the effective range of the mesh, and as such they are at the bottom of the priority list for positioning. For these nodes, we strongly recommend considering `CLIENT_MUTE` as this will disable rebroadcasting packets on that node and free up channel utilization. If you have multiple ingress nodes but no nearby base node, we recommend putting one in `CLIENT` and placing it in the best position you can to act as a mini-base, keeping the rest of the nodes on `CLIENT_MUTE`.

## Mesh Topology

Following this system, when we use an ingress node to send a packet on the mesh, the ideal broadcast sequence is:

```network-diagram
                                           ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
                                           │  Backbone  │──────►│    Base    │──────►│   Ingress   │
                                           │    Node    │      │    Node    │       │    Node    │
                                           └─────────────┘       └─────────────┘       └─────────────┘
                                                 ▲
                                                 │
                                                 │
                                                 ▼
 ┌─────────────┐       ┌─────────────┐        ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
 │   Ingress   │──────►│    Base    │──────►│  Backbone   │──────►│    Base    │──────►│   Ingress   │
 │    Node     │      │    Node    │       │    Node    │       │    Node    │       │    Node    │
 └─────────────┘       └─────────────┘        └─────────────┘       └─────────────┘       └─────────────┘
```

With hop count set to `5`, and zero-hop forwarding correctly set up on your base node, your message will ideally be able to relay across at least 3 backbone nodes and still reliably deliver to base nodes within their coverage areas. However, for this to work smoothly, we must have a high level of adherence to our [Recommended Settings](/recommended-settings), so please configure your nodes in compliance with the settings listed on the page. If we work together, we can bring our topology closer and closer to the ideal.
