import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import 'react-calendar/dist/Calendar.css';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import HomePage from './components/HomePage';
import NoticePage from './components/NoticePage';
import AssignPage from './components/AssignPage';
import Footer from './components/Footer';
import TabMenu from './components/TabMenu';
import TabMenu_login from './components/TabMenu_login';
import { useEffect, useState } from 'react';
function App() {
  const [sessionKey, setSessionKey] = useState();
  const location = useLocation();

  useEffect(() => {
    if(sessionKey !== undefined && sessionKey !== null)
      sessionStorage.setItem("sessionKey", sessionKey);
    else
      setSessionKey(sessionStorage.getItem("sessionKey"));
  }, [sessionKey]);

  return (
    <>
      { location.pathname !== "/" ? <TabMenu sessionKey={ sessionKey } onLogout={ () => setSessionKey(undefined) }/> : <TabMenu_login/> }
      
      <Routes>
        
        <Route path="/" element={ <LoginPage onLoginSuccess={ setSessionKey }/> }/>
        <Route path="/home" element={ <HomePage sessionKey={ sessionKey }/> }/>
        <Route path="/main" element={ <MainPage sessionKey={ sessionKey }/> }/>
        <Route path="/notice" element={ <NoticePage sessionKey={ sessionKey }/> }/>
        <Route path="/assign" element={ <AssignPage sessionKey={ sessionKey }/> }/>
        
      </Routes>

      <Footer/>
    </>
  );
}

export default App;