const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/';

        if (file.fieldname === 'photo') {
            folder += 'photo/';
        } else if (file.fieldname === 'proof') {
            folder += 'document/';
        } else if (file.fieldname === 'transactionProof') {
            folder += 'payment/';
        }

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + '-' + file.originalname.replace(/\s/g, '_');
        cb(null, uniqueName);
    }
});


// ✅ ADD THIS (missing in your code)
const fileFilter = (req, file, cb) => {

    const mime = file.mimetype;

    // PHOTO → only image
    if (file.fieldname === 'photo') {
        if (mime.startsWith('image/')) return cb(null, true);
        return cb(new Error('Photo must be an image'));
    }

    // DOCUMENT → image + PDF
    if (file.fieldname === 'proof') {
        if (mime.startsWith('image/') || mime === 'application/pdf') {
            return cb(null, true);
        }
        return cb(new Error('Document must be image or PDF'));
    }

    // PAYMENT → only image
    if (file.fieldname === 'transactionProof') {
        if (mime.startsWith('image/')) return cb(null, true);
        return cb(new Error('Transaction proof must be image'));
    }

    return cb(new Error('Invalid field'));
};


const upload = multer({
    storage,
    fileFilter   // ✅ IMPORTANT
});

module.exports = upload;