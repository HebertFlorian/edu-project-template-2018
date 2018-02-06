import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from './store';

const store = configure();

class ListEpisodes extends Component {
    render() {
        return(
           <h1>YOLO Swag</h1>
        );
    }
};

class Episode extends Component {
    render() {
        return(<h1>YOLO Swag</h1>);
    }
};

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                  <div>
                    <Route path="/listEpisodes" component={ListEpisodes}></Route>
                    <Route path="/episode" component={Episode}></Route>
                  </div>
                </Router>
            </Provider>
        );
    }
};
