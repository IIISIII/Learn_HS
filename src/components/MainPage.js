import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { getCrawlData } from "./Crawl";
import React from 'react';
import TabMenu from "../TabMenu";
//import Button from '@material-ui/core/Button';
import styled from "styled-components";
import { CircularProgressbar } from 'react-circular-progressbar';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const MainPage = () => {
   
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [uid, setId] = useState(location.state ? location.state.uid : null);
    const [upw, setPw] = useState(location.state ? location.state.upw : null);
    const [dataArr, setDataArr] = useState()
    const timeoutId = useRef();
    const [selectedNum, setSelectedNum] = useState(0);

    const getData = () => {
        if(loading || uid === null || upw === null)
            return;

        setLoading(true);
        
        getCrawlData({ uid, upw })
            .then(setData)
            .then(() => {
                setLoading(false);
                clearTimeout(timeoutId.current);
                timeoutId.current = setTimeout(() => {
                    getData();
                }, 5000);
            });
    };

    const click =(i) => {
      
        

        const target = document.getElementById(i + "-title");
        console.log(target.textContent);
       
        
    }
    const subject= ({data})=>data.map((n,i)=><button key={i} id={ i + "-title" } onClick={ () => click(i) } variant="contained">{n.title}</button>)
    //const result =({ data }) => data.map((i, n) => <p key={ n } id={ n + "-title" } onClick={ () => click(n) }>{ i.title }</p>);
 


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

    const result =({ data }) => data.map(item => item.attendList.map(items => items.map(itemlist => <p>{ itemlist.lectureTitle }  { itemlist.maxTime } { itemlist.currentTime }</p>)));



    const load_table =({data},num) =>{
        const list = new Array();
        data[num].attendList.map((items,week)=>
            items.map((itemlist)=>{
                    var progress = { week, ...itemlist }; 
                    // progress.head=itemlist.lectureTitle;
                    // progress.title=title;
                    // progress.max=itemlist.maxTime;
                    // progress.cur=itemlist.currentTime;
                    list.push(progress);
                    return progress;
                })
            );

        
        return list;
    }
    
    const print_table = (arr) => {
    
        //sessionStorage.setItem("data",arr);
        return (
            <tbody>
            {
                arr.map((info, index) => {
                    const percent = (info.currentTime / info.maxTime * 100).toFixed(0);
                    return (
                        <tr key={ index }>
                            <th style={{padding:"10px"}}>
                                {info.week+1}
                            </th>

                            <th>
                               { info.currentTime > info.maxTime ? "출석완료" : "결석" } 
                            </th>
                            <th align="center">
                                <div style={{ width: 100, height: 100, padding:"20px" }}>
                                    <CircularProgressbar value={ percent } text={ percent > 100 ? "100" : percent }/>
                                </div>
                            </th>
                            <th>
                                <a href={ info.url }>
                                    { info.lectureTitle }
                                </a>
                            </th>
                        </tr>
                    );
                })
            }
            </tbody>
        );
    };
   


    return (
        <>
            { loading && <p>Loading...</p> }
            <div 
                style={{marginLeft:"auto", marginRight: "auto"}}>
                { data && subject(data) }
            </div>
           
            { data && 
            <table style={{ marginLeft:"100px", marginRight:"auto",width:"1000px",textAlign: "center",margin:"20px", border: "1px solid #dddddd"}}>
                <thead>
                    <tr>
                        <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>주차</th>

                  <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>출석여부</th>
                        <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>진행률</th>
                  <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>동영상 제목</th>
                    </tr> 
                </thead>
                {print_table(load_table(data,selectedNum))}
            </table> }
        </>
    );
};

export default MainPage;