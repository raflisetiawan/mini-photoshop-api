# Mini Photoshop App

Aplikasi Mini Photoshop dengan Node.js (Nest.js) sebagai backend dan Quasar.js sebagai frontend.

## Deskripsi

Aplikasi ini memiliki fitur-fitur dasar untuk pengolahan citra digital, termasuk pembacaan dan penyimpanan citra, serta beberapa operasi pengolahan citra seperti membuat citra negatif, mengubah citra berwarna menjadi citra grayscale, brightness adjustment, operasi aritmetika antara dua citra, dan operasi geometri seperti translasi, rotasi, flipping, dan zooming.

## Setup

### Backend (Node.js - Nest.js)

1. Install dependencies:

```bash
$ cd mini-photoshop-api
$ npm install

# development mode
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoint API

- **Upload Gambar:** `POST /image/upload`
- **Tampilkan Gambar:** `GET /image/:imageName`
- **Informasi Gambar:** `GET /image/:imageName/info`

### Operasi Pengolahan Citra

- **Convert ke Biner:** `GET /image-processing/convert-binary/:imageName`
- **Convert ke Grayscale:** `GET /image-processing/convert-grayscale/:imageName`
- **Brightness Adjustment:** `GET /image-processing/brighten-image/:imageName/:factor`

### Operasi Aritmetika

- **Penjumlahan Citra:** `GET /image-processing/add-images/:imageName1/:imageName2`
- **Pengurangan Citra:** `GET /image-processing/subtract-images/:imageName1/:imageName2`

### Operasi Geometri

- **Translasi Citra:** `GET /image-processing/translate-image/:imageName/:x/:y`
- **Rotasi Citra:** `GET /image-processing/rotate-image/:imageName/:degrees`
- **Flipping Citra:**
  - Horizontal: `GET /image-processing/flip-image/:imageName/horizontal`
  - Vertical: `GET /image-processing/flip-image/:imageName/vertical`
- **Zooming Citra:** `GET /image-processing/zoom-image/:imageName/:factor`
