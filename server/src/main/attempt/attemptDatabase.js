/** Attempt structure 
 *  - _id
 *  + userID
 *  + quizID
 *  + answers : Answer[]
 * 
 *  * 
 *  Answer structure
 *  + question
 *  + answer
 *  + isCorrect
 */
 import dataStore from "nedb-promise";
import { IDatabase } from "../../utils/database/DatabaseInterface";
 export class AttemptDatabase extends IDatabase{

    constructor({ filename, autoload }) {
        super({ filename, autoload });
        //this.store = dataStore({ filename, autoload });
    }
   

    async update(id, props){
        return this.store.update({"_id" : id}, {$set : props}, { multi: true });
    }

    /*async update(id, newAnswers){
        return this.store.update({"_id" : id}, {$set : { "answers" : newAnswers}}, { multi: true });
    }*/

    async findByUser(user, quiz){
        return this.store.find({"userID":user, "quizID" : quiz});
    }

    async findByQuiz(quiz){
        return this.store.find({"quizID":quiz});
    }
 }
 



/*export var attemptDB = new AttemptDatabase({
    filename: "./db/attempts.json",
    autoload: true,
})*/

