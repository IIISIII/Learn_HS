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
import Table from 'react-bootstrap/Table';

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

    const subject2 = (data, selectedNum) =>
        data.map((n, i) => {
            return (
                <th>
                    {
                        i !== selectedNum ?
                            <Button key = {i} id = { i + "-title" } onClick={ () => setSelectedNum(i) } variant="contained">
                                { n.title }
                            </Button> :
                            <div>
                                {n.title}
                            </div> 
                    }
                </th>
            )
        });

    const load_checktable = (data, num) => {
        return [[], ...data[num].attendList].reduce((acc, cur, i) => {
            const list = cur.map((itemlist) => {
                const progress = {}; 
                progress.jucha = i;
                progress.realmax = itemlist.maxTime;
                progress.realcur = itemlist.currentTime >= itemlist.maxTime ? itemlist.maxTime : itemlist.currentTime;
                return progress;
            });
            return acc.concat(list);
        });
    };
    
    const print_checktable = (arr) => {
        let index = -1;
        let flag = -1;
        const checkArr = [];
        for(let a = 0; a < arr.length; a ++) {
            if(arr[a].jucha != flag) {
                index ++;
                flag = arr[a].jucha;
                checkArr[index] = { week: flag, curSum: 0, maxSum: 0 };
            }
            checkArr[index].curSum += arr[a].realcur;
            checkArr[index].maxSum += arr[a].realmax;
        }

        return checkArr.map(item => {
            const percent = item.curSum / item.maxSum * 100;
            return (
                <td align= "center" style={{ border: "1px solid rea", width: "auto", height: "auto", padding: "10px", Align: "center" }}>
                    { item.week + "주차" } 
                    <div style={{ width: "auto", height: "auto", padding: "25px" }}>
                        <CircularProgressbar value={(percent).toFixed(0)} text={(percent).toFixed(0)}  
                            styles={buildStyles({
                                textColor: "#2A3990",
                                pathColor: "#2A3990",
                                trailColor: "#D23369",
                                textSize: "28px"
                            })}
                        />
                    </div>
                </td>
            );
        });


    }
    

    const load_table = (data, num) => {
        return [[], ...data[num].attendList].reduce((acc, cur, i) => {
            const list = cur.map(itemlist => {
                const progress = {}; 
                progress.head = itemlist.lectureTitle;
                progress.url = itemlist.url;
                progress.weekends = i-1;
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
                <tr style={{height:"10px"}}>
                    <th align="center" style={{verticalAlign:"middle"}} >
                        {info.weekends+1+"주차"}
                    </th>
                    <th align="center" style={{ verticalAlign:"middle", padding:"50px",Align:"center" }}>
                     {(info.cur/info.max*100).toFixed(0)>100 ? "100": (info.cur/info.max*100).toFixed(0)}% {info.cur>info.max ? "출석완료":"결석"} 
                    </th>
                    <th align="center" style={{ width: 150,padding:"20px",Align:"center" }}>
                        <div  style={{   padding:"20px" }}>
                            <CircularProgressbar value={(info.cur/info.max*100).toFixed(0)} text={(info.cur/info.max*100).toFixed(0)>=100 ? "100" : (info.cur/info.max*100).toFixed(0)}/>
                        </div>
                    </th>
                    <th align="center"style={{ verticalAlign:"middle", padding:"20px",Align:"center" }} >
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
                    <table style={{ width:"100%", textAlign: "center" }}>
                        <thead>
                            <tr>
                                { subject2(dataArr, selectedNum) }
                            </tr>
                        </thead>
                    </table>
                    <table style={{ width: "100%", border: "1px solid #dddddd"}}>
                        <thead>
                            <tr>
                                { print_checktable(load_checktable(dataArr, selectedNum)) }
                            </tr>
                        </thead>
                    </table>
                    <Table style={{ width:"100%", fontSize:"15px", textAlign: "center", border: "1px solid #dddddd"}}>
                        <thead>
                            <tr>
                                <th style={{width:"30", backgroundColor: "#eeeeee", textAlign: "center" }}>주차</th>
                                <th style={{ backgroundColor: "#eeeeee", textAlign: "center" }}>출석여부</th>
                                <th style={{ backgroundColor: "#eeeeee", textAlign: "center" }}>진행률</th>
                                <th style={{ backgroundColor: "#eeeeee", textAlign: "center" }}>동영상 제목</th>
                            </tr> 
                        </thead>
                        { print_table(load_table(dataArr, selectedNum)) }
                    </Table>
                </div>
            }
        </div>
    );
};

export default MainPage;