import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getHomworkData } from "./Crawl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import Loading from "./Loading";
import '@fullcalendar/common/main.css';
import { Tooltip } from "bootstrap";

let toolTipInstance = null;

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
    }, [dataArr]);

    const load_table = ({ data }) => {
        const homeworkList = data.map(item => {
            const title = item.title;
            return item.homework.map(i => ({ title, ...i }));
        });

        const array = homeworkList.reduce((acc, cur) => acc.concat(cur));

        return array.sort(function(a,b){return new Date(b.deadline) - new Date(a.deadline)});
    };

    const converToEvents = (arr) => arr.map(hwork => ({ title: hwork.title, date: hwork.deadline.split(" ")[0], url: `javascript:window.open('${hwork.url}', '${hwork.name}', 'top=10, left=10');`, color: hwork.report ? "#367E18" : "#CC3636", extendedProps: { description: hwork.name } }));

    const handleMouseEnter = (info) => {
        const hname = info.event.extendedProps.description;
        if(hname && toolTipInstance == null) {
            toolTipInstance = new Tooltip(info.el, {
                title: info.event.extendedProps.description,
                html: true,
                placement: "top",
                trigger: "hover",
                container: "body"
            });

            toolTipInstance.show();
        }
    };

    const handleMouseLeave = (info) => {
        if(toolTipInstance) {
            toolTipInstance.dispose();
            toolTipInstance = null;
        }
    };

    const getCalendar = (events) => {
        return (
            <div className='mypage-body'>
                <div className='body-wrapper box'>
                    <div className='body-info-container'> 
                        <div className='calendar-wrapper'>
                            <FullCalendar
                                 weekends={true}
                                defaultView="dayGridMonth"
                                plugins={[ dayGridPlugin ]}
                                events={ events }
                                height={'80vh'}
                                eventMouseEnter={ handleMouseEnter }
                                eventMouseLeave={ handleMouseLeave }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="contentBody">
            { !dataArr ?
            <Loading style={ { textAlign:"center" } }/> :
            <div className="autoMargin" style={ { fontFamily:"NanumSquareNeo-Variable", fontSize:"13px" ,marginLeft:"20%",marginRight:"20%",width:"65%", marginBottom: "40px" } }>
                { getCalendar(converToEvents(dataArr)) }
            </div> }
        </div>
    );
}

export default AssignPage;