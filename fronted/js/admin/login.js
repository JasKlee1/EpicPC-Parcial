

const API_URL = 'http://localhost:4000';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    messageElement.innerText = '';

    try {
        const res = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('jwtToken', data.token); // ⬅️ TOKEN GUARDADO
            window.location.href = 'dashboard.html';
        } else {
            const error = await res.json();
            messageElement.innerText = `Error: ${error.message}`;
            messageElement.style.color = 'red';
        }
    } catch (err) {
        messageElement.innerText = 'Error de conexión. Asegúrate de que el backend esté corriendo.';
        messageElement.style.color = 'red';
    }
});