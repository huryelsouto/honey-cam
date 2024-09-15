try {
    const response = await axios.get('/api/controllers/user-controller/auth.php');
    if(response.status === 200 && response.data.username){
        document.getElementById('userName').textContent = response.data.username;
    } else {
        window.location.href = "/";
        alert(`Error ${response.status}`);
    }
} catch (error) {
    alert(`Error ${error}`);
    window.location.href = "/";
}