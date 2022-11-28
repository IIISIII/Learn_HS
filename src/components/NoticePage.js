import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getNoticeData } from "./Crawl";
import Paginations from './Paginations'
import Loading from "./Loading";
import NoticeTable from "./NoticeTable";

const NoticePage = ({ sessionKey }) => {
    const [respond, setRespond] = useState();
    const [loading, setLoading] = useState(true);
    const [dataArr, setDataArr] = useState(null)
    const timeoutId = useRef();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const offset = (page - 1) * 10;


    const getData = () => {
        if(!loading)
            return;
    
        getNoticeData({ key: sessionKey })
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
        respond && setDataArr(load_table(respond));
    }, [respond]);

    useEffect(() => {
        if(dataArr !== undefined && dataArr !== null)
            localStorage.setItem(`${sessionKey}_notice`, JSON.stringify(dataArr, null, 2));
        else {
            const savedData = localStorage.getItem(`${sessionKey}_notice`);
            if(savedData !== null)
                setDataArr(JSON.parse(savedData));
        }
    }, [dataArr]);

    function load_table({ data }) {
        const notiList = data.map(item => {
            const title = item.title;
            return item.notification.map(i => {
                const noti = { title };
                noti.head = i.title;
                noti.url = i.url;
                noti.date = i.date;
                return noti
            });
        });

        const array = notiList.reduce((acc, cur) => acc.concat(cur));

        return array.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    }

    const print_table =(arr)=>{
        var count = arr.length;
        return (
            <tbody>
                {
                    arr.slice(offset, offset + 10).map((noti, key)=>  {   
                        return (
                            <tr key={ key }>
                                <th style={ { padding: "10px", fontFamily: "Andada_Pro", fontWeight: "lighter"} }>
                                    { count - ((page - 1) * 10) - key}
                                </th>
                                <th style={ { fontFamily: "SUIT-Regular", fontWeight: "200", fontSize: "14px" } }>
                                    { noti.title }
                                </th>
                                <th style={ { fontFamily: "SUIT-Regular", fontWeight: "500" } }>
                                    <a style={ { textDecorationLine: "none" } } href={ noti.url }>{ noti.head }</a>
                                </th>
                                <th style={ { fontFamily: "Andada_Pro", fontSize: "14px", fontWeight: "lighter" } }>
                                    { noti.date }
                                </th>
                            </tr>
                        )
                    })
                }
            </tbody>
        );
    };
         

    return (
        <div className="contentBody">
            { 
                !dataArr ? <Loading/> :
                <>
                    <h1 style={{marginLeft:"18%",fontFamily:"NanumSquareNeo-Variable"}}>공지사항</h1>
                    <div style={{marginLeft:"15%", marginRight:"15%"}}>
                       <NoticeTable print_table = {print_table} dataArr = {dataArr}/>
                    </div>
                    <Paginations total={dataArr.length} limit={10} page={page} setPage={setPage}/>
                </>
            }
        </div>
    );
}
export default NoticePage;