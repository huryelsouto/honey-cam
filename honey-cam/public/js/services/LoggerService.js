class LoggerService {
    // Instância estática que será retornada
    static instance;

    constructor() {
        if (LoggerService.instance) {
            return LoggerService.instance;  // Retorna a instância existente se já tiver sido criada
        }

        this.logs = [];
        LoggerService.instance = this;      // Define a instância única
    }

    // Função para criar o objeto de log
    createLogObject(message, method = 'GET', body = {}, user = 'Anonymous') {
        const logObject = {
            path: window.location.pathname,          // Obtém o path atual
            message: message,                        // Mensagem descritiva do log
            method: method,                          // Método HTTP (pode ser 'GET', 'POST', etc.)
            body: body,                              // Corpo da requisição ou outros dados
            ip: '::',                                // IP (capturado no backend, aqui é apenas um placeholder)
            user: user,  // Captura o usuário logado ou 'Anonymous'
            timestamp: new Date().toISOString()      // Timestamp no formato ISO
        };

        return logObject;
    }

    // Função para adicionar o log ao array de logs
    addLog(message, method = 'GET', body = {}, user = 'Anonymous') {
        const logObject = this.createLogObject(message, method, body, user);
        this.logs.push(logObject);
        this.sendLogToBackend(logObject); // Opcional: enviar o log para o backend
        console.log('Log registrado:', logObject);
        console.log(this.logs);
    }

    // Função para enviar o log para o backend (opcional)
    sendLogToBackend(logObject) {
        fetch('/api/controllers/logger-controller/action.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logObject)
        })
        .then(response => response.json())
        .then(data => console.log('Log enviado ao backend:', data))
        .catch(error => console.error('Erro ao enviar log:', error));
    }

    // Função para visualizar todos os logs
    viewLogs() {
        return this.logs;
    }
}

// Exporta uma instância da classe LoggerService como singleton
const loggerService = new LoggerService();
Object.freeze(loggerService);  // Impede que novas propriedades sejam adicionadas ou que a instância seja modificada

export default loggerService;
