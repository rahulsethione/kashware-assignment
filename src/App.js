import React from 'react';
import { LoginForm } from './components/LoginForm';

import './App.css';
import { UserJsonEditor } from './components/UserJsonEditor';

const AUTH_TOKEN = "AUTH_TOKEN";

function App() {

  const [authToken, setAuthToken] = React.useState(localStorage.getItem(AUTH_TOKEN));

  if(!authToken)
    return <LoginForm />;
  else 
    return <UserJsonEditor />
}

export default App;
