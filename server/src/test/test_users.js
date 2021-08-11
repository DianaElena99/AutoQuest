
import {UserDatabase} from './../auth/userDatabase'

export var userDBTest = new UserDatabase({
    filename: "./db/tests/user_test.json",
    autoload: true,
})

async function fetchUsersTest(){
    let res = await userDBTest.findAll();
    return res;
}

async function registerUserTest(usr){
    let res = await userDBTest.insert(usr);
    return res;
}

async function loginUserTest(usr){
    let res = await userDBTest.findOne(usr);
}

async function confirmPasswdTest(id){
    await userDBTest.update(id);
}

async function deleteTest(id){
    await userDBTest.delete(id);
}

export async function run_tests_users(){
    var usr = {"username":"dummy","confirmed_mail":false,"password":"pass", "mail":"dummy@dummy.com","role":"stud"}
    
    console.log(fetchUsersTest.length == 0);
    let res = registerUserTest(usr);
    
    console.log(res);
    confirmPasswdTest(res._id);
    
    var loginProps = {"username":"dummy","password":"pass","confirmed_mail":true}; 
    console.log(loginUserTest(loginProps));
}

