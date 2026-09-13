let allFavorites = [];
let editingId = null;

// ASCII Canvas
const asciiCanvas = document.getElementById('ascii-canvas');
const ctx = asciiCanvas ? asciiCanvas.getContext('2d') : null;

function resizeCanvas() {
    if (!asciiCanvas) return;
    asciiCanvas.width = asciiCanvas.parentElement.clientWidth;
    asciiCanvas.height = asciiCanvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function renderAsciiEffect() {
    if (!ctx || !asciiCanvas) return;
    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);

    const cellSize = 12;
    const cols = Math.floor(asciiCanvas.width / cellSize);
    const rows = Math.floor(asciiCanvas.height / cellSize);
    const charSet = " .:-=+*#%";

    ctx.font = `${cellSize}px monospace`;
    ctx.fillStyle = 'rgba(34, 211, 238, 0.25)';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const wave = Math.sin(c * 0.2 + r * 0.2 + Date.now() * 0.002);
            if ((wave + 1) / 2 > 0.65) {
                const char = charSet[Math.floor(Math.random() * charSet.length)];
                ctx.fillText(char, c * cellSize, r * cellSize);
            }
        }
    }
    requestAnimationFrame(renderAsciiEffect);
}
renderAsciiEffect();

// Sayfa Geçişleri
function showView(viewName) {
    document.getElementById('page-home').style.display = viewName === 'home' ? 'block' : 'none';
    document.getElementById('page-add').style.display = viewName === 'add' ? 'block' : 'none';
    document.getElementById('page-category').style.display = viewName === 'category' ? 'block' : 'none';

    document.getElementById('nav-home').classList.toggle('active', viewName === 'home');
    document.getElementById('nav-add').classList.toggle('active', viewName === 'add');
}

document.getElementById('nav-home').addEventListener('click', () => showView('home'));
document.getElementById('nav-add').addEventListener('click', () => showView('add'));

// Verileri Getir
async function fetchFavorites() {
    try {
        const response = await fetch('/api/favorites');
        const result = await response.json();

        if (result.success) {
            allFavorites = result.data;
            renderAllViews();
        }
    } catch (err) {
        console.error('Veri yükleme hatası:', err);
    }
}

function renderAllViews() {
    renderFavoritesList();
    renderRecentFavorites();
    renderDynamicCategories();
}

function renderFavoritesList() {
    const list = document.getElementById('favorites-list');
    list.innerHTML = allFavorites.length === 0 ? '<p>Henüz kayıt yok.</p>' : '';
    allFavorites.forEach(item => list.appendChild(createCardElement(item)));
}

function renderRecentFavorites() {
    const list = document.getElementById('recent-favorites-list');
    list.innerHTML = '';
    [...allFavorites].reverse().slice(0, 3).forEach(item => list.appendChild(createCardElement(item)));
}

function renderDynamicCategories() {
    const container = document.getElementById('dynamic-categories');
    container.innerHTML = '';

    const categories = [...new Set(allFavorites.map(item => item.category.trim().toLowerCase()))];

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'menu-btn btn-dark-gray';
        btn.innerHTML = `<span><span>📁 ${cat.toUpperCase()}</span></span>`;
        btn.addEventListener('click', () => showCategoryPage(cat));
        container.appendChild(btn);
    });
}

function showCategoryPage(categoryName) {
    showView('category');
    document.getElementById('category-title').innerText = `${categoryName.toUpperCase()} KATEGORİSİ`;
    const container = document.getElementById('category-favorites-list');
    container.innerHTML = '';

    allFavorites
        .filter(item => item.category.trim().toLowerCase() === categoryName)
        .forEach(item => container.appendChild(createCardElement(item)));
}

function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';
    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);

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

// Global Silme İşlevi (Silince Anasayfaya Yönlendirir)
window.deleteFavorite = async function(id) {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    try {
        const response = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
            if (editingId && String(editingId) === String(id)) {
                editingId = null;
                document.getElementById('favorite-form').reset();
                document.querySelector('#submit-btn span span').innerText = 'Kaydet';
            }
            await fetchFavorites();
            showView('home'); // Silme sonrası anasayfaya yönlendir
        }
    } catch (err) {
        console.error('Silme hatası:', err);
    }
};

// Global Düzenleme İşlevi
window.editFavorite = function(id) {
    const item = allFavorites.find(f => String(f.id) === String(id));
    if (!item) return;

    document.getElementById('title').value = item.title;
    document.getElementById('category').value = item.category;
    document.getElementById('rating').value = item.rating;
    document.getElementById('note').value = item.note || '';

    editingId = id;
    showView('add');
    document.querySelector('#submit-btn span span').innerText = 'Güncelle';
};

// Form Kaydet / Güncelle
document.getElementById('favorite-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const rating = document.getElementById('rating').value;
    const note = document.getElementById('note').value;

    const payload = { title, category, rating: Number(rating), note };

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
                body: JSON.stringify({ id: Date.now(), ...payload })
            });
        }

        const result = await response.json();
        if (result.success) {
            editingId = null;
            document.getElementById('favorite-form').reset();
            document.querySelector('#submit-btn span span').innerText = 'Kaydet';
            fetchFavorites();
        }
    } catch (err) {
        console.error('İşlem hatası:', err);
    }
});

fetchFavorites();