import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from "../img/logo.png"

function TabMenu_login() {
  return (
    <Navbar bg="light" expand="lg" activeKey="/">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} width="70"/>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default TabMenu_login;