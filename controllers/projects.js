const Project = require('../models/project');


module.exports.index = async (req, res) => {
    pageTitle = 'oikkis. Manage Projects';
    const projects = await Project.find()
    res.render('projects/admin/projects', { pageTitle, projects });
}

module.exports.showOneProject = async (req, res, next) => {
    pageTitle = 'oikkis. View Project';
    const {id} = req.params;
    const project = await Project.findById(id);
    res.render('projects/admin/show', { pageTitle, project });
}

module.exports.renderNewForm = (req, res) => {
    pageTitle = 'oikkis. Add new project';
    res.render('projects/admin/new', { pageTitle });
}

module.exports.createProject = async (req, res) => {
    const newProject = new Project ({...req.body.project})
    await newProject.save();
     // set up flash message!
    req.flash('success', `New Project Added Succesfully!`);
    res.redirect(`/admin/projects/show/${newProject._id}` )
}

module.exports.renderEditForm = async (req, res) => {
    pageTitle = 'oikkis. Edit Project';
    const {id} = req.params;
    const project = await Project.findById(id);
    res.render('projects/admin/edit', { pageTitle, project });
}

// at least one project technology need to be selected
// cannot update empty array...
module.exports.updateProject = async (req, res) => {
    const{ id } = req.params;
    await Project.findByIdAndUpdate(id, {...req.body.project})
    req.flash('success', `Project Edited Succesfully!`);
    res.redirect(`/admin/projects/show/${id}` )
}

module.exports.deleteProject = async (req, res) => {
    const {id} = req.params;
    await Project.findByIdAndDelete(id)
    req.flash('success', `Project Deleted Succesfully!`);
    res.redirect(`/admin/projects/`);
}