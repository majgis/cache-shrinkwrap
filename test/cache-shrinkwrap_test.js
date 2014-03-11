'use strict';

var cache_shrinkwrap = require('../lib/cache-shrinkwrap.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var dependencies = {
  "nopt": {
    "version": "2.2.0",
    "from": "nopt@",
    "dependencies": {
      "abbrev": {
        "version": "1.0.4",
        "from": "abbrev@1"
      }
    }
  }
};
var expected = [
  'abbrev@1.0.4',
  'nopt@2.2.0'
];

exports['getVersionsFromDependencies'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'dependencies': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(cache_shrinkwrap.getVersionsFromDependencies(dependencies), expected, 'should be array with two versions');
    test.done();
  }
};
