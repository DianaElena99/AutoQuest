import axios from 'axios';
import { AnswerItem, Attempt } from '../local/quiz/AttemptProps';
import { baseURL, prefix, config, withLogs, authConfig } from './../../common/index'

const URL = `http://${baseURL}${prefix}/main`

interface AttemptApiProps{
    createAttempt : (attempt : Attempt, tok:string) => Promise<Attempt>,
    evaluateAttempt : (_id : string, answers : AnswerItem[], tok:string) => Promise<any>,
    fetchAttempts : (quizID : string, userID : string, tok:string)=> Promise<Attempt[]>
}

export const RemoteAttemptAPI : AttemptApiProps = {
    createAttempt : (attempt : Attempt, tok:string)  => {
        return withLogs(axios.post(URL + "/attempt",attempt,authConfig(tok)), "create attempt")
    },

    evaluateAttempt : (_id : string, answers : AnswerItem[], tok:string) =>{
        return withLogs(axios.put(URL + "/attempt/" + _id, answers, authConfig(tok)), "evaluate attempt")
    },

    fetchAttempts : (quizID : string, userID : string, tok:string)=>{
        return withLogs(axios.post(URL+"/attempts/"+quizID, {"userID" : userID},authConfig(tok)), "evaluate attempt")
    }
}