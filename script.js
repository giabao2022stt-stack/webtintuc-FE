// Thay thế toàn bộ nội dung file script.js bằng code này

// ⚠️ THAY ĐỔI ĐỊA CHỈ NÀY BẰNG URL API ĐÃ DEPLOY CỦA BẠN (ví dụ: https://your-news-api.onrender.com)
const API_BASE_URL = 'https://webtintuc-project-1.onrender.com'; 

const newsdetails = document.getElementById('newsdetails');
const trendingNews = document.getElementById('trendingNews');
const paginationControls = document.getElementById('paginationControls');

// Các nút danh mục (giữ nguyên)
const generalBtn = document.getElementById('general');
const businessBtn = document.getElementById('business');
const sportBtn = document.getElementById('sport');
const technologyBtn = document.getElementById('technology');
const entertainmentBtn = document.getElementById('entertainment');
const worldBtn = document.getElementById('world');
const travelBtn = document.getElementById('travel');
const healthBtn = document.getElementById('health'); 

// Nút Sắp xếp
const sortNewestBtn = document.getElementById('sortNewest');
const sortOldestBtn = document.getElementById('sortOldest');

const searchBtn = document.getElementById('searchBtn');
const newsQuery = document.getElementById('newsQuery');

// BIẾN PHÂN TRANG & DỮ LIỆU
let allNewsItems = []; 
let currentPage = 1;
const itemsPerPage = 8; // Số tin tức hiển thị trên mỗi trang

// HÀM CHÍNH ĐỂ TẢI DỮ LIỆU
async function fetchNews(category='general'){
    currentPage = 1; 

    newsdetails.innerHTML = '<div class="col-12 text-center p-5"><h5 class="text-muted"><div class="spinner-border text-secondary me-2"></div> Đang tải tin tức...</h5></div>';
    paginationControls.innerHTML = '';

    try {
        let res = await fetch(`${API_BASE_URL}/rss?category=${category}`);
        let data = await res.json();
        
        if (!data.success) throw new Error(data.error || 'Lỗi tải tin tức');
        
        allNewsItems = data.items; 

        // Mặc định sắp xếp Mới nhất trước khi hiển thị
        sortNews('newest', false); 
        displayNewsWithPagination();
        displayTrending(allNewsItems.slice(0,3));
    } catch (error) {
        newsdetails.innerHTML = `<div class="col-12 text-center p-5"><h5 class="text-danger">Lỗi kết nối Server API: ${error.message}</h5><p class="text-muted">Đảm bảo Server đang chạy và URL API đã được cập nhật.</p></div>`;
        trendingNews.innerHTML = '';
    }
}

// HÀM SẮP XẾP DỮ LIỆU
function sortNews(order, shouldDisplay = true) {
    if (order === 'newest') {
        allNewsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    } else if (order === 'oldest') {
        allNewsItems.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
    }
    if (shouldDisplay) {
        currentPage = 1;
        displayNewsWithPagination();
    }
}

// HIỂN THỊ TIN NỔI BẬT (3 CỘT NGANG)
function displayTrending(items) {
    trendingNews.innerHTML = '';
    items.forEach(item => {
        let trendingItem = `
            <div class="col-lg-4 col-md-4 col-sm-12 mb-3">
                <div class="card h-100 border-warning border-3">
                    <img src="${item.image || 'placeholder.jpg'}" alt="..." class="card-img-top" style="height: 150px; object-fit: cover;">
                    <div class="card-body p-2">
                        <h6 class="mb-0 fw-bold"><a href="${item.link}" target="_blank" class="text-dark text-decoration-none">${item.title}</a></h6>
                        <small class="text-muted">${item.pubDate.substring(0, 10)}</small>
                    </div>
                </div>
            </div>`;
        trendingNews.innerHTML += trendingItem;
    });
}

// HÀM HIỂN THỊ TIN TỨC CÓ PHÂN TRANG
function displayNewsWithPagination(){
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = allNewsItems.slice(startIndex, endIndex);

    newsdetails.innerHTML='';

    if (itemsToDisplay.length === 0) {
        newsdetails.innerHTML = '<div class="col-12 text-center p-5"><h5 class="text-danger">Không tìm thấy tin tức nào.</h5></div>';
        paginationControls.innerHTML = '';
        return;
    }
    
    // Duyệt qua tin tức (2 CỘT: col-lg-6)
    itemsToDisplay.forEach((item, index)=>{ 
        let linkId = btoa(item.link); 
        
        // Thêm p-3 để tạo khoảng cách cho card
        let card = `<div class="col-lg-6 col-md-6 col-sm-12 p-3"> 
        <div class="card h-100">
        <img src="${item.image || 'placeholder.jpg'}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.desc}</p>
            
            <button class="btn btn-sm btn-info text-white me-2" onclick="getSummary('${item.link}')">Tóm Tắt AI</button>
            
            <a href="${item.link}" target="_blank" class="btn btn-sm btn-primary">Xem chi tiết</a>
            
            <p class="mt-2 fw-semibold" style="color: #007bff; display:none;" id="summary-${linkId}"></p>
            
        </div>
        </div>
        </div>`;
        newsdetails.innerHTML += card;

        // CHÈN QUẢNG CÁO NATIVE (sau mỗi 4 bài trên trang)
        if ((index + 1) % 4 === 0 && (index + 1) < itemsToDisplay.length) {
            let adCard = `
                <div class="col-lg-12 col-md-12 col-sm-12 mt-3 mb-3 px-3"> 
                    <div class="card bg-warning bg-opacity-25 border-warning border-2 p-2">
                        <small class="text-muted text-center">QUẢNG CÁO NATIVE(Minh họa học tập)</small>
                        <a href="https://tiki.vn/" target="_blank">
                            <img src="./hinhanh/salebanner2.jpg" alt="Native Ad" class="img-fluid mt-2" style="max-height: 150px; object-fit: cover; width: 100%; border-radius: 5px;">
                        </a>
                    </div>
                </div>`;
            newsdetails.innerHTML += adCard;
        }
    });

    // Sau khi hiển thị tin tức, render các nút phân trang
    renderPaginationControls(allNewsItems.length);
}

