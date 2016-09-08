

server.register(options, function (err) {
        if (err) {
            throw err;
        } else {
            server.start(function (err) {
                if (err) {
                    throw err;
                }

                server.log('info', `Server running at: ${server.info.uri}`);
            });
        }
    }
);