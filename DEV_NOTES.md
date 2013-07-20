# Inca
A game by The Brothers Hinebaugh

Started July 19, 2013

## Contents
1. [Overview](#overview)
- [Stories](#stories)
- [Notes](#notes)

<a id="overview"></a>
## Overview
This is a game planned for the 7dRTS challenge from ludum dare. We want to develop gameplay that is far more tactical than typical games in the real-time strategy genre, so more like Bungie's Myth than the typcial C&C or Starcraft build-resources-then-attack style.

Development in stages, with plenty of playtesting in between each. First, we build up a networked system simulating a population with needs like food, water, sunlight. Er, maybe those are a plant's needs. Whatever. It's an abstraction at this point. So we build the simulation system and then create some controls for manipulating the inputs and resource allocation and such.

Next phase, we remove those controls and let the system run with plenty of resources, creating a thriving, robust populace. And then we build tools to disrupt it, seeing what's fun, and what's effective for messing up the system. We will also have probably figured out how to automate the system's abilty to recover and self-heal in response to make it harder to bring the whole thing down.

Third phase is to take another step back from direct control. Now both the system and the destructive forces are programmatic and we're building tools for the player directly manipulating those disruptive forces, to either enhance or mitigate them. Mostly mitigate, I suppose. And yes, the gameplay just flip-flopped between trying to support the system to trying to destroy, and then back.

The next phase is getting close to what we image the final gameplay to be like. It's difficult to project that far out, since we want each phase to be experimental and iterative. But in general, this phase will introduce individual character units that the player directs by assigning goals and waypoints. So it's yet another step away from having direct control of the system. The player's job now is to use his team of characters to thwart the destructive forces and protect his city (which is really what the abstracted system is supposed to be modeling). And now we're into tactical unit management gameplay that's more like Myth and hopefully more fun.

<a id="stories"></a>
## Stories
- Natural resources are distributed across geographic regions
- Processing nodes may be placed near a resource to act as a gateway into the system
- Collectors deliver the raw resource to the processing node
- Routes distribute the refined material to other nodes in the system
- Storage nodes can be placed anywhere along routes


- Processor node, collector, and route creation is automated for a naturally growing system
- The player can modify the performance of different elements in the system
- The player can modify individual instances of elements


- Performance modications happen automatically as the system maintains itself
- The player has tools to negatively impact parts of the system
- Negative events occur automatically (probably randomly)
- The player has tools available to impact these negative events directly


- Actors exist outside the system to protect it using the tools previously available to the player
- The player has controls to direclty control the actors
- The actors can semi-autonomously complete objectives set by the player
- Profit?

<a id="notes"></a>
## Notes