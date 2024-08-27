// Importação dos módulos necessários do Winston para lidar com logs
const { format, createLogger, transports } = require("winston");
// Importa o módulo para rotacionar os arquivos de log diariamente
require("winston-daily-rotate-file")

// Configuração do transporte para rotacionar os arquivos de log diariamente
const fileRotateTransport = new transports.DailyRotateFile({
    filename: "logs/%DATE%.log", // Nome do arquivo de log com a data atual
    datePattern: "YYYY-MM-DD", // Padrão de formatação de data no nome do arquivo
    maxFiles: "14d", // Número máximo de dias que os arquivos de log serão mantidos
});

// Configuração geral para o logger
const logConfiguration = {
    transports: [
        new transports.Console(), // Transporte para exibir logs no console
        fileRotateTransport // Transporte para salvar logs em arquivos rotacionados
    ],
    format: format.combine( // Formato de log combinando timestamp e mensagem em formato JSON
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss' // Formato de timestamp
        }),
        format.printf(info => `${JSON.stringify(info)}`) // Formato de mensagem
    )
};

// Criação do logger com a configuração definida anteriormente
const logger= createLogger(logConfiguration);

// Exportação do logger para que possa ser utilizado em outros módulos
module.exports = logger
