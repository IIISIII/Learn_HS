import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function TabMenu() {
  return (
    <Navbar bg="light" expand="lg" activeKey="/home">
      <Container>
        <Navbar.Brand href="#home">Hansung-learn</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">홈</Nav.Link>
            <Nav.Link href="/main">강좌</Nav.Link>
            <Nav.Link href="/notice">공지사항</Nav.Link>
            <Nav.Link href="/assign">과제</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TabMenu;

