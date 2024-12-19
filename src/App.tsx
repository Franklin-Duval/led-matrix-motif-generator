import 'antd/dist/antd.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './assets/global-css/modal-styles.css';
import { GeneratorPage } from './modules/generator';
import { MigrationRevuePage } from './modules/migration';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={MigrationRevuePage} />
        <Route exact path='/generator' component={GeneratorPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
