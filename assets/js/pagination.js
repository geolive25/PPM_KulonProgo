$(document).ready(function() {
    // --- KONFIGURASI ---
    const itemsPerPage = 6; // Jumlah item per halaman
    const $grid = $('.grid'); // Container grid
    const $paginationContainer = $('#dynamic-pagination'); // Container pagination
    
    // Ambil semua item
    let $allItems = $('.grid .all'); 
    let totalItems = $allItems.length;
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    let currentPage = 1;

    // --- FUNGSI UTAMA ---

    // 1. Render Tombol Pagination
    function renderPagination() {
        $paginationContainer.empty(); 

        if (totalPages <= 1) return;

        // Tombol Prev
        $paginationContainer.append('<li><a href="#" data-page="prev"><i class="fa fa-angle-left"></i></a></li>');

        // Angka Halaman
        for (let i = 1; i <= totalPages; i++) {
            let activeClass = (i === currentPage) ? 'active' : '';
            $paginationContainer.append('<li class="'+activeClass+'"><a href="#" data-page="'+i+'">'+i+'</a></li>');
        }

        // Tombol Next
        $paginationContainer.append('<li><a href="#" data-page="next"><i class="fa fa-angle-right"></i></a></li>');
    }

    // 2. Tampilkan Item Sesuai Halaman (MENGGUNAKAN FILTER ISOTOPE)
    function showPage(page) {
        currentPage = page;
        
        // Hitung batas index
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // INI KUNCI PERBAIKANNYA:
        // Kita suruh Isotope yang melakukan filtering berdasarkan index urutan
        $grid.isotope({
            filter: function() {
                // $(this) merujuk pada setiap item (.col-lg-4) di dalam grid
                var index = $(this).index(); 
                
                // Hanya tampilkan jika index item berada dalam range halaman saat ini
                return index >= start && index < end;
            }
        });

        updateActivePagination();
    }

    // 3. Update tampilan tombol aktif
    function updateActivePagination() {
        $paginationContainer.find('li').removeClass('active');
        $paginationContainer.find('a[data-page="'+currentPage+'"]').parent().addClass('active');
    }

    // --- INISIALISASI ---
    // Gunakan window load agar gambar sudah dimuat semua sebelum isotope menghitung posisi
    $(window).on('load', function() {
        // Hanya jalankan pagination jika filter aktif adalah "Semua Tahapan" (*)
        if ($('.filters ul li.active').attr('data-filter') === '*') {
            renderPagination();
            showPage(1);
        }
    });

    // --- EVENT HANDLERS ---

    // A. Klik Tombol Pagination
    $paginationContainer.on('click', 'li a', function(e) {
        e.preventDefault();
        let page = $(this).data('page');

        if (page === 'prev') {
            if (currentPage > 1) showPage(currentPage - 1);
        } else if (page === 'next') {
            if (currentPage < totalPages) showPage(currentPage + 1);
        } else {
            showPage(parseInt(page));
        }

        // Scroll smooth sedikit ke atas
        $('html, body').animate({
            scrollTop: $("#meetings").offset().top - 80
        }, 500);
    });

    // B. Integrasi dengan Filter Kategori (Menu Atas)
    $('.filters ul li').click(function() {
        var filterValue = $(this).attr('data-filter');

        if (filterValue === '*') {
            // Jika user klik "Semua Tahapan", kita ambil alih dengan Pagination
            $paginationContainer.show();
            // Recalculate total items (in case dynamic)
            $allItems = $('.grid .all');
            totalItems = $allItems.length;
            totalPages = Math.ceil(totalItems / itemsPerPage);
            
            renderPagination();
            showPage(1); 
        } else {
            // Jika user klik Kategori lain (misal: Analisis), matikan pagination
            // Biarkan Isotope bawaan template bekerja
            $paginationContainer.hide();
            $grid.isotope({ filter: filterValue });
        }
    });
});