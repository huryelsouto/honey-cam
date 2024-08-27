// Função para extrair o token JWT de uma solicitação HTTP
const getJWTToken = (req) => {
    // Obtém o cabeçalho de autorização da solicitação
    const authorization = req.get('authorization')
    // Verifica se o cabeçalho de autorização existe e começa com 'Bearer '
    if (authorization && authorization.startsWith('Bearer ')) {
        // Retorna o token JWT removendo o prefixo 'Bearer '
        return authorization.replace('Bearer ', '')
    }
    // Retorna null se o cabeçalho de autorização não estiver presente ou não começar com 'Bearer '
    return null
}

// Exporta a função para que possa ser utilizada em outros módulos
module.exports = { getJWTToken }
