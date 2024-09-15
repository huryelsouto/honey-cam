<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    session_unset();

    session_destroy();

    http_response_code(200);

    header("Location: /");

} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid request method. Please use POST.']);
}

exit();
?>