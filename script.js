
// ALL INPUTS
var nameInput = document.getElementById('name');
var phoneInput = document.getElementById('phone');
var emailInput = document.getElementById('email');
var addressInput = document.getElementById('address');
var groupInput = document.getElementById('group');
var notesInput = document.getElementById('notes');
var photoInput = document.getElementById('photo');
var favoriteInput = document.getElementById('favorite');
var emergencyInput = document.getElementById('emergency');
var searchInput = document.getElementById('searchInput');

var addBtn = document.getElementById('saveBtn');
var form = document.getElementById('contactForm');
var contactModal = new bootstrap.Modal(document.getElementById('contactModal'));

var myIndex;
var selectedPhoto = '';

var contactList;

if (localStorage.getItem('contacts') == null) {
    contactList = [];
} else {
    contactList = JSON.parse(localStorage.getItem('contacts'));
    display();
}


// OPEN FORM
function openForm() {
    clear();
    document.getElementById('formTitle').innerHTML = 'Add New Contact';
    addBtn.innerHTML = 'Save Contact';
    document.getElementById('contactId').value = '';
    contactModal.show();
}

// ADD CONTACT
function addContact() {
    if (nameInput.classList.contains('is-valid') &&
        phoneInput.classList.contains('is-valid') &&
        emailInput.classList.contains('is-valid')) {

        var contact = {
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            address: addressInput.value,
            group: groupInput.value,
            notes: notesInput.value,
            favorite: favoriteInput.checked,
            emergency: emergencyInput.checked,
            photo: selectedPhoto
        };

        contactList.push(contact);

        localStorage.setItem('contacts', JSON.stringify(contactList));
        display();
        clear();
        contactModal.hide();

        Swal.fire('Contact added');

    } else {
        Swal.fire('Please enter valid information');
    }
}


function display() {
    var data = '';
    var favorites = '';
    var emergencies = '';
    var favCount = 0;
    var emergencyCount = 0;

    for (var i = 0; i < contactList.length; i++) {

        if (contactList[i].favorite == true) {
            favCount++;
            favorites += `<p>${contactList[i].name}<br>${contactList[i].phone}</p>`;
        }

        if (contactList[i].emergency == true) {
            emergencyCount++;
            emergencies += `<p>${contactList[i].name}<br>${contactList[i].phone}</p>`;
        }

        var photo = '<div class="contact-photo"><i class="bi bi-person-fill"></i></div>';

        if (contactList[i].photo != '') {
            photo = `<img src="${contactList[i].photo}" class="contact-photo">`;
        }

        data += `
            <div class="col-md-6">
                <div class="card p-3 mb-3 rounded-4">
                    <div class="d-flex align-items-center gap-3">
                        ${photo}
                        <div>
                            <h5>${contactList[i].name}</h5>
                            <p>${contactList[i].phone}</p>
                            <p>${contactList[i].email}</p>
                        </div>
                    </div>

                    <p class="mt-3">${contactList[i].address}</p>
                    <p>${contactList[i].group}</p>
                    <p>${contactList[i].notes}</p>

                    ${contactList[i].favorite ? '<span class="contact-badge">Favorite</span>' : ''}
                    ${contactList[i].emergency ? '<span class="contact-badge emergency-badge">Emergency</span>' : ''}

                    <div class="contact-actions mt-3">
                        <a href="tel:${contactList[i].phone}">Call</a>
                        <a href="mailto:${contactList[i].email}">Email</a>
                        <button onclick="toggleFavorite(${i})">Favorite</button>
                        <button onclick="edit(${i})">Update</button>
                        <button onclick="deleteContact(${i})" class="delete-btn">Delete</button>
                    </div>
                </div>
            </div>`;
    }

    if (data == '') {
        data = '<div class="col-12 text-center py-5"><h5>No contacts available</h5></div>';
    }

    if (favorites == '') {
        favorites = '<p class="text-secondary">No favorites yet</p>';
    }

    if (emergencies == '') {
        emergencies = '<p class="text-secondary">No emergency contacts</p>';
    }

    document.getElementById('contactsList').innerHTML = data;
    document.getElementById('favoritesList').innerHTML = favorites;
    document.getElementById('emergencyList').innerHTML = emergencies;

    document.getElementById('totalCount').innerHTML = contactList.length;
    document.getElementById('contactCount').innerHTML = contactList.length;
    document.getElementById('favoriteCount').innerHTML = favCount;
    document.getElementById('emergencyCount').innerHTML = emergencyCount;
}


