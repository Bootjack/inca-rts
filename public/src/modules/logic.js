/* Logic maintains a list of directives, each defining a target, an action, and a test for whether current
 * circumstances warrant a given directive. Whenever a directive is completed, the directive list is re-evaluated,
 * giving each directive a score on the following priority scale:
 *      0: invalid - do not execute this directive
 *      1: optional - should execute this directive if no required directives are available
 *      2: required - must execute this directive if possible
 *      3: imperative - must execute this directive regardless of other available options
 * Ties among priority (should be rare) are decided by the number of intervening directives executed since the
 * last time each one was executed. Since only one may be executed at a time, two directives will never share the
 * same non-zero count. At initialization we can set exactly one directive as imperative by convention. (And let's
 * face it, at some point we're doing a for loop over an array here, so the first directive in the array wins.) */