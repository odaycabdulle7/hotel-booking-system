/* Hotel Booking System - Logic */

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // Interactive Date Constraints (Removed for simplicity)


    // Booking Form Validation
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Elements
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');

            // Get values
            const phone = bookingForm.contact.value.trim();
            const checkIn = new Date(bookingForm.checkin.value);
            const checkOut = new Date(bookingForm.checkout.value);
            const today = new Date();
            // Removed complex time setting

            // Reset Messages
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            errorMsg.textContent = "";

            let isValid = true;
            let errors = [];

            // Phone Validation
            // Simpler check: Just length
            if (phone.length < 5) {
                isValid = false;
                errors.push("Phone number is too short.");
            }

            // Date Validation
            if (checkIn < today) {
                isValid = false;
                errors.push("Check-in date cannot be in the past.");
            } else if (checkOut <= checkIn) {
                isValid = false;
                errors.push("Check-out date must be after check-in date.");
            }

            if (isValid) {
                // Show Success Message
                successMsg.style.display = 'block';
                // Personalize the message
                const name = bookingForm.fullname.value;
                successMsg.textContent = `Dear ${name}, Booking Confirmed! We look forward to hosting you.`;

                // Clear Form
                bookingForm.reset();
                document.getElementById('totalPrice').textContent = "Total Price: $0";

                // Hide message after 5 seconds
                setTimeout(function () {
                    successMsg.style.display = 'none';
                }, 5000);
            } else {
                // Show Error Message
                errorMsg.style.display = 'block';
                errorMsg.innerHTML = errors.join("<br>");
            }
        });

        // Price Calculation Logic
        const roomPrices = {
            'single': 15,
            'double': 20,
            'family': 25
        };

        const calculatePrice = function () {
            const checkInVal = bookingForm.checkin.value;
            const checkOutVal = bookingForm.checkout.value;
            const roomType = bookingForm.roomtype.value;
            const priceDisplay = document.getElementById('totalPrice');

            if (checkInVal && checkOutVal && roomType) {
                const checkInDate = new Date(checkInVal);
                const checkOutDate = new Date(checkOutVal);

                // Calculate difference in time
                const diffTime = checkOutDate - checkInDate;
                // Calculate difference in days (1000ms * 60s * 60m * 24h)
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 0) {
                    const pricePerNight = roomPrices[roomType];
                    const total = diffDays * pricePerNight;
                    priceDisplay.textContent = `Total Price: $${total} (${diffDays} nights)`;
                } else {
                    priceDisplay.textContent = "Total Price: $0";
                }
            } else {
                priceDisplay.textContent = "Total Price: $0";
            }
        };

        // Add listeners for real-time calculation
        bookingForm.checkin.addEventListener('change', calculatePrice);
        bookingForm.checkout.addEventListener('change', calculatePrice);
        bookingForm.roomtype.addEventListener('change', calculatePrice);
    }
});
