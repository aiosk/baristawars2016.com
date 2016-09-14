<?php
// Routes

//$app->get('/[{name}]', function ($request, $response, $args) {
//    // Sample log message
//    $this->logger->info("Slim-Skeleton '/' route");
//
//    // Render index view
//    return $this->renderer->render($response, 'index.phtml', $args);
//});

$app->get('/helper/time', function ($request, $response, $args) {
    $this->logger->info("get current time and timezone");

    $tz = $this->get('settings')['timezone'];
    $format = 'Y-m-d H:i:s';
    date_default_timezone_set($tz);

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

    return $response;
//        ->withHeader('Access-Control-Allow-Origin', '*')
//        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
//        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});


$app->post('/registration', function ($request, $response) {
    $this->logger->info("save registration form");

    $response_data = [
        'status' => true,
        'message' => 'registration success'
    ];

    try {
        $files = $request->getUploadedFiles();
        $picture = $files['picture'];

        $fileLoc = '';
        if (!empty($picture)) {
            $fileExt = explode('/', $picture->getClientMediaType())[1];
            $fileLoc = 'uploads/' . uniqid('img_', true) . '.' . $fileExt;
            $picture->moveTo('../' . $fileLoc);
        }


        $data = $request->getParsedBody();

        $q = 'select count(id) total from user where email=":email")';
        $st = $this->db->prepare($q)->execute([
            ':email' => $data['email']
        ]);
        $user_exist = $st->fetch();
        var_dump($user_exist->total);

        $q = 'insert into user (email) values (:email)';
        $st = $this->db->prepare($q)->execute([
            ':email' => $data['email']
        ]);

        $q = 'insert into user_detail (user_id,name,dob,address,picture) values (:id,:name,:dob,:address,:picture)';
        $st = $this->db->prepare($q)->execute([
            ':id' => $this->db->lastInsertId(),
            ':name' => $data['name'],
            ':dob' => $data['dob'],
            ':address' => $data['address'],
            ':picture' => $fileLoc,
        ]);;
    } catch (Exception $e) {
        var_dump($e);
    }

    $response->withJson($response_data);

    return $response;
//        ->withHeader('Access-Control-Allow-Origin', '*')
//        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
//        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});