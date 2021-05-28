const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    image: {
        type: String
    },
    author:{
        required: true,
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('post', postSchema);