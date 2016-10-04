import serve from 'koa-static';
import koa from 'koa';
import accesslog from 'koa-accesslog';
import compress from 'koa-compress';

let app = koa();

const serverAttr = {port: 8500, root: './dist'};

app.use(compress({
        filter(content_type) {
            return /text/i.test(content_type);
        },
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
    })
);
app.use(accesslog());
app.use(serve(serverAttr.root));
app.listen(serverAttr.port);

console.log(`listening on port ${serverAttr.port}`);
