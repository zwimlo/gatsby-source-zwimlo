'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _normalize = require('./normalize');

var _normalize2 = _interopRequireDefault(_normalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var siteId = _ref2.siteId,
        apiType = _ref2.apiType,
        objectType = _ref2.objectType,
        accessToken = _ref2.accessToken,
        verbose = _ref2.verbose;
    var apiEndpoint, documents;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.time(_chalk2.default.cyan('zwimlo') + ' fetched ' + objectType + ' items in');

            apiEndpoint = 'https://' + apiType + '.zwimlo.com/v1/sites/' + siteId + '/' + (0, _pluralize2.default)(objectType);
            _context.next = 4;
            return pagedGet(apiEndpoint, accessToken, objectType, verbose);

          case 4:
            documents = _context.sent;


            console.timeEnd(_chalk2.default.cyan('zwimlo') + ' fetched ' + objectType + ' items in');

            return _context.abrupt('return', {
              documents: documents
            });

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

// Tx to https://github.com/steniowagner @  https://github.com/axios/axios/issues/604
//  used for refDetails


var parseParams = function parseParams(params) {
  var keys = (0, _keys2.default)(params);
  var options = '';

  keys.forEach(function (key) {
    var isParamTypeObject = (0, _typeof3.default)(params[key]) === 'object';
    var isParamTypeArray = isParamTypeObject && params[key].length >= 0;

    if (!isParamTypeObject) {
      options += key + '=' + params[key] + '&';
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach(function (element) {
        options += key + '=' + element + '&';
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

var pagedGet = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(apiEndpoint, accessToken, objectType, verbose) {
    var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var limit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 50;
    var aggregatedResponse = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
    var response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' current offset: ' + offset);verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' limit: ' + limit);verbose && _axios2.default.interceptors.request.use(function (request) {
              console.log('Starting Request', request);
              return request;
            });
            _context2.next = 5;
            return _axios2.default.get(apiEndpoint, {
              params: (0, _extends3.default)({
                offset: offset,
                limit: limit
              }, accessToken ? { access_token: accessToken } : {}, objectType === 'content' ? { refDetails: ['ASSET', 'CONTENT'] } : {}),
              paramsSerializer: function paramsSerializer(params) {
                return parseParams(params);
              }
            });

          case 5:
            response = _context2.sent;


            if (!aggregatedResponse) {
              aggregatedResponse = response.data;
            } else {
              aggregatedResponse = aggregatedResponse.concat(response.data);
            }

            if (!(offset + limit < response.headers['x-total-count'])) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt('return', pagedGet(apiEndpoint, accessToken, objectType, verbose, offset += limit, limit, aggregatedResponse));

          case 9:

            aggregatedResponse = (0, _normalize2.default)(aggregatedResponse, verbose);

            console.log(_chalk2.default.black.bgCyan(' zwimlo ') + ' fetched successfully ' + _chalk2.default.cyan(aggregatedResponse.length) + ' items');

            return _context2.abrupt('return', aggregatedResponse);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function pagedGet(_x2, _x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();