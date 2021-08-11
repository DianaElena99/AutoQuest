import React, { useCallback, useEffect, useState } from "react";
import { RemoteApi, Token } from "./remote/AuthAPI";
import PropTypes from "prop-types";
import {Plugins} from '@capacitor/core'
import { Redirect } from "react-router";
import { IonAlert } from "@ionic/react";
import { UserProps } from "../data/local/user/UserProps";
import { ConfirmRegistration } from "./register/ConfirmRegistration";

export interface RegisterState{
  username?:string,
  password?:string,
  mail?:string,
  role?:string
}


type LoginFn = (username?: string, password?: string) => void;
type LogoutFn = () => void;

export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login?: LoginFn;
  pendingAuthentication?: boolean;
  username?: string;
  password?: string;
  token: Token | null;
  logout?: () => void;
  localData: boolean;
  register:(user:RegisterState)=>void;
  confirmRegistration:(id:string)=>void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  token: null,
  localData: false,
  register:(user:RegisterState)=>{},
  confirmRegistration:(id:string)=>{}
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const {
    isAuthenticated,
    isAuthenticating,
    authenticationError,
    pendingAuthentication,
    token,
    localData,
  } = state;
  const login = useCallback<LoginFn>(loginCallback, []);
  const logout = useCallback<LogoutFn>(logoutCallBack, []);
  useEffect(initialSetupEffect, []);
  useEffect(authenticationEffect, [pendingAuthentication]);
  const value = {
    isAuthenticated,
    login,
    isAuthenticating,
    authenticationError,
    token,
    logout,
    localData,
    register,
    confirmRegistration
  };
  //log("render");

  async function confirmRegistration(id:string){
    try{
      const resp = await RemoteApi.confirmRegistration({'id':id});
      alert("Success!");
    }catch(error){
      alert(JSON.stringify(error));
    }
  }

  async function register(user: RegisterState){
    const aux : UserProps = {username:user.username||'', password:user.password||'', mail:user.mail||'', role:user.role||''};
    try{
      var res = await RemoteApi.register(aux);
      alert("Account created! Check your mail address and confirm your registration.")
    }catch(error){
      alert(error);
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  function loginCallback(username?: string, password?: string): void {
    console.log(
      "Entered Login function callback, will make pendingAuthentification:true and set username&password"
    );
    setState({
      ...state,
      pendingAuthentication: true,
      username,
      password,
    });
    console.log("After setState:" + JSON.stringify(state));
  }
  function logoutCallBack() {
    const { Storage } = Plugins;
    Storage.remove({ key: "token" });
    setState({
      ...state,
      isAuthenticated: false,
      token: null,
    });
  }
  function initialSetupEffect() {
    const { Storage } = Plugins;
    (async () => {
      let result: any = await Storage.get({ key: "token" });
      if (result.value !== null) {
        let resultObj = JSON.parse(result.value);
        console.log(
          "Inside AuthentificationEffect, pending is :" +
            pendingAuthentication +
            " result from Storage is not null, result.value = " +
            JSON.stringify(resultObj)
        );
        if (resultObj.time > Date.now())
          setState({
            ...state,
            isAuthenticated: true,
            //token: resultObj.token,
            token : resultObj,
            localData: true,
            
          });
          console.log("After setState:" + JSON.stringify(state));
      }
    })();
  }

  function authenticationEffect() {
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    };
    async function authenticate() {
      if (!pendingAuthentication) {
        console.log(
          `Entered authentificate() , pendingAuthentification is false, returning`
        );
        return;
      }
      try {
        console.log("Inside authentificate() setting isAuthentifcating: True");
        setState({
          ...state,
          isAuthenticating: true,
        });
        console.log("After setState:" + JSON.stringify(state));

        const { username, password } = state;
        const response = await RemoteApi.login(username||'', password||'');
        console.log(
          "Response received from loginAPi: " + JSON.stringify(response)
        );
        if (canceled) {
          console.log("Cancelled, ignoring response");
          return;
        }
        const { Storage } = Plugins;
        let expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 5);
        await Storage.set({
          key: "token",
          value: JSON.stringify({
            token: response.token,
            role : response.role,
            time: expiryDate.getTime(),
            id : response.id
          }),
        });
        setState({
          ...state,
          token: response,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });
        console.log("After setState:" + JSON.stringify(state));
      } catch (error) {
        
        if (canceled) {
          return;
        }
        //log("authenticate failed");
        setState({
          ...state,
          authenticationError: error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });

        
      }
    }
  }
};
