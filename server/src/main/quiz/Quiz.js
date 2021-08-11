class Quiz{
    
    constructor(className, creator,questions){
        this.className = className;
        this.creator = creator;
        this.questions = questions;
    }


    addQuestions(quest){
        this.questions.push(quest);
    }
}