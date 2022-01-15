import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';
import Header from './Components/header/Header';
import App from './Components/App';
import Material from './Components/material/Material';
import Categorie from './Components/categorie/Categorie';
import Salle from './Components/salle/Salle';
import Client from './Components/client/Client';
import Reservation from './Components/reservation/Reservation';

import reportWebVitals from './reportWebVitals';

const Routing = () => {

  const app_routes =  <AnimatePresence exitBeforeEnter>
                        <Switch>
                          <Route path="/" exact component={App}></Route>
                          <Route path="/material"  component={Material}></Route>
                          <Route path="/categorie" component={Categorie}></Route>
                          <Route path="/salle" component={Salle}></Route>
                          <Route path="/client" component={Client}></Route>
                          <Route path="/reservation" component={Reservation}></Route>
                        </Switch>
                      </AnimatePresence>

  return (
    <Router>
      <Header />
      { app_routes }
      <a className="link" href="https://icons8.com/icon/_qcg-uxDKWmy/airpods">Airpods icon by Icons8</a>
    </Router>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
