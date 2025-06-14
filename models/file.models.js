const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: [true, 'path is required']
    },
    originalname: {
        type:String,
        required: [true, 'originalname is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true,'user is required']
    },
    fileId: {                             // ✅ Add this field
    type: String,
    required: true
  }
})


const file = mongoose.model('file',fileSchema)

module.exports = file;