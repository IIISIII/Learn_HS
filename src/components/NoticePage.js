import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import TabMenu from "../TabMenu";
import { getNoticeData } from "./Crawl";
import Paginations from './Paginations'
import Loading from "./Loading";
import NoticeTable from "./NoticeTable";

const NoticePage = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [uid, setId] = useState(location.state ? location.state.uid : null);
    const [upw, setPw] = useState(location.state ? location.state.upw : null);
    const [dataArr, setDataArr] = useState(null)
    const timeoutId = useRef();
    const [page, setPage] = useState(1);
    const offset = (page - 1) * 10;


    const getData = () => {
        if(loading || uid === null || upw === null)
            return;
        
        setLoading(true);
        getNoticeData({ uid, upw })
            .then(setData)
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
        data && setDataArr(load_table(data));
    }, [data]);

    function load_table(data) {
    const array = new Array();
    data.data.map((i, key) => {
        const title = i.title;
        i.notification.map((j) => {
            var noti = {};
            noti.head = j.title;
            noti.url = j.url;
            noti.date = j.date;
            noti.title = title;
            array.push(noti);
        });
    });
    console.log(array);
    return array.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
}

    const print_table =(arr)=>{
        var count = arr.length;
        return (arr.slice(offset, offset + 10).map((noti, key)=>  {   
        return (
            <tbody key={key}>
                <tr>
                    <th style={ { padding: "10px" } }>
                        { count - ((page - 1) * 10) - key}
                    </th>
                    <th>
                        {noti.title}
                    </th>
                    <th>
                        <a style={{textDecorationLine:"none"}} href={noti.url}>{noti.head}</a>
                    </th>
                    <th>
                        {noti.date}
                    </th>
                </tr>
            </tbody>
        )}
        ))
    }
         

    return (
        <>
            <TabMenu/>
            
            { !data && <Loading style={{textAlign:"center"}}/> }

            <div style={{marginLeft:"15%", marginRight:"15%"}}>
                {data && 
                <NoticeTable
                    print_table = {print_table}
                    dataArr = {dataArr}
                />}
            </div>
            {
                dataArr && <Paginations total={dataArr.length} limit={10} page={page} setPage={setPage}/>
            }
        </>
    );
}
export default NoticePage;