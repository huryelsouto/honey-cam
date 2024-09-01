<?php

// Função para criar um hash da senha
function createPasswordHash($password)
{
    return password_hash($password, PASSWORD_BCRYPT);
}

// Função para verificar se a senha fornecida corresponde ao hash armazenado
function verifyPassword($password, $hash)
{
    return password_verify($password, $hash);
}

// Função para obter o caminho do arquivo JSON
function getStoragePath($relativePath)
{
    return __DIR__ . '/../' . $relativePath;
}

// Função para obter o número de administradores
function getNumberOfAdmins()
{
    $adminsFilePath = getStoragePath('data/admins.json');
    $admins = json_decode(file_get_contents($adminsFilePath), true);
    return count($admins); // Conta o número de admins no JSON
}

// Função para adicionar um novo administrador
function addAdmin($name, $password)
{
    $adminsFilePath = getStoragePath('data/admins.json');
    $admins = json_decode(file_get_contents($adminsFilePath), true);

    $passwordHash = createPasswordHash($password);

    $newAdmin = [
        'id' => count($admins) + 1,
        'name' => $name,
        'passwordHash' => $passwordHash
    ];

    $admins[] = $newAdmin;

    // Atualiza o arquivo JSON
    file_put_contents($adminsFilePath, json_encode($admins, JSON_PRETTY_PRINT));

    return $newAdmin;
}

// Função de exemplo para upload de marcas
function uploadBrands()
{
    // Aqui você pode adicionar o código para lidar com o upload de marcas
    echo "Upload de marcas realizado com sucesso!";
}

// Função de exemplo para upload de imagens
function uploadImages()
{
    // Aqui você pode adicionar o código para lidar com o upload de imagens
    echo "Upload de imagens realizado com sucesso!";
}

// Função de exemplo para upload de vídeos
function uploadVideos()
{
    // Aqui você pode adicionar o código para lidar com o upload de vídeos
    echo "Upload de vídeos realizado com sucesso!";
}

// Exporte as funções para uso em outros módulos
return [
    'getNumberOfAdmins' => 'getNumberOfAdmins',
    'addAdmin' => 'addAdmin',
    'uploadBrands' => 'uploadBrands',
    'uploadImages' => 'uploadImages',
    'uploadVideos' => 'uploadVideos'
];

?>