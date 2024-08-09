const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    age:{
        type:Number,
        required:true
    },
    NIC:{
        type:Number,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["voter","admin"],
        default:"voter"
    },
    mobile:{
        type:Number
    },
    password:{
        type:String,
        required:true
    },
    isVoted:{
        type:Boolean,
        default:false
    }

})
userSchema.pre('save',async function(next){
    const person = this;
    if(!person.isModified("password")){
        return next();
    }
    try {
        //Creating password generation
        const salt = await bcrypt.genSalt(10);
        // hash password
        const hashedPassword = await bcrypt.hash(person.password,salt);
        //override the plain password with hashed one
        person.password = hashedPassword;
        next();
    } catch (error) {
        return next(error)
    }
})
userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        console.log('Type of Candidate Password:', typeof candidatePassword); // Debug log
        console.log('Type of Stored Password:', typeof this.password); // Debug log
        console.log('Candidate Password:', candidatePassword); // Debug log
        console.log('Stored Password:', this.password); // Debug log
    
    if (typeof candidatePassword !== 'string' || typeof this.password !== 'string') {
          throw new Error('Passwords must be strings');
        } 
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

const user = mongoose.model("user", userSchema);
module.exports = user;