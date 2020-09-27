# 330-project1
There are ant hills, which decay over time. The ant hills send out 2 different types of ants; searchers and harvesters.

Searchers move psudeo-randomly, with gaussian noise actually, with the mean as the last angle walked at and a variable deviation. This is to make random walkers who actually go somewhere. When the searchers collide with food they drop a powerful pheremone.

Harvesters move with bias, they select a weighted random pheromone, (pheromone strength/distance) all in a vector, then normalized. They take the vector from the pheromone to them, normalize it, then multiply by a variable multiplier, and then add on a random normal vector. Over time with alot of steps, this brings about random movement with a bit of bias. When a harvester collides with food, they bring it back to the hill.

All ants have a chance to die when they are outside of the hill.