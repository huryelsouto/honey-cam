<?php
function login()
{
    // Resposta de erro se os dados estiverem faltando
    echo json_encode(['error' => 'Parâmetros inválidos.']);
    http_response_code(400);
}
?>