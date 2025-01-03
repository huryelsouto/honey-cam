#!/usr/local/bin/bash

# Diretório onde os logs estão armazenados
logsDirectory="/Users/huryelsouto/Documents/faculdade/honey-cam/logs_coletados/access_logs"

# Função para executar o comando GoAccess em cada arquivo de log
process_log_file() {
    local filePath="$1"
    local outputHtml="${filePath}.html"
    
    echo "Processando arquivo: $filePath"
    
    LC_TIME="en_US.UTF-8" goaccess "$filePath" -o "$outputHtml" --log-format=COMBINED
    
    if [ $? -eq 0 ]; then
        echo "Relatório gerado para: $filePath"
    else
        echo "Erro ao processar o arquivo: $filePath" >&2
        return 1
    fi
}

# Função para unificar todos os logs em um único arquivo
merge_logs() {
    local logFiles=("$@")
    local outputLog="$logsDirectory/unified_log.log"
    
    cat "${logFiles[@]}" > "$outputLog"
    
    if [ $? -eq 0 ]; then
        echo "Logs unificados em: $outputLog"
    else
        echo "Erro ao unificar os logs" >&2
        return 1
    fi
}

# Função principal que processa os arquivos de log
process_logs() {
    # Coleta todos os arquivos de log no diretório
    logFiles=()
    while IFS= read -r -d $'\0' file; do
        logFiles+=("$file")
    done < <(find "$logsDirectory" -type f -name "*.log" -print0)
    
    if [ ${#logFiles[@]} -eq 0 ]; then
        echo "Nenhum arquivo de log encontrado no diretório: $logsDirectory"
        return 1
    fi
    
    # Processa cada arquivo de log
    for logFile in "${logFiles[@]}"; do
        process_log_file "$logFile" || return 1
    done

    # Unifica os logs
    merge_logs "${logFiles[@]}" || return 1
    
    # Gera o relatório para o log unificado
    process_log_file "$logsDirectory/unified_log.log" || return 1
    
    echo "Processamento completo!"
}

# Executa o script
process_logs
