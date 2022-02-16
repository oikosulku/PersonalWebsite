const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    projectUrl: {
        type: String,
        required: false
    },
    github: {
        type: String,
        required: false
    },
    projectTech: [],
    projectDate: {
        type: Date,
        default: Date.now 
    }
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;