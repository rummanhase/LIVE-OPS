const router = require('express').Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey"
const {userModel} = require('../Schema/userSchema')

router.post('/signup' , async(req , res)=>{
    const {email , pass} = req.body;
    if(!email || !pass){
        res.status(404)
        .send({
            result:"Must contain Email and/or Pass"
        })
    }else{
        const isPresent = await userModel.find({email})
        if(isPresent.length>0){
            res.status(403)
            .send({
                result:"Already a signed up user please login"
            })
        }else{
            let result = await new userModel({ email, pass }).save();
            result = result.toJSON();
            delete result.pass;
            res.status(201)
            .send(result);
        }
    
    }
})


router.post('/login', async(req, res) => {
    const { email, pass } = req.body;
    if (!email || !pass) {
        res.status(404).send({
            result: "Must contain Email and/or Pass"
        })
    } else {
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(401).send({
                result: "Invalid email or password"
            })
        } else {
            if (user.pass == pass) {
                jwt.sign({ email }, SECRET_KEY, (err, token) => {
                    res.status(200).json({ token })
                })
            } else {
                res.status(401).send({
                    result: "Invalid email or password"
                })
            }
        }
    }
});

module.exports = router