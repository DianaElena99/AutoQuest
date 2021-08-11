import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ClassProps } from "./classes/ClassesProps";
import { Attempt } from "./quiz/AttemptProps";
import { Quiz } from "./quiz/QuizProps";
import { RemoteClassAPI } from "../remote/ClassesAPI";
import { RemoteQuizAPI } from "../remote/QuizAPI";
import { RemoteAttemptAPI } from "../remote/AttemptAPI";
import { AuthContext, AuthState } from "../../auth/AuthProvider";
import { withLogs } from "../../common";
import { resolve } from "path";


interface UserDTO{
    username : string,
    role : string,
    _id: string
}

export interface ItemState {
    classesList : ClassProps[],
    quizesList : Quiz[],
    attemptsList : Attempt[],
    usersList : UserDTO[],
    generatedSet : string[],

    fetchClasses : (id:string, tok:string)=>void,
    addStudent : (id:string, stud : string, tok:string) => void,
    addClass : (cls : ClassProps, tok:string) => void,

    fetchQuizes : (cls : string, tok:string)=>void,
    createQuiz  : (quiz : Quiz, tok:string)=>void,
    generateQuiz : (inputText : string, creator : string, tok:string)=>void,

    fetchUsers : ()=>void;
    fetchAttempts : (quizID : string, userID : string, tok:string)=>void,
    createAttemptFN : (att : Attempt, tok:string)=>void,
    evaluateAttempt : (att : Attempt, tok:string)=>void
}

const initialItemState : ItemState = {
    classesList : [],
    quizesList : [],
    attemptsList : [],
    usersList : [],
    generatedSet : [],

    fetchClasses : (id:string, tok:string)=> {},
    addStudent : (id:string, stud : string, tok:string)=> {},
    addClass : (cls : ClassProps, tok:string) => {},

    fetchQuizes : (cls : string, tok:string)=>{},
    createQuiz : (quiz : Quiz, tok:string)=>{},
    generateQuiz : (inputText : string, creator : string, tok:string)=>{},

    fetchAttempts : (quizID : string, userID : string, tok:string)=>{},
    fetchUsers : ()=>{},
    createAttemptFN : (att : Attempt, tok:string)=>{},
    evaluateAttempt : (att : Attempt, tok:string)=>{}
}

export const ItemContext = React.createContext<ItemState>(initialItemState);

interface ItemProviderProps {
    children: PropTypes.ReactNodeLike;
}

export const ItemProvider : React.FC<ItemProviderProps> = ({children}) =>{
    const { token } = useContext<AuthState>(AuthContext); //obtains token
    const [state,setState] = useState<ItemState>(initialItemState);
    const {classesList, quizesList, attemptsList, usersList, generatedSet} = state;
    const value = {
        classesList,
        quizesList,
        attemptsList,
        usersList,
        generatedSet, 

        fetchClasses,
        addStudent,
        addClass,

        fetchQuizes,
        createQuiz,
        generateQuiz,

        fetchAttempts,
        fetchUsers,
        createAttemptFN,
        evaluateAttempt
    };

    useEffect(()=>{
        if (token){
            console.log("use effect to fetch class list; token:" + token.id);
            fetchClasses(token.id, token.token);
        }
        console.log("Classes list of logged in user : " + classesList.forEach(e => JSON.stringify(e)));
    }, [token]);

    return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;

    async function evaluateAttempt(att : Attempt, tok:string){
        if (att._id)
            await RemoteAttemptAPI.evaluateAttempt(att._id, att.answers, tok)
                .then(res => alert("Successfully sent!"))
                .catch(err => alert(JSON.stringify(err)));
    }

    async function createAttempt(att : Attempt, tok:string){
        console.log("Got heree");
        await RemoteAttemptAPI.createAttempt(att, tok)
            .then(res => {
                alert("Successfully submited. Please wait for a professor to evaluate your quiz")
            })
            .catch(err => alert(JSON.stringify(err)));
    }

    async function fetchAttempts(quizID:string, userID:string, tok:string) {
        await RemoteAttemptAPI.fetchAttempts(quizID, userID, tok)
            .then(res =>{
                setState({
                    ...state,
                    attemptsList : res
                })
            }).catch(err =>{
                alert(err);
            });
    }


    async function fetchUsers(){
        await RemoteClassAPI.fetchStudents()
                            .then(res =>{setState({...state,usersList:res})})
                            .catch(err => alert(err));
    }

    async function fetchQuizes(cls : string, tok:string){
        await RemoteQuizAPI.getQuizes(cls, tok)
            .then(res => {
                setState({
                    ...state,
                    quizesList : res
                })
            })
            .catch(err =>{
                alert(err);
            })
    }

    async function fetchClasses(id:string, tok:string){
        await RemoteClassAPI.getClasses(id, tok)
            .then(res => {
                    setState({
                        ...state,
                        classesList : res
                    });
                    console.log(classesList);
                })
            .catch(err =>{
                    alert(err);
                });
    }

    async function createQuiz(quiz: Quiz, tok:string){
        await RemoteQuizAPI.createQuiz(quiz, tok)
                    .then(res => alert("Quiz successfully created!"))
                    .catch(err => alert(err));
    }

    async function generateQuiz(inputText : string, creator : string, tok:string) {
        
        await RemoteQuizAPI.generateQuiz(inputText, creator, tok)
                .then(res => {
                    console.log(res);
                    setState({
                        ...state,
                        generatedSet : res
                    })
                  })
                .catch(err => 
                    alert(JSON.stringify(err))
                );
        
    }

    function createAttemptFN(attemptData : Attempt, tok:string){
        createAttempt(attemptData, tok);
    }


    async function addStudent(id:string, user:string, tok:string){
        await RemoteClassAPI.addStudent(id, user, tok).catch(err =>{
            alert(err);
        });
    }

    async function addClass(cls : ClassProps, tok:string){
        await RemoteClassAPI.addClass(cls, tok)
            .then(res =>{
                    classesList.push(res);
                    alert("Successfully created classroom " + res.name) ;
                })
            .catch(err => alert(JSON.stringify(err)));
    }

    
}