import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import NoticePage from './components/NoticePage';
import AssignPage from './components/AssignPage';
import Footer from './components/Footer';
import TabMenu from './components/TabMenu';
import TabMenu_login from './components/TabMenu_login';
import { useEffect, useState } from 'react';
import ErrorPage from './components/ErrorPage';

function App() {
  const [sessionKey, setSessionKey] = useState();
  const location = useLocation();

  const checkLocation = (path) => {
    const cloc = ["/main", "/notice", "/assign"];
    return cloc.indexOf(path) >= 0;
  }

  useEffect(() => {
    if(sessionKey !== undefined && sessionKey !== null)
      sessionStorage.setItem("sessionKey", sessionKey);
    else
      setSessionKey(sessionStorage.getItem("sessionKey"));
  }, [sessionKey]);

  return (
    <>
      { checkLocation(location.pathname) ? <TabMenu sessionKey={ sessionKey } onLogout={ () => setSessionKey(undefined) }/> : <TabMenu_login/> }
      
      <Routes>
        
        <Route path="/" element={ <LoginPage onLoginSuccess={ setSessionKey }/> }/>
        <Route path="/main" element={ <MainPage sessionKey={ sessionKey }/> }/>
        <Route path="/notice" element={ <NoticePage sessionKey={ sessionKey }/> }/>
        <Route path="/assign" element={ <AssignPage sessionKey={ sessionKey }/> }/>
        <Route path="*" element={ <ErrorPage/> }/>
        
      </Routes>

      <Footer/>
    </>
  );
}

export default App;