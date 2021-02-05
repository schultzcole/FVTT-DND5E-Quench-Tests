import registerD20RollBatches from "./quench-tests/d20-roll-tests.mjs";

/**
 * Quench entry point
 */
Hooks.on("quenchReady", (quench) => {
    console.log("DND5E Quench Tests | Registering batches...");
    registerD20RollBatches(quench);
});
