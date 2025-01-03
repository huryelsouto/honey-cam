#!/usr/local/bin/bash

# Exibe e executa o comando para parar o Apache
echo "Parando Apache..."
sudo apachectl stop

# Exibe e executa o comando para parar o serviço Apache via Brew
echo "Parando serviço httpd via Brew..."
sudo brew services stop httpd

# Exibe e executa o comando para encerrar todos os processos httpd
echo "Finalizando todos os processos httpd..."
sudo killall httpd

# Exibe e executa o comando para iniciar o serviço Apache via Brew
echo "Iniciando serviço httpd via Brew..."
sudo brew services start httpd

# Exibe e executa o comando para iniciar o Apache manualmente
echo "Iniciando Apache manualmente..."
sudo apachectl start

echo "Processo concluído."
