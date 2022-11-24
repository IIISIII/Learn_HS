import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'react-calendar/dist/Calendar.css';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import HomePage from './components/HomePage';
import NoticePage from './components/NoticePage';
import AssignPage from './components/AssignPage';
import Footer from './components/Footer';
import TabMenu from './components/TabMenu';

function App() {
  return (
    <BrowserRouter>
      <TabMenu/>
      <Routes>
        
        <Route path="/" element={ <LoginPage/> }/>
        <Route path="/main" element={ <MainPage/> }/>
        <Route path="/home" element={ <HomePage/> }/>
        <Route path="/notice" element={ <NoticePage/> }/>
        <Route path="/assign" element={ <AssignPage/> }/>
        
      </Routes>
      <Footer/>
    </BrowserRouter>
    
  );
}

export default App;