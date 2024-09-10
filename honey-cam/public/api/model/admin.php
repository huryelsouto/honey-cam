<?php

// Carrega os dados dos administradores a partir do arquivo JSON
$adminsFilePath = __DIR__ . '/../data/admins.json';
$admins = json_decode(file_get_contents($adminsFilePath), true);

class Admin {
    // Retorna todos os administradores
    public static function findAll() {
        global $admins;
        return $admins;
    }

    // Retorna o administrador pelo ID
    public static function findByPk($id) {
        global $admins;
        foreach ($admins as $admin) {
            if ($admin['id'] === $id) {
                return $admin;
            }
        }
        return null;
    }

    // Retorna o administrador pelo nome
    public static function findOne($conditions) {
        global $admins;
        $name = $conditions['where']['name'];
        foreach ($admins as $admin) {
            if ($admin['name'] === $name) {
                return $admin;
            }
        }
        return null;
    }
}

// Para simular o comportamento do "module.exports" do Node.js em PHP, você simplesmente usa a classe Admin diretamente em outros arquivos.

?>
