import { IonButton, IonButtons, IonCard, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react"
import { count } from "console"
import { add, arrowBack } from "ionicons/icons"
import React, { useContext, useState } from "react"
import { Redirect, RouteComponentProps } from "react-router"
import { AuthContext } from "../../auth/AuthProvider"
import { ItemContext } from "../../data/local/Provider"
import { Quiz } from "../../data/local/quiz/QuizProps"


interface QuizForm{
    classroom : string,
    classID : string,
    questions : Question[],
    description : string,
    cnt:number
}

interface Question{
    id:number,
    text:string
}

export const CreateQuiz: React.FC<RouteComponentProps> = ({history}) =>{

    const [state, setState] = useState<QuizForm>({classroom:"", cnt:0,classID:"", questions:[], description:""});
    const { classroom, questions, description, classID, cnt} = state;

    var idx = 0;
    const {token, isAuthenticated} = useContext(AuthContext);
    const {classesList, createQuiz} = useContext(ItemContext); 
    if (!isAuthenticated) return <Redirect to="/login"/>

    var usersClasses = classesList.filter(cls => cls.owner == token?.id);
    function handleSubmit(): void {
        if(description == '') setState({...state, description:'No description provided'});
        if(token){
            let questionsArr : string[] = [];
            questions.forEach(e =>{
                questionsArr.push(e.text)
            })
            
            let quiz : Quiz = {classID : classID, 
                questions:questionsArr, 
                creator:token?.id,
                description : description,
                _id:''
            };
            createQuiz(quiz, token?.token);
        }
    }
    return( <IonPage>
        <IonHeader>
              <IonToolbar>
              <IonButtons slot="start">
              <IonButton routerLink="/">
                  <IonIcon icon={arrowBack} />
                  </IonButton>
              </IonButtons>
              <IonTitle>
                  Create a Quiz
              </IonTitle>
              </IonToolbar>
          </IonHeader>
          <IonContent>
              <IonLabel>Select a classroom</IonLabel>
              <IonSelect placeholder="Choose..." 
                    value={classroom} 
                    onIonChange={ev => {let cls = classesList.filter(e => e.name == ev.detail.value);
                                        console.log("ev : " + ev.detail.value);
                                        console.log("cls :" + JSON.stringify(cls[0]));
                                        if (cls.length > 0)
                                            setState({
                                                ...state, 
                                                classID:cls[0]._id || '',
                                                classroom : ev.detail.value
                                        })
                                        console.log(JSON.stringify(state));
                                        }
                                }>
                  {usersClasses.map(e => {
                      return <IonSelectOption>{e.name}</IonSelectOption>
                  })}
              </IonSelect>
              <IonFab vertical='center' horizontal='end'  slot='fixed'>
                <IonFabButton onClick={()=>{
                  let aux = questions;
                  aux.push({ id:cnt, text:`Question${cnt}`});
                  console.log(aux);
                  setState({
                      ...state,
                      cnt : cnt + 1,
                      questions : aux
                  });
                  console.log(JSON.stringify(state));
                }}>  
                    <IonIcon icon = { add } />
                </IonFabButton>
              </IonFab>
             
              
                {questions.map(e=>{
                    return <IonItem key={e.id}>
                        <IonCard>
                            <IonInput value={e.text} 
                                placeholder={e.id.toString()} 
                                onIonChange = {(ev)=>{
                                    let aux = questions;
                                    aux.forEach(elem =>{
                                        if (elem.id == e.id){
                                            elem.text = ev.detail.value || '';
                                        }
                                    })

                                    setState({
                                        ...state,
                                        questions : aux 
                                    })
                                }}/>
                        </IonCard>
                    </IonItem>
                })}

              <IonItem><IonLabel position="floating">Add a description to this quiz (optional)</IonLabel>
              <IonInput value={description} 
                onIonChange={ev => {
                    setState({
                        ...state,
                        description:ev.detail.value || ''
                    });
                    console.log(JSON.stringify(state));
                }}></IonInput>
              </IonItem>
              <IonButton onClick={()=>handleSubmit()}>Create quiz</IonButton>
          </IonContent>
        </IonPage>)

}


