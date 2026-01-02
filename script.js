document.addEventListener('DOMContentLoaded', () => {
    let index = 0;
    const gallery = document.querySelector(".gallery");
    const slides = document.querySelectorAll(".gallery img");

    function updateGallery() {
        if (gallery) gallery.style.transform = `translateX(-${index * 100}%)`;
    }

    window.nextSlide = function() {
        if (!slides.length) return;
        index = (index + 1) % slides.length;
        updateGallery();
    }

    window.prevSlide = function() {
        if (!slides.length) return;
        index = (index - 1 + slides.length) % slides.length;
        updateGallery();
    }

    const icon = document.getElementById("creditIcon");
    const sound = document.getElementById("creditSound");

    if (icon) {
        icon.addEventListener("click", () => {
            if (!sound) return;
            sound.currentTime = 0;
            sound.volume = 0.2;
            sound.play();
        });
    }

    const faders = document.querySelectorAll('.fade');

    function checkFade() {
        const triggerBottom = window.innerHeight * 0.85;
        faders.forEach(fader => {
            const top = fader.getBoundingClientRect().top;
            if (top < triggerBottom) {
                fader.classList.add('show');
            }
        });
    }

    window.addEventListener('scroll', checkFade);
    window.addEventListener('load', checkFade);
    checkFade();

    const SERVER_IP = "mc.overtimemc.ru";
    const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

    const statusDot = document.getElementById('statusDot');
    const serverState = document.getElementById('serverState');
    const playersCount = document.getElementById('playersCount');
    const playersMax = document.getElementById('playersMax');
    const uptimeFill = document.querySelector('.uptime-fill');
    const checkBtn = document.getElementById('checkStatusBtn');

    let checks = 0;
    let onlineChecks = 0;

    async function fetchServerStatus() {
        if (checkBtn) {
            checkBtn.textContent = "Проверка...";
            checkBtn.disabled = true;
        }

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            checks++;

            if (data && data.online) {
                onlineChecks++;

                if (statusDot) statusDot.className = "status-dot online";
                if (serverState) serverState.textContent = "ВКЛЮЧЁН";

                if (playersCount) playersCount.textContent = data.players?.online ?? 0;
                if (playersMax) playersMax.textContent = data.players?.max ?? "?";
            } else {
                if (statusDot) statusDot.className = "status-dot offline";
                if (serverState) serverState.textContent = "ВЫКЛЮЧЕН";

                if (playersCount) playersCount.textContent = 0;
                if (playersMax) playersMax.textContent = data?.players?.max ?? "?";
            }

            const uptime = Math.round((onlineChecks / checks) * 100);
            if (uptimeFill) {
                uptimeFill.style.width = uptime + "%";
                uptimeFill.textContent = uptime + "%";
            }

        } catch (e) {
            if (statusDot) statusDot.className = "status-dot offline";
            if (serverState) serverState.textContent = "ОШИБКА";
            if (playersCount) playersCount.textContent = "-";
            if (playersMax) playersMax.textContent = "-";
        }

        if (checkBtn) {
            checkBtn.textContent = "Проверить";
            checkBtn.disabled = false;
        }
    }

    fetchServerStatus();
    setInterval(fetchServerStatus, 30000);

    if (checkBtn) {
        checkBtn.addEventListener("click", fetchServerStatus);
    }

    const staff = document.querySelector('.staff');
    const prevStaffBtn = document.getElementById('prevStaffBtn');
    const nextStaffBtn = document.getElementById('nextStaffBtn');

    function scrollStaff(delta) {
        if (!staff) return;
        staff.scrollBy({ left: delta, behavior: 'smooth' });
    }

    if (prevStaffBtn) prevStaffBtn.addEventListener('click', () => {
        scrollStaff(-(staff ? staff.clientWidth * 0.7 : 260));
    });

    if (nextStaffBtn) nextStaffBtn.addEventListener('click', () => {
        scrollStaff(staff ? staff.clientWidth * 0.7 : 260);
    });

});
