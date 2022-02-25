const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateProject} = require('../middleware');

const project = require('../controllers/projects');

//
// set some global vars to project use....
router.use((req, res, next) => {
    res.locals.projectTech = ['html', 'css', 'js', 'react', 'node', 'mongo', 'bootstrap'];
    next();
})

// show all projects
router.get('/', isLoggedIn, catchAsync( project.index ));
// show ONE project
router.get('/show/:id', isLoggedIn, catchAsync( project.showOneProject ));
// render new project form
router.get('/new', isLoggedIn, project.renderNewForm );
// create new project post action
router.post('/', isLoggedIn, validateProject, catchAsync( project.createProject ));
// render edit project form
router.get('/:id/edit', isLoggedIn, catchAsync(project.renderEditForm))
// edit project put/save action
router.put('/:id', isLoggedIn, validateProject, catchAsync(project.updateProject))
// delete project
router.delete('/:id', isLoggedIn, catchAsync(project.deleteProject))


module.exports = router;