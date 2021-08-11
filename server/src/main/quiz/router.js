// router module for the quiz entity
// operations : 
// /POST {quiz} => creates a quiz
// /GET {class} => gets the quizes of a class
// /POST {source_material} => generates a quiz from source
const axios = require('axios');
import Router from "koa-router";
import {quizDB} from "./../databases"
const fs = require('fs');
export const router = new Router();

export function getCurrentDateTime(){
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;
    return dateTime;
}

function validateInputText(inpText){
    var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return !(format.test(inpText))
}


function writeToFile(txt, userID){
    validateInputText(txt)
    file = `./../../qgen/dataset/${userID}.txt`;
    fs.writeFile(file, txt);
}

router.post("/generate-quiz", async(ctx)=>{
    const response = ctx.response;
    const inp = ctx.request.body;
    console.log("Got here : " + JSON.stringify(inp));
    //writeToFile(inp.inputText, inp.creator);
    let questions = [] //= ['Test question 1', 'When is the national day of Romania?', 'Some dummy question', 'This will probably be deleted', 'Irrelevant question'];
    await axios.default.post("http://localhost:5000/qgen" , {"inp":inp.inputText}).then(res =>{
        console.log(res.data.questions);
        questions = res.data.questions;
        
    }).catch(err =>{
        console.log(err);
    })
    response.body = questions;
    response.status = 201;

});

router.post("/quiz", async(ctx)=>{
    const response = ctx.response;
    var parts = ctx.request.body;
    // parts : json = {classID, creator, questions, description}
    // validate questions
    let qst = parts.questions;
    qst.forEach(element => {
       console.log(validateInputText(element)); 
    });

    if (!parts.description)
        parts.description = "No description for this quiz";
    const dataCreated = getCurrentDateTime();
    const quiz = {"dataCreated":dataCreated, 
                "classID" : parts.classID, 
                "creator":parts.creator, 
                "questions": parts.questions,
                "description" : parts.description
            }
    console.log(quiz);
    await quizDB.insertOne(quiz)
                .then(async(x)=>{
                    response.body = {"message":"Added quiz successfully"}
                    response.status = 201;
                })
                .catch(async(err)=>{
                    response.body = {"message":"Failed to add the quiz"}
                    response.status = 500;
                })
})

/**Find all the quizes of a class */
router.get("/quiz/:cls", async(ctx)=>{
    const response = ctx.response;
    const cls = ctx.params.cls;
    const quizList = await quizDB.findByClass(cls);
    response.status = 200;
    response.body = quizList;
});