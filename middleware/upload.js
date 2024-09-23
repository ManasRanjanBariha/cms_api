
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
       
        const applicantCode = req.body.applicant_code;
        const timestamp = Date.now();
        
        
        const ext = path.extname(file.originalname);
        cb(null, `${applicantCode}-${timestamp}${ext}`);
    }
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc/;
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.test(ext)) {
        cb(null, true); 
    } else {
        cb(new Error('Only .pdf and .doc files are allowed.'), false); 
    }
};

const upload = multer({ 
    storage, 
    fileFilter 
});

module.exports = upload;
