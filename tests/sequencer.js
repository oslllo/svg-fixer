const TestSequencer = require('@jest/test-sequencer').default;

class Sequencer extends TestSequencer {
        sort(tests) {
        const copyTests = Array.from(tests);
        return copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
        //     const orderPath = ['b', 'a', 'c'];
        //     return tests.sort((testA, testB) => {
        //     const indexA = orderPath.indexOf(testA.path);
        //     const indexB = orderPath.indexOf(testB.path);

        //     if (indexA === indexB) return 0; // do not swap when tests both not specify in order.

        //     if (indexA === -1) return 1;
        //     if (indexB === -1) return -1;
        //     return indexA < indexB ? -1 : 1;
        // } 
    }
}

module.exports = Sequencer;