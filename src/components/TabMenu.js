import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../img/로고.png"

function TabMenu({name}) {

  return (
    <Navbar bg="light" expand="lg" activeKey="">
      <Container>
        <Navbar.Brand href="/main">
        <img src={logo} width="70"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">홈</Nav.Link>
            <Nav.Link href="/main">강좌</Nav.Link>
            <Nav.Link href="/notice">공지사항</Nav.Link>
            <Nav.Link href="/assign">과제</Nav.Link>
            
          </Nav>
          <Nav className='right' style={{paddingRight:"0"}}>
            {name && <Nav.Link style={{textAlign:"right"}}>{name}님, 안녕하세요 !</Nav.Link>}
            &nbsp;
            <Nav.Link href="/" style={{textAlign:"right", fontSize:"14px"}}>Log out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TabMenu;

