const express = require('express')
const router = express.Router();
const user = require('../models/user');
const {jwtAuthMiddleware,generateToken} = require('../jwt');



router.post("/signup", async (req, res) => {

    try {
        const data = req.body
        const newUser = new user(data)
        const response = await newUser.save();
        console.log("New User Registered")
        const payload = {
            id:response.id
        }
        const token = generateToken(payload);
        console.log(token);
        res.status(200).json({response:response, token:token});
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})

    }
});
// Post-Login Route
router.post("/login",async(req,res)=>{
    let {NIC , password} = req.body

    if(typeof password!= 'string'){
        password = String(password)
    }
    try {
        const user = await user.findOne({NIC:NIC});
        if(!user || (await user.comparePassword(password)))
        {
            return res.status(401).json("Invalid Username or Password!")

        }
        const payload = {
            id:user.id,
            nic:user.NIC
        }
        const token = generateToken(payload)
        res.json({token})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server error"})
    }
});

// GET - /user/profile
router.get("/profile",jwtAuthMiddleware, async(req,res)=>{
    try {
        const userData =  req.user;
        const userId = userData.id;
        const user = await user.findById(userId)
        res.status(200).json({user})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"})
    }
})
router.put("/profile/password",jwtAuthMiddleware,async (req,res)=>{
    try {
        const userId = req.user;
        const {currentPassword, newPassword} = req.body;
        const user = await user.findById(userId);
        if(!user || (await user.comparePassword(currentPassword)))
            {
                return res.status(401).json("Invalid Username or Password!")
    
            }
            user.password = newPassword;
            await user.save();
            console.log("password Updated")
                res.status(200).json({message: "Password Updated"})
    } catch (error) {
        
    }
})
module.exports = router;