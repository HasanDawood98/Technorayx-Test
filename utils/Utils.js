module.exports = {
    relativePathToUrl: (req, relativePath) => {
        const absolutePath = req.protocol + '://' + req.headers.host + '/' + relativePath;
        return absolutePath;
    },
};
