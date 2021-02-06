const express = require('express');
const router = express.Router();
const checkAuthentication = require('../middleware/checkAuthentication');
const { check, validationResult } = require('express-validator');
const Video = require('../models/Video');

router.get('/', checkAuthentication, async(req, res) => {
    try{
        const ideas = await Video.find({user:req.user}).sort({createdAt:-1});
        res.render('video', {user: req.user, ideas});
    }catch(e){
        return res.render('video', {errors:['Server Error'] , user: req.user});
    }
});

router.get('/new', checkAuthentication, (req, res) => {
    res.render('video-new', {user: req.user});
});

router.post('/new',[
    check('title', 'Please enter a title for video Idea').not().isEmpty(),
    check('details', 'Please provide some details for video Idea').not().isEmpty(),
] ,checkAuthentication, async(req, res) => {
    const {title, details} = req.body;
    const errorsArray = validationResult(req);
    let errors = [];
    if(!errorsArray.isEmpty()){
        errorsArray.errors.forEach(error=>{
            errors.push(error.msg);
        });
        return res.render('video-new', {errors , idea: req.body, user: req.user});
    }
    try{
        const newVideo = {
            title,
            details,
            user: req.user
        };
        let video = new Video(newVideo);
        await video.save();
        req.flash('success', 'Video idea added successfully');
        res.redirect('/videos'); 
    }catch(e){
        return res.render('video-new', {errors:['Server Error'] , idea: req.body, user: req.user});
    } 
});

router.get('/edit/:id', checkAuthentication, async (req, res) => {
    try{
        const idea = await Video.findById(req.params.id);
        res.render('video-edit', {idea, user: req.user});
    }catch(e){
        res.redirect('back');
    }
});

router.put('/edit/:id',[
    check('title', 'Please enter a title for video Idea').not().isEmpty(),
    check('details', 'Please provide some details for video Idea').not().isEmpty(),
] ,checkAuthentication, async(req, res) => {
    const {title, details} = req.body;
    const errorsArray = validationResult(req);
    let errors = [];
    if(!errorsArray.isEmpty()){
        errorsArray.errors.forEach(error=>{
            errors.push(error.msg);
        });
        return res.render('video-new', {errors , idea: req.body, user: req.user});
    }
    try{
        const idea = await Video.findByIdAndUpdate(req.params.id, req.body);
        await idea.save();
        req.flash('success', 'Video idea updated successfully');
        res.redirect('/videos');
    }catch(e){
        return res.render('video-new', {errors:['Server Error'] , idea: req.body, user: req.user});
    } 
});

router.delete('/delete/:id',checkAuthentication , async (req, res) => {
    try{
        await Video.findByIdAndDelete(req.params.id);
        req.flash('success', 'Video idea deleted successfully');
        res.redirect('/videos');
    }catch(e){
        res.redirect('back');
    }
});

module.exports = router;