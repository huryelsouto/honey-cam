<?php

// // Função para criar um hash da senha
// function createPasswordHash($password) {
//     return password_hash($password, PASSWORD_BCRYPT);
// }

// // Função para verificar se a senha fornecida corresponde ao hash armazenado
// function verifyPassword($password, $hash) {
//     return password_verify($password, $hash);
// }

// Função para obter o caminho do arquivo JSON
function getStoragePath($relativePath)
{
    return __DIR__ . '/' . $relativePath;
}

// // Função para adicionar um novo usuário
// function addUser($name, $password) {
//     $passwordHash = createPasswordHash($password);

//     // Simulação de inserção no "banco de dados" JSON
//     $usersFilePath = getStoragePath('/api/data/users.json');
//     $users = json_decode(file_get_contents($usersFilePath), true);

//     $newUser = [
//         'id' => count($users) + 1,
//         'name' => $name,
//         'passwordHash' => $passwordHash
//     ];

//     $users[] = $newUser;

//     // Atualizando o arquivo JSON
//     file_put_contents($usersFilePath, json_encode($users, JSON_PRETTY_PRINT));

//     return $newUser;
// }

// // Função para autenticar um usuário
// function authenticateUser($name, $password) {
//     // Busca do usuário pelo nome
//     $usersFilePath = getStoragePath('/api/data/users.json');
//     $users = json_decode(file_get_contents($usersFilePath), true);
//     $user = array_filter($users, function($user) use ($name) {
//         return $user['name'] === $name;
//     });

//     if (empty($user)) {
//         throw new Exception('User not found');
//     }

//     $user = array_values($user)[0];

//     // Comparação da senha fornecida com o hash armazenado
//     if (!verifyPassword($password, $user['passwordHash'])) {
//         throw new Exception('Incorrect password');
//     }

//     return $user;
// }

// Função para encontrar o hash da senha de um usuário pelo nome
function findUserPasswordHashByName($name)
{
    $usersFilePath = getStoragePath('../data/users.json');

    if (!file_exists($usersFilePath)) {
        throw new Exception('Users file not found');
    }

    $usersData = json_decode(file_get_contents($usersFilePath), true);
    $user = array_filter($usersData, function ($user) use ($name) {
        return $user['name'] === $name;
    });

    if (empty($user)) {
        throw new Exception('User not found');
    }

    return array_values($user)[0]['passwordHash'];
}

?>