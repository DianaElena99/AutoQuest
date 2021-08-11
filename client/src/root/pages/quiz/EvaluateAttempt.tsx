import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useContext } from "react";
import { Redirect, RouteComponentProps, useParams } from "react-router";
import { AuthContext } from "../../auth/AuthProvider";
import { ItemContext } from "../../data/local/Provider";
import { AnswerItem } from "../../data/local/quiz/AttemptProps";
import { SettingsComponent } from "../main-page/SettingsComponent";

interface EvaluateAttemptInterface{
    answers: AnswerItem[]
}


export const EvaluateAttempt: React.FC<RouteComponentProps> = ({history}) =>{

    const {token, isAuthenticated} = useContext(AuthContext);
    const {attemptsList, evaluateAttempt} = useContext(ItemContext);
    let idAttempt : {id:string} = useParams();
    if (!isAuthenticated) return <Redirect to="/login"/>
    
    let itemAttempt = attemptsList.filter(e => e._id == idAttempt.id)[0];

    function handleSubmit(){
        itemAttempt.evaluated = true;
        console.log(itemAttempt);
        if (token) evaluateAttempt(itemAttempt, token?.token);
    }

    return( <IonPage>
        <IonHeader>
              <IonToolbar>
              <IonButtons slot="start">
              <IonButton onClick={()=>{history.goBack()}}>
                  <IonIcon icon={arrowBack} />
                  </IonButton>
              </IonButtons>
              <IonTitle>
                  Evaluate Attempt
              </IonTitle>
              <SettingsComponent/>
              </IonToolbar>
          </IonHeader>
          <IonContent>
              <IonList>
                {itemAttempt.answers.map(e => {
                    return <IonItem> 
                        <IonCard>Question {itemAttempt.answers.indexOf(e)+1}</IonCard> <br/>
                        <IonCard>
                            <IonCardHeader>{e.question}</IonCardHeader>    
                            <IonCardContent>{e.answer}</IonCardContent>
                        </IonCard><br/>
                        <IonSelect value = {e.isCorrect} 
                            onIonChange={(ev)=>{
                                e.isCorrect = (ev.detail.value==="true")
                                console.log(e.isCorrect)
                            }}
                        >
                            <IonSelectOption>true</IonSelectOption>
                            <IonSelectOption>false</IonSelectOption>
                        </IonSelect><br/>
                    </IonItem>
                })}
              </IonList>
              <IonButton onClick = {handleSubmit}>Send evaluation</IonButton>
          </IonContent>
    </IonPage>)
}