import 'antd/dist/antd.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './assets/global-css/modal-styles.css';
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
