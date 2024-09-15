import loggerService from '/js/services/LoggerService.js';

const login = async (event) => {
    event.preventDefault();
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const sentData = {
        username: username,
        password: password
    };
    // const sentDataMock = {
    //     username: "admin",
    //     password: "admin"
    // };

    try {
        loggerService.addLog('login', 'POST', sentData, sentData.username);
        const response = await axios.post('/api/controllers/user-controller/login.php', sentData);
        if (response.status === 200 && response.data) {
            setTimeout(() => {
                window.location.href = "/camera";  // Redireciona após um pequeno delay
            }, 500);
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            document.getElementById("usernameErrorMessage").style.display = "inline-block";
            setTimeout(() => document.getElementById("usernameErrorMessage").style.display = "none", 3000);
        }
        if (error.response && error.response.status === 401) {
            document.getElementById("passwordErrorMessage").style.display = "inline-block";
            setTimeout(() => document.getElementById("passwordErrorMessage").style.display = "none", 3000);
        }
        if (error.response && error.response.status === 403) {
            document.getElementById("rateErrorMessage").style.display = "inline-block";
            setTimeout(() => document.getElementById("rateErrorMessage").style.display = "none", 3000);
        }
    }
};

document.getElementById('login-button').onclick = login;