import loggerService from '/js/services/LoggerService.js';

const logout = async (event) => {
    event.preventDefault();

    try {
        loggerService.addLog('logout', 'POST');
        const response = await axios.post('/api/controllers/user-controller/logout.php');
        if (response.status === 200 && response.data) {
            setTimeout(() => {
                window.location.href = "/";  // Redireciona após um pequeno delay
            }, 500);
        }
    } catch (error) {
        alert('Error: try this operation later');
    }
};

document.getElementById('logout-button').onclick = logout;