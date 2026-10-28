// ==========================================================================
// AURUM DRIVE - Interactive functionality
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // 2. Select Car Button click -> fill form & scroll
    const selectCarBtns = document.querySelectorAll('.select-car-btn');
    const carSelect = document.getElementById('carSelect');
    const bookingSection = document.getElementById('booking');

    selectCarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const carName = e.target.getAttribute('data-car');
            if (carSelect && carName) {
                carSelect.value = carName;
            }
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Set default booking date to tomorrow
    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        bookingDateInput.value = `${yyyy}-${mm}-${dd}`;
        bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // 4. Booking Form Submit -> Show Modal
    const bookingForm = document.getElementById('bookingForm');
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.getElementById('modalClose');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalSummary = document.getElementById('modalSummary');

    if (bookingForm && bookingModal) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const car = document.getElementById('carSelect').value;
            const tariff = document.getElementById('tariffSelect').value;
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            const name = document.getElementById('clientName').value;
            const phone = document.getElementById('clientPhone').value;

            if (modalSummary) {
                modalSummary.innerHTML = `
                    Уважаемый <strong>${name}</strong>!<br>
                    Автомобиль <strong>${car}</strong> успешно зарезервирован.<br>
                    Тариф: <strong>${tariff}</strong>.<br>
                    Подача: <strong>${date}</strong> в <strong>${time}</strong>.<br>
                    Консьерж свяжется с вами по номеру <strong>${phone}</strong> в течение 5 минут.
                `;
            }

            bookingModal.classList.add('active');
            bookingForm.reset();
        });
    }

    function closeModal() {
        if (bookingModal) {
            bookingModal.classList.remove('active');
        }
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });

    // 5. Header shadow on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.background = 'rgba(9, 11, 16, 0.96)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
        } else {
            header.style.background = 'rgba(9, 11, 16, 0.85)';
            header.style.boxShadow = 'none';
        }
    });
});

