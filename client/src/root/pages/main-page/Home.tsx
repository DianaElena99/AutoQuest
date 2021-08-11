import { IonButton, IonCard, IonChip, IonContent, IonHeader, IonItem, IonItemDivider, IonLabel, IonList, IonMenu, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { AuthContext } from "../../auth/AuthProvider";
import { Login } from "../../auth/login/Login";
import { ClassProps } from "../../data/local/classes/ClassesProps";
import { ItemContext } from '../../data/local/Provider'
import { RemoteClassAPI } from "../../data/remote/ClassesAPI";
import { SettingsComponent } from "./SettingsComponent";

export const Home: React.FC<RouteComponentProps> = ({history}) =>{
    const {token, isAuthenticated} = useContext(AuthContext); 
    const context = useContext(ItemContext);
    const {classesList, fetchClasses} = context;
    console.log(isAuthenticated);
    console.log("Token: " + JSON.stringify(token));
    console.log(classesList);
    /*
    var lst : ClassProps[] = [];
    console.log(token);
    if (token)
        axios.get("http://localhost:3000/main/classes/" + token.id)
            .then(resp => {
                lst = resp.data; 
                console.log(lst);
            }); 
*/
    if (!isAuthenticated) return <Redirect to="/login"/>
    const role = JSON.parse(JSON.stringify(token)).role;


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle >
                        Welcome!
                    </IonTitle>
                    <SettingsComponent/>
                </IonToolbar>
            </IonHeader>
           
            <IonContent>
                { (role === 'stud')?
                        <IonList>
                        <IonCard>
                            <IonChip color="secondary">Student</IonChip>
                        </IonCard>
                
                        
                        <IonItem>
                            <IonButton routerLink="/generate-quiz">Create a Quiz</IonButton>
                        </IonItem>
                        <IonItem> 
                               <h6>Note: Being a student, your quiz will 
                                   be available only for you, you cannot post it 
                                   in a class where you are enrolled.</h6>
                        </IonItem>
                        </IonList>   : 
                    (role === 'prof')?
                    <IonList>
                    <IonChip color="success">Professor</IonChip>
                    <IonItem>
                       <IonButton routerLink="/create-quiz">Create a Quiz(manually)</IonButton>
                    </IonItem>
                    <IonItem>
                       <IonButton routerLink="/generate-quiz">Generate a Quiz(from input text)</IonButton>
                    </IonItem>
                    <IonItem>
                      <IonButton routerLink="/create-class">Create a new class</IonButton>
                    </IonItem>
                   </IonList> :"Nope..."
                }

                <IonList>
                    {classesList.map((e : ClassProps) => {
                        //console.log(e);
                        return <IonItem key = {e._id}>
                            <IonCard onClick = {()=>history.push(`/quizes/${e._id}-${e.name}`)}>
                               <IonText><h3>{e.name}</h3></IonText> 
                            </IonCard>
                        </IonItem>
                    })}
                </IonList>

            </IonContent>
        </IonPage>
    );
};

