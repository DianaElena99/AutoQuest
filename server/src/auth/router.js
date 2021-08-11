import Router from "koa-router";
import jwt from "jsonwebtoken";
import { jwtConfig } from "./../utils/config";
import { userDB } from "./userDatabase";
import { DECRYPTION_KEY } from "./../utils/config";
import {sendAccountActivationMail} from './../utils/mailUtils'
var CryptoJS = require("crypto-js");

const createToken = (user) => {
    return jwt.sign(
      { username: user.username, _id: user._id },
      jwtConfig.secret,
      {
        expiresIn: 60 * 60 * 2,
      }
    );
  };

export const router = new Router();

router.get('/users', async(ctx)=>{
    const response = ctx.response;
    let users = await userDB.findAll();
    let userList = []
    users.forEach(element => {
        userList.push({"_id":element._id,"username":element.username, "role":element.role});
    });
    response.status = 200;
    response.body = userList;
})

router.post('/login', async(ctx)=>{
    const credentials = ctx.request.body;
    const response = ctx.response;

    console.log("Checking credentials");
    const user = await userDB.findOne({username:credentials.username});
    console.log(ctx.request.body);
    const decr = CryptoJS.AES.decrypt(credentials.password, DECRYPTION_KEY).toString(CryptoJS.enc.Utf8);

    console.log("decrypted pass " + decr);
    console.log("user pass " + user.password);
    console.log(decr == user.password);
    if (user && decr == user.password && user.confirmed_mail === true){
        response.status = 201; // success
        response.body = { token: createToken(user), role:user.role, id:user._id };
    } else {
        response.status = 400; // bad request
        response.body = { issue: [{ error: "Authentication failed" }] };
    }
})

router.post('/register', async(ctx)=>{
    var credentials = ctx.request.body;
    const response = ctx.response;
    var decr = CryptoJS.AES.decrypt(credentials.password, DECRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    credentials.password = decr;
    credentials.confirmed_mail = false;
    
    var URL = "http://localhost:8100/confirm-registration/"
    const existing = await userDB.findOne({mail:credentials.mail});
    if (existing){
        response.status = 400;
        response.body = {message : "Error! This mail address already has an account."}
        
    }else{

        const res = await userDB.insert(credentials);
        if(res){
            sendAccountActivationMail(credentials.mail, URL + res._id).then((ev)=>{
                response.status = 201;
                response.body = {message : "Account created successfully. Confirm registration by mail."}
            }).catch(err =>{
                response.status = 500
                response.bodt = {message : err}
            })
        } 
    }  
});

router.put('/confirmation', async(ctx)=>{
    const message = ctx.request.body;
    const response = ctx.response;
    console.log(JSON.stringify(message));
    if (message.id!=undefined){
        const res = await userDB.update(message.id);
        console.log("res:" + JSON.stringify(res));
        if(res){
            //await userDB.delete({_id:message.id, confirmed_mail:false});
            response.status = 201;
            response.body = {message : "Your mail address was confirmed. Head to the home page to log into your account."}
        }
    }
});