
/**
 * Quench test batches for Actor5e rest methods
 * @param {Quench} quench
 */
export default function registerActorRestTests(quench) {
    /**
     * DND5E QUENCH: Actor Rest Test (No Dialog, No Chat)
     *
     * Tests that `Actor5e#shortRest` and `Actor5e#longRest` replenish the correct actor and owned item resources.
     * This batch skips the rest dialogs and does not show a message in chat.
     */
    quench.registerBatch("dnd5e-quench-tests.actor-rests.fastForward", (context) => {
        const { describe, it, afterEach, assert } = context;

        const defaultOptions = { dialog: false, chat: false };
        const baseActorData = { name: "Test Actor", type: "character" };

        /**
         * @param {object} testCase
         * @param {string} [testCase.name] - The name of the test case
         * @param {object} [testCase.extraActorData] - Data to be included in the created actor in addition to `baseActorData`
         * @param {object} [testCase.expectedValues] - Expected actor data properties after the action is performed
         * @param {string} [testCase.fn] - The name of the function to execute on the actor
         * @param {?object} [testCase.extraFnOptions] - Extra options to pass to the specified function
         * @param {?boolean} [testCase.debug] - Whether or not to pause the debugger at the start of this test case.
         * @private
         */
        function _defineTest(testCase) {
            if (!("extraActorData" in testCase) || !("expectedValues" in testCase) || !("fn" in testCase)) {
                it (testCase.name);
            } else {
                it(testCase.name, async function() {
                    if (testCase.debug) debugger;

                    // Setup
                    const actorData = mergeObject(baseActorData, testCase.extraActorData, { inplace: false });
                    const actor = await Actor.create(actorData);

                    try {
                        // Perform action
                        await actor[testCase.fn](mergeObject(defaultOptions, testCase.extraFnOptions ?? {}, { inplace: false }));

                        // Test expected results
                        for (let [key, value] of Object.entries(testCase.expectedValues)) {
                            assert.deepEqual(
                                getProperty(actor.data, key),
                                value,
                                `Expected actor data at path "${key}" does not match actual`
                            );
                        }
                    } finally {
                        // Cleanup
                        await actor.delete();
                    }
                });
            }
        }

        describe("Short Rest", function() {
            describe("Recover Actor Resources", function() {
                [
                    {
                        name: "Replenish short rest resources",
                        extraActorData: {
                            "data.resources.primary": { value: 0, max: 3, sr: true },
                            "data.resources.secondary": { value: 0, max: 3, sr: true, lr: true },
                            "data.resources.tertiary": { value: 0, max: 3, sr: true },
                        },
                        expectedValues: {
                            "data.resources.primary.value": 3,
                            "data.resources.secondary.value": 3,
                            "data.resources.tertiary.value": 3,
                        },
                        fn: "shortRest",
                    },
                    {
                        name: "Don't replenish long rest resources",
                        extraActorData: {
                            "data.resources.primary": { value: 0, max: 3, lr: true },
                        },
                        expectedValues: {
                            "data.resources.primary.value": 0,
                        },
                        fn: "shortRest",
                    },
                ].forEach(_defineTest);
            }); // Recover Actor Resources
        }); // Short Rest

        describe("Long Rest", function() {
            describe("Recover Actor Resources", function() {
                [
                    {
                        name: "Replenish short and long rest resources",
                        extraActorData: {
                            "data.resources.primary": { value: 0, max: 3, sr: true },
                            "data.resources.secondary": { value: 0, max: 3, lr: true },
                        },
                        expectedValues: {
                            "data.resources.primary.value": 3,
                            "data.resources.secondary.value": 3,
                        },
                        fn: "longRest",
                    }
                ].forEach(_defineTest);
            }); // Recover Actor Resources
        }); // Long Rest

    }, { displayName: "DND5E QUENCH: Actor Rest" });
}
