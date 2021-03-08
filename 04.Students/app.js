async function loadStudents() {
    let table = document.querySelector('tbody');
    table.innerHTML = '';
    const respons = await fetch('http://localhost:3030/jsonstore/collections/students');
    const data = await respons.json();
    let sorted = Object.values(data).sort((a, b) => b.grade - a.grade);
    sorted.forEach(s => {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        tdName.textContent = s.firstName;
        let tdLname = document.createElement('td');
        tdLname.textContent = s.lastName;
        let tdFn = document.createElement('td');
        tdFn.textContent = s.facultyNumber;
        let tdGrade = document.createElement('td');
        tdGrade.textContent = s.grade;
        tr.appendChild(tdName);
        tr.appendChild(tdLname);
        tr.appendChild(tdFn);
        tr.appendChild(tdGrade);
        table.appendChild(tr);
    })

}

loadStudents();

document.getElementById('form').addEventListener('submit', addStudent);

async function addStudent(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    let facultyNumber = formData.get('facultyNumber');
    facultyNumber = Number(facultyNumber);
    let grade = formData.get('grade');
    grade = Number(grade);

    if (firstName === '' || lastName === '' || facultyNumber == '' || grade == '') {
        return alert('All fields are required!');
    } else if (Number.isNaN(facultyNumber) || Number.isNaN(grade)) {
        return alert('Faculty Number and Grade must be numbers!');
    }
    const body = {
        firstName,
        lastName,
        facultyNumber,
        grade
    }
    await fetch('http://localhost:3030/jsonstore/collections/students', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    e.target.reset();
    loadStudents();
}