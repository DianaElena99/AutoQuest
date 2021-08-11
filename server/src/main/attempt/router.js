//router module for the attempt entity
//operations
// POST { attempt } => adds a new attempt

import Router from "koa-router";
import {attemptDB} from "./../databases";
import {userDB} from './../../auth/userDatabase';
import {quizDB} from './../databases';
import { getCurrentDateTime } from "../quiz/router";


const errorMessage = {"message":"Error saving the attempt"};

export const router = new Router();
/** Attempt structure 
 *  - _id
 *  + userID
 *  + quizID
 *  + answers : Answer[]
 * 
 *  * 
 *  Answer structure
 *  + question
 *  + answer
 *  + isCorrect
 */


function validateAttempt(att){
    var errors = 0;
    console.log("Validating : " + JSON.stringify(att));
    /// user is valid ? 
    const usr = userDB.findOne({"username":att.userID});
    
    if (!usr){
        console.log("Invalid user");
        errors ++;
    }
        

    /// quiz is valid ? 

    const quizz = quizDB.findOne(att.quizID);
    if (!quizz){
        console.log("Invalid quiz id");
        errors ++;
    }
        

    const answerItems = att.answers;
    if (!answerItems){
        errors ++; 
    }
        
     
    if (errors != 0) return false;
    return true;   
}


/// add an attempt
router.post("/attempt", async(ctx)=>{
    const response = ctx.response;
    console.log("Received : " + JSON.stringify(ctx.request.body));
    const attemptObj = ctx.request.body;
    if (validateAttempt(attemptObj)){
        const dateCrt = getCurrentDateTime() ;
        attemptObj.date = dateCrt;
        const addedObj = await attemptDB.insertOne(attemptObj);
        if (addedObj){
            response.body = addedObj;
            response.status = 201;
        }else{
            response.body = errorMessage;
            response.status = 500;
        }
    }else{
        response.body = errorMessage;
        response.status = 500; // internal error
    }
});


async function validateEval(evalObj, attID){
    const att = await attemptDB.findOne(attID);
    if (att) return true;
}


/// update an attempt
/// -- prof adds the corrected quiz
router.put("/attempt/:id", async(ctx)=>{
    const response = ctx.response;
    const attID = ctx.params.id;
    const attemptObj = ctx.request.body;
    console.log("received : " + JSON.stringify(attemptObj));
    console.log("ID attempt : " + attID);
    // check if the attempt was already evaluated 

        const att = await attemptDB.findOne(attID);
        await attemptDB.update(attID, { "evaluated" : true});
        const linesChanged = await attemptDB.update(attID, { "answers" : attemptObj});
        const newObj = await attemptDB.findOne(attID);
        if (newObj){
            response.body = newObj;
            response.status = 201;
        }else{
            response.body = errorMessage;
            response.status = 500;
        }

});

/// find all the attempts for a quiz 
/// if user is prof => show all the attempts
/// if user is stud => show only their own attempts


router.get("/attempts", async(ctx)=>{
    const response = ctx.response;
    let attemptsList = await attemptDB.findAll();
    response.body = attemptsList;
    response.status = 200;
})



router.post("/attempts/:quizID", async(ctx)=>{
    const response = ctx.response;
    const quizID = ctx.params.quizID;
    console.log("Body : " + JSON.stringify(ctx.request.body));
    const userID = ctx.request.body.userID;

    const userProps = await userDB.findOne({_id:userID});
    let userType = "";
    if (userProps)
       userType = userProps.role;
    
    let attemptList;
    console.log(userType);
    
    if (userType == 'stud'){
        attemptList = await attemptDB.findByUser(userID, quizID);
    }else if (userType == 'prof'){
        attemptList = await attemptDB.findByQuiz(quizID);
    }

    if (attemptList){
        response.body = attemptList;
        response.status = 200;
    }else{
        response.status = 404;
    }
});
