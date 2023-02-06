import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import idGenerator from "../helpers/idGenerator.js";

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: false,
        trim: true,
        default: null
    },
    token:{
        type: String,
        default: idGenerator()
    },
    confirmation:{
        type: Boolean,
        default: false
    }
});

//Before save on database (hash pass)
userSchema.pre('save', async function(next){
    //no changed the password again
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(passwordForm){
    return await bcrypt.compare(passwordForm,this.password);
}

const User = mongoose.model("User",userSchema);
export default User;