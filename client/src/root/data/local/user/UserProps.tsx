import { ClassProps } from "../classes/ClassesProps";
import { Quiz } from "../quiz/QuizProps";

export interface UserProps{
    _id? : string,
    username : string,
    password : string,
    mail : string,
    role:string,
    classes? : ClassProps[],
    quizes? : Quiz[]
}