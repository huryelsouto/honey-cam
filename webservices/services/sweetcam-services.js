// Importação do módulo fs para lidar com sistema de arquivos
const fs = require('fs')

// Função para obter a configuração da câmera para imagem
const getCamPictureConfig = () => {
    // Lê o arquivo de configuração cam-picture.json e armazena seu conteúdo como uma string
    const jsonString = fs.readFileSync("./config/cam-picture.json");
    // Retorna o conteúdo do arquivo convertido de JSON para um objeto JavaScript
    return JSON.parse(jsonString);
}

// Função para obter a configuração da câmera para vídeo
const getCamVideoConfig = () => {
    // Lê o arquivo de configuração cam-video.json e armazena seu conteúdo como uma string
    const jsonString = fs.readFileSync("./config/cam-video.json");
    // Retorna o conteúdo do arquivo convertido de JSON para um objeto JavaScript
    return JSON.parse(jsonString);
}

// Função para obter a configuração da marca
const getBrandConfig = () => {
    // Lê o arquivo de configuração brand.json e armazena seu conteúdo como uma string
    const jsonString = fs.readFileSync("./config/brand.json");
    // Retorna o conteúdo do arquivo convertido de JSON para um objeto JavaScript
    return JSON.parse(jsonString);
}

// Função para obter o meio (medium) de interação (vídeo, imagem, etc.)
const getMedium = () => {
    // Lê o arquivo de configuração sweetcam.json e armazena seu conteúdo como uma string
    const jsonString = fs.readFileSync("./config/sweetcam.json");
    // Retorna o meio de interação definido no arquivo de configuração
    return JSON.parse(jsonString).medium;
}

// Função para obter o limite de login definido no arquivo de configuração
const getLoginLimit = () => {
    // Lê o arquivo de configuração sweetcam.json e armazena seu conteúdo como uma string
    const jsonString = fs.readFileSync("./config/sweetcam.json");
    // Retorna o limite de login definido no arquivo de configuração
    return JSON.parse(jsonString).loginLimit;
}

// Exportação das funções para uso em outros módulos
module.exports = { getCamPictureConfig, getCamVideoConfig, getBrandConfig, getMedium, getLoginLimit}
