<?php
session_start();

function isUserLoggedIn() {
    // Verifica se a variável de sessão 'user_id' está definida
    if (isset($_SESSION['username'])) {
        return true;  // O usuário está logado
    } else {
        return false; // O usuário não está logado
    }
}

// Capturar a rota da URL
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Definir rotas protegidas
$protected_routes = ['/camera'];

// Verificar se o caminho é protegido e se o usuário está autenticado
if (in_array($path, $protected_routes)) {
    if (!isUserLoggedIn()) {
        // Redirecionar para a página de login se o usuário não estiver autenticado
        header('Location: /');
        exit();
    }
}

// Carregar o conteúdo com base na rota
switch ($path) {
    case '/':
        include 'views/login.html';
        break;
    case '/camera':
        include 'views/picture.html';
        break;
    default:
        http_response_code(404);
        echo "404 - Página não encontrada: " . htmlspecialchars($path);
        break;
}
?>