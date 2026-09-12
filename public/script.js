// Sayfa Mantığı ve ASCII Canvas Efekti
const asciiCanvas = document.getElementById('ascii-canvas');
const ctx = asciiCanvas ? asciiCanvas.getContext('2d') : null;

// Ekran boyutunu ayarlama
function resizeCanvas() {
    if (!asciiCanvas) return;
    asciiCanvas.width = asciiCanvas.parentElement.clientWidth;
    asciiCanvas.height = asciiCanvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ASCII Efekt Parametreleri (Verilen JSON Konfigürasyonu)
const config = {
    cellSize: 9,
    coverage: 0.37,
    contrast: 1.58,
    charSet: " .:-=+*#%@",
    animSpeed: 0.05
};

let time = 0;
function renderAsciiEffect() {
    if (!ctx || !asciiCanvas) return;
    ctx.fillStyle = '#11111b';
    ctx.fillRect(0, 0, asciiCanvas.width, asciiCanvas.height);

    const cols = Math.floor(asciiCanvas.width / config.cellSize);
    const rows = Math.floor(asciiCanvas.height / config.cellSize);

    ctx.font = `${config.cellSize}px monospace`;
    ctx.fillStyle = '#3ca6ff';

    time += config.animSpeed;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Shimmer / Wave Efekti Mantığı
            const wave = Math.sin(c * 0.2 + r * 0.2 + time);
            const luminance = (wave + 1) / 2;

            if (luminance > (1 - config.coverage)) {
                const charIndex = Math.floor(luminance * (config.charSet.length - 1));
                const char = config.charSet[charIndex];
                ctx.fillText(char, c * config.cellSize, r * config.cellSize);
            }
        }
    }
    requestAnimationFrame(renderAsciiEffect);
}
renderAsciiEffect();

// Favorileri ve Sağ Taraftaki "En Son Eklenenler" Listesini Getirme
async function fetchFavorites() {
    try {
        const response = await fetch('/api/favorites');
        const result = await response.json();

        if (result.success) {
            renderFavorites(result.data);
            renderRecentFavorites(result.data);
        }
    } catch (error) {
        console.error('Favoriler çekilemedi:', error);
    }
}

// Ana Sayfa Sağ Taraf: En Son Eklenen 3 Favoriyi Listeleme
function renderRecentFavorites(favorites) {
    const recentContainer = document.getElementById('recent-favorites-list');
    if (!recentContainer) return;

    recentContainer.innerHTML = '';
    const recentItems = [...favorites].reverse().slice(0, 3);

    if (recentItems.length === 0) {
        recentContainer.innerHTML = '<p style="color: #a6adc8;">Henüz favori eklenmedi.</p>';
        return;
    }

    recentItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${item.title}</h3>
            <span class="badge">${item.category}</span>
            <div class="rating">⭐ ${item.rating}/5</div>
        `;
        recentContainer.appendChild(card);
    });
}

// Navigasyon Mantığı (Home ve Ekle Sayfaları Arasında Geçiş)
document.getElementById('nav-home').addEventListener('click', () => {
    document.getElementById('page-home').style.display = 'block';
    document.getElementById('page-add').style.display = 'none';
});
document.getElementById('nav-add').addEventListener('click', () => {
    document.getElementById('page-home').style.display = 'none';
    document.getElementById('page-add').style.display = 'block';
});

fetchFavorites();