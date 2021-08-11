import { IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonItem, IonList, IonListHeader, IonPage, IonToolbar } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useContext, useEffect } from "react";
import { RouteComponentProps, useParams } from "react-router";
import { AuthContext } from "../../auth/AuthProvider";
import { ItemContext } from "../../data/local/Provider";
import { SettingsComponent } from "../main-page/SettingsComponent";

interface QuizPageProps extends RouteComponentProps<{
    id? : string;
}>{}

export const ShowAttempts : React.FC<QuizPageProps> = ({history, match}) =>{
    const tok : {"id":string} = useParams();
    const {token, isAuthenticated} = useContext(AuthContext);
    const {attemptsList,quizesList, fetchAttempts} = useContext(ItemContext);
    
    useEffect(()=>{
        if (token) fetchAttempts(tok.id, token?.id, token?.token);
        console.log(attemptsList);
    }, []);
    
    let quiz = quizesList.filter(e => e._id == tok.id)[0];

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
               
            <IonListHeader>Attempts for this quiz</IonListHeader>
            <IonList>
                { attemptsList.map(a => 
                    ( <IonCard key={a._id} >
                       {(token?.role == "prof" && a.evaluated == false)?  
                            <IonButton onClick={()=>{
                                history.push(`/evaluate/${a._id}`)
                            }}>Evaluate this attempt</IonButton> : 
                            <div></div>}
                        Attempt #{attemptsList.indexOf(a)+1}
                       {a.answers.map(e =>{
                             return <IonItem key = {a.answers.indexOf(e)+1}>
                               Item {a.answers.indexOf(e)+1} <br/>
                               Question: {e.question} <br/>
                               Your answer: {e.answer}<br/>
                               Mark: {e.isCorrect ? "Correct" : "Incorrect" }
                               <br/> <hr/>
                           </IonItem>}
                       )}
                    </IonCard>)
                 )}
                 </IonList></IonContent></IonPage>)

}