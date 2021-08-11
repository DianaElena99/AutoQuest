import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonLabel, IonList, IonLoading, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { Console } from "console";
import React, { useContext, useState } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { ENCRYPTION_KEY } from "../../common/config";
import {AuthContext, AuthProvider} from './../AuthProvider'

var CryptoJS = require("crypto-js");

interface LoginState {
    username?: string;
    password?: string;
  }

export const Login : React.FC<RouteComponentProps> = ({history}) => {
    const {
        isAuthenticated,
        login,
        token,
        authenticationError
      } = useContext(AuthContext);    

    const [state, setState] = useState<LoginState>({});
    const { username, password } = state;

    function handleLogin(){
        console.log("Login fn " + login);
        if (state.username == '' || state.password==''){
            alert("Username and password can't be empty");
        }else{
            var encrypted_pass : string = CryptoJS.AES.encrypt(state.password, ENCRYPTION_KEY).toString();
            login?.(state.username||'', encrypted_pass);
            console.log("Token after login: " + JSON.stringify(token));
            console.log("isAuth after login : " + isAuthenticated);
            
        }
    }

    if (isAuthenticated) {
      return <Redirect to={{ pathname: "/" }} />;
    }
   
    return (
    <IonPage>
        <IonHeader>
        <IonToolbar>
            <IonTitle>
                AutoQuest 
            </IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonGrid >
                <IonRow>
                    <IonCol class="ion-padding-top ion-padding-start">
                        Log into your account   
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                    <IonInput
                      placeholder="Username"
                      value={username}
                      onIonChange={(e) =>
                        setState({
                        ...state,
                        username: e.detail.value || "",
                      })}
                    />
                    <IonInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onIonChange={(e) =>
                        setState({
                        ...state,
                        password: e.detail.value || "",
                      })}
                    />
                    <IonButton color="success" 
                                    shape="round" 
                                    fill="outline" 
                                    expand="block"
                                    onClick={handleLogin}>Sign In</IonButton>

                    <IonAlert isOpen={authenticationError!==null} message="Authentication failed. Please try again."></IonAlert>
                    </IonCol>
                   
                </IonRow>
                
                <IonRow >
                    <IonCol class="ion-padding-top">
                        <IonLabel >
                            Don't have an account? 
                        </IonLabel>
                        <IonButton color="tertiary" shape="round" fill="outline" expand="block" routerLink="/register">Sign Up Here</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
           
        </IonContent>
    </IonPage>
    )
};
