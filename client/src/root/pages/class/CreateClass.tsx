import { IonBackButton, IonButton, IonButtons, IonCard, IonChip, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { arrowBack } from 'ionicons/icons';
import { ItemContext } from "../../data/local/Provider";
import { AuthContext } from "../../auth/AuthProvider";



export const CreateClass: React.FC<RouteComponentProps> = ({history}) =>{
    const {token} = useContext(AuthContext);
    const {usersList, fetchUsers, addClass} = useContext(ItemContext);
    const [classname, setClassname] = useState<string>("");

    function findUsername(id:string){
        let u = ''
        usersList.forEach(element => {
            if (element._id == id) u = element.username;
        });
        return u;
    }

    const [users, setUsers] = useState<string[]>([findUsername(token?.id || '')]);

    useEffect(()=>{fetchUsers()},[]);
    
    console.log(usersList.length + ' users');
    function handleCreateClassroom(){
        let classData = {"name" : classname, "owner":token?.id || '', "members":users}
        console.log(classData);
        if(token)addClass(classData, token.token);
    }
    return(
        <IonPage>
          <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
                <IonButton routerLink="/">
                    <IonIcon icon={arrowBack} />
                    </IonButton>
                </IonButtons>
                <IonTitle>
                    Create a new classroom
                </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem>
                        <IonLabel position="floating">Name of the class</IonLabel>
                        <IonInput onIonChange = {(e)=>{
                            setClassname(e.detail.value || '');
                            console.log(classname);
                        }}></IonInput>
                    </IonItem>
                    <IonListHeader>Selected users:</IonListHeader>
                    <IonList>
                        {users.map(e=>{
                            return <IonChip>{e}</IonChip>
                        })}
                    </IonList>
                    <IonItem>
                        <IonSearchbar placeholder="Invite users"></IonSearchbar>                       
                    </IonItem>
                    <IonList>
                            {usersList.map(e=> {  return <IonCard  key = {e._id} 
                                                onClick={(ev)=>{
                                                    var aux = users;
                                                    aux.push(e._id);
                                                    setUsers(aux);
                                                    console.log(users);
                                                }
                                        } > 
                                    <IonText>Username: {e.username}</IonText> &emsp;
                                    <IonText>Role: </IonText>{e.role == "stud"? <IonChip>Student</IonChip> : <IonChip>Professor</IonChip>}
                                    <IonButton color="danger" 
                                                onClick={(ev)=>{
                                                    var aux = users;
                                                    aux.splice(aux.indexOf(e._id), 1);
                                                    setUsers(aux);
                                                    console.log(users);
                                                }
                                    }>x</IonButton>
                                </IonCard>
                            })}
                    </IonList>

                    <IonButton color="tertiary" 
                        shape="round" 
                        fill="outline" 
                        expand="block"
                        onClick={()=>handleCreateClassroom()}>Create classroom</IonButton>
                </IonList>
            </IonContent>
            </IonPage>)
}