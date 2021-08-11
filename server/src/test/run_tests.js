
import { run_tests_attempt } from "./test_attempt";
import { run_tests_quiz } from "./test_quiz";
import {run_tests_classroom} from './test_classroom';
import {run_tests_users} from './test_users';
export function run_all(){
    run_tests_attempt();
    run_tests_quiz();
    run_tests_classroom();
    run_tests_users();
}