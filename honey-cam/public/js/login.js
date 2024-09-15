const login = async (event) => {
    event.preventDefault();
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const sentData = {
        username: username,
        password: password
    };
    const sentDataMock = {
        username: "admin",
        password: "admin"
    };

    try {
        const response = await axios.post('/api/controllers/user-controller/login.php', sentDataMock);
        if (response.status === 200 && response.data) {
            setTimeout(() => {
                window.location.href = "/camera";  // Redireciona após um pequeno delay
            }, 500);
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            $("#usernameErrorMessage").css("display", "inline-block");
            // setTimeout(() => $("#usernameErrorMessage").css("display", "none"), 3000);
        }
        if (error.response && error.response.status === 401) {
            $("#passwordErrorMessage").css("display", "inline-block");
            setTimeout(() => $("#passwordErrorMessage").css("display", "none"), 3000);
        }
        if (error.response && error.response.status === 403) {
            $("#rateErrorMessage").css("display", "inline-block");
            setTimeout(() => $("#rateErrorMessage").css("display", "none"), 3000);
        }
    }
};

document.getElementById('login-button').onclick = login;