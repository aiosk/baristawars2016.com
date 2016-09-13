import Hapi from 'hapi';

const server = new Hapi.Server();

server.connection({
    port: 3500,
    routes: {
        cors: true
    }
});

let parseParam = function (param) {
    let result = {};

    if ((param.data != null) && Object.keys(param).length === 1) {
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

const options = {};