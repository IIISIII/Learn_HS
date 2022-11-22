import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import TabMenu from "../TabMenu";
import { getHomworkData } from "./Crawl";

const AssignPage = ()=> {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [uid, setId] = useState(location.state ? location.state.uid : null);
    const [upw, setPw] = useState(location.state ? location.state.upw : null);
    const timeoutId = useRef();
    const [dataArr, setDataArr] = useState()

    const getData = () => {
        if(loading || uid === null || upw === null)
            return;

        setLoading(true);
        
        getHomworkData({ uid, upw })
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

    const load_table =(data) =>{
        const array = new Array();
        data.data.map((i,key)=>{
            const title = i.title;
            i.homework.map((k)=>     
            {
                var hwork = {};
                hwork.name =  k.name;
                hwork.deadline = k.deadline;
                hwork.url = k.url;
                hwork.report = k.report;
                hwork.title = title;
                array.push(hwork);
            });
        })
        console.log(array);
    return array.sort(function(a,b){return new Date(b.deadline) - new Date(a.deadline)});
    }

    const print_table =(arr)=>{
        var count = arr.length;
        //sessionStorage.setItem("data",arr);
        return (arr.map((hwork,key)=>     
        (
            <tbody>
                <tr>
                    <th style={{padding:"10px"}}>
                        {count--}
                    </th>
                    <th>
                        {hwork.title}
                    </th>
                    <th>
                        <a href={hwork.url}>{hwork.name}</a>
                    </th>
                    <th>
                        {hwork.deadline}
                    </th>
                </tr>
            </tbody>
        )))
    }

    return (
        <>
            <TabMenu/>
            <h1>과제 페이지</h1>
            { loading && <p>Loading...</p> }
            { data && 
            <table style={{ textAlign: "center",margin:"20px", border: "1px solid #dddddd", width:"90%"}}>
                <thead>
                    <tr>
                        <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>번호</th>
                        <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>과목</th>
                        <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>과제</th>
                        <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>기한일</th>
                    </tr> 
                </thead>
                {print_table(load_table(data))}
            </table> } 
            <pre>{ JSON.stringify(data, null, 2) }</pre>
        </>
    );
}
export default AssignPage;