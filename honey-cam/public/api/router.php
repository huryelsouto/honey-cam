<?php
require_once __DIR__ . '/controllers/camera.php';

session_start();

// Define o cabeçalho de resposta como JSON
header('Content-Type: application/json');

// Obtenha a rota da URL
$request = $_SERVER['REQUEST_URI'];

// Remova query strings, se houver
$request = strtok($request, '?');

// Remove qualquer prefixo até a última barra antes da rota
$request = preg_replace('#^/api/router.php#', '', $request);

// Cria um novo objeto da classe Car
// $camera = new Camera();

// Roteamento básico
switch ($request) {
    case '/auth':
        $authInfos = auth();
        echo json_encode($authInfos);
        break;
    case '/camera':
        $cam_configs = mainRoute();

        http_response_code(200);
        echo json_encode($cam_configs);
        break;
    case '/login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Captura o conteúdo bruto da requisição
            $json = file_get_contents('php://input');
            // Decodifica o JSON em um array associativo
            $postData = json_decode($json, true);

            loginPostRoute($postData);
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

// switch ($request) {
//     case '/login':
//         loginTest();
//         // require __DIR__ . '/controllers/login.php';
//         break;

//     case '/register':
//         require __DIR__ . '/controllers/register.php';
//         break;

//     case '/profile':
//         require __DIR__ . '/controllers/profile.php';
//         break;

//     default:
//         // Resposta para rota não encontrada
//         echo json_encode(['error' => 'Rota não encontrada']);
//         http_response_code(404);
//         break;
// }
?>