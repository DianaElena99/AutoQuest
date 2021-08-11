export interface Attempt{
    _id? : string,
    userID : string,
    quizID : string,
    answers : AnswerItem[],
    evaluated? : boolean
    date?:string
}

export interface AnswerItem{
    question : string,
    answer : string,
    isCorrect : boolean,
}