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
  const [UserName, setUserName] = useState();
  const location = useLocation();

  useEffect(() => {
    if(UserName !== undefined && UserName !== null)
      sessionStorage.setItem("name", UserName);
    if(location.pathname !== "/") {
      if(UserName === undefined || UserName === null) {
        const s_name = sessionStorage.getItem("name");
        if(s_name !== undefined && s_name !== null)
          setUserName(s_name);
      }
    }
  }, [UserName]);

  return (
    <>
      { location.pathname !== "/" ? <TabMenu name = { UserName }/> : <TabMenu_login/> }
      
      <Routes>
        
        <Route path="/" element={ <LoginPage onLoginSuccess={ setUserName }/> }/>
        <Route path="/main" element={ <MainPage/> }/>
        <Route path="/home" element={ <HomePage/> }/>
        <Route path="/notice" element={ <NoticePage/> }/>
        <Route path="/assign" element={ <AssignPage/> }/>
        
      </Routes>
      <Footer/>
    </>
  );
}

export default App;