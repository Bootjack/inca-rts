/* Exchange accepts two sets of storage modules: inputs and outputs. Each input is assigned a proportion
 * value between 0 and 1. The total of all inputs must equal one. This is enforced at configuration by
 * tracking a running total of proportions and limiting each input to a maximum proportion of 1 minus the
 * total, with the final input being forced to equal this value. Outputs are similarly assigned proportion
 * values, but enforced slightly differently. If the end of the output list results in a total less than 1,
 * a waste output is automatically appended to make up the difference.
 *
 * TODO At some future point, waste may be handled as being vented out to a global Environment object.
 *
 * Note that the simplest possible exchange has a single input and a single output, each with a proportion
 * value of 1. This is how a simple transfer is performed between two storage modules. */