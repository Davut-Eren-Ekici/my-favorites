import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Gelen JSON gövdelerini ayrıştırmak için zorunlu middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyaları sunma
app.use(express.static(path.join(__dirname, 'public')));

// Örnek veri hafızası
let favorites = [
    { id: "1", title: "Inception", category: "Film", rating: 5, note: "Harika bir bilim kurgu." }
];

// GET: Tüm favorileri getir
app.get('/api/favorites', (req, res) => {
    res.json({ success: true, data: favorites });
});

// POST: Yeni favori ekle
app.post('/api/favorites', (req, res) => {
    const { title, category, rating, note } = req.body;

    if (!title || !category) {
        return res.status(400).json({ success: false, message: 'Başlık ve kategori zorunludur.' });
    }

    const newFavorite = {
        id: String(req.body.id || Date.now()),
        title,
        category,
        rating: Number(rating) || 5,
        note: note || ''
    };

    favorites.push(newFavorite);
    res.status(201).json({ success: true, data: newFavorite });
});

// PUT: Varolan favoriyi güncelle
app.put('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    const { title, category, rating, note } = req.body;

    const index = favorites.findIndex(f => String(f.id) === String(id));
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Kayıt bulunamadı.' });
    }

    favorites[index] = {
        ...favorites[index],
        title: title || favorites[index].title,
        category: category || favorites[index].category,
        rating: rating !== undefined ? Number(rating) : favorites[index].rating,
        note: note !== undefined ? note : favorites[index].note
    };

    res.json({ success: true, data: favorites[index] });
});

// DELETE: Favori sil
app.delete('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    favorites = favorites.filter(f => String(f.id) !== String(id));
    res.json({ success: true, message: 'Kayıt silindi.' });
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});