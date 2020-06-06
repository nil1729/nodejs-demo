module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('error', 'Not Authorized');
        res.redirect('/users/login');
    }
};