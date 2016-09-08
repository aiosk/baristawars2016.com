'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _hapi2.default.Server();

server.connection({
    port: 3000,
    routes: {
        cors: true
    }
});

var parseParam = function parseParam(param) {
    var result = {};

    if (param.data != null && Object.keys(param).length === 1) {
        if (_.isString(param.data) && param.data.trim().length > 0) {
            param = JSON.parse(param.data);
            result = parseParam(param);
        } else if (_.isArray(param.data) && param.data.length > 0) {
            result = param.data;
        }
    } else {
        result = param;
    }

    return result;
};

var options = {};

server.register(options, function (err) {
    if (err) {
        throw err;
    } else {
        server.start(function (err) {
            if (err) {
                throw err;
            }

            server.log('info', 'Server running at: ' + server.info.uri);
        });
    }
});