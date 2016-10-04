'use strict';

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaAccesslog = require('koa-accesslog');

var _koaAccesslog2 = _interopRequireDefault(_koaAccesslog);

var _koaCompress = require('koa-compress');

var _koaCompress2 = _interopRequireDefault(_koaCompress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _koa2.default)();

var serverAttr = { port: 8500, root: './dist' };

app.use((0, _koaCompress2.default)({
    filter: function filter(content_type) {
        return (/text/i.test(content_type)
        );
    },

    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));
app.use((0, _koaAccesslog2.default)());
app.use((0, _koaStatic2.default)(serverAttr.root));
app.listen(serverAttr.port);

console.log('listening on port ' + serverAttr.port);