import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { getCrawlData } from "./Crawl";
import React from 'react';
import TabMenu from "../TabMenu";
import Button from '@material-ui/core/Button';
import styled from "styled-components";
import { CircularProgressbar } from 'react-circular-progressbar';
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
    const theme = {
        blue: {
          default: "#403b3f",
          hover: "#283593"
        },
        pink: {
          default: "#e91e63",
          hover: "#ad1457"
        }
      };
    const Button = styled.button`
        background-color: ${(props) => theme[props.theme].default};
        color: white;
        padding: 5px 15px;
        border-radius: 5px;
        outline: 0;
        text-transform: uppercase;
        margin: 10px 0px;
        cursor: pointer;
        box-shadow: 0px 2px 2px lightgray;
        transition: ease background-color 250ms;
        &:hover {
            background-color: ${(props) => theme[props.theme].hover};
        }
        &:disabled {
            cursor: default;
            opacity: 0.7;
        }`
    ;

    Button.defaultProps = {
        theme: "blue"
    };

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


    const subject2= ({ data }) =>
        data.map((n, i) => {
            return(
                <th>
                    <Button 
                        key={ i } 
                        id={ i + "-title" } 
                        onClick={ () => setSelectedNum(i) } 
                        variant="contained">{ n.title }
                    </Button>
                </th>
            )
        });
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


const load_checktable=({data},num)=>{
    const week = new Array();
    data[num].attendList.map((items,i)=>{
        var weekend=i;
      
        return items.map((itemlist)=>{
            var 
            progress = {}; 
            progress.jucha=weekend;
            progress.realmax=itemlist.maxTime;
            progress.realcur=itemlist.currentTime;
            week.push(progress);
            return progress;
        })})

    console.log(week);
return week;
}

const print_checktable=(arr)=>{
   
    
   return (arr.map((test)=>
   (
    <th>{test.jucha}</th>
   )
   ))
}


const load_table =({data},num) =>{
    const list = new Array();
    data[num].attendList.map((items,i)=>{
        var weekend=i;
        
        return items.map((itemlist)=>{
            var 
            progress = {}; 
            progress.head=itemlist.lectureTitle;
            progress.url=itemlist.url;
            progress.weekends=weekend;
            //progress.title=title;
            progress.max=itemlist.maxTime;
            progress.cur=itemlist.currentTime;
            list.push( progress);
            return progress;
        })})

    
return list;
}
    
const print_table =(arr)=>{

    return (arr.map((info)=>     
    (
        <tbody>
            <tr>
                <th style={{padding:"10px"}}>
                    {info.weekends+1+"주차"}
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
                    <a href={info.url}>{info.head}</a>
                </th>
            </tr>
        </tbody>
    )))
}
   


    return (
        <>
            { loading && <p>Loading...</p> }
            {data&&  <table style={{ textAlign: "center",margin:"20px", border: "1px solid #dddddd", width:"90%"}}>
                <thead>
                <tr>
                    {subject2(data)}
                </tr>
                </thead>
                </table>}

            {data&&  <table style={{ textAlign: "center",margin:"20px", border: "1px solid #dddddd", width:"90%"}}>
                <thead>
                <tr>
                    {print_checktable(load_checktable(data,selectedNum))}
                </tr>
                </thead>
                </table>}

            { data && 
            <table style={{ textAlign: "center",margin:"20px", border: "1px solid #dddddd", width:"90%"}}>
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