// DELETE CONTACT
function deleteContact(indexNum) {
    Swal.fire({
        title: 'Delete this contact?',
        showCancelButton: true,
        confirmButtonText: 'Delete'
    }).then(function (result) {
        if (result.isConfirmed) {
            contactList.splice(indexNum, 1);

            localStorage.setItem('contacts', JSON.stringify(contactList));

            display();
        }
    });
}

// EDIT CONTACT
function edit(index) {
    myIndex = index;

    nameInput.value = contactList[index].name;
    phoneInput.value = contactList[index].phone;
    emailInput.value = contactList[index].email;
    addressInput.value = contactList[index].address;
    groupInput.value = contactList[index].group;
    notesInput.value = contactList[index].notes;

    favoriteInput.checked = contactList[index].favorite;
    emergencyInput.checked = contactList[index].emergency;

    selectedPhoto = contactList[index].photo;

    if (selectedPhoto != '') {
        document.getElementById('photoPreview').innerHTML =
            '<img src="' + selectedPhoto + '">';
    } else {
        document.getElementById('photoPreview').innerHTML =
            '<i class="bi bi-person-fill"></i>';
    }

    document.getElementById('contactId').value = index;
    document.getElementById('formTitle').innerHTML = 'Update Contact';
    addBtn.innerHTML = 'Save Changes';

    contactModal.show();
}

// UPDATE CONTACT
function update() {
    contactList[myIndex].name = nameInput.value;
    contactList[myIndex].phone = phoneInput.value;
    contactList[myIndex].email = emailInput.value;
    contactList[myIndex].address = addressInput.value;
    contactList[myIndex].group = groupInput.value;
    contactList[myIndex].notes = notesInput.value;
    contactList[myIndex].favorite = favoriteInput.checked;
    contactList[myIndex].emergency = emergencyInput.checked;
    contactList[myIndex].photo = selectedPhoto;

    localStorage.setItem('contacts', JSON.stringify(contactList));

    display();
    clear();
    contactModal.hide();

    Swal.fire('Contact updated');
}

// SEARCH CONTACTS
function search() {
    var word = searchInput.value.toLowerCase();
    var data = '';

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].name.toLowerCase().includes(word) ||
            contactList[i].phone.toLowerCase().includes(word) ||
            contactList[i].email.toLowerCase().includes(word)) {

            data += `
                <div class="col-md-6">
                    <div class="card p-3 mb-3 rounded-4">
                        <h5>${contactList[i].name}</h5>
                        <p>${contactList[i].phone}</p>
                        <p>${contactList[i].email}</p>
                        <button onclick="edit(${i})" class="btn btn-outline-warning">Update</button>
                        <button onclick="deleteContact(${i})" class="btn btn-outline-danger">Delete</button>
                    </div>
                </div>`;
        }
    }

    if (data == '') {
        data = '<h5 class="text-center text-secondary">No contacts available</h5>';
    }

    document.getElementById('contactsList').innerHTML = data;
}

// FAVORITE CONTACT
function toggleFavorite(index) {
    if (contactList[index].favorite == true) {
        contactList[index].favorite = false;
    } else {
        contactList[index].favorite = true;
    }

    localStorage.setItem('contacts', JSON.stringify(contactList));
    display();
}

// VALIDATION
function validateInputs(element) {
    var regex = {
        name: /^[a-zA-Z ]{2,20}$/,
        phone: /^01[0125][0-9]{8}$/,
        email: /@gmail\.com$/
    };

    if (element.id == 'email' && element.value == '') {
        element.classList.remove('is-invalid');
        element.classList.remove('is-valid');
        return;
    }

    if (regex[element.id].test(element.value)) {
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
    } else {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
    }
}

// PHOTO
photoInput.onchange = function () {
    var reader = new FileReader();

    reader.onload = function () {
        selectedPhoto = reader.result;
        document.getElementById('photoPreview').innerHTML =
            '<img src="' + selectedPhoto + '">';
    };

    reader.readAsDataURL(photoInput.files[0]);
};

// FORM SUBMIT
form.onsubmit = function (e) {
    e.preventDefault();

    if (myIndex == undefined) {
        addContact();
    } else {
        update();
    }
};

// CLEAR INPUTS
function clear() {
    form.reset();

    selectedPhoto = '';
    document.getElementById('contactId').value = '';

    document.getElementById('photoPreview').innerHTML =
        '<i class="bi bi-person-fill"></i>';

    nameInput.classList.remove('is-valid', 'is-invalid');
    phoneInput.classList.remove('is-valid', 'is-invalid');
    emailInput.classList.remove('is-valid', 'is-invalid');
}
