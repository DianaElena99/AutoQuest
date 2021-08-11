import { SingletonFactory } from "./../utils/database/DatabaseFactory";

var factory = SingletonFactory.getFactory();

export var attemptDB = factory.getDatabase("attempt", {
    filename: "./db/attempts.json",
    autoload: true,
});

export var classDB = factory.getDatabase("class", {
    filename: "./db/classes.json",
    autoload: true,
});
  
export var quizDB = factory.getDatabase("quiz", {
    filename: "./db/quizes.json",
    autoload: true,
});