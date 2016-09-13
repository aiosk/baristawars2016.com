<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';


$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$config['db']['host'] = "localhost";
$config['db']['user'] = "baristawars";
$config['db']['pass'] = "baristawars";
$config['db']['dbname'] = "baristawars";

$app = new \Slim\App(["settings" => $config]);

$container = $app->getContainer();
$container['logger'] = function ($c) {
    $logger = new \Monolog\Logger('baristawars_logger');
    $file_handler = new \Monolog\Handler\StreamHandler("../logs/app.log");
    $logger->pushHandler($file_handler);
    return $logger;
};
$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO("mysql:host=" . $db['host'] . ";dbname=" . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

$app->get('/helper/time', function (Request $request, Response $response) {
//    $name = $request->getAttribute('name');
//    $response->getBody()->write("Hello, $name");
    $this->logger->addInfo("get current time and timezone");
    $tz = 'Asia/Jakarta';
    date_default_timezone_set($tz);

    $format = 'Y-m-d H:i:s';
    $now = new DateTime("now");
    $registration = [
        'start' => new DateTime('2016-09-12 00:00:00'),
        'end' => new DateTime('2016-09-25 23:59:59'),
    ];


    $data = [
        'current' => $now->format($format),
        'registration' => [
            'start' => $registration['start']->format($format),
            'end' => $registration['end']->format($format)
        ],
        'registrationOpen' => $now > $registration['start'] && $now < $registration['end'],
        'timezone' => $tz
    ];
    $response->withJson($data);

    return $response->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');;
});

$app->post('/registration', function (Request $request, Response $response) {
    $this->logger->addInfo("save registration form");
    $data = $request->getBody();
    $files = $request->getUploadedFiles();
    $picture = $files['picture'];

    $fileExt = explode('/', $picture->getClientMediaType())[1];
    $fileLoc = '../uploads/' . uniqid('img_', true) . '.' . $fileExt;
    $picture->moveTo($fileLoc);

    $data = [
        'status' => true,
        'message' => 'registration success'
    ];
    $response->withJson($data);

    return $response->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

$app->run();