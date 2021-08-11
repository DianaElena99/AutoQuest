import axios from 'axios';
import { authConfig, baseURL, config, withLogs } from './../../common/index'
import {ClassProps} from './../local/classes/ClassesProps'
const ClassURL = `http://${baseURL}/main/classes`;

interface ClassApiProps{
    getClasses : (id:string, token:string) => Promise<ClassProps[]>
    addClass : (newClass : ClassProps, token:string) => Promise<ClassProps>
    addStudent : (id : string, user:string, token:string) => Promise<any>
    fetchStudents : () => Promise<any>
}

export const RemoteClassAPI : ClassApiProps = {
    getClasses : (id:string, token:string) => {
        return withLogs(axios.get(ClassURL + "/" + id, authConfig(token)), `get classes for user with id ${id}`);
    },


    fetchStudents : () =>{
        return withLogs(axios.get("http://localhost:3000/auth/users"), "fetching the users");
    },

    addClass : (newClass : ClassProps, token:string) => {
        return withLogs(axios.post(ClassURL, newClass, authConfig(token)), `create new class`);
    },

    addStudent : (id : string, user:string, token:string)=>{
        return withLogs(axios.put(ClassURL + "/" + id, {"user":user}, authConfig(token)), `adding student ${user} in class ${id}`);
    }
}