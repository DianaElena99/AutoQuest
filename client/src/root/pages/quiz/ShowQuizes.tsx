
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonListHeader, IonPage, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { Redirect, RouteComponentProps, useParams } from "react-router";
import { arrowBack } from 'ionicons/icons';
import { AuthContext } from "../../auth/AuthProvider";
import { ItemContext } from "../../data/local/Provider";
import { Quiz } from "../../data/local/quiz/QuizProps";
import { SettingsComponent } from "../main-page/SettingsComponent";



export const ShowQuizes: React.FC<RouteComponentProps> = ({history}) =>{
    
    const tok : {"cls":string} = useParams();
    let cid = tok.cls.split("-")[0];
    let header = tok.cls.split("-")[1];
    const {token, isAuthenticated} = useContext(AuthContext); 
    const {quizesList, fetchQuizes} = useContext(ItemContext);

    useEffect(()=>{if(token) fetchQuizes(cid, token?.token)}, []);

    
    console.log(quizesList);

    return (    
    <IonPage>
        <IonHeader>
              <IonToolbar>
              <IonButtons slot="start">
              <IonButton onClick={()=>{history.goBack()}}>
                  <IonIcon icon={arrowBack} />
                  </IonButton>
              </IonButtons>
                {header}
               
              </IonToolbar>
        </IonHeader>
        <IonContent>
            {token?.role == "prof" ?  
            <IonCard>
                
                <IonInput placeholder="Username goes here..."></IonInput>
                <IonButton>Add a student to Classroom</IonButton>
            </IonCard> : <div></div>}
            
            <IonListHeader>Quizes posted in this class</IonListHeader>
            {quizesList.length === 0? (<IonCard><IonText>There are no quizes in this class yet.</IonText></IonCard>) :  
               quizesList.map((x : Quiz) => 
                {
                    
                        return <IonItem key = {x._id}>
                            <IonCard onClick={e => history.push(`/quiz/${x._id}`)}>
                                <IonCardHeader color="tertiary">
                                <h2>{x.description || "Quiz " + x.dataCreated }</h2>
                                </IonCardHeader>
                                <IonCardContent >
                                    <IonText color="white">                                       
                                        <br/> <h5>Attempt quiz</h5>
                                    </IonText>
                                </IonCardContent>
                            </IonCard>
                        </IonItem>
                    
                }

            )}
        </IonContent>
    </IonPage>);
}