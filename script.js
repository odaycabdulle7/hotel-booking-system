/* Hotel Booking System - Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Interactive Date Constraints (The "Normal Way")
    const checkInInput = document.getElementById('checkin');
    const checkOutInput = document.getElementById('checkout');

    if (checkInInput && checkOutInput) {
        // 1. Set minimum check-in date to Today
        const today = new Date().toISOString().split('T')[0];
        checkInInput.setAttribute('min', today);

        // 2. When Check-in changes, update Check-out min date
        checkInInput.addEventListener('change', () => {
            if (checkInInput.value) {
                // Calculate next day
                const checkInDate = new Date(checkInInput.value);
                checkInDate.setDate(checkInDate.getDate() + 1);
                const nextDay = checkInDate.toISOString().split('T')[0];

                checkOutInput.setAttribute('min', nextDay);

                // If current checkout is invalid (before or same as new checkin), clear it
                if (checkOutInput.value && checkOutInput.value < nextDay) {
                    checkOutInput.value = "";
                }
            }
        });
    }

    // Booking Form Validation
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Elements
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');

            // Get values
            const phone = bookingForm.contact.value.trim();
            const checkIn = new Date(bookingForm.checkin.value);
            const checkOut = new Date(bookingForm.checkout.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Reset Messages
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            errorMsg.textContent = "";

            let isValid = true;
            let errors = [];

            // Phone Validation
            // Must start with 25261 and have exactly 7 more digits (total 12 digits)
            const phoneRegex = /^25261\d{7}$/;
            if (!phoneRegex.test(phone)) {
                isValid = false;
                errors.push("Phone number must start with 25261 and be followed by 7 digits (e.g., 25261xxxxxxx).");
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
                const name = bookingForm.fullname.value.split(' ')[0] || "Guest";
                successMsg.textContent = `Dear ${name}, Booking Confirmed! We look forward to hosting you.`;

                // Clear Form
                bookingForm.reset();
                document.getElementById('totalPrice').textContent = "Total Price: $0";

                // Hide message after 5 seconds
                setTimeout(() => {
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

        const calculatePrice = () => {
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
