<?php

// Função para ler um arquivo JSON e convertê-lo em um array associativo
function readJsonFile($filePath) {
    // Lê o conteúdo do arquivo JSON como string
    $jsonString = file_get_contents($filePath);
    // Converte a string JSON em um array associativo e retorna
    return json_decode($jsonString, true);
}

// Função para obter a configuração da câmera para imagem
function getCamPictureConfig() {
    // Lê o arquivo de configuração cam-picture.json e retorna o conteúdo como array
    return readJsonFile(__DIR__ . "/../config/cam-picture.json");
}

// // Função para obter a configuração da câmera para vídeo
// function getCamVideoConfig() {
//     // Lê o arquivo de configuração cam-video.json e retorna o conteúdo como array
//     return readJsonFile(__DIR__ . "/../config/cam-video.json");
// }

// Função para obter a configuração da marca
function getBrandConfig() {
    // Lê o arquivo de configuração brand.json e retorna o conteúdo como array
    return readJsonFile(__DIR__ . "/../config/brand.json");
}

// Função para obter o meio (medium) de interação (vídeo, imagem, etc.)
function getMedium() {
    // Lê o arquivo de configuração sweetcam.json e retorna o valor de 'medium'
    $config = readJsonFile(__DIR__ . "/../config/sweetcam.json");
    return $config['medium'];
}

// Função para obter o limite de login definido no arquivo de configuração
function getLoginLimit() {
    // Lê o arquivo de configuração sweetcam.json e retorna o valor de 'loginLimit'
    $config = readJsonFile(__DIR__ . "/../config/sweetcam.json");
    return $config['loginLimit'];
}

?>
