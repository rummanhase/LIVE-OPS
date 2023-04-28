const router = require('express').Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey"
const {userModel} = require('../Schema/userSchema')
const {offerModel} = require('../Schema/userSchema')

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

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token not provided.' })
    }
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token.' })
      }
      req.user = user
      next()
    })
  }

  router.put('/offers/:offerId', authenticateToken, async (req, res) => {
    const offerId = req.params.offerId;
    const updatedOffer = req.body;
    
    try {
        let savedOffer = await offerModel.findOne({ offer_id: offerId });
        // console.log(savedOffer);
        let result; 
      if (savedOffer) {
        savedOffer.offer_title = updatedOffer.offer_title;
        savedOffer.offer_description = updatedOffer.offer_description;
        savedOffer.offer_image = updatedOffer.offer_image;
        savedOffer.offer_sort_order = updatedOffer.offer_sort_order;
        savedOffer.content = updatedOffer.content;
        savedOffer.schedule = updatedOffer.schedule;
        savedOffer.target = updatedOffer.target;
        savedOffer.pricing = updatedOffer.pricing;
        result = 'updated successfully';
      } else {
        const offer = new offerModel(req.body);
        await offer.validate();
        savedOffer = await offer.save();
        result = 'created successfully';
      }
    
      res.status(200).json({result,savedOffer});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  

module.exports = router