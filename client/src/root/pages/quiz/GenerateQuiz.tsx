import { IonBackButton, IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import React, { Provider, useContext, useEffect, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { arrowBack } from 'ionicons/icons';
import axios from "axios";
import { authConfig, config } from "../../common";
import { ItemContext } from "../../data/local/Provider";
import { ClassProps } from "../../data/local/classes/ClassesProps";
import { Plugins } from "@capacitor/core";
import { AuthContext } from "../../auth/AuthProvider";
import { Quiz } from "../../data/local/quiz/QuizProps";

interface GenerateQuizState{
    inputText?: string,
    className?: string,
    classID?:string,
    description?:string,
    finalQuestions?: string[]
}



export const GenerateQuiz: React.FC<RouteComponentProps> = ({history}) =>{
    const {classesList, generatedSet,generateQuiz, createQuiz} = useContext(ItemContext);
    const [state, setState] = useState<GenerateQuizState>({});
    const {inputText, className, finalQuestions, description, classID} = state;
    const { Storage } = Plugins;
    const {token, isAuthenticated} = useContext(AuthContext);
    if (!isAuthenticated) return <Redirect to="/login"/>

    var usersClasses = classesList.filter(cls => cls.owner == token?.id);
    function sendRequest(){
        console.log("Sending : " + JSON.stringify(state));
        if(token && state.inputText){
            generateQuiz(state.inputText, token?.id, token?.token);
            console.log("GenerateQuiz.tsx --- " + generatedSet.length);
            setState({
                ...state,
                finalQuestions : generatedSet
            })
        }   
    }

    function handleSubmit(){
        console.log("Got here")
        console.log("Token : " + token?.token)
        console.log("Final questions : " + finalQuestions)
        console.log("ClassID " + classID);
        if (token && finalQuestions && classID){
            if(!description){
                setState({
                    ...state,
                    description:"No description provided"
                })
            }

            let quizObj : Quiz = {"questions": finalQuestions, "classID":classID , "_id":"", "creator":token.id, "description":description || ""}
            console.log(JSON.stringify(quizObj));
            createQuiz(quizObj, token.token);
        }           
    }
    return(
        <IonPage>
          <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
                <IonButton onClick= {()=>{
                    history.goBack()}}>
                    <IonIcon icon={arrowBack} />
                    </IonButton>
                </IonButtons>
                <IonTitle>
                    Generate a Quiz
                </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
               
                <IonList>
                    <IonItem>
                       <IonTextarea value={inputText} 
                        rows={15}
                        placeholder="Add a source text" 
                        onIonChange = {ev => {
                           setState({
                               ...state,
                               inputText : ev.detail.value || ''
                           });
                       }}>

                       </IonTextarea></IonItem><br/>
                        <IonItem><IonInput placeholder="Description of quiz" 
                                    value={description}
                                    onIonChange={(ev)=>{
                                        setState({
                                            ...state, 
                                            description:ev.detail.value||''
                                        })
                                    }}
                                />
                    </IonItem><br/>
                    {(token?.role == "prof") ? (
                           <IonSelect value={className}  
                                    placeholder = "Choose a class"
                                    onIonChange={(ev) => {
                                        console.log(usersClasses);
                                        var cls : ClassProps = {name:"", _id:"", members:[], owner:""};
                                        usersClasses.forEach(elem =>{
                                            console.log(JSON.stringify(elem));
                                            console.log(elem.name.trim() == ev.detail.value.trim())
                                            if (elem.name.trim() == ev.detail.value.trim()){
                                                setState({
                                                    ...state, 
                                                    classID:elem._id || '',
                                                    className : ev.detail.value
                                                });
                                                console.log(JSON.stringify(state));
                                            }
                                        });
                                        
                                        /*if (cls)
                                            setState({
                                                ...state, 
                                                classID:cls._id || '',
                                                className : ev.detail.value
                                        })*/
                                       
                                    }
                                }>
                                
                                {usersClasses.map((e) =>{
                                    return <IonSelectOption> {e.name }</IonSelectOption>
                                })}
                                
                            </IonSelect> 
                     
                       
                        ) : (<IonItem></IonItem>)}
                     { generatedSet.length == 0 &&
                    <IonButton color="tertiary" 
                        shape="round" 
                        fill="outline" 
                        expand="block"
                        onClick = {sendRequest}>Generate Quiz</IonButton>}
                </IonList>
                {(generatedSet.length != 0) &&
                    <IonList>
                        {generatedSet.map(e => {
                            return <IonCard key = {generatedSet.indexOf(e)}>
                                <IonText>{e}</IonText>  &emsp; &emsp;
                                <IonButton color = "danger" 
                                    onClick={()=>{
                                        generatedSet.splice(generatedSet.indexOf(e),1);
                                        setState({
                                            ...state,
                                            finalQuestions : generatedSet
                                        })
                                        console.log(JSON.stringify(state));
                                    }}>  x</IonButton>
                            </IonCard>
                        })}
                       <IonButton onClick={()=>handleSubmit()} color="danger" fill="outline" shape="round">Submit Quiz</IonButton>
                    </IonList>
                    
                }
            </IonContent>
        </IonPage>
    );
}