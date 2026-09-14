# ❄️ My Favorites Dashboard      

[![Live Demo](https://img.shields.io/badge/Live-Demo-22d3ee?style=for-the-badge&logo=github&logoColor=white)](https://davut-eren-ekici.github.io/my-favorites/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

Kişisel içerikleri, projeleri, filmleri ve kaynakları tek bir merkezden yönetmek, kategorize etmek ve derecelendirmek için geliştirilmiş **kış temalı (Winter-themed)** modern ve dinamik bir web paneli.

🔗 **Canlı Önizleme:** [https://davut-eren-ekici.github.io/my-favorites/](https://davut-eren-ekici.github.io/my-favorites/)

---

## ✨ Öne Çıkan Özellikler

- **❄️ Prosedürel Kar Yağışı Efekti:** HTML5 Canvas2D kullanılarak geliştirilmiş, akıcı ve performanslı kar tanesi animasyonu.
- **🏡 Vektörel Kış Köyü Manzarası:** Yönetim görünümüne özel tasarlanmış karlı ev, kardan adam ve çocuk siluetlerinden oluşan custom SVG illüstrasyonu.
- **📁 Dinamik Kategorizasyon:** Eklenen içeriklere göre otomatik olarak sol menüde oluşan ve harf duyarsız (case-insensitive) çalışan akıllı filtreleme sistemi.
- **⚡ Tam CRUD Desteği:** Favori öğeleri ekleme, anlık listeleme, güncelleme ve silme (Create, Read, Update, Delete) işlevleri.
- **🎨 Glassmorphism & Retro-Futuristic Arayüz:** Modern cam efektleri (`backdrop-filter`) ve özel buton tasarımları ile güçlendirilmiş UI/UX.
- **📱 Duyarlı (Responsive) Tasarım:** Masaüstü ve mobil cihazlarda sorunsuz çalışan esnek düzen.

---

## 🛠️ Teknolojiler

### Frontend
- **HTML5 & CSS3:** Flexbox, CSS Grid, Glassmorphism tasarımı.
- **Vanilla JavaScript (ES6+):** Modüler durum yönetimi, DOM manipülasyonu ve Fetch API.
- **HTML5 Canvas API:** Özel parçacık tabanlı (particle-based) kar yağışı algoritması.

### Backend (Geliştirme / Local API)
- **Node.js & Express.js:** RESTful API mimarisi.

---

## 🚀 Yerel Kurulum (Local Setup)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. **Repoyu klonlayın:**
   ```bash
   git clone [https://github.com/davut-eren-ekici/my-favorites.git](https://github.com/davut-eren-ekici/my-favorites.git)
   cd my-favorites

   📂 Proje Yapısı
Plaintext
my-favorites/
├── public/
│   ├── index.html       # Ana HTML yapısı ve sayfa görünümleri
│   ├── style.css        # Cam efekti, kış teması ve responsive stiller
│   └── script.js        # Canvas animasyonu, API istekleri ve DOM yönetimi
├── server.js            # Express.js REST API sunucusu
├── package.json         # Proje bağımlılıkları ve script'ler
└── README.md            # Proje dokümantasyonu



📝 Lisans
Bu proje MIT lisansı altında korunmaktadır. İstediğiniz gibi çatallayabilir (fork) ve geliştirebilirsiniz.