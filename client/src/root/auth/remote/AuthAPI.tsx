import axios from 'axios';
import { baseURL, prefix, config, withLogs } from '../../common/index';
import { UserProps } from '../../data/local/user/UserProps';

const authURL = `http://${baseURL}${prefix}/auth/`;

export interface Token{
    token : string,
    role : "prof" | "stud" | '',
    time : number | undefined,
    id : string
}


export interface AuthProps {
    token : Token;
}

interface RemoteApiProps {
    login : (username : string, password : string)=>Promise<Token>;
    register : (userProps : UserProps)=>Promise<string>;
    confirmRegistration : (token:{"id":string})=>Promise<string> ;
}

export const RemoteApi : RemoteApiProps = {
    login:(username : string, password : string) => {
        console.log(username + " " + password);
        console.log(authURL);
        const obj = {username:username,password:password};
        const data = JSON.parse(JSON.stringify(obj))
        return withLogs(axios.post(authURL + "login", data, config), 'login');
    },
    register : (userProps : UserProps)=>{
        return withLogs(axios.post(authURL + "register", userProps, config),'register')
    },
    confirmRegistration : (token : {"id":string}) =>{
        return withLogs(axios.put(authURL + "confirmation", token, config),'confirm register');
    }
}


