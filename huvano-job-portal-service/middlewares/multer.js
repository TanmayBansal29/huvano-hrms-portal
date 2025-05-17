const multer = require("multer");

// Local storage just to pass file to cloudinary
const storage = multer.memoryStorage()

// Creating the filter for the file types allowed (pdf, doc, docx)
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .pdf, .doc and .docx files are allowed"), false);
    }
}

// using the multer method for storage and file filter
const upload = multer({storage, fileFilter});

module.exports = upload;