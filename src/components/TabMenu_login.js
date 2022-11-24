import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../img/로고.png"

function TabMenu_login() {
  return (
    <Navbar bg="light" expand="lg" activeKey="">
      <Container>
        <Navbar.Brand href="/">
        <img src={logo} width="70"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link >홈</Nav.Link>
            <Nav.Link >강좌</Nav.Link>
            <Nav.Link >공지사항</Nav.Link>
            <Nav.Link >과제</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TabMenu_login;

