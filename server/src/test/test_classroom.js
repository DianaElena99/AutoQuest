import { ClassDatabase } from "../main/classes/classDatabase";

export var classroomTestDB = new ClassDatabase({
    filename: "./db/tests/classroom_test.json",
    autoload: true,
});

async function createClassroomTest(cls){
    let res = await classroomTestDB.insertOne(cls);
    return res;
}


async function deleteClassroomTest(id){
    await classroomTestDB.delete(id);
}

async function deleteAll(){
    const cls = await fetchClassroomsTest();
    cls.forEach(x => {
        
        console.log("Deleting classroom: " + x._id);
        console.log(deleteClassroomTest(x._id));
    })
}

async function fetchClassroomsTest(){
    let res = await classroomTestDB.findAll();
    return res;
}

async function filterClassroomTest(props){
    let res = await classroomTestDB.findByUID(props);
    return res;
}

async function updateClassroomTest(props){
    let res = await classroomTestDB.update(props.classID, props.uID);
    return res;
}

export async function run_tests_classroom(){
    console.log("__________________");
    console.log("TEST CLASSROOM");
    console.log("___________________")
    var cls1 = {"name":"test1","owner":"nwhqSDBowHCAoT1U","members":["nwhqSDBowHCAoT1U","fBDZXoZBRtP21Nle","2Df264mG0QYMBrH3"]};
    var cls2 = {"name":"test2","owner":"nwhqSDBowHCAoT1U","members":["nwhqSDBowHCAoT1U","2Df264mG0QYMBrH3"]};

    var clsList = await fetchClassroomsTest();
    console.log(clsList.length == 0); 
    await createClassroomTest(cls1);
    await createClassroomTest(cls2);
    clsList = await fetchClassroomsTest();
    console.log(clsList.length == 2);

    var fil1 = await filterClassroomTest("nwhqSDBowHCAoT1U");
    console.log(fil1.length == 2);
    var fil2 = await filterClassroomTest("fBDZXoZBRtP21Nle");
    console.log(fil2.length == 1);

    let props = {"uID":"fBDZXoZBRtP21Nle", "classID":fil2[0]._id}

    await updateClassroomTest(props);
    var fil2 = await filterClassroomTest("fBDZXoZBRtP21Nle");
    console.log(fil2.length == 2);

    await deleteAll();
}