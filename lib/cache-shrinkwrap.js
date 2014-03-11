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

function errorhandler(err, stdout, stderr) {
  if (err) {
    console.log(stdout);
    console.log(stderr);
  }
}

function addVersions(versions) {
  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    npm.commands.cache(['add', version], errorhandler);
  }
}


function getVersionsFromDependencies(dependencies, parentVersions){
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