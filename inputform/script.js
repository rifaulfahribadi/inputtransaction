const scriptURL = 'https://script.google.com/macros/s/AKfycbzzJ3-9SNHELozRr2OKKGW5MqloH46Glxso_mp9IdKNJAXeMBVx0tKYQfOUbtmHyIwx/exec'

document.addEventListener('DOMContentLoaded', function () {
    const currencyFields = ['jumlah_dibayarkan', 'tagihan_ukt', 'ongkir', 'biaya_admin_bank'];

    currencyFields.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);

        field.addEventListener('input', function () {
            let value = field.value.replace(/[^,\d]/g, '').toString();
            let split = value.split(',');
            let remainder = split[0].length % 3;
            let rupiah = split[0].substr(0, remainder);
            let thousand = split[0].substr(remainder).match(/\d{3}/gi);

            if (thousand) {
                let separator = remainder ? '.' : '';
                rupiah += separator + thousand.join('.');
            }

            rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
            field.value = 'Rp ' + rupiah;
        });

        field.addEventListener('blur', function () {
            // Convert the formatted string back to a number for saving
            field.value = field.value.replace(/[^0-9]/g, '');
        });
    });

    document.getElementById('studentForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        // Before sending, remove the formatting (Rp and dots)
        currencyFields.forEach(function (fieldId) {
            const field = document.getElementById(fieldId);
            formData.set(fieldId, field.value.replace(/[^0-9]/g, ''));
        });

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                alert('Data telah berhasil dikirim!');
                // Reset the form and navigate back to the first page
                document.getElementById('studentForm').reset();
                nextPage(1); // Go back to the first page
            })
            .catch(error => console.error('Error!', error.message));
    });
});

// Validation for Page 1
function validatePage1() {
    const requiredFields = ['tanggal', 'nama', 'jurusan', 'status', 'jalur', 'status_pembayaran_tagihan', 'jumlah_dibayarkan', 'status_pembayaran_ukt', 'tagihan_ukt'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = document.getElementById(requiredFields[i]);

        if (!field.value) {
            alert('Please fill out all required fields.');
            return false;
        }
    }
    nextPage(2); // Move to the next page only if validation is successful
}

// Validation for Page 2
function validatePage2() {
    const requiredFields = ['status_pembayaran_almamater', 'status_pembayaran_kaos', 'status_pembayaran_admisi'];

    for (let i = 0; i < requiredFields.length; i++) {
        const field = document.getElementById(requiredFields[i]);

        // Check if the field is empty or has not been selected
        if (!field.value || field.value === "") {
            alert('Please fill out all required fields.');
            return false; // Prevents moving to the next page
        }
    }

    // If all fields are filled, proceed to the next page
    nextPage(3); // Assuming nextPage() takes the next page number as an argument
}

// Navigate to the next page
function nextPage(pageNumber) {
    var pages = document.getElementsByClassName('form-page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById('page' + pageNumber).style.display = 'block';
}

// Navigate to the previous page
function previousPage(pageNumber) {
    var pages = document.getElementsByClassName('form-page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById('page' + pageNumber).style.display = 'block';
}

// Function to handle the submission button
function handleSubmit() {
    validatePage3();
}

// Validation function for Page 3 before submitting the form
function validatePage3() {
    const requiredFields = [
        'status_pendapatan_admisi',
        'status_pendapatan_administrasi_berkas',
        'status_pendapatan_sk',
        'status_pendapatan_almamater',
        'status_pendapatan_kaos',
        'status_pendapatan_operasional' 
    ];

    for (let i = 0; i < requiredFields.length; i++) {
        const field = document.getElementById(requiredFields[i]);

        // Check if the field is empty or has not been selected
        if (!field.value || field.value === "") {
            alert('Please fill out all required fields.');
            return false; // Prevents form submission
        }
    }

    // If all fields are filled, show confirmation dialog
    confirmSubmit();
    return true; // Allows form submission to proceed
}

// Function to confirm submission
function confirmSubmit() {
    if (confirm("Apakah Anda yakin ingin mengirim data ini?")) {
        disableSubmitButton();
        sendData();
        return false; // Prevent the form from submitting normally
    }
    return false;
}

function disableSubmitButton() {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Mengirim..."; // Optional: Change button text to indicate submission
}

function enableSubmitButton() {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = "Kirim"; // Revert button text back to "Kirim"
}

function sendData() {
    const form = document.getElementById('studentForm');
    const formData = new FormData(form);

    // Before sending, remove the formatting (Rp and dots) for currency fields
    const currencyFields = ['jumlah_dibayarkan', 'tagihan_ukt', 'ongkir', 'biaya_admin_bank'];
    currencyFields.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);
        formData.set(fieldId, field.value.replace(/[^0-9]/g, ''));
    });

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            alert('Data telah berhasil dikirim!');
            form.reset(); // Clear the form
            enableSubmitButton(); // Re-enable the submit button
            previousPage(1); // Go back to the first page
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Pengiriman data gagal. Silakan coba lagi.');
            enableSubmitButton(); // Re-enable the submit button
        });
}