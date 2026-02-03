const menu = document.querySelector('.hamburger');
const list = document.querySelector('.nav-links');

menu.onclick = function () {
    if (list.className == "nav-links") {
        list.className = "nav-links active";
    } else {
        list.className = "nav-links";
    }
};


const d1_el = document.getElementById('checkin');
const d2_el = document.getElementById('checkout');
const room_el = document.getElementById('roomtype');
const total = document.getElementById('totalPrice');
const form = document.getElementById('bookingForm');

function updatePrice() {
    const date1 = new Date(d1_el.value);
    const date2 = new Date(d2_el.value);
    const diff = date2 - date1;
    const days = diff / (1000 * 3600 * 24);

    if (days > 0) {
        let price = 0;
        const type = room_el.value;
        if (type == "single") price = 15;
        else if (type == "double") price = 20;
        else if (type == "family") price = 25;

        total.innerText = "Total: $" + (days * price) + " (" + days + " Nights)";
    } else {
        total.innerText = "Total Price: $0";
    }
}

form.onchange = updatePrice;

form.onsubmit = function (event) {
    event.preventDefault();

    // Variables
    const name = document.getElementById('fullname').value;
    const phone = document.getElementById('contact').value;
    const inDate = d1_el.value;
    const outDate = d2_el.value;

    if (!isNaN(name)) {
        alert("Name must be string");
    } else if (phone.length != 12) {
        alert("Phone must be 12 numbers");
    } else if (new Date(inDate) >= new Date(outDate)) {
        alert("Check-out must be after Check-in");
    } else {
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('successMessage').innerText = "Confirmed: " + name;
        form.reset();
        total.innerText = "Total Price: $0";
    }
};
