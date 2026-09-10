import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Geçici Veri Deposu (In-Memory Data)
let favorites = [
    {
        id:1,
        title: "Interstellar",
        category: "film",
        rating:5,
        note: "Müzikleri ve bilim kurgu atmosferi muazzam."
    },
    {
        id:2,
        title: "Bohemian Rhapsody - Queen",
        category:"müzik",
        rating:5,
        note: "Tüm zamanların en iyi rock Parçası"
    }
];

// Tüm favorileri getiren GET isteği
app.get('/api/favorites', (req,res) =>{
    res.json({ success: true,data: favorites});
});

//YENİ FAVORİ EKLE (POST)
app.post('/api/favorites', (req, res) => {
    // Frontend'den gelen verileri ayıklıyoruz
    const { title, category, rating, note } = req.body;

    // Basit bir doğrulama (Validation): Başlık veya kategori boşsa hata dön
    if (!title || !category) {
        return res.status(400).json({ 
            success: false, 
            error: "Lütfen başlık ve kategori alanlarını doldurun." 
        });
    }

    // Yeni eleman için benzersiz bir ID ve obje oluşturuyoruz
    const newFavorite = {
        id: Date.now(), // Zaman damgası ile eşsiz ID üretiyoruz
        title,
        category,
        rating: Number(rating) || 5,
        note: note || ''
    };

    
    favorites.push(newFavorite);

    // Yanıt olarak eklenen objeyi dönüyoruz
    res.status(201).json({ 
        success: true, 
        message: "Yeni favori başarıyla eklendi!", 
        data: newFavorite 
    });
});


// Sunucuyu Başlatma
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});

