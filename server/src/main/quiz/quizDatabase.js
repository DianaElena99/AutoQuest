import dataStore from "nedb-promise";
import { IDatabase } from "../../utils/database/DatabaseInterface";

/**
 * Quiz structure 
 *  - _id
 *  + classId 
 *  + creatorID
 *  + questions : String[]
 * 
 *  

 */

export class QuizDatabase extends IDatabase{
    constructor({ filename, autoload }) {
        super({ filename, autoload });
        //this.store = dataStore({ filename, autoload });
    }

    async findByClass(props){
        return this.store.find({"classID":props});
    }

}

