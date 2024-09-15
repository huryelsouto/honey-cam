<?php
require_once __DIR__ . '/../../services/sweetcam-services.php';
require_once __DIR__ . '/../../services/user-services.php';

session_start();

// Verifica se o método da requisição é POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    // Decodifica o JSON em um array associativo
    $postData = json_decode($json, true);

    $beginTimeOfLogin = 0;

    // Obtém a sessão atual
    $session = $_SESSION;
    // Obtém o limite de tentativas de login
    $loginLimit = getLoginLimit();

    // Se a contagem de tentativas de login não existir na sessão, define-a como 0 e armazena o momento atual
    if (!isset($session['loginTimes'])) {
        $_SESSION['loginTimes'] = 0;
        $beginTimeOfLogin = time();
    }

    // Obtém o momento atual
    $currentTime = time();

    // Se o tempo desde o início do processo de login for inferior a 60 segundos
    if ($currentTime - $beginTimeOfLogin <= 60) {
        // Incrementa a contagem de tentativas de login
        $_SESSION['loginTimes'] += 1;

        // Se a contagem de tentativas de login ultrapassar o limite
        if ($_SESSION['loginTimes'] > $loginLimit) {
            // Retorna uma resposta de erro indicando que o limite de tentativas de login foi atingido
            echo json_encode(["error" => "login request reached limit"]);
            http_response_code(403);
            exit();
        }
    } else {
        // Se passou mais de 60 segundos desde o último início de login, redefine a contagem de tentativas de login como 1 e armazena o momento atual
        $_SESSION['loginTimes'] = 1;
        $beginTimeOfLogin = time();
    }

    // Verifica se os dados necessários foram enviados
    if (isset($postData['username']) && isset($postData['password'])) {
        $username = $postData['username'];
        $password = $postData['password'];


        // Obtém o hash da senha do usuário pelo nome de usuário
        try {
            $passwordHash = findUserPasswordHashByName($username);
        } catch (Exception $e) {
            echo json_encode(['error' => 'User not found']);
            http_response_code(404);
            exit();
        }

        // Compara a senha fornecida com o hash de senha armazenado
        if (password_verify($password, $passwordHash)) {
            // Se as senhas corresponderem, armazena o nome de usuário na sessão e retorna uma mensagem de sucesso
            $_SESSION['username'] = $username;
            // Login bem-sucedido, iniciar a sessão
            $_SESSION['authenticated'] = true;
            $_SESSION['username'] = $username;
            echo json_encode(["username" => $_SESSION["username"]]);
            http_response_code(200);

            exit();
        } else {
            // Se as senhas não corresponderem, retorna um erro de senha incorreta
            echo json_encode(["error" => "wrong password"]);
            http_response_code(401);
            exit();
        }
    } else {
        // Resposta de erro se os dados estiverem faltando
        echo json_encode(["error" => "unsuficient data"]);
        http_response_code(400);
        exit();
    }

} else {
    // Se não for uma requisição POST, retorna uma resposta de erro
    echo json_encode(['error' => 'Invalid request method. Please use POST.']);
    header('Content-Type: application/json');
}
?>