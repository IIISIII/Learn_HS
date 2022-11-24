import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import { useEffect,useState } from 'react';
function App() {
  const [UserName, setUserName] = useState();

  useEffect(() => {
    setUserName("username");
  },[])
  return (
    <BrowserRouter>
      
      <Routes>
        
        <Route path="/" element={ <><TabMenu_login/> <LoginPage/></> }/>
        <Route path="/main" element={<> <TabMenu name = {UserName}/><MainPage/> </>}/>
        <Route path="/home" element={<> <TabMenu name = {UserName}/><HomePage/> </>}/>
        <Route path="/notice" element={<> <TabMenu name = {UserName}/><NoticePage/> </>}/>
        <Route path="/assign" element={<> <TabMenu name = {UserName}/><AssignPage/> </>}/>
        
      </Routes>
      <Footer/>
    </BrowserRouter>
    
  );
}

export default App;