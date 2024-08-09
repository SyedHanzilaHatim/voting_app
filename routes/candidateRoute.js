const express = require('express');
const router = express.Router();
const candidate = require('./../models/candidate');
const {jwtAuthMiddleware} = require('../jwt');
const user = require('../models/candidate') 

const checkAdminRole =async (userID)=>{
    try {
       const user =  await user.findById(userID)
       if (user.role === "admin")
        return true;
    } catch (error) {
        return false;
        
    }
}

router.post("/",jwtAuthMiddleware, async(req,res)=>{
    try {
        if( ! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: "User doesn't have admin role"})
        }
        const data = req.body //Assuming the request body contains the candidate data

        // creating a new user document using the Mongoose model
        const newCandidate = new candidate(data);

        //saving the new user to the database
        const response = await newCandidate.save();
        console.log("Candidate Data Saved")
        res.status(200).json({response:response})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
        
    }
});
router.put('/:candidateID',jwtAuthMiddleware, async(req,res)=>{
    try {
        if( ! await checkAdminRole(req.user.id)){
            res.status(403).json({message:"User doesn't have admin role"})
        }
        const candidateID = req.params.id; //Extracting the id from the URL parameter
        const updateCandidateData = req.body; // Updated data for the person

        const response = await candidate.findByIdAndUpdate(candidateID,updateCandidateData,{
            new:true,
            runValidators:true,
        })
        if(!response){
            return res.status(404).json({error: "Candidate not Found"});
        }
        console.log('candidate data updated');
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})
        
    }
});

router.delete("/:candidateID",jwtAuthMiddleware, async(req,res)=>{
    try {
        if( ! await checkAdminRole(req.user.id)){
            res.status(403).json({message:"User doesn't have admin role"})
        }
        const candidateID = req.params.candidateID;
        const reponse = await candidate.findByIdAndDelete(candidateID)
        if(!response){
            return res.status(404).json({error:"Candidate Not found"})
        }
        console.log("candidate Data Deleted");
        res.status(200).json(reponse)
       
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
        
    }
})
module.exports = router;
