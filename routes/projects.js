const express = require('express');
const Project = require('./../models/project');
const catchAsync = require('./../utils/catchAsync');
const router = express.Router();
const {projectSchema} = require('./../schemas.js');
const appError = require('./../utils/AppError');

// Project form validation...
const validateProject = (req, res, next) => {
    console.log(req.body);
    const { error } = projectSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new appError(msg, 400);
    } else {
        next();
    }
}

//
// middleware
router.use((req, res, next) => {
    res.locals.projectTech = ['html', 'css', 'js', 'react', 'node', 'mongo', 'bootstrap'];
    res.locals.messages = req.flash('success');
    next();
})

//
// show all projects
router.get('/', catchAsync(async (req, res) => {
    pageTitle = 'oikkis. Manage Projects';
    const projects = await Project.find()
    res.render('projects/admin/projects', { pageTitle, projects });
}))

//
// show ONE project
router.get('/show/:id', catchAsync(async (req, res, next) => {
    pageTitle = 'oikkis. View Project';
    const {id} = req.params;
    const project = await Project.findById(id);
    res.render('projects/admin/show', { pageTitle, project });
}))

//
// add new project form
router.get('/new', catchAsync(async (req, res) => {
    pageTitle = 'oikkis. Manage Projects';
    res.render('projects/admin/new', { pageTitle });
}))

//
// add new project POST
router.post('/', validateProject, catchAsync(async (req, res) => {
    const newProject = new Project ({...req.body.project})
    await newProject.save();
     // set up flash message!
    req.flash('success', `New Project Added Succesfully!`);
    res.redirect(`/admin/projects/show/${newProject._id}` )
}))

//
// edit project form
router.get('/:id/edit', catchAsync(async (req, res) => {
    pageTitle = 'oikkis. Edit Project';
    const {id} = req.params;
    const project = await Project.findById(id);
    res.render('projects/admin/edit', { pageTitle, project });
}))

//
// edit project put/save
// at least one project technology need to be selected
// cannot update empty array...
router.put('/:id', validateProject, catchAsync(async (req, res) => {
    const{ id } = req.params;
    await Project.findByIdAndUpdate(id, {...req.body.project})
    req.flash('success', `Project Edited Succesfully!`);
    res.redirect(`/admin/projects/show/${id}` )
}))

//
// delete project
router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Project.findByIdAndDelete(id)
    req.flash('success', `Project Deleted Succesfully!`);
    res.redirect(`/admin/projects/` );
}))



module.exports = router;