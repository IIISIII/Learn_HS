import { useState } from "react";
import TabMenu from "../TabMenu";
import 'react-calendar/dist/Calendar.css';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';

import '@fullcalendar/common/main.css';
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import AssignCal from "./AssignCalendar";

const HomePage = ()=> {
    const [value, onChange] = useState(new Date());
    const selectedView = 'month';  
    
    return (
        <>
            <h1>/홈페이지
            </h1>

        </>
       
    );
}
export default HomePage;