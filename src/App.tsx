import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { GeneratorPage } from './modules/generator';
import { HomePage } from './modules/homePage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/generator' component={GeneratorPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
