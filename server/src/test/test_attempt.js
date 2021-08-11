import {AttemptDatabase} from './../main/attempt/attemptDatabase';

export var attemptDBTest = new AttemptDatabase({
    filename: "./db/tests/attempt_test.json",
    autoload: true,
});


async function test_find_one(id){
    const att = await attemptDBTest.findOne(id);
    console.log("Attempt with id " + id + " : " + att);
    return att;
}

async function test_find_all(){
    const quizes = await attemptDBTest.findAll();
    quizes.forEach(element => {
        console.log(element);
    });
    return quizes;
}


async function test_delete(id){
    await attemptDBTest.delete(id);
}

async function test_delete_all(){
    const quizes = await test_find_all();
    quizes.forEach(x => {
        
        console.log("Deleting attempt: " + x._id);
        console.log(test_delete(x._id));
        test_find_one(x._id);
    })
}

async function test_filter(){
    const res1 = await attemptDBTest.findByUser("user1", "quiz1");
    const res2 = await attemptDBTest.findByQuiz("quiz1");
    console.log("res1 : " + JSON.stringify(res1) + " \n" + res1.length);
    console.log("res2 : " + JSON.stringify(res2) + " \n" + res2.length);
}

async function test_update(id, stuff){
    console.log("updating attempt with id : " + id);
    await attemptDBTest.update(id, stuff);
    var newAttempt = await attemptDBTest.findOne(id);
    console.log("updated succefully : " + (newAttempt.answers == stuff));
}

async function test_update_all(){
    var eval2 = [
        {
            question : "What is the capital of France?",
            answer : "Lyon",
            isCorrect : false
        },
        {
            question : "Which are the neighbours of Romania?",
            answer : "Bulgaria, Moldova, Hungary, Ukraine, Serbia",
            isCorrect : true
        }
    ];

    let quizes = await attemptDBTest.findAll();
    quizes.forEach(x =>{
        test_update(x._id, eval2);
    });

}

async function test_insert(attempt){
    const inserted = await attemptDBTest.insertOne(attempt);
    console.log("Inserted attempt : " + inserted._id);
    return inserted._id;
}

export async function run_tests_attempt(){
    var att1 = {
        userID : "user1",
        quizID : "quiz1",
        evaluated:false,
        answers : [
            {
                question : "What is the capital of France?",
                answer : "Paris",
                isCorrect : false
            },
            {
                question : "Which are the neighbours of Romania?",
                answer : "Bulgaria, Moldova, Ungaria",
                isCorrect : false
            }
        ]
    }   

    
    test_insert(att1);    
    //test_update_all();

    test_filter();    
    test_delete_all()
    
}