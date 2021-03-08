document.getElementById('loadBooks').addEventListener('click', loadBooks);
const table = document.querySelector('tbody');
table.innerHTML = '';

async function loadBooks() {
    const response = await fetch('http://localhost:3030/jsonstore/collections/books');
    const data = await response.json();
    table.innerHTML = '';
    for (let k in data) {
        let tr = document.createElement('tr');
        let tdTitle = document.createElement('td');
        tdTitle.textContent = data[k].title;
        let tdAuthor = document.createElement('td');
        tdAuthor.textContent = data[k].author;
        let tdBtns = document.createElement('td');
        let editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.id = k;
        editBtn.addEventListener('click', editBook);
        let dellBtn = document.createElement('button');
        dellBtn.textContent = 'Delete';
        dellBtn.id = k;
        dellBtn.addEventListener('click', deleteBook);
        tdBtns.appendChild(editBtn);
        tdBtns.appendChild(dellBtn);
        tr.appendChild(tdTitle);
        tr.appendChild(tdAuthor);
        tr.appendChild(tdBtns);
        table.appendChild(tr);
    }
}

async function editBook(event) {
    let id = event.target.id;
    document.getElementById('creatForm').style.display = 'none';
    document.getElementById('editForm').style.display = 'block';

    const response = await fetch('http://localhost:3030/jsonstore/collections/books/' + id);
    const data = await response.json();

    document.getElementById('editTitle').value = data.title;
    document.getElementById('editName').value = data.author;
    document.querySelector(`#editForm [name='id']`).value = id;
}

async function deleteBook(event) {
    let id = event.target.id;
    await fetch('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'delete'
    })
    loadBooks();
}

document.getElementById('editForm').addEventListener('submit', updateBook);


async function updateBook(e) {
    e.preventDefault();
    const title = document.getElementById('editTitle').value;
    const author = document.getElementById('editName').value;
    const id = document.querySelector(`#editForm [name='id']`).value;

    const response = await fetch('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({author, title})
    });
    if (response.ok === false) {
        let error = response.json();
        return alert(error.message);
    }
    document.getElementById('creatForm').style.display = 'block';
    document.getElementById('editForm').style.display = 'none';
    loadBooks();
}

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let author = formData.get('author');
    let title = formData.get('title');

    if (author === '' || title === '') {
        return alert('All fields are requred!');
    }

    const respons = await fetch('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({author, title})
    });

    if (respons.ok === false) {
        let error = respons.json();
        return alert(error.message);
    }
    e.target.reset();
    document.getElementById('creatForm').style.display = 'block';
    document.getElementById('editForm').style.display = 'none';
    loadBooks();
})