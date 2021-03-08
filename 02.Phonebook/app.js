const phoneList = {};

document.getElementById('btnLoad').addEventListener('click', attachEvents);

async function attachEvents() {
    const ul = document.getElementById('phonebook');
    ul.innerHTML = '';
   

    const respons = await fetch('http://localhost:3030/jsonstore/phonebook');
    const data = await respons.json();

    const id = Object.keys(data);
    for (let a = 0; a < id.length; a++) {
        let li = document.createElement('li');
        let span = document.createElement('span');
        let dellBtn = document.createElement('button');
        dellBtn.id = id[a];
        dellBtn.textContent = 'Delete';
        dellBtn.addEventListener('click', delNum);
        span.appendChild(dellBtn);
        let [name, number] = Object.values(data[id[a]]);
        li.textContent = `${name}: ${number}`;
        li.appendChild(span);
        ul.appendChild(li);
    }

}

attachEvents();

document.getElementById('btnCreate').addEventListener('click', addPhone);

async function addPhone() {
    const name = document.getElementById('person');
    const number = document.getElementById('phone');
    const patern = /^\W[\d]+-[\d]+-[\d]+$/g;

    const person = name.value;
    const phone = number.value;

    if (phone === '' || phone === '') {
        return alert('All fields are required!');
    } else if (patern.test(phone) === false) {
        return alert('Enter a valid phone number: +1-111-1111');
    }

    if (phoneList.hasOwnProperty(person)) {
        const confirmed = confirm('Name already exist. Do you want to change the number?');
        if (confirmed) {
            phoneList.person = phone;
        } else {
            return alert('Change the name!');
        }
    } else {
        phoneList[person] = phone;
    }

    const response = await fetch('http://localhost:3030/jsonstore/phonebook', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({person, phone})
    });

    if (response.ok === false) {
        let error = response.json();
        return alert(error.message);
    }
    name.value = '';
    number.value = '';
    await attachEvents();
}

async function delNum(event) {
    const id = event.target.id;
    const respons = await fetch('http://localhost:3030/jsonstore/phonebook/' + id, {
        method: 'delete',
    });

    if (respons.ok === false) {
        let error = respons.json();
        return alert(error.message);
    }
    await attachEvents();
}