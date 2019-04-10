import React, { Component } from 'react';

import {
  Route,
  withRouter,
  Switch,
  Redirect
} from 'react-router-dom';

import Dashboard from './views/User/Dashboard.jsx';
import Login from './views/Login';
import NotFound from './views/NotFound';
import PrivateRoute from './routes/PrivateRoute';

class App extends Component {

  render() {
    return (
        <>
            <Switch>
              <Route path="/login"
                     render={(props) => <Login {...props} />} />
              <PrivateRoute path="/user" component={Dashboard} history={this.props.history}/>
              <Redirect exact from="/" to="/login" />
              <Route component={NotFound} />
            </Switch>
        </>
    );
  }
}

export default withRouter(App);
