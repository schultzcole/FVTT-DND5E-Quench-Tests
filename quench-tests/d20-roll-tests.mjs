import { d20Roll } from "/systems/dnd5e/module/dice.js";

/**
 * Quench test batches for d20 rolls
 * @param {Quench} quench
 */
export default function registerD20RollBatches(quench) {
    /**
     * DND5E QUENCH: D20 Roll Formula Tests (Fast Forward, No Chat)
     *
     * Tests that `d20Roll` produces the correct roll formula for a variety of input options.
     * All rolls in this batch are fastforwarded (no roll dialog shown) and do not produce chat messages.
     */
    quench.registerBatch("dnd5e-quench-tests.d20roll-formula.fastForward", (context) => {
        const { describe, it, after, assert } = context;

        let defaultRollOptions = { fastForward: true, chatMessage: false };

        /**
         * Takes a testCase with input options and an expected formula,
         * and asserts that that the resulting roll conforms to that formula.
         */
        function _defineTest(testCase) {
            // If the test case doesn't define options or an expected formula, register a placeholder "pending" test.
            if (!("options" in testCase) || !("expectedFormula" in testCase)) {
                it(testCase.name);
            } else {
                it(testCase.name, async function () {
                    // Optional `debug` flag to pause execution on a specific test case
                    if (testCase.debug) debugger;

                    const options = mergeObject(defaultRollOptions, testCase.options, { inplace: false });
                    const roll = await d20Roll(options);
                    assert.equal(roll.formula, testCase.expectedFormula, "Incorrect formula");
                });
            }
        }

        describe("d20Roll produces correct formula", function() {
            [
                {
                    name: `No options produces "1d20"`,
                    options: {},
                    expectedFormula: "1d20",
                },
            ].forEach(_defineTest);

            describe("Adv/Disadv", function() {
                [
                    {
                        name: `Advantage produces "2d20kh"`,
                        options: { advantage: true },
                        expectedFormula: "2d20kh",
                    },
                    {
                        name: `Disadvantage produces "2d20kl"`,
                        options: { disadvantage: true },
                        expectedFormula: "2d20kl",
                    },
                    {
                        name: `Advantage and disadvantage produces "2d20kh"`,
                        options: { advantage: true, disadvantage: true },
                        expectedFormula: "2d20kh",
                    },
                ].forEach(_defineTest);
            }); // Adv/Disadv

            describe("Parts", function() {
                [
                    {
                        name: `Flat +2 produces "1d20 + 2"`,
                        options: { parts: ["+2"] },
                        expectedFormula: "1d20 + 2",
                    },
                    {
                        name: `Dynamic +5 produces "1d20 + 5"`,
                        options: { parts: ["@dynamic"], data: { dynamic: "5" } },
                        expectedFormula: "1d20 + 5",
                    }
                ].forEach(_defineTest);
            }); // Parts

            describe("Actor traits", function() {
                describe("Elven Accuracy", function() {
                    [
                        {
                            name: `Without advantage produces "1d20"`,
                            options: { elvenAccuracy: true },
                            expectedFormula: "1d20",
                        },
                        {
                            name: `With advantage produces "3d20kh"`,
                            options: { elvenAccuracy: true, advantage: true },
                            expectedFormula: "3d20kh",
                        },
                        {
                            name: `With disadvantage produces "2d20kl"`,
                            options: { elvenAccuracy: true, disadvantage: true },
                            expectedFormula: "2d20kl",
                        },
                    ].forEach(_defineTest);
                }); // Elven Accuracy

                describe("Reliable Talent", function() {
                    [
                        {
                            name: `Without advantage produces "{1d20,10}kh"`,
                            options: { reliableTalent: true },
                            expectedFormula: "{1d20,10}kh",
                        },
                        {
                            name: `With advantage produces "{2d20kh,10}kh"`,
                            options: { reliableTalent: true, advantage: true },
                            expectedFormula: "{2d20kh,10}kh",
                        },
                        {
                            name: `With disadvantage produces "{2d20kl,10}kh"`,
                            options: { reliableTalent: true, disadvantage: true },
                            expectedFormula: "{2d20kl,10}kh",
                        },
                    ].forEach(_defineTest);
                }); // Reliable Talent

                describe("Halfling Lucky", function() {
                    [
                        {
                            name: `Without advantage produces "1d20r1=1"`,
                            options: { halflingLucky: true },
                            expectedFormula: "1d20r1=1",
                        },
                        {
                            name: `With advantage produces "2d20r1=1kh"`,
                            options: { halflingLucky: true, advantage: true },
                            expectedFormula: "2d20r1=1kh",
                        },
                        {
                            name: `With disadvantage produces "2d20r1=1kl"`,
                            options: { halflingLucky: true, disadvantage: true },
                            expectedFormula: "2d20r1=1kl",
                        },
                    ].forEach(_defineTest);
                }); // Halfling Lucky

                describe("Combinations", function() {
                    [
                        {
                            name: `Elven Accuracy & Reliable Talent produces "{3d20kh,10}kh"`,
                            options: { elvenAccuracy: true, advantage: true, reliableTalent: true },
                            expectedFormula: "{3d20kh,10}kh",
                        },
                        {
                            name: `Reliable Talent & Halfling Lucky produces "{1d20r1=1,10}kh"`,
                            options: { reliableTalent: true, halflingLucky: true },
                            expectedFormula: "{1d20r1=1,10}kh",
                        },
                        {
                            // invalid?
                            name: `Halfling Lucky & Elven Accuracy produces "3d20r1=1kh"`,
                            options: { elvenAccuracy: true, advantage: true, halflingLucky: true },
                            expectedFormula: "3d20r1=1kh",
                        },
                        {
                            // invalid?
                            name: `Halfling Lucky & Elven Accuracy & Reliable Talent produces "{3d20r1=1kh,10}kh"`,
                            options: { elvenAccuracy: true, advantage: true, halflingLucky: true, reliableTalent: true },
                            expectedFormula: "{3d20r1=1kh,10}kh",
                        },
                    ].forEach(_defineTest);
                })
            }); // Actor Traits
        }); // d20Roll produces correct formula
    }, { displayName: "DND5E QUENCH: D20 Roll Formula Tests (Fast Forwarded)" });
}
