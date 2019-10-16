'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _deepMapKeys = require('deep-map-keys');

var _deepMapKeys2 = _interopRequireDefault(_deepMapKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixForGatsbyKey = 'zwimlo_';
var restrictedNodeFields = ['id', 'fields', 'parent', 'children', 'internal'];

/**
 * Validate the GraphQL naming convetions & protect specific fields.
 *
 * @param {any} key
 * @returns the valid name
 * Based on code from gatsby-source-filesystem - tx :-)
 */
var getValidKeyName = function getValidKeyName(key, verbose) {
  var newKey = key;
  var replaced = false;

  var NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

  if (!NAME_RX.test(newKey)) {
    replaced = true;
    newKey = newKey.replace(/-|__|:|\$|\.|\s/g, '_');
  }
  if (!NAME_RX.test(newKey.slice(0, 1))) {
    replaced = true;
    newKey = '' + prefixForGatsbyKey + newKey;
  }
  if (restrictedNodeFields.includes(newKey)) {
    replaced = true;
    newKey = ('' + prefixForGatsbyKey + newKey).replace(/-|__|:|\$|\.|\s/g, '_');
  }

  {
    replaced && verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' offending key: ' + key + ' replaced by ' + newKey);
  }

  return newKey;
};

// prepare json ids and fields to comply with Gatsby
var prepareKeys = function prepareKeys(objects, verbose) {
  return (0, _deepMapKeys2.default)(objects, function (key) {
    return getValidKeyName(key, verbose);
  });
};

exports.default = prepareKeys;