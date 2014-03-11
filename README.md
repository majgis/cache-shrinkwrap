#cache-shrinkwrap

This module is a utility for system administrators which is intended to be installed globally.

It adds all dependencies, including child dependencies, contained in an npm-shrinkwrap.json file.

Read the documentation for [npm-shrinkwrap](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html) for specifics about
generating this file.

## Getting Started
Install the module with:

```bash
npm install -g cache-shrinkwrap`
```

## Documentation

The `cache-shrinkwrap` command can be executed with either one or no arguments:

```bash
# With no argument, it looks in the current or parent directory for npm-shrinkwrap.json
cache-shrinkwrap

# You can also specify the path to a file created by npm shrinkwrap command
cache-shrinkwrap wraps/npm-shrinkwrap-2014-01-12.json
```

The result of inputting this npm-shrinkwrap.json file:
```json
{
  "name": "cache-shrinkwrap",
  "version": "0.1.0",
  "dependencies": {
    "nopt": {
      "version": "2.2.0",
      "from": "nopt@2.2.0",
      "resolved": "https://registry.npmjs.org/nopt/-/nopt-2.2.0.tgz",
      "dependencies": {
        "abbrev": {
          "version": "1.0.4",
          "from": "abbrev@1",
          "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz"
        }
      }
    },
  ...

```

Is equivalent to executing these commands:
```bash

npm cache add abbrev@1.0.4
npm cache add nopt@0.1.0
...

```

Although, it is not exactly equivalent. Node is only fired up once and all dependencies are added to the cache
through npm's api in a single session as follows:  `npm.commands.cache(['add', 'abbrev@1.0.4'])`. In other words,
it is much faster than trying to execute multiple `npm cache add name@version` statements.

##API
Although only intended for command line usage, there is a [public api](https://github.com/slchackers/cache-shrinkwrap/blob/master/lib/cache-shrinkwrap.js).

```javascript
var cache_shrinkwrap = require('cache-shrinkwrap');
cache_shrinkwrap.addFilePath('project/nsw.json');
```

##References:

  1. [npm-shrinkwrap](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html)
  2. [npm-cache](https://www.npmjs.org/doc/cli/npm-cache.html)
  3. [StackOverflow  - Can dependencies be included when using npm cache add?](http://stackoverflow.com/questions/22215606/can-dependencies-be-included-when-using-npm-cache-add)

## License
Copyright (c) 2014 SLCHackers
Licensed under the MIT license.

## Release History
0.1.3 - remove console statement reporting undefined
0.1.2 - removed npm-shrinkwrap.json to prevent installation of dev dependencies
0.1.1 - Documentation was updated and the public api was simplified
0.1.0 - Basic loading of npm-shrinkwrap.json for populating the npm cache


