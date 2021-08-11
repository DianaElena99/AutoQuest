import axios from 'axios';
import { Quiz } from '../local/quiz/QuizProps';
import { baseURL, prefix, config, withLogs, authConfig } from './../../common/index'

const QuizURL = `http://${baseURL}${prefix}/main`

interface QuizApiProps{
    getQuizes : (cls : string, tok:string)=>Promise<Quiz[]>,
    generateQuiz : (inputText : string, creator : string, tok:string)=>Promise<string[]>,
    createQuiz : (quiz : Quiz, tok:string) => Promise<Quiz>
}

export const RemoteQuizAPI : QuizApiProps = {
    getQuizes : (cls : string, tok:string)=>{
        return withLogs(axios.get(QuizURL + "/quiz/" + cls, authConfig(tok)), `fetch quizes from class ${cls}`);
    },

    generateQuiz : (inputText : string, creator : string, tok:string) =>{
        return withLogs(axios.post(QuizURL + "/generate-quiz", {"inputText":inputText, "creator":creator}, authConfig(tok)), "generating quiz");
    },

    createQuiz : (quiz:Quiz, tok:string) =>{
        return withLogs(axios.post(QuizURL + "/quiz", quiz,  authConfig(tok)), "creating quiz");
    }
}