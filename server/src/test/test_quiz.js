import { QuizDatabase } from './../main/quiz/quizDatabase'


export var quizDBTest = new QuizDatabase({
    filename: "./db/tests/quizes_test.json",
    autoload: true,
})

async function test_insert(quiz){
    const inserted = await quizDBTest.insertOne(quiz);
    console.log("Inserted quiz : " + inserted._id);
    return inserted._id;
}

async function test_find(id){
    const quiz = await quizDBTest.findOne(id);
    console.log("Quiz with id " + id + " : " + quiz);
    return quiz;
}

async function test_find_all(){
    const quizes = await quizDBTest.findAll();
    quizes.forEach(element => {
        console.log(element);
    });
    return quizes;
}


async function test_delete(id){
    await quizDBTest.delete(id);
}

async function test_delete_all(){
    const quizes = await test_find_all();
    quizes.forEach(x => {
        
        console.log("Deleting : " + x._id);
        console.log(test_delete(x._id));
        test_find(x._id);
    })
}

export async function run_tests_quiz(){
   
    //await 
    test_find_all();
    var quiz1 = {"creator":"prof1", "class":"clasa1", "questions":["What is the capital of France?", "What is the largest city of Holland?", "Which are the neighbors of Romania?"]}
    var quiz2 = {"creator":"prof2", "class":"clasa2", "questions":["What is the capital of France?", "What is the largest city of Holland?", "Which are the neighbors of Romania?"]}
    var quiz3 = {"creator":"prof3", "class":"clasa3", "questions":["What is the capital of France?", "What is the largest city of Holland?", "Which are the neighbors of Romania?"]}
    
     test_insert(quiz1);
     test_insert(quiz2);
     test_insert(quiz3);
     test_delete_all();

}