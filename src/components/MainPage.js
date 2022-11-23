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

const result =({ data }) => data.map((item)=>item.attendList.map((items)=>items.map((itemlist)=><p>{itemlist.lectureTitle}  {itemlist.maxTime} {itemlist.currentTime}</p>)));



const load_table =({data}) =>{
    const list = new Array();
    data.map((item)=>{
        const title = item.title;
        return item.attendList.map((items)=>
        items.map((itemlist)=>{
            var 
            progress = {}; 
            progress.head=itemlist.lectureTitle;
            progress.title=title;
            progress.max=itemlist.maxTime;
            progress.cur=itemlist.currentTime;
            list.push( progress);
            return progress;
        }))
    })
    
return list;
}
    
const print_table =(arr)=>{
    var count = arr.length;
    //sessionStorage.setItem("data",arr);
    return (arr.map((info)=>     
    (
        <tbody>
            <tr>
                <th style={{padding:"10px"}}>
                    {count--}
                </th>
                <th>
                    {info.title}
                </th>
                <th>
                 {(info.cur/info.max*100).toFixed(0)>100 ? "100": (info.cur/info.max*100).toFixed(0)}% {info.cur>info.max ? "출석완료":"결석"} 
                </th>
                <th align="center">
                
                <div style={{ width: 100, height: 100, padding:"20px" }}>
            <CircularProgressbar value={(info.cur/info.max*100).toFixed(0)} text={(info.cur/info.max*100).toFixed(0)>100 ? "100" : (info.cur/info.max*100).toFixed(0)}/>
                    </div>
                  
                    </th>
                <th>
                    {info.head}
                </th>
            </tr>
        </tbody>
    )))
}
   


    return (
        <>
            <TabMenu/>
            { loading && <p>Loading...</p> }
            { data && subject(data) }
           
            { data && 
            <table style={{ textAlign: "center",margin:"20px", border: "1px solid #dddddd", width:"90%"}}>
                <thead>
                    <tr>
                        <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>번호</th>
                  <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>과목</th>
                  <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>출석여부</th>
                        <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>진행률</th>
                  <th style={{backgroundColor:"#eeeeee", textAlign:"center"}}>동영상 제목</th>
                    </tr> 
                </thead>
                {print_table(load_table(data))}
            </table> }
        </>
    );
};

export default MainPage;