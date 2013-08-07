/* Storage enables a capacity to hold a type of material. It sets a material type, capacity, and transfer rate.
 * Any storage module will also persist its current quantity, space available, and flags for whether it is empty
 * or full. Optionally, a storage module may define a delta, which is a passive change increment (or decrement)
 * applied to its quantity each frame. The default delta is 0. */