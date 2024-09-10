<?php
// Importa os serviços relacionados à administração
require_once '../services/admin-services.php';
// Importa os serviços relacionados aos usuários
require_once '../services/user-services.php';
// Importa os serviços relacionados à sweetcam
require_once '../services/sweetcam-services.php';
// Importa os serviços JWT personalizados
require_once '../utils/jwt-services.php';
// Inicia a sessão
session_start();

// Define um prefixo para as rotas de administração baseado na variável de ambiente ADMIN_PATH
$prefix = getenv('ADMIN_PATH');

// Rota para login de administrador
function adminLogin() {
    $username = $_POST['username'] ?? null;
    $password = $_POST['password'] ?? null;

    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'username or password is null']);
        exit();
    }

    $credentials = findAdminCredentialsByName($username);
    $passwordHash = $credentials['passwordHash'];
    $name = $credentials['name'];
    $id = $credentials['id'];

    if (password_verify($password, $passwordHash)) {
        $userForToken = [
            'id' => $id,
            'username' => $username
        ];
        $token = jwt_encode($userForToken, getenv('JWT_SECRET'), ['expiresIn' => 3600]);
        echo json_encode(['token' => $token, 'username' => $username]);
    } else {
        sendEmail("Attempt to login as admin failed");
        http_response_code(401);
        echo json_encode(['error' => 'failed']);
    }
}

// Rota para atualização de senha de administrador
function updateAdminPassword() {
    $newPassword = $_POST['newPassword'] ?? null;

    if (!$newPassword) {
        http_response_code(400);
        echo json_encode(['error' => 'provide new password is null']);
        exit();
    }

    $decodedToken = jwt_decode(getJWTToken(), getenv('JWT_SECRET'));
    $id = $decodedToken->id;
    updatePassword($id, $newPassword);

    http_response_code(200);
    echo json_encode(['message' => "password update succeed"]);
}

// Rota para obtenção da imagem da câmera
function getPicture() {
    $config = array_merge(getCamPictureConfig(), getBrandConfig(), ["userName" => "admin"]);
    include '../views/picture.php';
}

// Rota para obtenção do vídeo da câmera
function getVideo() {
    $config = array_merge(getCamVideoConfig(), getBrandConfig(), ["userName" => "admin"]);
    include '../views/video.php';
}

// Rota para adição de usuário para o serviço sweetcam
function addUser() {
    $userInfo = $_POST;
    $savedUser = addUser($userInfo['name'], $userInfo['password']);
    http_response_code(201);
    echo json_encode($savedUser);
}

// Rota para revisão da configuração da imagem da câmera
function updateCamPictureConfig() {
    $name = $_POST['name'];
    $value = $_POST['value'];
    configCamPicture($name, $value);
    http_response_code(200);
    echo json_encode(['message' => "$name has been updated to $value"]);
}

// Rota para obtenção da configuração da imagem da câmera
function getCamPictureConfig() {
    $camPictureConfig = getCamPictureConfig();
    echo json_encode($camPictureConfig);
}

// Rota para revisão da configuração do vídeo da câmera
function updateCamVideoConfig() {
    $name = $_POST['name'];
    $value = $_POST['value'];
    configCamVideo($name, $value);
    http_response_code(200);
    echo json_encode(['message' => "$name has been updated to $value"]);
}

// Rota para obtenção da configuração do vídeo da câmera
function getCamVideoConfig() {
    $camVideoConfig = getCamVideoConfig();
    echo json_encode($camVideoConfig);
}

// Rota para upload de imagem da marca
function uploadBrandImage() {
    $path = uploadBrands()['path'];
    $storedPath = explode('public', $path)[1];
    http_response_code(200);
    echo json_encode(['message' => 'Succeed', 'storedPath' => $storedPath]);
}

// Rota para upload de imagem panorâmica
function uploadPanoramicImage() {
    $path = uploadImages()['path'];
    $storedPath = explode('public', $path)[1];
    http_response_code(200);
    echo json_encode(['message' => 'Succeed', 'storedPath' => $storedPath]);
}

// Rota para upload de vídeo panorâmico
function uploadPanoramicVideo() {
    $path = uploadVideos()['path'];
    $storedPath = explode('public', $path)[1];
    http_response_code(200);
    echo json_encode(['message' => 'Succeed', 'storedPath' => $storedPath]);
}

// Definindo as rotas
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($path) {
    case "/$prefix/login":
        adminLogin();
        break;
    case "/$prefix/password":
        if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
            updateAdminPassword();
        }
        break;
    case "/$prefix/picture":
        getPicture();
        break;
    case "/$prefix/video":
        getVideo();
        break;
    case "/$prefix/user":
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            addUser();
        }
        break;
    case "/$prefix/config/cam-picture":
        if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
            updateCamPictureConfig();
        } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
            getCamPictureConfig();
        }
        break;
    case "/$prefix/cam-video":
        if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
            updateCamVideoConfig();
        } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
            getCamVideoConfig();
        }
        break;
    case "/$prefix/brands":
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            uploadBrandImage();
        }
        break;
    case "/$prefix/images":
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            uploadPanoramicImage();
        }
        break;
    case "/$prefix/videos":
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            uploadPanoramicVideo();
        }
        break;
    default:
        http_response_code(404);
        echo "404 Not Found";
        break;
}
?>
