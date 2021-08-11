import { IonButton, IonChip, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { getUrl } from "ionicons/dist/types/components/icon/utils"
import React, { useContext } from "react"
import { RouteComponentProps } from "react-router"
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthProvider";



export const ConfirmRegistration : React.FC<RouteComponentProps> = ({history}) => {
    const {confirmRegistration} = useContext(AuthContext);
    const token : {"id":string} = useParams();
    function sendConfirmationRequest(){
        confirmRegistration(token.id);    
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Confirm your registration on Quizzz</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
               <IonChip onClick={sendConfirmationRequest}>Click here</IonChip>
            </IonContent>
            <IonButton
                color = "tertiary"
                shape = "round"
                expand = "block"
                onClick={ev => history.push("/login")}>
                To Login Page
            </IonButton>
        </IonPage>
    )
}