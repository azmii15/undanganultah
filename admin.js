
const csvFile = document.getElementById("csvFile");
const importStatus = document.getElementById("importStatus");
const guestTable = document.getElementById("guestTable");
const searchGuest = document.getElementById("searchGuest");

// =============================
// 1. DATA TAMU
// =============================

function getGuests() {
    return JSON.parse(localStorage.getItem("importedGuests")) || [];
}

function saveGuests(data) {
    localStorage.setItem("importedGuests", JSON.stringify(data));
}

function getRSVP() {
    return JSON.parse(localStorage.getItem("rsvpGuests")) || [];
}

// =============================
// 2. FORMAT NOMOR WHATSAPP
// =============================

function formatPhone(phone) {
    let number = String(phone || "").replace(/\D/g, "");

    if (number.startsWith("0")) {
        number = "62" + number.substring(1);
    } else if (number.startsWith("8")) {
        number = "62" + number;
    }

    return number;
}

// =============================
// 3. IMPORT CSV
// =============================

if (csvFile) {
    csvFile.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        if (typeof Papa === "undefined") {
            importStatus.textContent = "PapaParse gagal dimuat.";
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: "greedy",

            transformHeader: function (header) {
                return header
                    .replace(/^\uFEFF/, "")
                    .trim()
                    .toLowerCase()
                    .replace(/[\s-]+/g, "_");
            },

            complete: function (results) {

                const rows = results.data;
                const guests = getGuests();

                let added = 0;
                let updated = 0;
                let skipped = 0;

                rows.forEach(row => {

                    const name = String(
                        row.nama_tamu ||
                        row.nama ||
                        row.name ||
                        ""
                    ).trim();

                    const phone = formatPhone(
                        row.no_whatsapp ||
                        row.no_wa ||
                        row.no_hp ||
                        row.telepon ||
                        row.phone ||
                        ""
                    );

                    const institution = String(
                        row.instansi || ""
                    ).trim();

                    const category = String(
                        row.kategori || ""
                    ).trim();

                    const csvId = String(row.id || "").trim();

                    if (!name || !phone) {
                        skipped++;
                        return;
                    }

                    const existingIndex = guests.findIndex(guest =>
                        guest.name.toLowerCase() === name.toLowerCase()
                    );

                    if (existingIndex !== -1) {

                        // Perbarui data lama tanpa menghapus status hadir
                        guests[existingIndex].phone = phone;
                        guests[existingIndex].institution = institution;
                        guests[existingIndex].category = category;

                        if (csvId) {
                            guests[existingIndex].csvId = csvId;
                        }

                        updated++;

                    } else {

                        guests.push({
                            id: csvId || (
                                Date.now().toString() +
                                Math.random().toString(36).slice(2)
                            ),
                            csvId: csvId,
                            name: name,
                            phone: phone,
                            institution: institution,
                            category: category,
                            present: false
                        });

                        added++;
                    }

                });

                saveGuests(guests);

                importStatus.textContent =
                    added + " tamu baru ditambahkan, " +
                    updated + " data diperbarui, " +
                    skipped + " data dilewati.";

                renderGuests();
            },

            error: function (error) {
                importStatus.textContent =
                    "Gagal membaca CSV: " + error.message;
            }
        });
    });
}

// =============================
// 4. LINK UNDANGAN PERSONAL
// =============================

function getInvitationLink(guest) {

    const invitationPath = window.location.pathname.replace(
        /admin\.html$/i,
        "index.html"
    );

    return window.location.origin +
        invitationPath +
        "?to=" + encodeURIComponent(guest.name);
}

// =============================
// 5. PESAN WHATSAPP SESUAI KATEGORI
// =============================

