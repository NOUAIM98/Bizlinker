<?php

return [
    'paths' => ['api/*', 'auth/*', 'login', 'register'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:8081'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];