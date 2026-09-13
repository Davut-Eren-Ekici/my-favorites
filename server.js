const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Geçici Bellek (In-memory storage)
let favorites = [];

// GET: Tüm favorileri getir
app.get('/api/favorites', (req, res) => {
    res.json({ success: true, data: favorites });
});

// POST: Yeni favori ekle
app.post('/api/favorites', (req, res) => {
    const { id, title, category, rating, note } = req.body;
    
    if (!title || !category) {
        return res.status(400).json({ success: false, message: "Başlık ve kategori zorunludur." });
    }

    const newItem = {
        id: id || Date.now(),
        title,
        category: category.trim().toLowerCase(),
        rating: Number(rating) || 5,
        note: note || ""
    };

    favorites.push(newItem);
    res.json({ success: true, data: newItem });
});

// DELETE: Favori sil
app.delete('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    const index = favorites.findIndex(item => String(item.id) === String(id));

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Favori bulunamadı." });
    }

    favorites.splice(index, 1);
    res.json({ success: true, message: "Favori silindi." });
});

// PUT: Favori güncelle (Üstüne Yaz)
app.put('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    const { title, category, rating, note } = req.body;

    const index = favorites.findIndex(item => String(item.id) === String(id));

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Favori bulunamadı." });
    }

    favorites[index] = {
        ...favorites[index],
        title: title || favorites[index].title,
        category: category ? category.trim().toLowerCase() : favorites[index].category,
        rating: rating !== undefined ? Number(rating) : favorites[index].rating,
        note: note !== undefined ? note : favorites[index].note
    };

    res.json({ success: true, data: favorites[index] });
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});