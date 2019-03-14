/*!
 * open-file | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/open-file
*/
'use strict';

const fsOpen = require('graceful-fs').open;
const inspectWithKind = require('inspect-with-kind');

const PATH_ERROR = 'Expected a file path (string) to open and resolve its file descriptor';
const FLAG_ERROR = 'Expected valid file open flag, for example \'r\' & \'ax+\'';

module.exports = function openFile(...args) {
  return new Promise((resolve, reject) => {
    const argLen = args.length;

    if (argLen !== 2 && argLen !== 3) {
      throw new TypeError(`Expected 2 or 3 arguments (path: <string>, flags: <string> | <integer>[, mode: <integer>]), but got ${
        argLen === 0 ? 'no' : argLen
      } arguments.`);
    }

    const [filePath, flags] = args;

    if (typeof filePath !== 'string') {
      throw new TypeError(`${PATH_ERROR}, but got ${inspectWithKind(filePath)}.`);
    }

    if (filePath.length === 0) {
      throw new Error(`${PATH_ERROR.replace(' (string)', '')}, but got '' (empty string).`);
    }

    const typeOfFlags = typeof flags;

    if (typeOfFlags !== 'string' && typeOfFlags !== 'number') {
      throw new TypeError(`${FLAG_ERROR}, but got ${inspectWithKind(flags)}.`);
    }

    if (flags === '') {
      throw new Error(`${FLAG_ERROR}, but got '' (empty string).`);
    }

    fsOpen(...args, (err, fileDescriptor) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(fileDescriptor);
    });
  });
};
