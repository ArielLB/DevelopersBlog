import React , {Fragment,useEffect} from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
import { BrowserRouter as Router,Route,Switch} from 'react-router-dom';

//redux 
import { Provider } from 'react-redux';
import store from './store';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
//

import './App.css';


if(localStorage.token) setAuthToken(localStorage.token);//?

const  App = () => {
  useEffect(()=>{//runs only once - check is the user is authenticated on every page
    store.dispatch(loadUser());
  },[])
  return (
  //wrap everything with provider so every component can access the state
  //fragment is just an empty component that can wrap like div
    <Provider store={store}>
    <Router>
    <Fragment>
      <Navbar/>
      <Switch>
        <Route exact path='/' component={Landing}/>
        <Routes component={Routes}/>
      </Switch>
    </Fragment>
    </Router>
    </Provider>
)};

export default App;
