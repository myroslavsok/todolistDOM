# open-file

[![NPM version](https://img.shields.io/npm/v/open-file.svg)](https://www.npmjs.com/package/open-file)
[![Build Status](https://travis-ci.org/shinnn/open-file.svg?branch=master)](https://travis-ci.org/shinnn/open-file)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/open-file.svg)](https://coveralls.io/github/shinnn/is-gist-starred?branch=master)
[![dependencies Status](https://david-dm.org/shinnn/open-file/status.svg)](https://david-dm.org/shinnn/open-file)
[![devDependencies Status](https://david-dm.org/shinnn/open-file/dev-status.svg)](https://david-dm.org/shinnn/open-file?type=dev)

A [Node](https://nodejs.org/) module to [open](http://man7.org/linux/man-pages/man2/open.2.html) a file with resolving its file descriptor

```javascript
const openFile = require('open-file');

openFile('file.txt', 'r').then(fileDescriptor => {
  fileDescriptor; //=> 15
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install open-file
```

## API

```javascript
openFile = require('open-file');
```

### openFile(*filePath*, *flags* [, *mode*])

*filePath*: `String` (a file path to open)  
*flags*: `String` or `Number`  
*mode*: `Integer`  
Return: [`Promise`](https://promisesaplus.com/) of the file descriptor (`Integer`)

Almost the same function as [`fs.open`](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback), except:

* The first argument is restricted to `String` and doesn't accept `Buffer` by design.
* It returns a [promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) instead of calling a callback function.

## License

Copyright (c) 2016 - 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
