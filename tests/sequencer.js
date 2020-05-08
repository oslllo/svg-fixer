const TestSequencer = require('@jest/test-sequencer').default;

class Sequencer extends TestSequencer {
        sort(tests) {
        const copyTests = Array.from(tests);
        return copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
    }
}

module.exports = Sequencer;