const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {check,validationResult} = require('express-validator');
const request = require('request');
const config = require('config');

//GET api/profile/me
//get my profile
router.get('/me',auth,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg: 'there is no profile for this user!'});
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

//POST api/profile
//post new profile or update existing one
router.post('/',auth,
[
    check('status','status is required!').not().isEmpty(),
    check('skills','skills is required').not().isEmpty()
], 
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate({user: req.user.id} , {$set : profileFields} , {new: true});
            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

//GET api/profile
//get all profiles
router.get('/', async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

//GET api/profile/user/:user_id
//get profile by user id
router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg: 'profile not found!'});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') return res.status(400).json({msg: 'profile not found!'});
        res.status(500).send('Server error!');
    }
});

// DELETE api/profile
//delete profile
router.delete('/',auth, async (req,res)=>{
    try {
        //remove posts from that user
        await Post.deleteMany({ user: req.user.id});
        
        await Profile.findOneAndRemove({user : req.user.id});
        
        await User.findByIdAndRemove({_id: req.user.id});
        res.json({msg: 'user removed!'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});


// PUT api/profile/experience
//add profile experience
router.put('/experience',
[
    auth,
    [
        check('title','title is required!').not().isEmpty(),
        check('company','company is required!').not().isEmpty(),
        check('from','from date is required!').not().isEmpty()
    ]
], async (req,res)=>{
    
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        const {title, company, location, from, to, current, description} = req.body;
        const newExperience = {title, company, location, from, to, current, description};

    try{
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExperience);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

// DELETE api/profile/experience/:exp_id
//delete profile experience
router.delete('/experience/:exp_id',auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

// PUT api/profile/education
//add profile education
router.put('/education',
[
    auth,
    [
        check('school','school is required!').not().isEmpty(),
        check('degree','degree is required!').not().isEmpty(),
        check('fieldofstudy','field of study is required!').not().isEmpty(),
        check('from','from date is required!').not().isEmpty()
    ]
], async (req,res)=>{
    
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        const {school, degree, fieldofstudy, from, to, current, description} = req.body;
        const newEducation = {school, degree, fieldofstudy, from, to, current, description};

    try{
        const profile = await Profile.findOne({user: req.user.id});
        profile.education.unshift(newEducation);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

// DELETE api/profile/education/:edu_id
//delete profile education
router.delete('/education/:edu_id',auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
});

// GET api/profile/github/:username
//get user repos from github 
router.get('/github/:username',(req,res)=>{
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
                  &client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };

        request(options,(error,response,body)=>{
            if(error) console.error(error);
            if(response.statusCode !== 200) return res.status(404).json({msg:'no github profile found!'});

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!');
    }
})


module.exports = router;