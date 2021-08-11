import { Plugins } from "@capacitor/core"
import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonText, IonToolbar} from "@ionic/react"
import axios from "axios"
import { arrowBack } from "ionicons/icons"
import React, { useContext, useEffect, useState } from "react"
import { Redirect, RouteComponentProps, useParams } from "react-router"
import { AuthContext } from "../../auth/AuthProvider"
import { authConfig } from "../../common"
import { ItemContext } from "../../data/local/Provider"
import { AnswerItem, Attempt } from "../../data/local/quiz/AttemptProps"
import { Quiz } from "../../data/local/quiz/QuizProps"
import { SettingsComponent } from "../main-page/SettingsComponent"

interface QuizPageProps extends RouteComponentProps<{
    id? : string;
}>{}

interface Item{
    id : number,
    item : AnswerItem
}

export const AttemptQuiz: React.FC<QuizPageProps> = ({history, match}) =>{
    const tok : {"id":string} = useParams();
    const {token, isAuthenticated} = useContext(AuthContext);
    const {quizesList, createAttemptFN} = useContext(ItemContext);
    
    const [started, setStarted] = useState(false);
    const [crt, setCrt] = useState(0);
    const [sent, setSent] = useState(false);
    const [answerItems, setAnswerItems] = useState<Item[]>([]);
    const [answerItem, setAnswerItem] = useState<string>("");
    const [endingQuiz, setEndingQuiz] = useState(false);


    if (endingQuiz === true) {
        setStarted(false);
        setCrt(0);
        setAnswerItems([]);
        setEndingQuiz(false);
        
      }
    
    function sendAttempt(){
        let attemptData : Attempt;
        let auxItems : AnswerItem[] = [];
        answerItems.forEach(elem =>{
            auxItems.push(elem.item);
        })
        if(token)
        {
            attemptData = {"answers": auxItems, "userID": token.id, "quizID":tok.id, "evaluated":false, "date": ""};
            createAttemptFN(attemptData,token.token);
        }
    }


    let quiz = quizesList.filter(e => e._id == tok.id)[0];

    if (!isAuthenticated) return <Redirect to="/login"/>
    return(
        <IonPage>
            <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
              <IonButton onClick={()=>history.goBack()}>
                  <IonIcon icon={arrowBack} />
                  </IonButton>
                  
              </IonButtons>{quiz.description || ""}</IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={()=>{history.push(`/attempts/${quiz._id}`)}}>Show attempts</IonButton>            
                <IonListHeader>Details about the quiz</IonListHeader>
                {
                    <IonList>
                   {!started && (
                        <IonItem>
                            <IonButton
                                onClick={(e) => {
                                    setStarted(true);
                                    setSent(false);
                                    let aux : Item[] = []
                                    let cnt = 0;
                                    quiz.questions.forEach(elem=>{
                                        aux.push({id:cnt, item:{answer:"", question:elem, isCorrect:false}});
                                        cnt++;
                                    })
                                    setAnswerItems(aux);
                                }}> Start quiz </IonButton>
                            </IonItem>
                    )}

                    {started && quiz.questions.length !== 0 && (
                        <IonCard>
                        <IonItem>
                            <IonLabel>{quiz.questions[crt]}</IonLabel> </IonItem>
                         <IonItem key={crt}>   <IonInput
                                placeholder = "Answer goes here"
                                value={answerItem}
                                onIonChange={(e) => {
                                    let aux = answerItems;
                                    
                                    aux.forEach(elem =>{
                                        if (elem.id === crt){
                                            elem.item.answer = e.detail.value || '';
                                        }
                                    })
                                    console.log(aux);
                                    setAnswerItems(aux);
                                }}
                            /> </IonItem>
                        {crt < quiz.questions.length - 1 && (
                        <IonButton
                            onClick={(e) => {
                                setCrt(crt + 1);
                                setAnswerItem("");
                            }}> Next </IonButton>
                        )}
                        {crt === quiz.questions.length - 1 && (
                            <IonButton
                                onClick={(e) => {
                                    if (sent == false)
                                    {
                                        sendAttempt(); 
                                        setSent(true);
                                    }
                                                         
                                    setAnswerItem("");
                                    setEndingQuiz(true);
                                    
                                }}> Done </IonButton>
                        )}
                        </IonCard>
                    )}
                   </IonList> 
                }
               
            </IonContent>
        </IonPage>
    )
}