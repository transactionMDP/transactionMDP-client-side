import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import Footer from "../components/Footer/Footer";


/* La page 404 */
class NotFound extends Component {
    render() {
        return (
            <div className="wrapper wrapper-full-page">
                <div id="notfound">
                    <div className="notfound">
                        <div className="notfound-404"/>
                        <h1 className="title">404</h1>
                        <h2>Oops! Page Not Be Found</h2>
                        <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily
                            unavailable</p>
                        <Link to="/">Back to homepage</Link>
                    </div>
                </div>
                { /*this.props.location.pathname.indexOf("/user/")===0?(null):(<Footer/>) */}
            </div>
        );
    }
}

export default NotFound;
