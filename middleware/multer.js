function getMulterMiddleware(fieldName, destinationPath, allowedFiles) {
    const checkFileType = (req, file, callback) => {
        if (!allowedFiles) {
            return callback(null, true);
        }

        // Allowed extensions
        const fileTypes = new RegExp(`^(${allowedFiles.join('|')})$`);
        // Check extention
        const extension = fileTypes.test(extname(file.originalname).toLowerCase());
        // Check mime type
        // const mimeType = fileTypes.test(file.mimetype);

        if (extension) {
            return callback(null, true);
        }
        callback('File type not allowed', false);
    };

    const storage = multer.diskStorage({
        destination: (req, file, done) => {
            if (!existsSync(destinationPath)) {
                mkdirSync(destinationPath, { recursive: true });
            }
            done(null, destinationPath);
        }, //'public/images/',
        filename: function (req, file, done) {
            const name = file.fieldname + '-' + Date.now() + extname(file.originalname);
            file.relativeUrl = destinationPath + name;
            done(null, name);
        },
    });
    // Upload setup
    return multer({
        storage: storage,
        fileFilter: checkFileType,
        limits: {
            fileSize: 3000000,
        },
    }).single(fieldName);
}

module.exports = {
    getMulterMiddleware,
};
