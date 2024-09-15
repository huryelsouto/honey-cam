<?php
session_start();

// Verifica se o método da requisição é GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_SESSION['authenticated']) && $_SESSION['authenticated']) {
        echo json_encode(["username" => $_SESSION["username"], "authenticated" => $_SESSION["authenticated"]]);
    } else {
        echo json_encode(["error" => "user not logged"]);
        http_response_code(404);
        exit();
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid request method. Please use GET.']);
}
?>