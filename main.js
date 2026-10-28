// ==========================================================================
// AURUM DRIVE - Interactive functionality
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const fleetGrid = document.querySelector('.fleet-grid');
    const bookingSection = document.getElementById('booking');
    const bookingForm = document.getElementById('bookingForm');
    const carSelect = document.getElementById('carSelect');
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.getElementById('modalClose');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const summaryName = document.getElementById('summaryName');
    const detailCar = document.getElementById('detailCar');
    const detailTariff = document.getElementById('detailTariff');
    const detailDateTime = document.getElementById('detailDateTime');
    const conciergeNote = document.getElementById('conciergeNote');
    const modalTimer = document.getElementById('modalTimer');
    const bookingDateInput = document.getElementById('bookingDate');

    // ---------- 1. Header shadow on scroll ----------
    const updateHeader = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // ---------- 2. Mobile hamburger menu ----------
    const setMenuState = (open) => {
        if (!navMenu || !menuToggle) return;
        navMenu.classList.toggle('active', open);
        menuToggle.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('menu-open', open);
    };

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            setMenuState(!navMenu.classList.contains('active'));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => setMenuState(false));
        });

        // Close by Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                setMenuState(false);
            }
        });

        // Reset state when switching to desktop layout
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenuState(false);
        });
    }

    // ---------- 3. Car card -> auto-select & smooth scroll ----------
    const selectCar = (carName) => {
        if (!carSelect || !carName) return;
        carSelect.value = carName;
        carSelect.dispatchEvent(new Event('change', { bubbles: true }));
        // Restart the highlight animation
        carSelect.classList.remove('is-selected');
        void carSelect.offsetWidth;
        carSelect.classList.add('is-selected');
    };

    const scrollToBooking = () => {
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (fleetGrid) {
        // Delegated click: works for the whole card and its button
        fleetGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.car-card');
            if (!card) return;
            const btn = card.querySelector('.select-car-btn');
            selectCar(btn ? btn.getAttribute('data-car') : null);
            scrollToBooking();
        });
    }

    // ---------- 4. Default booking date = tomorrow ----------
    if (bookingDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        bookingDateInput.value = `${yyyy}-${mm}-${dd}`;
        bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // ---------- 5. AURUM Modal ----------
    let conciergeTimer = null;
    let lastFocused = null;

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    const startConciergeTimer = () => {
        if (conciergeTimer) clearInterval(conciergeTimer);
        let remaining = 5 * 60;
        if (modalTimer) modalTimer.textContent = formatTime(remaining);
        if (conciergeNote) conciergeNote.textContent = 'свяжется с вами в течение';
        conciergeTimer = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                clearInterval(conciergeTimer);
                conciergeTimer = null;
                if (modalTimer) modalTimer.textContent = '';
                if (conciergeNote) conciergeNote.textContent = 'Консьерж уже набирает ваш номер';
            } else if (modalTimer) {
                modalTimer.textContent = formatTime(remaining);
            }
        }, 1000);
    };

    const openModal = () => {
        if (!bookingModal) return;
        lastFocused = document.activeElement;
        bookingModal.classList.add('active');
        bookingModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        startConciergeTimer();
        if (modalOkBtn) modalOkBtn.focus();
    };

    const closeModal = () => {
        if (!bookingModal) return;
        bookingModal.classList.remove('active');
        bookingModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (conciergeTimer) {
            clearInterval(conciergeTimer);
            conciergeTimer = null;
        }
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    };

    if (bookingForm && bookingModal) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const car = document.getElementById('carSelect').value;
            const tariff = document.getElementById('tariffSelect').value;
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            const name = document.getElementById('clientName').value;

            if (summaryName) summaryName.textContent = name;
            if (detailCar) detailCar.textContent = car;
            if (detailTariff) detailTariff.textContent = tariff;
            if (detailDateTime) detailDateTime.textContent = `${date} в ${time}`;

            openModal();
            bookingForm.reset();
        });
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);

    // Close on overlay click
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal || (e.target.classList && e.target.classList.contains('modal-overlay'))) {
            closeModal();
        }
    });

    // Close by Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
            closeModal();
        }
    });
});
