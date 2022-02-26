const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateProject} = require('../middleware');

const page = require('../controllers/pages');


/*
* PUBLIC
*/


// show ONE project
// router.get('/show/:id', catchAsync( project.showPage ));

// /*
// * ADMIN

// */
// // show all pages/manage pages
router.get('/pages', isLoggedIn, catchAsync( page.getPages ));
// // render new page form
router.get('/new',  isLoggedIn, page.renderNewForm ); 
// // create new project post action
router.post('/', isLoggedIn, catchAsync( page.createPage )); //ivalidatePage, 
// // render edit page form
router.get('/pages/:id/edit', isLoggedIn, catchAsync(page.renderEditForm))

router.get('/pages/:id/publish', isLoggedIn, catchAsync(page.publishPage))
router.get('/pages/:id/unpublish', isLoggedIn, catchAsync(page.unpublishPage))
// // edit page put/save action
router.put('/pages/:id', isLoggedIn,  catchAsync(page.updatePage)) // validateProject
// delete page
router.delete('/pages/:id', isLoggedIn, catchAsync(page.deletePage));

// get index page
router.get('/:page', catchAsync( page.index ));
router.get('/', catchAsync( page.index ));
//router.get('/:page', catchAsync( page.index ));

module.exports = router;