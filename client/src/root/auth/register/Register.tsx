import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonContent, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { stat } from "fs";
import React, { useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import { ENCRYPTION_KEY } from "../../common/config";
import { AuthContext, RegisterState } from "../AuthProvider";

var CryptoJS = require("crypto-js");


export const Register : React.FC<RouteComponentProps> = ({history}) => {
    const [state,setState] = useState<RegisterState>({});
    const {username, password, mail, role} = state;
    const {register} = useContext(AuthContext);

    function handleRegister(){
        if (state.username === '' || state.password==='' || state.role==='' || state.mail===''){
            alert("Can't submit a form with empty fields.");
        }
        else{
            var encrypted_pass : string = CryptoJS.AES.encrypt(state.password, ENCRYPTION_KEY).toString();
         
            if (state.role == 'Student'){
                state.role = 'stud';
            }
            else if (state.role == 'Teacher'){
                state.role = 'prof';
            }
         
            if (!state.mail?.endsWith("@cs.ubbcluj.ro")) state.role= 'stud';
         
            const aux : RegisterState = {username:state.username, password:encrypted_pass, role:state.role, mail:state.mail}
            register(aux);
        }
    }

    return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
          <IonBackButton defaultHref="login" />
        </IonButtons> 
                <IonTitle>
                    Registration
                </IonTitle>
            </IonToolbar>
            
        </IonHeader>
        <IonContent>
            <IonList>
                <IonListHeader>
                    <IonText color="white">Please complete this form</IonText></IonListHeader>
                <IonCard>
                    <IonItem> 
                        <IonLabel position="floating">Username</IonLabel>
                        <IonInput value={username} onIonChange={(e)=>{
                            setState({
                                ...state, 
                                username: e.detail.value||'',
                            })
                        }}/>
                    </IonItem>
                </IonCard>

                <IonCard>
                <IonCardHeader><IonText color="danger">Tip: choose a strong password, that is at least 8 characters and has upper case, lower case, digits and special characters</IonText></IonCardHeader>
                    <IonItem> 
                        <IonLabel position="floating" >Password</IonLabel>
                        <IonInput value={password} type='password' onIonChange={(e)=>{
                            setState({
                                ...state, 
                                password: e.detail.value||'',
                            })
                        }}/>
                    </IonItem>
                </IonCard>

                <IonCard>
                    <IonItem> 
                        <IonLabel position="floating">Mail</IonLabel>
                        <IonInput value={mail} onIonChange={(e)=>{
                            setState({
                                ...state, 
                                mail: e.detail.value||'',
                            })
                        }}/>
                    </IonItem>
                </IonCard>

                <IonCard>
                    <IonItem> 
                        <IonLabel position="floating">Account type</IonLabel>
                        <IonSelect value={role} onIonChange={
                            (e)=>{
                                setState({
                                    ...state,
                                    role:e.detail.value
                                })
                            }
                        }>
                            <IonSelectOption>Student</IonSelectOption>
                            <IonSelectOption>Teacher</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonCard>
                <IonButton color="tertiary" 
                        shape="round" 
                        fill="outline" 
                        expand="block"
                        onClick={handleRegister}>Create Account</IonButton>
            </IonList>
        </IonContent>
    </IonPage>
    )
}