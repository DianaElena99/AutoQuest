import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { Login } from './root/auth/login/Login';
import React from 'react';
import { PrivateRoute } from './root/auth/login/PrivateRoute';
import { AuthProvider } from './root/auth/AuthProvider';
import { Register } from './root/auth/register/Register';

import { ConfirmRegistration } from './root/auth/register/ConfirmRegistration';
import { Home } from './root/pages/main-page/Home';
import { GenerateQuiz } from './root/pages/quiz/GenerateQuiz';
import { ShowQuizes } from './root/pages/quiz/ShowQuizes';
import { CreateClass } from './root/pages/class/CreateClass';
import { AttemptQuiz } from './root/pages/quiz/AttemptQuiz';
import { ItemProvider } from './root/data/local/Provider';
import { CreateQuiz } from './root/pages/quiz/CreateQuiz';
import { EvaluateAttempt } from './root/pages/quiz/EvaluateAttempt';
import { ShowAttempts } from './root/pages/quiz/ShowAttempts';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
      <AuthProvider>

        <Route path="/login" component = {Login} exact={true}/>
        <Route path="/register" component = {Register} exact={true}/>
        <Route path='/confirm-registration/:id' component={ConfirmRegistration} exact={true}/>

        <ItemProvider>
          <PrivateRoute path="/home" component={Home} exact = {true}/>
          <Route path = "/generate-quiz" component={GenerateQuiz} exact={true}/>
          <Route path = "/create-quiz" component={CreateQuiz} exact={true}/>
          <Route path = "/create-class" component={CreateClass} exact={true}/>
          <Route path = "/quizes/:cls" component = {ShowQuizes} exact = {true}/>
          <Route path = "/quiz/:id" component={AttemptQuiz}  exact = {true}/>
          <Route path = "/attempts/:id" component={ShowAttempts} exact={true}/>
          <Route path = "/evaluate/:id" component={EvaluateAttempt} exact={true}/>
        </ItemProvider>
        <Route exact path="/" render={() => <Redirect to="/home" />} />

      </AuthProvider>

        
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
