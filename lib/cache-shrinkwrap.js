/*
 * cache-shrinkwrap
 * https://github.com/slchackers/cache-shrinkwrap
 *
 * Copyright (c) 2014 SLCHackers
 * Licensed under the MIT license.
 */

'use strict';
var fs = require('fs');
var nopt = require('nopt');
var npm = require('npm');
var configDefs = require('npmconf').defs;
var conf = nopt(configDefs.types, configDefs.shorthands);
var confLoaded = false;
var queue = [];
var errorCount = 0;
var errorMessages = [];
var itemCount = 0;

npm.load(conf, function (er) {
  if (er) {
    console.error('Unable to load npm configuration.');
  } else {
    confLoaded = true;
    while (queue.length) {
      addVersions(queue.shift());
    }
  }
});


function errorhandler(err) {

  if (err) {
    errorMessages.push(err.message);
    errorCount += 1
  }
}

function addVersions(versions) {
  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    npm.commands.cache(['add', version], errorhandler);
  }
  itemCount += versions.length;
}


function getVersionsFromDependencies(dependencies, parentVersions) {
  var versions = parentVersions || {};
  for (var key in dependencies) {
    var dependency = dependencies[key];
    if (dependency.dependencies) {
      getVersionsFromDependencies(dependency.dependencies, versions);
    }
    versions[key + '@' + dependency.version] = null;
  }

  if (!parentVersions) {
    var result = [];
    for (var version in versions) {
      result.push(version);
    }
    return result;
  }
}

// Report any errors
process.on('exit', function (code) {
  if (logging) {
    console.log('\n  Processed: ' + itemCount);
    console.log('  Failures: ' + errorCount);
    if (errorCount > 0){
      console.log('    ' + errorMessages.join('\n    ') + '\n')

    }
  }
  if (errorCount > 0) {
    process.exit(1);
  }
});

/**
 * Recurses npm-shrinkwrap file path to add each dependency to npm cache
 *
 * @param shrinkwrapPath
 */
exports.addFilePath = function (shrinkwrapPath) {
  exports.addFile(JSON.parse(fs.readFileSync(shrinkwrapPath)));
};


/**
 * Recurses npm-shrinkwrap object to add each dependency to npm cache
 *
 * @param shrinkwrap
 */
exports.addFile = function (shrinkwrap) {
  exports.addDependencies(shrinkwrap.dependencies);
};


/**
 * Recurses npm-shrinkwrap dependencies to add each to npm cache
 *
 * @param dependencies
 */
exports.addDependencies = function (dependencies) {
  exports.addVersions(getVersionsFromDependencies(dependencies));
};


/**
 * Adds array of versions, in form 'name@version' to npm cache
 *
 * @param versions Array of strings
 */
exports.addVersions = function (versions) {
  if (confLoaded) {
    addVersions(versions);
  } else {
    queue.push(versions);
  }
};


/**
 * Recurses npm-shrinkwrap dependencies to return an array of 'name@version' values for each dependency.
 *
 * @param dependencies Root dependencies node from npm-shrinkwrap.json file
 * @returns {Array}
 */
exports.getVersionsFromDependencies = function (dependencies) {
  return getVersionsFromDependencies(dependencies);
};

var logging = false;
/**
 * Write totals to stdout on process exit
 * @param loggingEnabled
 */
exports.setLogging = function (loggingEnabled) {
  logging = loggingEnabled;
};
