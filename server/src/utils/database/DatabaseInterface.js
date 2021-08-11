import dataStore from "nedb-promise";



export class IDatabase{

    constructor({ filename, autoload }) {
        this.store = dataStore({ filename, autoload });
    }

    async findAll(){
        return this.store.find({});
    }

    async findOne(id){
        return this.store.find({"_id":id});
    }
    
    async delete(id){
        return this.store.remove({"_id":id});
    }

    async insertOne(obj){
        return this.store.insert(obj);
    };
}