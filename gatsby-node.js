'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _gatsbySourceFilesystem = require('gatsby-source-filesystem');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.sourceNodes = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref2, configOptions) {
    var actions = _ref2.actions,
        store = _ref2.store,
        cache = _ref2.cache,
        createNodeId = _ref2.createNodeId,
        getNode = _ref2.getNode;

    var createNode, createNodeField, apiType, optionAccessToken, accessToken, verbose, siteId, objectTypes, _loop, type;

    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            createNode = actions.createNode, createNodeField = actions.createNodeField;

            // Gatsby adds a configOption that's not needed for this plugin, delete it

            delete configOptions.plugins;

            // Consider options for delivery (content) or preview
            apiType = configOptions.preview ? 'preview' : 'content';

            // Get an existing token from options for delivery or preview

            optionAccessToken = apiType === 'preview' ? configOptions.previewToken : configOptions.deliveryToken;

            // Enhance the token to a parameter if available

            accessToken = optionAccessToken ? optionAccessToken : '';

            // Defines if the output is verbose or nearly silent

            verbose = configOptions.verboseOutput;
            siteId = configOptions.siteId;
            objectTypes = ['asset', 'content'];
            _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop(type) {
              var objectType, _ref3, documents;

              return _regenerator2.default.wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      objectType = objectTypes[type];

                      verbose && console.log(_chalk2.default.magenta('zwimlo') + ' current objectType: ' + objectType);
                      _context2.next = 4;
                      return (0, _fetch2.default)({
                        siteId: siteId,
                        apiType: apiType,
                        objectType: objectType,
                        accessToken: accessToken,
                        verbose: verbose
                      });

                    case 4:
                      _ref3 = _context2.sent;
                      documents = _ref3.documents;
                      _context2.next = 8;
                      return _promise2.default.all(documents.map(function () {
                        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(node) {
                          var nodeId, nodeType, nodeContent, nodeData, createdNode, fileNode;
                          return _regenerator2.default.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  nodeId = createNodeId('zwimlo-' + objectType + '-' + node.zwimlo_id);
                                  nodeType = 'Zwimlo' + _lodash2.default.upperFirst(objectType);

                                  verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' creating ' + objectType + ' with ID: ' + nodeId);

                                  verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' and gatsby node type: ' + nodeType);
                                  nodeContent = (0, _stringify2.default)(node);
                                  nodeData = (0, _assign2.default)({}, node, {
                                    id: nodeId,
                                    parent: null,
                                    children: [],
                                    internal: {
                                      type: nodeType,
                                      mediaType: '' + (objectType === 'asset' ? node.file.contentType : 'application/json'),
                                      contentDigest: _crypto2.default.createHash('md5').update(nodeContent).digest('hex')
                                    }
                                  });


                                  createNode(nodeData);

                                  verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' nodeData ID: ' + nodeData.id);
                                  createdNode = getNode(nodeData.id);

                                  if (!(nodeType === 'ZwimloAsset')) {
                                    _context.next = 20;
                                    break;
                                  }

                                  _context.next = 12;
                                  return (0, _gatsbySourceFilesystem.createRemoteFileNode)({
                                    url: createdNode.file.url,
                                    store: store,
                                    cache: cache,
                                    createNode: createNode,
                                    createNodeId: createNodeId
                                  });

                                case 12:
                                  fileNode = _context.sent;


                                  console.log('createdNode', createdNode.zwimlo_id);

                                  verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' createdNode ID: ' + createdNode.id);

                                  verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' fileNode ID: ' + fileNode.id);


                                  createdNode.relativePath___NODE = fileNode.id;

                                  _context.next = 19;
                                  return createNodeField({
                                    node: fileNode,
                                    name: 'ZwimloAsset',
                                    value: createdNode.zwimlo_id
                                  });

                                case 19:
                                  verbose && console.log(_chalk2.default.magentaBright('zwimlo') + ' ' + objectType + ' node created');

                                case 20:
                                case 'end':
                                  return _context.stop();
                              }
                            }
                          }, _callee, undefined);
                        }));

                        return function (_x3) {
                          return _ref4.apply(this, arguments);
                        };
                      }()), _fs2.default.writeFile('test.json', documents, function (error) {
                        {
                          error && console.log(error);
                        }
                      }));

                    case 8:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _loop, undefined);
            });
            _context3.t0 = _regenerator2.default.keys(objectTypes);

          case 10:
            if ((_context3.t1 = _context3.t0()).done) {
              _context3.next = 15;
              break;
            }

            type = _context3.t1.value;
            return _context3.delegateYield(_loop(type), 't2', 13);

          case 13:
            _context3.next = 10;
            break;

          case 15:
            return _context3.abrupt('return');

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();