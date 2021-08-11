import dataStore from "nedb-promise";
import { IDatabase } from "../../utils/database/DatabaseInterface";

/**
 *  Class structure
 *  - _id : id of the class
 *  + name : name of the class
 *  + owner : id of the user who created the class
 *  + members : list with ids of the users enrolled in the class, including the owner
 */

export class ClassDatabase extends IDatabase{
    constructor({ filename, autoload }) {
        super({ filename, autoload });
    }


    // return all the classes in which user with uid is enrolled 
    async findByUID(uid){
        return this.store.find({members : {"$in":[uid]}});
    }

    async query(props){
        return this.store.find(props);
    }

    // add student to class
    async update(classID, uID){
        return this.store.update({_id:classID}, {$push:{members : uID}})
    }
}

