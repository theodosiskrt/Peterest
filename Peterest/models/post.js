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
    }
})

module.exports = mongoose.model('post', postSchema);