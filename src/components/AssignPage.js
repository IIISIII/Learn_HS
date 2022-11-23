import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import TabMenu from "../TabMenu";
import { getHomworkData } from "./Crawl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import Loading from "./Loading";

import '@fullcalendar/common/main.css';

const AssignPage = ()=> {
    const [respond, setRespond] = useState();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [uid, setId] = useState(location.state ? location.state.uid : null);
    const [upw, setPw] = useState(location.state ? location.state.upw : null);
    const timeoutId = useRef();
    const [dataArr, setDataArr] = useState()

    const getData = () => {
        if(loading || uid === null || upw === null)
            return;

        getHomworkData({ uid, upw })
            .then(setRespond)
            .then(() => {
                setLoading(false);
                clearTimeout(timeoutId.current);
                timeoutId.current = setTimeout(() => {
                    getData();
                }, 5000);
            });
    };

    useEffect(() => {
        if(uid == null || upw == null) {
            setId(sessionStorage.getItem("id"));
            setPw(sessionStorage.getItem("pw"));
        }
        else
            getData();

        return () => {
            if(uid != null && upw != null) {
                sessionStorage.setItem("id", uid);
                sessionStorage.setItem("pw", upw);
            }
            clearTimeout(timeoutId.current);
        };
    }, [uid, upw]);

    useEffect(() => {
        if(respond !== undefined && respond !== null) {
            if(respond.data !== undefined || respond.data.length > 0)
                setDataArr(load_table(respond));
        }
    }, [respond]);

    const load_table = (res) =>{
        const array = new Array();
        res.data.map(i => {
            const title = i.title;
            i.homework.map(k => {
                array.push({ title, ...k });
            });
        })
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
        <>
            <TabMenu/>
            { !respond && <Loading style={ { textAlign:"center" } }/> }
            <div style={{ marginLeft:"10%", marginRight:"10%" }}>
                { dataArr && getCalendar(converToEvents(dataArr)) }
            </div>
        </>
    );
}
export default AssignPage;