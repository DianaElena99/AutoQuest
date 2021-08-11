// router module for the class entity
// operations : 
// /GET {id} => get the list of the classes that user with id is involved in
// /POST {class} => creates a class
// /PUT {stud} => adds a student in class

import Router from "koa-router";
import {classDB} from "./../databases"
export const router = new Router();


// /GET {ID} --- returns the classes of user with id
router.get("/classes/:id", async(ctx)=>{
    const userID = ctx.params.id;
    const response = ctx.response;

    const classesList = await classDB.query({members : {"$in":[userID]}})
    console.log(classesList);
    if (classesList){
        response.status = 200;
        response.body = classesList;
    }
    else{
        response.status = 404;
        response.body = {message : "Classes not found"}
    }
    
});


/// returns all classes
router.get("/classes", async(ctx)=>{
    const response = ctx.response;

    const classesList = await classDB.findAll();
    response.status = 200;
    response.body = classesList;
});


//// create a class
router.post("/classes", async(ctx)=>{
    const cls = ctx.request.body;
    const response = ctx.response;

    const res = await classDB.insertOne(cls);
    if (res){
        response.status = 201;
        response.body = res;
    }else{
        response.status = 501;
        response.body = {message:"Error at creating a class"};
    }
});


/// add a student in the class
router.put("/classes/:id", async(ctx)=>{
    const response = ctx.response;
    const stud = ctx.request.body;
    const cid = ctx.params.id;
    const cls = await classDB.findOne(cid);
    if (!cls){
        response.status = 404;
        response.body = {message : "Class not found"};
    }
    else if (cls.members.indexOf(stud.user)!=-1){
            response.status = 200;
            response.body = {message : "Student already in class"};
    }
    else {
        const res = await classDB.update(cid, stud.user);
        if (res){
            response.status = 201
            response.body = {message:"User added to class"};
        }
    }
    
});