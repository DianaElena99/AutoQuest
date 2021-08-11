export interface Quiz{
    _id : string,
    classID : string,
    creator : string,
    questions : string[],
    dataCreated? : any,
    description : string
}