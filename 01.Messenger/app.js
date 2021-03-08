async function attachEvents() {
    const messages = document.getElementById('messages');
    const url = 'http://localhost:3030/jsonstore/messenger';
    const response = await fetch(url);
    const data = await response.json();

    let toPrint = [];

    Object.values(data).forEach(c => {
        let name = c.author;
        let comment = c.content;
        toPrint.push(`${name}: ${comment}`);
    })
    messages.value = toPrint.join('\n');

}

attachEvents();

document.getElementById('refresh').addEventListener('click', () => {
    attachEvents();
});

document.getElementById('submit').addEventListener('click', async () => {
    let name = document.querySelector('[name=author]');
    let message = document.querySelector('[name=content]');
    const author = name.value;
    const content = message.value;

    if (author === '' || content === '') {
        return alert('All fields are required!');
    }

    const respons = await fetch('http://localhost:3030/jsonstore/messenger', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({author, content})
    });

    if (respons.ok === false) {
        let error = respons.json();
        return alert(error.message);
    }
    message.value = '';
    attachEvents();

});



