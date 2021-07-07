import registerD20RollBatches from "./quench-tests/d20-roll-tests.mjs";
import registerActorRestTests from "./quench-tests/actor/rest-tests.mjs";

/**
 * Quench entry point
 */
Hooks.on("quenchReady", (quench) => {
    console.log("DND5E Quench Tests | Registering batches...");
    registerD20RollBatches(quench);
    registerActorRestTests(quench);
});
