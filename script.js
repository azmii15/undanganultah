
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 1. NAMA TAMU DARI LINK
    // =========================

    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get("to");
    const guestName = document.getElementById("guestName");

    if (guestName && namaTamu) {
        guestName.textContent = namaTamu.trim();
    }

    // =========================
    // 2. BUKA UNDANGAN
    // =========================

    const openButton = document.getElementById("openInvitation");
    const hero = document.querySelector(".hero");
    const invitationPage = document.getElementById("invitationPage");

    const music = document.getElementById("backgroundMusic");
    const musicButton = document.getElementById("musicButton");

    if (openButton && hero && invitationPage) {
        openButton.addEventListener("click", function () {
            hero.classList.add("closed");
            invitationPage.classList.add("show");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            // Coba putar musik setelah pengunjung membuka undangan
            if (music && musicButton) {
                music.play()
                    .then(function () {
                        musicButton.textContent = "❚❚ Pause Music";
                    })
                    .catch(function () {
                        musicButton.textContent = "▶ Play Music";
                    });
            }
        });
    }

    // =========================
    // 3. NAVBAR RESPONSIVE
    // =========================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("open");

            const isOpen = navLinks.classList.contains("open");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.textContent = isOpen ? "×" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });
    }

    // =========================
    // 4. COUNTDOWN
    // =========================

    const eventDate = new Date("2027-11-15T15:00:00+07:00").getTime();

    function updateCountdown() {
        const now = Date.now();
        const distance = eventDate - now;

        if (distance <= 0) {
            ["days", "hours", "minutes", "seconds"].forEach(function (id) {
                const element = document.getElementById(id);
                if (element) element.textContent = "00";
            });
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // =========================
    // 5. COPY GIFT ADDRESS
    // =========================

    const copyGift = document.getElementById("copyGift");

    if (copyGift) {
        copyGift.addEventListener("click", async function () {
            const giftAddress = document.getElementById("giftAddress");
            const address = giftAddress.textContent.trim();

            try {
                await navigator.clipboard.writeText(address);
                alert("Alamat berhasil disalin!");
            } catch (error) {
                alert("Gagal menyalin. Silakan salin alamat secara manual.");
            }
        });
    }

    // =========================
    // 6. MUSIC PLAYER
    // =========================

    if (music && musicButton) {
        musicButton.addEventListener("click", function () {
            if (music.paused) {
                music.play()
                    .then(function () {
                        musicButton.textContent = "❚❚ Pause Music";
                    })
                    .catch(function () {
                        alert("Musik gagal diputar. Periksa file backsound.mp3.");
                    });
            } else {
                music.pause();
                musicButton.textContent = "▶ Play Music";
            }
        });

        music.addEventListener("ended", function () {
            musicButton.textContent = "▶ Play Music";
        });
    }

    // =========================
    // 7. RSVP KE WHATSAPP
    // =========================

    const rsvpForm = document.getElementById("rsvpForm");

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("rsvpName").value.trim();
            const attendance = document.getElementById("attendance").value;
            const message = document.getElementById("message").value.trim();

            if (!name || !attendance || !message) {
                alert("Mohon lengkapi semua data RSVP.");
                return;
            }

            // GANTI DENGAN NOMOR WHATSAPP PENERIMA
            const nomorWhatsApp = "62895396824556";

            const pesan =
                "HALO SYAFIQ!\n\n" +
                "Saya ingin mengirim konfirmasi undangan ulang tahun.\n\n" +
                "Nama: " + name + "\n" +
                "Kehadiran: " + attendance + "\n" +
                "Ucapan: " + message + "\n\n" +
                "Terima kasih!";

            const whatsappURL =
                "https://wa.me/" + nomorWhatsApp +
                "?text=" + encodeURIComponent(pesan);

            window.open(whatsappURL, "_blank");
        });
    }

});
