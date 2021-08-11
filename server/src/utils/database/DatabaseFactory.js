import { ClassDatabase } from "../../main/classes/classDatabase";
import {AttemptDatabase} from '../../main/attempt/attemptDatabase';
import {QuizDatabase} from '../../main/quiz/quizDatabase';



export class DatabaseFactory{
    getDatabase(name, props){
        switch (name) {
            case "class":
                return new ClassDatabase(props);
                break;
            case "attempt":
                return new AttemptDatabase(props);
                break;
            case "quiz":
                return new QuizDatabase(props);
                break;
            default:
                break;
        }
    }
}


export var SingletonFactory = (function () {
    var factory;
 
    function createFactory() {
        var factory_ = new DatabaseFactory();
        return factory_;
    }
 
    return {
        getFactory: function () {
            if (!factory) {
                factory = createFactory();
            }
            return factory;
        }
    };
})();