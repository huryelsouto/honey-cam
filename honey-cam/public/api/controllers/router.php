<?php
require_once __DIR__ . '/../../index.php';
require_once __DIR__ . '/camera.php';

// Define o cabeçalho de resposta como JSON
header('Content-Type: application/json');

// Obtenha a rota da URL
$request = $_SERVER['REQUEST_URI'];

// Remova query strings, se houver
$request = strtok($request, '?');

// Remove qualquer prefixo até a última barra antes da rota
$request = preg_replace('#^/api/controllers/router.php#', '', $request);

// Roteamento básico
switch ($request) {
    case '/login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Captura o conteúdo bruto da requisição
            $json = file_get_contents('php://input');
            // Decodifica o JSON em um array associativo
            $postData = json_decode($json, true);

            loginPostRoute($postData);
            //header('Location: /camera');
        } else {
            //loginRoute();
        }
        break;
    case '/logout':
        //logoutRoute();
        break;
    default:
        http_response_code(404);
        echo "404 Not Found";
        break;
}
?>