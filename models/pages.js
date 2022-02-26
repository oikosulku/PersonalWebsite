const { number } = require('joi');
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        unique : true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        unique : true,
        required: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    template: {
        type: String,
        default: 'page'
    },
    order: {
        type: Number
    },
    pageDate: {
        type: Date,
        default: Date.now 
    }
})

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;