import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getHomworkData } from "./Crawl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import Loading from "./Loading";
import AssignCal from "./AssignCalendar";
import '@fullcalendar/common/main.css';

const AssignPage = ({ sessionKey }) => {
    const [respond, setRespond] = useState();
    const [loading, setLoading] = useState(false);
    const timeoutId = useRef();
    const [dataArr, setDataArr] = useState();
    const navigate = useNavigate();

    const getData = () => {
        if(loading)
            return;

        getHomworkData({ key: sessionKey })
            .then(res => {
                if(res.data.length === 0)
                    navigate("/");
                else {
                    setRespond(res);
                    clearTimeout(timeoutId.current);
                    timeoutId.current = setTimeout(() => {
                        getData();
                    }, 5000);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if(sessionKey === undefined || sessionKey === null)
            sessionKey = sessionStorage.getItem("sessionKey");

        if(sessionKey === null)
            navigate("/");

        if(timeoutId.current === undefined) {
            timeoutId.current = null;
            clearTimeout(timeoutId.current);
            getData();
        }

        return () => {
            clearTimeout(timeoutId.current);
        };
    }, []);

    useEffect(() => {
        if(respond !== undefined && respond !== null) {
            if(respond.data !== undefined && respond.data.length > 0)
                setDataArr(load_table(respond));
        }
    }, [respond]);

    useEffect(() => {
        if(dataArr !== undefined && dataArr !== null)
            localStorage.setItem(`${sessionKey}_assign`, JSON.stringify(dataArr, null, 2));
        else {
            const savedData = localStorage.getItem(`${sessionKey}_assign`);
            if(savedData !== null)
                setDataArr(JSON.parse(savedData));
        }
        console.log(dataArr);
    }, [dataArr]);

    const load_table = ({ data }) => {
        const homeworkList = data.map(item => {
            const title = item.title;
            return item.homework.map(i => ({ title, ...i }));
        });

        const array = homeworkList.reduce((acc, cur) => acc.concat(cur));

        return array.sort(function(a,b){return new Date(b.deadline) - new Date(a.deadline)});
    };

    const converToEvents = (arr) => arr.map(hwork => ({ title: hwork.name, date: hwork.deadline.split(" ")[0], url: hwork.url, color: hwork.report ? "#00FF00" : "#FF0000" }));

    const getCalendar = (events) => {
        return (
            <div className='mypage-body'>
                <div className='body-wrapper box'>
                    <div className='body-info-container'> 
                        <div className='calendar-wrapper'>
                            <FullCalendar
                                defaultView="dayGridMonth"
                                plugins={[ dayGridPlugin ]}
                                events={ events }
                                eventClick={ (arg) => {
                                    console.log(arg.event);
                                } }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="contentBody">
            { !dataArr ? <Loading style={ { textAlign:"center" } }/> : getCalendar(converToEvents(dataArr)) }
            {/* <div style={{ marginLeft:"10%", marginRight:"10%" }}>
                <AssignCal/>
            </div> */}
        </div>
    );
}
export default AssignPage;