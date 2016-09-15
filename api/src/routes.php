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
        'start' => new DateTime('2016-09-13 00:00:00'),
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
        'message' => 'Registration success'
    ];

    try {
        $data = $request->getParsedBody();
//        var_dump($data);

        foreach (['name', 'email'] as $v) {
            $text = ucfirst($v);
            $data[$v] = filter_var($data[$v], FILTER_SANITIZE_STRING);
            if (empty($data[$v])) {
                throw new Exception(ucfirst($text) . " is empty");
            }
        }

        if (!$data['email'] = filter_var($data['email'], FILTER_SANITIZE_EMAIL)) {
            throw new Exception("Email is not valid");
        }
        $data['dob'] = filter_var($data['dob'], FILTER_VALIDATE_REGEXP, array("options" => array("regexp" => "/\d{4}\-\d{2}\-\d{2}/")));
        if (!$data['dob']) {
            throw new Exception("Date of Birth is not valid");
        }

        $st = $this->db->prepare("select count(id) total from user where email=:email");
        $st->execute([':email' => $data['email']]);
        $user_exist = $st->fetch();

        if ((int)$user_exist['total'] > 0) {

            throw new Exception("'" . $data['email'] . "' already registered");
        }

        $files = $request->getUploadedFiles();
        $picture = $files['picture'];
        $fileLoc = '';
        if (!empty($picture->getClientMediaType())) {
            $pictureSize = $picture->getSize() / 1024 / 1024;
            if ($pictureSize > 1) {
                throw new Exception("Picture is too big");
            }
            $fileExt = explode('/', $picture->getClientMediaType())[1];
            $fileLoc = 'uploads/' . uniqid('img_', true) . '.' . $fileExt;
            $picture->moveTo(__DIR__ . '/../../' . $fileLoc);
        } else {
            throw new Exception("Picture is empty");
        }

        $coffeeshop_id = 0;
        if (!empty($data['coffeeshop_location'])) {
            $location = json_decode($data['coffeeshop_location']);

            $st = $this->db->prepare("select id from coffeeshop where name=:name");

            $st->execute([':name' => $location->name]);
            $coffeeshop_exist = $st->fetch();

            if (empty($coffeeshop_exist)) {
                $st = $this->db->prepare('insert into coffeeshop (name,location) values (:name,:location)');
                $st->execute([
                    ':name' => $location->name,
                    ':location' => $location->lat . ',' . $location->lng,
                ]);

                $coffeeshop_id = $this->db->lastInsertId();
            } else {
                $coffeeshop_id = $coffeeshop_exist['id'];
            }
        }

        $st = $this->db->prepare('insert into user (email,coffee_id) values (:email,:coffee_id)');
        $st->execute([
            ':email' => $data['email'],
            ':coffee_id' => $coffeeshop_id,
        ]);

        $q = 'insert into user_detail (user_id,name,dob,address,picture) values (:id,:name,:dob,:address,:picture)';
        $st = $this->db->prepare($q);
        $st->execute([
            ':id' => $this->db->lastInsertId(),
            ':name' => $data['name'],
            ':dob' => $data['dob'],
            ':address' => $data['address'],
            ':picture' => $fileLoc,
        ]);

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
        'message' => '',
    ];
    try {
        $st = $this->db->prepare("SELECT u.id,email,registration_time,confirm_time,participant_id, 
ud.name,dob,address,picture, c.name coffeeshop_name,c.location coffeeshop_location 
FROM `user` u LEFT JOIN user_detail ud ON u.id = ud.user_id 
LEFT JOIN coffeeshop c ON u.coffee_id = c.id 
ORDER BY registration_time DESC");
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