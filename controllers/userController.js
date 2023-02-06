import User from "../models/User.js";
import jwtGenerator from "../helpers/jwtGenerator.js";
import idGenerator from "../helpers/idGenerator.js";
import emailSend from "../helpers/sendEmail.js";
import sendEmailPassword from "../helpers/sendEmailPassword.js";

/****************************************************/
/****************************************************/
const save = async (req, res) => {
    const {name,email,password} = req.body;
    if([name,email,password].includes("")){
        const error = new Error('All fields are required');
        return res.json({status:400,msg: error.message});
    }
    //Find duplicate email
    const existEmail = await User.findOne({email});
    if(existEmail){
        const error = new Error('This email is already registered');
        return res.status(400).json({msg: error.message});
    }

    //Save new register
    try {
        const user = new User(req.body);
        await user.save();

        emailSend({
            email: user.email,
            name: user.name,
            token: user.token
        });

        res.json({status:200,msg:"Check your email to confirm your account!"});
    } catch (error) {
        console.log(error);
    }
};
/****************************************************/
/****************************************************/
const confirm = async (req, res) => {
    const {token} = req.params;
    
    //Find valind email
    const existToken = await User.findOne({token,confirmation:false});
    
    if(!existToken){
        const error = new Error('Invalid token');
        return res.status(404).json({msg: error.message});
    }
    //change status
    try {
        existToken.confirmation = true;
        await existToken.save();
        res.json({msg:"Account confirmed!"}); 
    } catch (error) {
        console.log(error);
    }
};
/****************************************************/
/****************************************************/
const login = async (req, res) => {
    const {email,password} = req.body;
    const findUser = await User.findOne({email});

    //Find email
    if(!findUser){
        const error = new Error("This email doesn't exist!");
        return res.status(404).json({msg: error.message});
    }
    
    //Find confirm status
    if(!findUser.confirmation){
        const error = new Error('Please, confirm your user. Check your Email.');
        return res.status(403).json({msg: error.message});
    }

    //Compare password
    if(!await findUser.comparePassword(password)){
        const error = new Error('Wrong password!');
        return res.status(403).json({msg: error.message});
    }

    try {
        res.json({
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            token: jwtGenerator(findUser._id)
        });
    } catch (error) {
        console.log(error)
    }
};
/****************************************************/
/****************************************************/
const profile = async (req, res) => {
    const {user} = req;
    res.json({profile:user});
}
/****************************************************/
/****************************************************/
const forgetPassword = async (req, res) => {
    const {email} = req.body;
    const exitUser = await User.findOne({email});
    if(!exitUser){
        const error = new Error(`The user doesn't exist`);
        return res.status(404).json({msg: error.message});
    }
    if(!exitUser.confirmation){
        const error = new Error(`Verify your email`);
        return res.status(404).json({msg: error.message});
    }
    try {
        exitUser.token = idGenerator();
        exitUser.confirmation = false;
        await exitUser.save();

        sendEmailPassword({
            email: exitUser.email,
            name: exitUser.name,
            token: exitUser.token
        });

        return res.json({msg:'Check your email to follow the steps'});
    } catch (error) {
        console.log(error);
    }
}
/****************************************************/
/****************************************************/
const confirmToken = async (req, res) => {
    const {token} = req.params;
    const validToken = await User.findOne({token,confirmation:false});
    if(validToken){
        res.json({msg:'Token ok!'});
    }else{
        const error = new Error('Invalid Token');
        return res.status(401).json({msg: error.message});
    }
}
/****************************************************/
/****************************************************/
const newPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    console.log(token,password)
    const user = await User.findOne({token});
    if(!user){
        const error = new Error('An error ocurred');
        return res.status(400).json({msg: error.message});
    }

    try {
        user.token = null;
        user.password = password;
        user.confirmation = true;
        await user.save();
        res.json({msg: "Your password was modified"});
    } catch (error) {
        console.log(error);
    }
}
/****************************************************/
/****************************************************/

export {save,login,confirm,profile,forgetPassword,confirmToken,newPassword}