import dataStore from "nedb-promise";

export class UserDatabase {
  constructor({ filename, autoload }) {
    this.store = dataStore({ filename, autoload });
  }

  async findOne(props) {
    return this.store.findOne(props);
  }

  async findAll(){
    return this.store.find({});
  }

  async insert(user) {
    return this.store.insert(user);
  }

  async update(id){
      this.store.update({_id:id}, {$set:{confirmed_mail:true}});
      return this.store.findOne({_id:id});
  }

  async delete(props){
    return this.store.remove(props);
  }
}

export var userDB = new UserDatabase({
  filename: "./db/users.json",
  autoload: true,
});