function createInvitationMessage(guest) {

    const name = guest.name;
    const category = (guest.category || "").toLowerCase();
    const invitationLink = getInvitationLink(guest);

    let message = "";

    if (category.includes("guru")) {

        message =
`Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu ${name},

Dengan hormat, saya ingin mengundang Bapak/Ibu untuk menghadiri acara ulang tahun saya, Syafiq's Birthday.

Tanggal: 15 November 2027
Waktu: 15.00 WIB - Selesai
Acara: Birthday Party Syafiq

Besar harapan saya agar Bapak/Ibu berkenan hadir dan turut merayakan momen bahagia ini.

Berikut tautan undangannya:
${invitationLink}

Terima kasih atas perhatian dan waktunya.

Hormat saya,
Syafiq`;

    } else if (category.includes("sahabat")) {

        message =
`Halo ${name}! 👋

Aku mau mengundang kamu ke acara ulang tahunku, Syafiq's Birthday! 🎉

Tanggal: 15 November 2027
Waktu: 15.00 WIB - Selesai

Aku berharap kamu bisa datang dan ikut merayakan hari spesial ini bersama!

Ini link undangannya:
${invitationLink}

Sampai ketemu ya!

— Syafiq`;

    } else if (category.includes("teman")) {

        message =
`Halo ${name}! 🎉

Aku mau mengundang kamu ke acara ulang tahunku, Syafiq's Birthday!

Tanggal: 15 November 2027
Waktu: 15.00 WIB - Selesai

Jangan lupa datang ya! Bakal lebih seru kalau kamu ikut merayakannya.

Link undangan:
${invitationLink}

Sampai ketemu!

— Syafiq`;

    } else if (category.includes("alumni")) {

        message =
`Halo Kak ${name}! 👋

Saya ingin mengundang Kakak untuk hadir di acara ulang tahun saya, Syafiq's Birthday.

Tanggal: 15 November 2027
Waktu: 15.00 WIB - Selesai

Semoga Kakak bisa menyempatkan waktu untuk hadir dan ikut meramaikan acara ini.

Berikut tautan undangannya:
${invitationLink}

Terima kasih, Kak.

Salam,
Syafiq`;

    } else {

        message =
`Halo ${name}!

Dengan senang hati saya ingin mengundang Anda ke acara ulang tahun saya, Syafiq's Birthday.

Tanggal: 15 November 2027
Waktu: 15.00 WIB - Selesai

Saya berharap Anda dapat hadir dan ikut merayakan momen spesial ini.

Link undangan:
${invitationLink}

Terima kasih!

— Syafiq`;
    }

    return message;
}

// =============================
// 6. KIRIM UNDANGAN WHATSAPP
// =============================

function sendInvitation(id) {

    const guests = getGuests();

    const guest = guests.find(item =>
        String(item.id) === String(id)
    );

    if (!guest) {
        alert("Data tamu tidak ditemukan.");
        return;
    }

    const phone = formatPhone(guest.phone);

    if (!phone || phone.length < 10) {
        alert("Nomor WhatsApp " + guest.name + " tidak valid.");
        return;
    }

    const message = createInvitationMessage(guest);

    const whatsappURL =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
}

// =============================
// 7. TAMPILKAN DATA TAMU
// =============================

function renderGuests(keyword = "") {

    const guests = getGuests();
    const rsvp = getRSVP();

    guestTable.innerHTML = "";

    const filtered = guests.filter(guest =>
        guest.name.toLowerCase().includes(keyword.toLowerCase())
    );

    document.getElementById("emptyMessage").style.display =
        filtered.length === 0 ? "block" : "none";

    filtered.forEach(guest => {

        const rsvpData = rsvp.find(item =>
            item.name &&
            item.name.toLowerCase() === guest.name.toLowerCase()
        );

        const row = document.createElement("tr");

        // Kolom data tamu
        const values = [
            guest.name,
            guest.institution || "-",
            guest.category || "-",
            guest.phone || "-",
            rsvpData ? rsvpData.attendance : "Belum RSVP",
            rsvpData ? rsvpData.message || "-" : "-",
            guest.present ? "Sudah Hadir" : "Belum Hadir"
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Tombol kirim undangan
        const invitationCell = document.createElement("td");
        const invitationButton = document.createElement("button");

        invitationButton.className = "whatsapp-button";
        invitationButton.textContent = "Kirim Undangan";

        invitationButton.addEventListener("click", function () {
            sendInvitation(guest.id);
        });

        invitationCell.appendChild(invitationButton);
        row.appendChild(invitationCell);

        // Tombol tandai hadir
        const actionCell = document.createElement("td");
        const presentButton = document.createElement("button");

        presentButton.className = "action-button";

        presentButton.textContent =
            guest.present ? "Sudah Hadir" : "Tandai Hadir";

        presentButton.disabled = guest.present;

        presentButton.addEventListener("click", function () {
            markPresent(guest.id);
        });

        actionCell.appendChild(presentButton);
        row.appendChild(actionCell);

        guestTable.appendChild(row);
    });

    updateStatistics(guests);
}

// =============================
// 8. STATISTIK
// =============================

function updateStatistics(guests) {

    const rsvp = getRSVP();

    document.getElementById("totalGuests").textContent =
        guests.length;

    document.getElementById("totalAttending").textContent =
        rsvp.filter(item =>
            String(item.attendance || "").toLowerCase() === "hadir"
        ).length;

    document.getElementById("totalPresent").textContent =
        guests.filter(item => item.present).length;
}

// =============================
// 9. TANDAI HADIR
// =============================

function markPresent(id) {

    const guests = getGuests();

    const index = guests.findIndex(guest =>
        String(guest.id) === String(id)
    );

    if (index === -1 || guests[index].present) return;

    guests[index].present = true;

    saveGuests(guests);

    renderGuests(searchGuest ? searchGuest.value : "");
}

// =============================
// 10. PENCARIAN TAMU
// =============================

if (searchGuest) {
    searchGuest.addEventListener("input", function () {
        renderGuests(this.value);
    });
}

// =============================
// 11. TAMPILKAN SAAT HALAMAN DIBUKA
// =============================

renderGuests();
