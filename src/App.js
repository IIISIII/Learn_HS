import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import {Nav} from 'react-bootstrap';
import HomePage from './components/HomePage';
import NoticePage from './components/NoticePage';
import AssignPage from './components/AssignPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <LoginPage/> }/>
        <Route path="/main" element={ <MainPage/> }/>
        <Route path="/home" element={ <HomePage/> }/>
        <Route path="/notice" element={ <NoticePage/> }/>
        <Route path="/assign" element={ <AssignPage/> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;