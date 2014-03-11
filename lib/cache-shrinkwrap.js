/*
 * cache-shrinkwrap
 * https://github.com/slchackers/cache-shrinkwrap
 *
 * Copyright (c) 2014 SLCHackers
 * Licensed under the MIT license.
 */

'use strict';
var fs = require('fs');
var findup = require('findup-sync');
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

exports.getVersionsFromDependencies = function (dependencies, parentVersions) {
  var versions = parentVersions || {};
  for (var key in dependencies) {
    var dependency = dependencies[key];
    if (dependency.dependencies) {
      exports.getVersionsFromDependencies(dependency.dependencies, versions);
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
};

exports.addFilePath = function (shrinkwrapPath) {
  exports.addFile(JSON.parse(fs.readFileSync(shrinkwrapPath)));
};

exports.addFile = function (shrinkwrap) {
  exports.addDependencies(shrinkwrap.dependencies);
};

exports.addDependencies = function (dependencies) {
  exports.addVersions(exports.getVersionsFromDependencies(dependencies));
};

exports.addVersions = function (versions) {
  if (confLoaded) {
    addVersions(versions);
  } else {
    queue.push(versions);
  }
};