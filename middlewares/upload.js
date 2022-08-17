const multer = require('multer');

const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const isImage = (req, file, callback) => {
    if(file.mimetype.startsWith('image')) {
        callback( null, true);
    }else {
        callback( new Error('Only image is allow'))
    }
};

const upload = multer({
    storage: multerConfig,
    fileFilter: isImage
});

module.exports = upload;