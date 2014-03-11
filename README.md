
This module is a utility for system administrators which is intended to be installed globally.

It adds all dependencies, including child dependencies, contained in an npm-shrinkwrap.json file.

Read the documentation for [npm-shrinkwrap](https://www.npmjs.org/doc/cli/npm-shrinkwrap.html) for specifics about
generating this file.

## Getting Started
Install the module with: `npm install -g cache-shrinkwrap`

## Examples

```bash
# Look in current or parent directory for npm-shrinkwrap.json
cache-shrinkwrap

# Specify the path to a file created by npm shrinkwrap command
cache-shrinkwrap wraps/npm-shrinkwrap-2014-01-12.json
```

## Release History
0.1.0 - basic loading of npm-shrinkwrap.json for populating the npm cache

## License
Copyright (c) 2014 SLCHackers  
Licensed under the MIT license.
