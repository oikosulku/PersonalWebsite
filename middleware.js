// include models
const Project = require('./models/project');

// include other depencies
const appError = require('./utils/AppError');
const {projectSchema} = require('./schemas.js');


// Check if user logged in
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/users/login');
    }
    next();
};


// Project form validation...
module.exports.validateProject = (req, res, next) => {
    console.log(req.body);
    const { error } = projectSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new appError(msg, 400);
    } else {
        next();
    }
}
