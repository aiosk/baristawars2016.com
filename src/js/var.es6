//const isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';
const isProd = true;

let urlBase = '192.168.2.50:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com/public'
}
urlBase = `http://${urlBase}`;
