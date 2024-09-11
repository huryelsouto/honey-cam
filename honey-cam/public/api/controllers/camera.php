<?php
require_once __DIR__ . '/../services/sweetcam-services.php';
require_once __DIR__ . '/../services/user-services.php';

// // Variável para armazenar o momento em que o processo de login começou
$beginTimeOfLogin = 0;

// Rota principal que determina se o usuário será redirecionado para a visualização de vídeo ou imagem com base na configuração atual do serviço
function mainRoute()
{
    global $beginTimeOfLogin;

    // Obtém o tipo de mídia atual (vídeo ou imagem)
    $medium = getMedium();

    // Se a mídia for vídeo
    if ($medium === "video") {
        $config = array_merge(getCamVideoConfig(), getBrandConfig(), ["userName" => $_SESSION['username']]);
        include '/views/video.html';
    }
    // Se a mídia for imagem
    elseif ($medium === "picture") {
        // Configura o objeto de configuração para a visualização de imagem
        $config = array_merge(getCamPictureConfig(), getBrandConfig(), ["userName" => $_SESSION['username']]);
        // Renderiza a visualização de imagem passando as configurações
        return $config;
    }
}

function auth()
{
    if (isset($_SESSION['authenticated']) && $_SESSION['authenticated']) {
        http_response_code(200);
        $authInfos = ['authenticated' => true, 'username' => $_SESSION['username']];
    } else {
        http_response_code(404);
        $authInfos = ['authenticated' => false];
    }
    return $authInfos;
}

// Rota para lidar com o processo de login
function loginPostRoute($loginData)
{
    global $beginTimeOfLogin;

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
            http_response_code(403);
            echo json_encode(["error" => "login request reached limit"]);
            return;
        }
    } else {
        // Se passou mais de 60 segundos desde o último início de login, redefine a contagem de tentativas de login como 1 e armazena o momento atual
        $_SESSION['loginTimes'] = 1;
        $beginTimeOfLogin = time();
    }

    // Verifica se os dados necessários foram enviados
    if (isset($loginData['username']) && isset($loginData['password'])) {
        $username = $loginData['username'];
        $password = $loginData['password'];


        // Obtém o hash da senha do usuário pelo nome de usuário
        try {
            $passwordHash = findUserPasswordHashByName($username);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }

        // Compara a senha fornecida com o hash de senha armazenado
        if (password_verify($password, $passwordHash)) {
            // Se as senhas corresponderem, armazena o nome de usuário na sessão e retorna uma mensagem de sucesso
            $_SESSION['username'] = $username;
            // Login bem-sucedido, iniciar a sessão
            $_SESSION['authenticated'] = true;
            $_SESSION['username'] = $username;
            http_response_code(200);
            echo json_encode(["message" => "succeed"]);
            return $_SESSION;
        } else {
            // Se as senhas não corresponderem, retorna um erro de senha incorreta
            http_response_code(401);
            echo json_encode(["error" => "wrong password"]);
            return;
        }
    } else {
        // Resposta de erro se os dados estiverem faltando
        echo json_encode($loginData);
        http_response_code(400);
        return;
    }
}

// // Rota para efetuar logout
// function logoutRoute()
// {
//     // Destroi a sessão do usuário
//     session_destroy();
//     // Redireciona para a página de login
//     header("Location: /login");
//     exit();
// }
?>