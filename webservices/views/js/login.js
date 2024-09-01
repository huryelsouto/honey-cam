const brandImagePath = "../../public/brands/Hikvision.png";  // Define this variable as needed
const brandImageWidth = ""; // Define this variable as needed

document.getElementById('brand_image').src = brandImagePath;
document.getElementById('brand_image').width = brandImageWidth;

const login = (event) => {
    event.preventDefault();
    const username = $("input[name=username]").val();
    const password = $("input[name=password]").val();
    const sentData = {
        username: username,
        password: password
    };
    axios
        .post('/login', sentData)
        .then(() => window.location.href = "/")
        .catch((error) => {
            if (error.response.status === 404) {
                $("#usernameErrorMessage").css("display", "inline-block");
                setTimeout(() => $("#usernameErrorMessage").css("display", "none"), 3000);
            }
            if (error.response.status === 401) {
                $("#passwordErrorMessage").css("display", "inline-block");
                setTimeout(() => $("#passwordErrorMessage").css("display", "none"), 3000);
            }
            if (error.response.status === 403) {
                $("#rateErrorMessage").css("display", "inline-block");
                setTimeout(() => $("#rateErrorMessage").css("display", "none"), 3000);
            }
        });
};
