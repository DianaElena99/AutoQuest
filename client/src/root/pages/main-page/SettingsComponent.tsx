import { IonButtons, IonCard, IonChip, IonList, IonToolbar } from "@ionic/react";
import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { AuthContext } from "../../auth/AuthProvider";
import {useNetwork} from './../../network/useNetworkStatus'



interface SettingsProps{

}

export const SettingsComponent: React.FC<SettingsProps> = (props) =>{
    const {logout} = useContext(AuthContext);
    const { networkStatus } = useNetwork();

    return(
        <IonButtons slot="end">
            
            <IonChip onClick={logout}>Log Out</IonChip>
        </IonButtons>
    )
}