// HÀM TẠO NÚT PHÂN TRANG
function renderPaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationControls.innerHTML = '';

    if (totalPages <= 1) return;

    let ul = document.createElement('ul');
    ul.className = 'pagination';

    // Nút Previous
    ul.innerHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Trước</a>
    </li>`;

    // Các nút số trang (Chỉ hiện 5 trang gần nhất)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        ul.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        </li>`;
    }

    // Nút Next
    ul.innerHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Sau</a>
    </li>`;

    paginationControls.appendChild(ul);
}

// HÀM CHUYỂN TRANG
function changePage(page) {
    const totalPages = Math.ceil(allNewsItems.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayNewsWithPagination();
    
    document.getElementById('newsdetails').scrollIntoView({ behavior: 'smooth' });
}


// HÀM TÍCH HỢP AI TÓM TẮT TIN TỨC (FE)
async function getSummary(link) {
    let summaryId = 'summary-' + btoa(link);
    let summaryElement = document.getElementById(summaryId);

    summaryElement.style.display = 'block';
    summaryElement.innerText = 'Đang xử lý Tóm tắt AI...';
    summaryElement.style.color = '#007bff';

    try {
        let res = await fetch(`${API_BASE_URL}/ai-summary`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: link })
        });
        
        let data = await res.json();
        
        if (res.ok) {
            summaryElement.innerText = `[TÓM TẮT AI]: ${data.summary}`;
            summaryElement.style.color = '#28a745'; 
        } else {
            summaryElement.innerText = data.error || 'Lỗi không xác định khi tóm tắt.';
            summaryElement.style.color = '#dc3545'; 
        }

    } catch (error) {
        console.error('Lỗi kết nối server AI:', error);
        summaryElement.innerText = 'Lỗi: Không thể kết nối tới Server API Tóm tắt.';
        summaryElement.style.color = '#dc3545';
    }
}


// LOGIC TÌM KIẾM THEO TỪ KHÓA - Đã điều chỉnh để dùng phân trang
searchBtn.addEventListener('click', () => {
    let keyword = newsQuery.value.trim().toLowerCase();
    
    // Tải lại dữ liệu gốc của category hiện tại để tìm kiếm trên dữ liệu đầy đủ
    fetch(`${API_BASE_URL}/rss?category=${localStorage.getItem('currentCategory') || 'general'}`)
        .then(res => res.json())
        .then(data => {
            let itemsToFilter = data.items;

            if (keyword !== '') {
                const filteredItems = itemsToFilter.filter(item => 
                    item.title.toLowerCase().includes(keyword) || 
                    item.desc.toLowerCase().includes(keyword)
                );
                allNewsItems = filteredItems;
            } else {
                allNewsItems = data.items;
            }
            
            currentPage = 1;
            displayNewsWithPagination();
        })
        .catch(error => {
            newsdetails.innerHTML = `<div class="col-12 text-center p-5"><h5 class="text-danger">Lỗi tìm kiếm: ${error.message}</h5></div>`;
        });
});

// Event listeners cho các nút chủ đề - Đã điều chỉnh để lưu category hiện tại
function setCategory(category) {
    localStorage.setItem('currentCategory', category);
    fetchNews(category);
}

generalBtn.addEventListener('click',()=>setCategory('general'));
businessBtn.addEventListener('click',()=>setCategory('business'));
sportBtn.addEventListener('click',()=>setCategory('sport'));
technologyBtn.addEventListener('click',()=>setCategory('technology'));
entertainmentBtn.addEventListener('click',()=>setCategory('entertainment'));
worldBtn.addEventListener('click',()=>setCategory('world'));
travelBtn.addEventListener('click',()=>setCategory('travel'));
healthBtn.addEventListener('click',()=>setCategory('health'));

// Event listeners cho nút SẮP XẾP
sortNewestBtn.addEventListener('click', () => sortNews('newest'));
sortOldestBtn.addEventListener('click', () => sortNews('oldest'));


// Tải tin tức chung khi trang vừa load
window.onload = function() {
    const initialCategory = localStorage.getItem('currentCategory') || 'general';
    fetchNews(initialCategory);
};
