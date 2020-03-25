const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//POST /api/users
//register new user
router.post('/',
[
    check('name','Name is required!').not().isEmpty(),
    check('email','Please enter a valid email!').isEmail(),
    check('password','Please enter password with 6 or more characters!').isLength({min:6})
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const { name, email, password } = req.body;
    try{
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({errors : [{msg: 'User already exists!'}]});
        }
        const avatar = gravatar.url(email,{
            s:'200', //size
            r: 'pg', //adult rated
            d: 'mm' //default
        });
        user = new User({name,email,avatar,password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();

        const payload = {
            user: {
                id: user.id // like _id in mongoDB
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn: 360000},(err,token)=>{ //decrease the expiresIn
            if(err) throw err;
            res.json({token});
        })
    

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = router;