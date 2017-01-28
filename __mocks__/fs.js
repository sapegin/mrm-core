'use strict';

const memfs = require('memfs');
const fs = new memfs.Volume();
fs.mountSync('./', {});
module.exports = fs;
