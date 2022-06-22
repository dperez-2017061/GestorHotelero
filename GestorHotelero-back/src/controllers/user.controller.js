'use strict'

const User = require('../models/user.model');
const jwt = require('../services/jwt');
const { validateData, encrypt, checkPassword, checkUpdate, checkPermission, checkParams } = require('../utils/validate');

//FUNCIONES PÚBLICAS

exports.register = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            username: params.username,
            password: params.password,
            name: params.name,
            phone: params.phone,
            email: params.email,
            role: 'CLIENT'
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let userExist = await User.findOne({username: params.username});
        if(userExist) return res.status(400).send({message: `Username ${params.username} already exist`});
        data.surname = params.surname;
        data.password = await encrypt(params.password);

        let user = new User(data);
        await user.save();
        return res.send({message: 'User created successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving user'}) ;
    }
}

exports.login = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            username: params.username,
            password: params.password
        };
        
        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let userExist = await User.findOne({username: params.username}).lean();
        if(userExist && await checkPassword(params.password, userExist.password)){
            let token = await jwt.createToken(userExist)
            delete userExist.password;
            delete userExist.role;

            return res.send({token, user:userExist, message: 'Login successfully'});
        }else return res.status(401).send({message: 'Invalid credentials'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error logging in'})
    }
}

//FUNCIONES PARA CLIENTE

exports.update = async(req, res)=>{
    try{
        let userId = req.params.id;
        let params = req.body;

        let userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'User not found'});
        let emptyParams = await checkParams(params);
        if(emptyParams === false) return res.status(400).send({message: 'Empty params'});
        let validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'Cannot update this information'});
        let permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update this user'});
        let usernameExist = await User.findOne({username: params.username});
        if(usernameExist && userExist.username != params.username) return res.status(400).send({message: `Username ${params.username} already in use`});

        let userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new: true}).lean();
        delete userUpdated.password;
        delete userUpdated.role;

        return res.send({user:userUpdated, message: 'User updated'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error updating user'});
    }
}

exports.delete = async(req, res)=>{
    try{
        let userId = req.params.id;
        
        let userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'User not found'});
        let permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update this user'});

        let userDeleted = await User.findOneAndDelete({_id: userId}).lean();
        return res.send({username: userDeleted.username, message: 'Account deleted'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error removing account'});
    }
}

//FUNCIONES PARA ADMINISTRADOR DE LA APLICACIÓN

exports.getUsers = async(req,res)=>{
    try{

        let users = await User.find();

        return res.send(users);
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting users'});
    }
}