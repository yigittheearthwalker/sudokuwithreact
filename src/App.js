import React, { Fragment } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import './App-media.css';
import SudokuState from './context/sudoku/SudokuState'
import Home from './components/pages/Home'

function App() {
  return (
    <SudokuState>
      <Fragment>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch> 
        </Router>
      </Fragment>
    </SudokuState>
  );
}

export default App;
