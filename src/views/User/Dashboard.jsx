import React from "react";
import { Route, Switch} from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "components/Navbars/UserNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

//import dashboardRoutesAdmin from "routes/DashboardAdmin.jsx";
import dashboardRoutesUser from "routes/DashboardUser.jsx";

import logo from "assets/img/react-logo.png";
import NotFound from "../NotFound";
import {connect} from "react-redux";
import { getCurrentUser } from "../../redux/actions";

let ps;

const MyRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => <Component {...rest} {...props}/>}/>
);

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentUser: this.props.currentUser,
      isLoading: true,
      backgroundColor: "primary",
      sidebarOpened:
          document.documentElement.className.indexOf("nav-open") !== -1
    };
    //this.loadUserProfile = this.loadUserProfile.bind(this);
  }
  /*loadUserProfile() {
    this.setState({
      isLoading: true
    });

    getCurrentUser()
        .then(response => {
          this.setState({
            user: response,
            isLoading: false
          });
        }).catch(error => {
      if(error.status === 404) {
        this.setState({
          notFound: true,
          isLoading: false
        });
      } else {
        this.setState({
          serverError: true,
          isLoading: false
        });
      }
    });
  }*/
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(this.refs.mainPanel, { suppressScrollX: true });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    this.props.getCurrentUser();
    //this.loadUserProfile();
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      if (navigator.platform.indexOf("Win") > -1) {
        let tables = document.querySelectorAll(".table-responsive");
        for (let i = 0; i < tables.length; i++) {
          ps = new PerfectScrollbar(tables[i]);
        }
      }
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
    //this.loadUserProfile();
  }
  // this function opens and closes the sidebar on small devices
  handleToggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/user" || prop.layout === "/admin") {
          return (
              <MyRoute path={prop.layout + prop.path} history={this.props.history} component={prop.component} key={key} />
        );
      } else {
        return <Route component={NotFound} key={key} />;
      }
    });
  };

  handleBgClick = color => {
    this.setState({ backgroundColor: color });
  };

  render() {
    /*if(this.state.notFound || !this.props.currentUser) {
      return <NotFound />;
    }*/

    /*if(this.state.serverError) {
      return <ServerError />;
    }*/

    //let dashboardRoutes = /*this.props.currentUser.role==="ROLE_USER"*/true?(dashboardRoutesUser):(dashboardRoutesAdmin);
    let dashboardRoutes = dashboardRoutesUser;

    return (
        <>
          <div className="wrapper">
            <Sidebar
                {...this.props}
                routes={dashboardRoutes}
                bgColor={this.state.backgroundColor}
                logo={{
                  outterLink: "https://www.bcp.com/",
                  text: "Banque Populaire",
                  imgSrc: logo
                }}
                toggleSidebar={this.handleToggleSidebar}
            />
            <div
                className="main-panel"
                ref="mainPanel"
                data={this.state.backgroundColor}
            >
              <AdminNavbar
                  {...this.props}
                  routes={dashboardRoutes}
                  toggleSidebar={this.handleToggleSidebar}
                  sidebarOpened={this.state.sidebarOpened}
                  handleLogout={this.props.handleLogout}
                  history={this.props.history}
              />
              <Switch>{this.getRoutes(dashboardRoutes)}</Switch>
              {// we don't want the Footer to be rendered on map page
                this.props.location.pathname.indexOf("maps") !== -1 ? null : (
                    <Footer fluid />
                )}
            </div>
          </div>
        </>
    );
  }
}

const mapStateToProps = (state) =>{
  return {
    currentUser: state.currentUser
  };
};

export default connect(mapStateToProps, { getCurrentUser })(Dashboard);
