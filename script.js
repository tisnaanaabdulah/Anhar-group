/* =========================
   DATA PRODUK
========================= */

const produk = [
    {
        id: 1,
        nama: "Kaos Premium",
        harga: 75000
    },
    {
        id: 2,
        nama: "Headset Gaming",
        harga: 120000
    },
    {
        id: 3,
        nama: "Keyboard Mechanical",
        harga: 250000
    },
    {
        id: 4,
        nama: "Jam Tangan",
        harga: 180000
    },
    {
        id: 5,
        nama: "Hoodie Premium",
        harga: 150000
    },
    {
        id: 6,
        nama: "Tas Casual",
        harga: 100000
    }
];


/* =========================
   KERANJANG
========================= */

let keranjang = JSON.parse(
    localStorage.getItem("keranjang")
) || [];


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(angka) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);

}


/* =========================
   SIMPAN KERANJANG
========================= */

function simpanKeranjang() {

    localStorage.setItem(
        "keranjang",
        JSON.stringify(keranjang)
    );

}


/* =========================
   TAMBAH KERANJANG
========================= */

function tambahKeranjang(id) {

    const produkDipilih = produk.find(
        item => item.id === id
    );

    if (!produkDipilih) return;


    const item = keranjang.find(
        item => item.id === id
    );


    if (item) {

        item.jumlah++;

    } else {

        keranjang.push({
            id: produkDipilih.id,
            nama: produkDipilih.nama,
            harga: produkDipilih.harga,
            jumlah: 1
        });

    }


    simpanKeranjang();

    tampilkanKeranjang();

    updateJumlahKeranjang();

    alert(
        produkDipilih.nama +
        " berhasil ditambahkan ke keranjang!"
    );

}


/* =========================
   TAMBAH JUMLAH
========================= */

function tambahJumlah(id) {

    const item = keranjang.find(
        item => item.id === id
    );

    if (item) {

        item.jumlah++;

    }

    simpanKeranjang();

    tampilkanKeranjang();

    updateJumlahKeranjang();

}


/* =========================
   KURANGI JUMLAH
========================= */

function kurangJumlah(id) {

    const item = keranjang.find(
        item => item.id === id
    );

    if (!item) return;


    item.jumlah--;


    if (item.jumlah <= 0) {

        keranjang = keranjang.filter(
            item => item.id !== id
        );

    }


    simpanKeranjang();

    tampilkanKeranjang();

    updateJumlahKeranjang();

}


/* =========================
   HAPUS PRODUK
========================= */

function hapusProduk(id) {

    keranjang = keranjang.filter(
        item => item.id !== id
    );

    simpanKeranjang();

    tampilkanKeranjang();

    updateJumlahKeranjang();

}


/* =========================
   TAMPILKAN KERANJANG
========================= */

function tampilkanKeranjang() {

    const container =
        document.getElementById("isiKeranjang");

    const totalHarga =
        document.getElementById("totalHarga");


    if (keranjang.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                🛒
                <h3>Keranjang masih kosong</h3>
                <p>Yuk pilih produk terlebih dahulu.</p>
            </div>
        `;

        totalHarga.innerText = "Rp0";

        return;
    }


    let html = "";

    let total = 0;


    keranjang.forEach(item => {

        const subtotal =
            item.harga * item.jumlah;

        total += subtotal;


        html += `

            <div class="cart-item">

                <div>

                    <h4>${item.nama}</h4>

                    <p>
                        ${formatRupiah(item.harga)}
                    </p>

                    <p>
                        Subtotal:
                        ${formatRupiah(subtotal)}
                    </p>

                </div>


                <div class="qty">

                    <button
                        onclick="kurangJumlah(${item.id})">
                        −
                    </button>

                    <span>
                        ${item.jumlah}
                    </span>

                    <button
                        onclick="tambahJumlah(${item.id})">
                        +
                    </button>

                </div>


                <button
                    onclick="hapusProduk(${item.id})"
                    style="
                        border:none;
                        background:none;
                        color:#ff4f81;
                        font-size:18px;
                    ">
                    🗑️
                </button>

            </div>

        `;

    });


    container.innerHTML = html;

    totalHarga.innerText =
        formatRupiah(total);

}


/* =========================
   JUMLAH KERANJANG
========================= */

function updateJumlahKeranjang() {

    const jumlah = keranjang.reduce(
        (total, item) =>
            total + item.jumlah,
        0
    );


    document.getElementById(
        "jumlahKeranjang"
    ).innerText = jumlah;

}


/* =========================
   BUKA KERANJANG
========================= */

function bukaKeranjang() {

    document
        .getElementById("cartModal")
        .classList.add("show");

    tampilkanKeranjang();

}


/* =========================
   TUTUP KERANJANG
========================= */

function tutupKeranjang() {

    document
        .getElementById("cartModal")
        .classList.remove("show");

}


/* =========================
   FILTER PRODUK
========================= */

function filterProduk(kategori) {

    const cards =
        document.querySelectorAll(".produk-card");

    const buttons =
        document.querySelectorAll(".kategori-btn");


    buttons.forEach(button => {

        button.classList.remove("active");

    });


    event.target.classList.add("active");


    cards.forEach(card => {

        const kategoriProduk =
            card.dataset.kategori;


        if (
            kategori === "semua" ||
            kategoriProduk === kategori
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


/* =========================
   PENCARIAN PRODUK
========================= */

function cariProduk() {

    const keyword =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();


    const cards =
        document.querySelectorAll(".produk-card");


    cards.forEach(card => {

        const nama =
            card.dataset.nama.toLowerCase();


        if (nama.includes(keyword)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


/* =========================
   CHECKOUT WHATSAPP
========================= */

function checkoutWhatsApp() {

    if (keranjang.length === 0) {

        alert(
            "Keranjang masih kosong!"
        );

        return;

    }


    let pesan =
        "Halo Anhar Group, saya ingin memesan:%0A%0A";


    let total = 0;


    keranjang.forEach(item => {

        const subtotal =
            item.harga * item.jumlah;

        total += subtotal;


        pesan +=
            `• ${item.nama} x${item.jumlah} = ${formatRupiah(subtotal)}%0A`;

    });


    pesan +=
        `%0ATotal: ${formatRupiah(total)}%0A%0A`;

    pesan +=
        "Mohon informasi cara pembayarannya. Terima kasih.";


    /*
       GANTI NOMOR DI BAWAH
       dengan nomor WhatsApp toko.

       Format:
       085155028629

       Jangan gunakan tanda +
       dan jangan gunakan angka 0
       di awal.
    */

    const nomorWhatsApp =
        "6281234567890";


    const url =
        `https://wa.me/${nomorWhatsApp}?text=${pesan}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================
   TAHUN FOOTER
========================= */

document.getElementById(
    "tahun"
).innerText = new Date().getFullYear();


/* =========================
   LOAD AWAL
========================= */

updateJumlahKeranjang();

tampilkanKeranjang();


/* =========================
   TUTUP MODAL KLIK LUAR
========================= */

document
    .getElementById("cartModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                tutupKeranjang();

            }

        }
    );