import {useState} from 'react';
import { Nav } from 'react-bootstrap';

function TabMenu(){
    return (
        <Nav activeKey="/home">
          <Nav.Item>
            <Nav.Link href="/home">홈</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/main">강좌</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/notice">공지사항</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/assign">과제</Nav.Link>
          </Nav.Item>
      </Nav>
      );
  
}
export default TabMenu;