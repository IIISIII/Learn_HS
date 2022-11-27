import { useNavigate } from "react-router";
import 'react-circular-progressbar/dist/styles.css';
import Loading from "./Loading";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { getCrawlData } from "./Crawl";
import React from 'react';
import TabMenu from "../TabMenu";
import Button from '@material-ui/core/Button';
import styled from "styled-components";
import { CircularProgressbar , buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const MainPage = ({ sessionKey }) => {
    const [respond, setRespond] = useState();
    const [dataArr, setDataArr] = useState();
    const [loading, setLoading] = useState(false);
    const timeoutId = useRef();
    const [selectedNum, setSelectedNum] = useState(0);
    const navigate = useNavigate();

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
        background-color: ${ (props) => theme[props.theme].default };
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
            background-color: ${ (props) => theme[props.theme].hover };
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
        if(loading)
            return;

        setLoading(true);

        getCrawlData({ key: sessionKey })
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
        respond && setDataArr(respond.data);
    }, [respond]);

    useEffect(() => {
        if(dataArr !== undefined && dataArr !== null)
            localStorage.setItem(`${sessionKey}_lecture`, JSON.stringify(dataArr, null, 2));
        else {
            const savedData = localStorage.getItem(`${sessionKey}_lecture`);
            if(savedData !== null)
                setDataArr(JSON.parse(savedData));
        }
    }, [dataArr]);

    const subject2= (data)=>
    data.map((n,i)=>{
        return(
        <th>
    <Button 
        key={i} 
        id={ i + "-title" } 
        onClick={ () => 
            setSelectedNum(i) } 
        variant="contained">{n.title}
    </Button></th>)})
        //const result =({ data }) => data.map((i, n) => <p key={ n } id={ n + "-title" } onClick={ () => click(n) }>{ i.title }</p>);
     
    

    const load_checktable = (data, num) => {
        return [[], ...data[num].attendList].reduce((acc, cur, i) => {
            const list = cur.map((itemlist) => {
                const progress = {}; 
                progress.jucha = i;
                progress.realmax = itemlist.maxTime;
                progress.realcur=itemlist.currentTime>=itemlist.maxTime? itemlist.maxTime:itemlist.currentTime;
                return progress;
            });
            return acc.concat(list);
        });
    };
    
    const print_checktable=(arr)=>{
        const tests = new Array();
        var count=0;
        var realmaxcount=0;
        var realcurcount=0;
     
        var what=arr[0].jucha;
        //if(arr[0].jucha==1) console.log("adsf");
       for(let i=0;i<arr.length;i++){
        if((arr[i].jucha-what)==2)
            what++;
    
        realmaxcount+=arr[i].realmax;
        realcurcount+=arr[i].realcur;
      
        console.log(arr[i].jucha +"jucha");
        console.log(what +  "what");
       if(arr[i].jucha!=what){
        realmaxcount-=arr[i].realmax;
        realcurcount-=arr[i].realcur;
        var good={}
            good.percent=(realcurcount/realmaxcount)*100;
            good.wek=arr[i-1].jucha+1;
        tests.push(good);
        console.log("iinput");
        what+=1;
        realmaxcount=arr[i].realmax;
        realcurcount=arr[i].realcur;
       }
       }
       return (tests.map((test)=>
       (
      
        <td   align="center" style={{ border : "1px solid rea",width: 150, height: 100, padding:"20px",Align:"center" }}>{test.wek+"주차"} 
           <div  style={{ width: 100, height: 100, padding:"25px" }}>
                <CircularProgressbar value={(test.percent).toFixed(0)} text={(test.percent).toFixed(0)}  
             styles={buildStyles({
                textColor: "blue",
                pathColor: "blue",
                trailColor: "red",
                textSize: "28px"
              })}/>
                        </div>
        </td>
       )
       ))
    }
    

    const load_table = (data, num) => {
        return [[], ...data[num].attendList].reduce((acc, cur, i) => {
            const list = cur.map(itemlist => {
                const progress = {}; 
                progress.head = itemlist.lectureTitle;
                progress.url = itemlist.url;
                progress.weekends = i;
                progress.max = itemlist.maxTime;
                progress.cur = itemlist.currentTime;
                return progress;
            });
            return acc.concat(list);
        });
    };
        
    const print_table =(arr)=>{

        return (arr.map((info)=>     
        (
            <tbody>
                <tr>
                    <th align="center">
                        {info.weekends+1+"주차"}
                    </th>
        
                    <th align="center" style={{ width: 550, height: 100, padding:"20px",Align:"center" }}>
                     {(info.cur/info.max*100).toFixed(0)>100 ? "100": (info.cur/info.max*100).toFixed(0)}% {info.cur>info.max ? "출석완료":"결석"} 
                    </th>
                    <th align="center" style={{ width: 150, height: 100, padding:"20px",Align:"center" }}>
                    
                    <div  style={{ width: 100, height: 100, padding:"20px" }}>
                <CircularProgressbar value={(info.cur/info.max*100).toFixed(0)} text={(info.cur/info.max*100).toFixed(0)>=100 ? "100" : (info.cur/info.max*100).toFixed(0)}/>
                        </div>
    
                      
                        </th>
                    <th align="center"style={{ width: 750, height: 100, padding:"20px",Align:"center" }} >
                        <a href={info.url}>{info.head}</a>
                    </th>
                </tr>
            </tbody>
        )))
    }
       
    
   
    return (
        <div className="contentBody">
            {
                !dataArr ? <Loading/> : 
                <div className="autoMargin" style={ { width: "90%" } }>
                    <table style={{ textAlign: "center", margin:"20px", border: "1px solid #dddddd", width:"100%"}}>
                        <thead>
                            <tr>
                                { subject2(dataArr) }
                            </tr>
                        </thead>
                    </table>
                    <table style={{ textAlign: "center", margin:"20px", border: "1px solid #dddddd", width:"100%"}}>
                    <thead>
                        <tr>
                            { print_checktable(load_checktable(dataArr, selectedNum)) }
                        </tr>
                    </thead>
                    </table>
                    <table style={{ textAlign: "center", margin:"20px", border: "1px solid #dddddd", width:"100%"}}>
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: "#eeeeee", textAlign: "center" }}>주차</th>
                                <th style={{ backgroundColor: "#eeeeee", textAlign: "center" }}>출석여부</th>
                                <th style={{ backgroundColor: "#eeeeee", textAlign: "center" }}>진행률</th>
                                <th style={{ backgroundColor: "#eeeeee", textAlign: "center" }}>동영상 제목</th>
                            </tr> 
                        </thead>
                        { print_table(load_table(dataArr, selectedNum)) }
                    </table>
                </div>
            }
        </div>
    );
};

export default MainPage;