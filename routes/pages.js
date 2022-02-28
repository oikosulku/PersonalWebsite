const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateProject} = require('../middleware');

const page = require('../controllers/pages');


/*
/* ADMIN
*/


//show all pages/manage pages
router.get('/pages', isLoggedIn, catchAsync( page.getPages ));
// render new page form
router.get('/new',  isLoggedIn, page.renderNewForm ); 
// create new project post action
router.post('/', isLoggedIn, catchAsync( page.createPage )); //ivalidatePage, 
// ender edit page form
router.get('/pages/:id/edit', isLoggedIn, catchAsync(page.renderEditForm))
// publish/unpublish page
router.get('/pages/:id/publish', isLoggedIn, catchAsync(page.publishPage))
router.get('/pages/:id/unpublish', isLoggedIn, catchAsync(page.unpublishPage))
// edit page put/save action
router.put('/pages/:id', isLoggedIn,  catchAsync(page.updatePage)) // validateProject
// delete page
router.delete('/pages/:id', isLoggedIn, catchAsync(page.deletePage));

/*
/* PUBLIC
*/

// get index page
router.get('/:page', catchAsync( page.index ));
router.get('/', catchAsync( page.index ));
//router.get('/:page', catchAsync( page.index ));

// contact form POST
router.post('/contact', page.contactPostAction );


module.exports = router;