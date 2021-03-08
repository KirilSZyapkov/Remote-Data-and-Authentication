document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    if (email === '' || password === '' || rePass === '') {
        return alert('All fields are required!');
    } else if (password !== rePass) {
        return alert('Passwords do not mach!');
    }
    const response = await fetch('http://localhost:3030/users/register', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    if (response.ok === false) {
        const error = response.statusText;
        return alert(error);
    } else {
        const data = await response.json();
        sessionStorage.setItem('authToken', data.accessToken);
        sessionStorage.setItem('userId', data._id);
    }
    e.target.reset();
});

document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    if (email === '' || password === '') {
        return alert('All fields are required!');
    }
    const response = await fetch('http://localhost:3030/users/login', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    if (response.ok === false) {
        const error = response.statusText;
        return alert(error);
    } else {
        const data = await response.json();
        sessionStorage.setItem('authToken', data.accessToken);
        sessionStorage.setItem('userId', data._id);
    }
    e.target.reset();
    window.location.assign('index.html');
})