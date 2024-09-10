<?php

// Carrega os dados dos usuários a partir do arquivo JSON
$usersFilePath = __DIR__ . '/../data/users.json';
$users = json_decode(file_get_contents($usersFilePath), true);

class User
{
    // Retorna todos os usuários
    public static function findAll()
    {
        global $users;
        return $users;
    }

    // Retorna o usuário pelo ID
    public static function findByPk($id)
    {
        global $users;
        foreach ($users as $user) {
            if ($user['id'] === $id) {
                return $user;
            }
        }
        return null;
    }

    // Retorna o usuário pelo nome
    public static function findOne($conditions)
    {
        global $users;
        $name = $conditions['where']['name'];
        foreach ($users as $user) {
            if ($user['name'] === $name) {
                return $user;
            }
        }
        return null;
    }
}

// Para simular o comportamento do "module.exports" do Node.js em PHP, você simplesmente usa a classe User diretamente em outros arquivos.

?>