import React from 'react';
import {
    Route,
    Redirect
  } from "react-router-dom";
import {connect} from "react-redux";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated ? (
                <Component {...rest} {...props}/>
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

const mapStateToProps = (state) =>{
    return {
        isAuthenticated: state.isAuthenticated
    };
};

export default connect(mapStateToProps)(PrivateRoute);

/*const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated ? (
                <Component {...rest} {...props}/>
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);*/
