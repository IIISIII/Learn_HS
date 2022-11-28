import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router';
import logo from "../img/logo.png"
import { logout } from './Crawl';

function TabMenu({ sessionKey, onLogout })
{
  const navigate = useNavigate();

  const logoutFunc = () => {
    logout({ key: sessionKey })
      .then(() => {
        sessionStorage.removeItem("sessionKey");
        onLogout();
        navigate("/");
      });
  };

  return (
    <Navbar bg="light" expand="lg" activeKey="/home">
      <Container>
        <Navbar.Brand href="/main">
        <img src={logo} width="70"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/main">강좌</Nav.Link>
            <Nav.Link href="/notice">공지사항</Nav.Link>
            <Nav.Link href="/assign">과제</Nav.Link>
          </Nav>
          {
            sessionKey &&
            <Nav className='right' style={ { paddingRight: "0" } }>
              <Nav.Link style={ { textAlign:"right" } }>{ sessionKey }님, 안녕하세요 !</Nav.Link>
              &nbsp;
              <Nav.Link style={ { textAlign:"right", fontSize:"14px" } } onClick={ logoutFunc }>Log out</Nav.Link>
            </Nav>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TabMenu;

