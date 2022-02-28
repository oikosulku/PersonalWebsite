const Page = require('../models/pages');
const Project = require('../models/project');
const _ = require("lodash");
const sanitizeHtml = require('sanitize-html');

module.exports.index = async (req, res) => {
    
    const url  = req.params.page ? req.params.page : 'home';
    const page = await Page.findOne({ url: url});
    
    switch (page.template ) {
        case 'home':
            const projects = await Project.find();
            res.render('pages/home', {page, projects});
            break;
        case 'contact':
            res.render('pages/contact', {page});
            break;
        default:
            res.render('pages/page', {page});
    }
}

// module.exports.showOneProject = async (req, res, next) => {
//     pageTitle = 'oikkis. View Project';
//     const {id} = req.params;
//     const project = await Project.findById(id);
//     res.render('projects/show', { pageTitle, project });
// }


module.exports.getPages = async (req, res) => {
    pageTitle = 'oikkis. Manage Pages';
    const pages = await Page.find().sort('order')
    res.render('pages/pages', { pageTitle, pages });
}


module.exports.renderNewForm = (req, res) => {
    pageTitle = 'oikkis. Add new Page';
    res.render('pages/new', { pageTitle });
}

module.exports.createPage = async (req, res) => {
    req.body.page.url = _.kebabCase(req.body.page.title);
    req.body.page.content = sanitizeHtml( req.body.page.content );
    const newPage = new Page ({...req.body.page})
    await newPage.save();
     // set up flash message!
    req.flash('success', `New Page Added Succesfully!`);
    res.redirect(`/pages` )
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const page = await Page.findById(id);
    res.render('pages/edit', { page });
}


module.exports.updatePage = async (req, res) => {
    const{ id, url, title } = req.params;
   
    if (req.body.page.url === '') {
        console.log('Urli tyhja');
        req.body.page.url = _.kebabCase(req.body.page.title);
    } else {
        req.body.page.url = _.kebabCase(req.body.page.url);
    }
    req.body.page.content = sanitizeHtml( req.body.page.content );
    //req.body.page.url = _.kebabCase(req.body.page.title);
    console.log(req.body.page);
    await Page.findByIdAndUpdate(id, {...req.body.page})
    req.flash('success', `Page Edited Succesfully!`);
    //res.redirect(`/pages/show/${id}` )
    res.redirect(`/pages`);
}

module.exports.publishPage = async (req, res) => {
    const{ id } = req.params;
    await Page.findByIdAndUpdate(id, {isPublished: true})
    req.flash('success', `Page Published Succesfully!`);
    res.redirect(`/pages`);
}

module.exports.unpublishPage = async (req, res) => {
    const{ id } = req.params;
    await Page.findByIdAndUpdate(id, {isPublished: false})
    req.flash('success', `Page UNPublished Succesfully!`);
    res.redirect(`/pages`);
}

module.exports.deletePage = async (req, res) => {
    const {id} = req.params;
    await Page.findByIdAndDelete(id)
    req.flash('success', `Page Deleted Succesfully!`);
    res.redirect(`/pages`);
}

module.exports.contactPostAction = (req, res) => {
    const{ yourName, yourEmail, yourMsg } = req.body;
    // POST ACTION NEED TO BE DONE
    // set up flash message!
    req.flash('success', `Thank you ${yourName}, your message has sended! Will respond soonest!`);
    res.redirect('contact');
}
