function attachEvents() {
    document.querySelector('.load').addEventListener('click', loadCatches);
    let cathes = document.querySelector('#catches');
    cathes.innerHTML = '';
    const userID = sessionStorage.getItem('userId');


    if (userID === null) {
        document.querySelector('.add').disabled = true;
    } else {
        document.querySelector('.add').disabled = false;
        document.getElementById('log-out').textContent = 'Logout';
    }

}

attachEvents();

async function loadCatches() {
    const userID = sessionStorage.getItem('userId');
    const cathes = document.getElementById('catches');

    cathes.innerHTML = '';
    const response = await fetch('http://localhost:3030/data/catches');
    const data = await response.json();
    data.forEach(c => {
        let bate = e('div', {className: 'catch'},
            e('label', {}, 'Angler'),
            e('input', {type: 'text', className: 'angler', value: c.angler}),
            e('hr', {}),
            e('label', {}, 'Weight'),
            e('input', {type: 'text', className: 'weight', value: c.weight}),
            e('hr', {}),
            e('label', {}, 'Species'),
            e('input', {type: 'text', className: 'species', value: c.species}),
            e('hr', {}),
            e('label', {}, 'Location'),
            e('input', {type: 'text', className: 'location', value: c.location}),
            e('hr', {}),
            e('label', {}, 'Bait'),
            e('input', {type: 'text', className: 'bait', value: c.bait}),
            e('hr', {}),
            e('label', {}, 'Capture Time'),
            e('input', {type: 'text', className: 'captureTime', value: c.captureTime}),
            e('hr', {}),
            e('button', {className: 'update', id: c._id}, 'Update'),
            e('button', {className: 'delete', id: c._id}, 'Delete')
        )
        bate.querySelector('.update').addEventListener('click', (e) => {
            document.querySelector('.add').textContent = 'Save';
            updateCatch(e)
        });
        bate.querySelector('.delete').addEventListener('click', deleteCatch);
        if (userID !== null) {
            if (userID === c._ownerId) {
                bate.querySelector('.delete').disabled = false;
                bate.querySelector('.update').disabled = false;

            } else {
                bate.querySelector('.delete').disabled = true;
                bate.querySelector('.update').disabled = true;

            }
        } else {
            bate.querySelector('.delete').disabled = true;
            bate.querySelector('.update').disabled = true;
        }

        cathes.appendChild(bate);
    })
}

let id = '';

async function updateCatch(e) {

    id = e.target.id;

    const response = await fetch('http://localhost:3030/data/catches/' + id);
    const data = await response.json();
    let field = document.getElementById('addForm');
    let inputs = [...field.querySelectorAll('input')];

    inputs[0].value = data.angler;
    inputs[1].value = data.weight;
    inputs[2].value = data.species;
    inputs[3].value = data.location;
    inputs[4].value = data.bait;
    inputs[5].value = data.captureTime;
}

async function deleteCatch(e) {
    const id = e.target.id;
    const token = sessionStorage.getItem('authToken');
    await fetch('http://localhost:3030/data/catches/' + id, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
    });
    loadCatches();
}

document.querySelector('.add').addEventListener('click', async (e) => {
    const target = e.target.textContent;
    const token = sessionStorage.getItem('authToken');

    let field = document.getElementById('addForm');
    let inputs = [...field.querySelectorAll('input')];

    let angler = inputs[0].value;
    let weight = inputs[1].value;
    let species = inputs[2].value;
    let location = inputs[3].value;
    let bait = inputs[4].value;
    let captureTime = inputs[5].value;

    if (target === 'Add') {

        if (angler === '' || weight === '' || species === '' || location === '' || bait === '' || captureTime === '') {
            return alert('All fields are required!');
        }

        await fetch('http://localhost:3030/data/catches', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify({angler, weight, species, location, bait, captureTime})
        });

    } else if (target === 'Save') {

        inputs.forEach(f => {
            if (f === '') {
                return alert('All fields are required!');
            }
        });

        await fetch('http://localhost:3030/data/catches/' + id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify({angler, weight, species, location, bait, captureTime})
        });

        document.querySelector('.add').textContent = 'Add';

    }
    inputs.forEach(f => f.value = '');
    loadCatches();
})

document.getElementById('log-out').addEventListener('click', logOut);

function logOut(e) {
    let target = e.target;
    if (target.textContent === 'Logout') {
        const answer = confirm('Are you sure?');
        if (answer) {
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('userId');
            document.getElementById('log-out').textContent = 'Login';
        }
    }

}

function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}