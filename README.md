# Inca
A game by Jason, Byron, and Kent Hinebaugh

Started July 19, 2013

## Contents
1. [Overview](#overview)
- [Notes](#notes)

<a id="overview"></a>
## Overview
This is a game planned for the 7dRTS challenge from ludum dare.



<a id="notes"></a>
## Notes
Development in stages, with plenty of playtesting in between each. First, we build up a networked system simulating a population with needs like food, water, sunlight. Er, maybe those are a plant's needs. Whatever. It's an abstraction at this point. So we build the simulation system and then create some controls for manipulating the inputs and resource allocation and such.

Next phase, we remove those controls and let the system run with plenty of resources, creating a thriving, robust populace. And then we build tools to disrupt it, seeing what's fun, and what's effective for messing up the system. We will also have probably figured out how to automate the system's abilty to recover and self-heal in response to make it harder to bring the whole thing down.

Third phase is to take another step back from direct control. Now both the system and the destructive forces are programmatic and we're building tools for the player directly manipulating those disruptive forces, to either enhance or mitigate them. Mostly mitigate, I suppose. And yes, the gameplay just flip-flopped between trying to support the system to trying to destroy, and then back.

The next phase is getting close to what we image the final gameplay to be like. It's difficult to project that far out, since we want each phase to be experimental and iterative. But in general, this phase will introduce individual character units that the player directs by assigning goals and waypoints. So it's yet another step away from having direct control of the system. The player's job now is to use his team of characters to thwart the destructive forces and protect his city (which is really what the abstracted system is supposed to be modeling). And now we're into tactical unit management gameplay that's more like Myth and hopefully more fun.