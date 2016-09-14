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
    $fileLoc = '';

    try {
        $files = $request->getUploadedFiles();
        $picture = $files['picture'];

        if (!empty($picture->getClientMediaType())) {
            $fileExt = explode('/', $picture->getClientMediaType())[1];
            $fileLoc = 'uploads/' . uniqid('img_', true) . '.' . $fileExt;
            $picture->moveTo('../' . $fileLoc);
        }

        $data = $request->getParsedBody();

        $st = $this->db->prepare("select count(id) total from user where email=:email");
        $st->execute([':email' => $data['email']]);
        $user_exist = $st->fetch();
        if ((int)$user_exist['total'] == 0) {

            $st = $this->db->prepare('insert into user (email) values (:email)');
            $st->execute([':email' => $data['email']]);

            $q = 'insert into user_detail (user_id,name,dob,address,picture) values (:id,:name,:dob,:address,:picture)';
            $st = $this->db->prepare($q);
            $st->execute([
                ':id' => $this->db->lastInsertId(),
                ':name' => $data['name'],
                ':dob' => $data['dob'],
                ':address' => $data['address'],
                ':picture' => $fileLoc,
            ]);
        }

    } catch (Exception $e) {
        $response_data = [
            'status' => false,
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
//            'trace' => $e->getTraceAsString(),
        ];
    }

    $response->withJson($response_data);

    return $response;
});

$app->get('/participant', function ($request, $response) {
    $this->logger->info("save registration form");

    $response_data = [
        'status' => true,
    ];
    try {
        $st = $this->db->prepare("SELECT u.id,email,registration_time,confirm_time,participant_id,
ud.name,dob,address,picture,
c.name coffeeshop_name,c.location coffeeshop_location FROM `user` u
left join user_detail ud on u.id = ud.user_id
left join coffeeshop c on u.coffee_id = c.id");
        $st->execute();
        $participants = $st->fetchAll();
        $response_data['items'] = $participants;
        $response_data['total'] = count($participants);
    } catch (Exception $e) {
        $response_data = [
            'status' => false,
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
//            'trace' => $e->getTraceAsString(),
        ];
    }
    $response->withJson($response_data);

    return $response;
});