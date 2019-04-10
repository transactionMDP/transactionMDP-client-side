/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <Nav>
            <NavItem>
              <NavLink href="javascript:void(0)">Banque Populaire</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="javascript:void(0)">About Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="javascript:void(0)">Blog</NavLink>
            </NavItem>
          </Nav>
          <div className="copyright">
            <a
                href="javascript:void(0)"
                rel="noopener noreferrer"
                target="_blank"
            >
              Banque Populaire
            </a>{" "}
            © {new Date().getFullYear()}
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
