const multer = require('multer');
const path = require('path');
const { existsSync, mkdirSync } = require('node:fs');

// Đường dẫn lưu hình ảnh
const dirImage = './uploads/new/images';
const dirThumb = './uploads/new/thumb';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!existsSync(dirImage) && !existsSync(dirThumb)) {
            mkdirSync(dirImage, { recursive: true });
            mkdirSync(dirThumb, { recursive: true });
        }

        if (!existsSync(dirImage) && existsSync(dirThumb)) {
            mkdirSync(dirImage, { recursive: true });
        }

        if (existsSync(dirImage) && !existsSync(dirThumb)) {
            mkdirSync(dirThumb, { recursive: true });
        }

        let math = ['image/png', 'image/jpeg', 'image/jpg'];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return cb(errorMess, null);
        }

        cb(null, dirImage);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + new Date().getTime() + new Date().getDate() + new Date().getMonth();
        cb(null, file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname));
    },
});

const uploadImages = multer({
    storage: storage,
});

module.exports = uploadImages;