const cloudinary = require('cloudinary').v2

const uploadImage = async ({file, name}) => {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'quiz-app',
        public_id: `quiz-app/${name}`,
        overwrite: true,
        resource_type: 'auto'
    })
    return result.secure_url
}

module.exports = uploadImage