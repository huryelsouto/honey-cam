<?php
// Verifica se a requisição é do tipo POST e se o conteúdo é JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] === 'application/json') {

    // Lê o corpo da requisição (JSON)
    $data = file_get_contents('php://input');
    
    // Decodifica o JSON para um array PHP
    $logObject = json_decode($data, true);

    if ($logObject !== null) {
        // Captura o IP do cliente que fez a requisição
        $clientIP = $_SERVER['REMOTE_ADDR'];

        // Sobrescreve o campo "ip" do log com o IP do cliente
        $logObject['ip'] = $clientIP;

        // Obtém a data atual
        $currentDate = date('Y-m-d');
        
        // Define o caminho do arquivo de logs com base na data
        $logFileName = __DIR__ . "/../../../logs/log_$currentDate.json";

        // Verifica se o diretório "logs" existe, se não, cria
        if (!is_dir(__DIR__ . "/../../../logs")) {
            mkdir(__DIR__ . "/../../../logs", 0755, true); // Cria o diretório com permissões adequadas
        }

        // Inicializa o array de logs
        $logs = [];

        // Se o arquivo já existir, lê o conteúdo
        if (file_exists($logFileName)) {
            $file = fopen($logFileName, 'r');
            $fileContent = fread($file, filesize($logFileName));
            fclose($file);
            $logs = json_decode($fileContent, true) ?? []; // Decodifica o conteúdo existente
        }

        // Adiciona o novo log ao array
        $logs[] = $logObject;

        // Converte o array de logs de volta para JSON
        $logsJson = json_encode($logs, JSON_PRETTY_PRINT);

        // Abre o arquivo no modo de escrita
        $file = fopen($logFileName, 'w');

        // Escreve o conteúdo JSON no arquivo
        fwrite($file, $logsJson);

        // Fecha o arquivo
        fclose($file);

        // Retorna uma resposta de sucesso
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => 'Success action!']);
    } else {
        // Erro ao decodificar o JSON
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid Data!']);
    }
} else {
    // Se não for uma requisição POST ou o conteúdo não for JSON
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Action not allowed']);
}
