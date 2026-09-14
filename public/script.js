let allFavorites = [];
let editingId = null;

// Canvas Yapılandırması
const asciiCanvas = document.getElementById('ascii-canvas');
const ctx = asciiCanvas ? asciiCanvas.getContext('2d') : null;

// Kar Yağışı (Snowfall) Efekti
const snowflakes = [];
const maxFlakes = 60;

function initSnow() {
    snowflakes.length = 0;
    if (!asciiCanvas) return;
    for (let i = 0; i < maxFlakes; i++) {
        snowflakes.push({
            x: Math.random() * asciiCanvas.width,
            y: Math.random() * asciiCanvas.height,
            radius: Math.random() * 2.5 + 1,
            speed: Math.random() * 1.2 + 0.5,
            wind: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.6 + 0.3
        });
    }
}

function renderSnowEffect() {
    if (!ctx || !asciiCanvas) return;
    ctx.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);

    snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        flake.y += flake.speed;
        flake.x += flake.wind;

        if (flake.y > asciiCanvas.height) {
            flake.y = -5;
            flake.x = Math.random() * asciiCanvas.width;
        }
        if (flake.x > asciiCanvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = asciiCanvas.width;
    });

    requestAnimationFrame(renderSnowEffect);
}

function resizeCanvas() {
    if (!asciiCanvas) return;
    asciiCanvas.width = asciiCanvas.parentElement.clientWidth;
    asciiCanvas.height = asciiCanvas.parentElement.clientHeight;
    initSnow();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
renderSnowEffect();

// Sayfa Görünüm Yönetimi
function showView(viewName) {
    document.getElementById('page-home').style.display = viewName === 'home' ? 'block' : 'none';
    document.getElementById('page-add').style.display = viewName === 'add' ? 'block' : 'none';
    document.getElementById('page-category').style.display = viewName === 'category' ? 'block' : 'none';

    document.getElementById('nav-home').classList.toggle('active', viewName === 'home');
    document.getElementById('nav-add').classList.toggle('active', viewName === 'add');
}

document.getElementById('nav-home').addEventListener('click', () => showView('home'));
document.getElementById('nav-add').addEventListener('click', () => showView('add'));

// API Veri Çekme
async function fetchFavorites() {
    try {
        const response = await fetch('/api/favorites');
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            allFavorites = result.data;
        } else if (Array.isArray(result)) {
            allFavorites = result;
        }
        renderAllViews();
    } catch (err) {
        console.error('Veri çekme hatası:', err);
    }
}

function renderAllViews() {
    renderFavoritesList();
    renderRecentFavorites();
    renderDynamicCategories();
}

function renderFavoritesList() {
    const list = document.getElementById('favorites-list');
    if (!list) return;
    list.innerHTML = allFavorites.length === 0 ? '<p style="color:#a6adc8;">Henüz kayıt yok.</p>' : '';
    allFavorites.forEach(item => list.appendChild(createCardElement(item)));
}

function renderRecentFavorites() {
    const list = document.getElementById('recent-favorites-list');
    if (!list) return;
    list.innerHTML = '';
    [...allFavorites].reverse().slice(0, 3).forEach(item => list.appendChild(createCardElement(item)));
}

// Dinamik Kategorileri Oluşturma
function renderDynamicCategories() {
    const container = document.getElementById('dynamic-categories');
    if (!container) return;
    container.innerHTML = '';

    const categories = [];
    allFavorites.forEach(item => {
        if (item.category && item.category.trim() !== '') {
            const catName = item.category.trim();
            if (!categories.some(c => c.toLowerCase() === catName.toLowerCase())) {
                categories.push(catName);
            }
        }
    });

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'menu-btn btn-dark-gray';
        btn.innerHTML = `<span><span>📁 ${cat.toUpperCase()}</span></span>`;
        btn.addEventListener('click', () => showCategoryPage(cat));
        container.appendChild(btn);
    });
}

// Kategori Sayfasını Gösterme
function showCategoryPage(targetCategory) {
    showView('category');

    const titleElem = document.getElementById('category-title');
    if (titleElem) {
        titleElem.innerText = `${targetCategory.toUpperCase()} KATEGORİSİ`;
    }

    const container = document.getElementById('category-favorites-list');
    if (!container) return;
    container.innerHTML = '';

    const filtered = allFavorites.filter(item =>
        item.category && item.category.trim().toLowerCase() === targetCategory.trim().toLowerCase()
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p style="color:#a6adc8;">Bu kategoride henüz kayıt yok.</p>';
    } else {
        filtered.forEach(item => container.appendChild(createCardElement(item)));
    }
}

function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';
    const ratingVal = Number(item.rating) || 5;
    const stars = '★'.repeat(ratingVal) + '☆'.repeat(5 - ratingVal);

    card.innerHTML = `
        <h3>${item.title}</h3>
        <span class="category-tag">(${item.category})</span>
        <div class="rating" style="color: #f59e0b;">${stars}</div>
        ${item.note ? `<p class="note" style="color:#a6adc8;">"${item.note}"</p>` : ''}
        
        <div class="card-actions">
            <button class="btn-card-edit" onclick="editFavorite('${item.id}')">
                <span><span>✏️ Düzenle</span></span>
            </button>
            <button class="btn-card-delete" onclick="deleteFavorite('${item.id}')">
                <span><span>🗑️ Sil</span></span>
            </button>
        </div>
    `;
    return card;
}

// Global Silme
window.deleteFavorite = async function (id) {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    try {
        const response = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
        if (response.ok) {
            if (editingId && String(editingId) === String(id)) {
                resetFormState();
            }
            await fetchFavorites();
            showView('home');
        }
    } catch (err) {
        console.error('Silme hatası:', err);
    }
};

// Global Düzenleme
window.editFavorite = function (id) {
    const item = allFavorites.find(f => String(f.id) === String(id));
    if (!item) return;

    document.getElementById('title').value = item.title;
    document.getElementById('category').value = item.category;
    document.getElementById('rating').value = item.rating;
    document.getElementById('note').value = item.note || '';

    editingId = String(id);
    showView('add');

    const btnSpan = document.querySelector('#submit-btn span span');
    if (btnSpan) btnSpan.innerText = 'Güncelle';
};

function resetFormState() {
    editingId = null;
    document.getElementById('favorite-form').reset();
    const btnSpan = document.querySelector('#submit-btn span span');
    if (btnSpan) btnSpan.innerText = 'Kaydet';
}

// Form Gönderme
document.getElementById('favorite-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value.trim();
    const rating = Number(document.getElementById('rating').value);
    const note = document.getElementById('note').value.trim();

    if (!title || !category) return;

    const payload = { title, category, rating, note };

    try {
        let response;
        if (editingId) {
            response = await fetch(`/api/favorites/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: String(Date.now()), ...payload })
            });
        }

        if (response.ok) {
            resetFormState();
            await fetchFavorites();
            showView('home');
        }
    } catch (err) {
        console.error('Form gönderme hatası:', err);
    }
});

fetchFavorites();