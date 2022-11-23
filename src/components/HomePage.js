import { useState } from "react";
import TabMenu from "../TabMenu";
import 'react-calendar/dist/Calendar.css';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';

import '@fullcalendar/common/main.css';

const HomePage = ()=> {
    const [value, onChange] = useState(new Date());

    return (
        <>
            <TabMenu/>
            { <h1>홈페이지</h1> }
            <div>
                <div className='mypage-body' style={ { width: "50%", height: "50%", margin: "0 auto" } }>
                        <div className='body-wrapper box'>
                            <div className='body-info-container'> 
                            <div className='calendar-wrapper'>
                                    <FullCalendar
                                        defaultView="dayGridMonth"
                                        plugins={[ dayGridPlugin ]}
                                        events={ [{title: "test", date: "2022-11-23", url: "https://dhdl-it.tistory.com/60" }] }
                                        eventClick={ (arg) => {
                                            console.log(arg.event);
                                        } }
                                    />
                            </div>
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
}
export default HomePage;