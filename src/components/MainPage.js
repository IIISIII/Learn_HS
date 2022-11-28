import { useNavigate } from "react-router";
import 'react-circular-progressbar/dist/styles.css';
import Loading from "./Loading";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { getCrawlData } from "./Crawl";
import React from 'react';
import TabMenu from "../TabMenu";
import Button from '@material-ui/core/Button';
import { MDBTable,MDBBtn, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Card from 'react-bootstrap/Card';
import styled from "styled-components";
import { CircularProgressbar , buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Table from 'react-bootstrap/Table';

const MainPage = ({ sessionKey }) => {
    const [respond, setRespond] = useState();
    const [dataArr, setDataArr] = useState();
    const [loading, setLoading] = useState(false);
    const [title, setTitle ] = useState();
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
        {dataArr && setTitle(dataArr[selectedNum].title)}
    }, [dataArr]);

    useEffect(()=>{
        console.log(title);
    },[title])
   
    const subject2 = (data, selectedNum) =>
        data.map((n, i) => {
            return (

                <th>
                    {
                        i !== selectedNum ?
                            <Button key = {i} id = { i + "-title" } onClick={ () => {setSelectedNum(i); setTitle(n.title) } } variant="contained" style={{border:"1px ", fontFamily:"SUIT-Regular"}}>
                                { n.title }
                            </Button> :
                           <Button style={{color:"#222222", background:"#cccccc", border:"4px #dddddd", fontWeight:"normal",fontFamily:"SUIT-Regular"}}>
                                {n.title}
                            </Button>
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

        return (
            
            checkArr.map(item => {
            const percent = item.curSum / item.maxSum * 100;
            return (
                <>
               <td align= "center" style={{ border: "none",width: "auto", height: "auto", padding: "0px", fontSize:"13px" }}>
                    <h style={{marginBottom:"2px"}}>{ item.week + "주차" } </h>
                    <div style={{ padding:"10px" }}>
                        {(percent).toFixed(0) == 100 ? 
                        <CircularProgressbar value={(percent).toFixed(0)} text={(percent).toFixed(0)}
                            styles={buildStyles({
                                textColor: "#3E6D9C",
                                pathColor: "#3E6D9C",
                                trailColor: "#dddddd",
                                textSize: "20px",
                            })}
                        />
                        :
                         <CircularProgressbar value={(percent).toFixed(0)} text={(percent).toFixed(0)}
                            styles={buildStyles({
                                textColor: "#FD841F",
                                pathColor: "#FD841F",
                                trailColor: "#dddddd",
                                textSize: "20px",
                            })}

                        />
            }
                    </div>
                </td>
                </>
            );
        })
   
        )


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
            <MDBTableBody style={{height:"10px"}}>
                <tr style={{height:"10px"}} >
                    <th align="center" style={{textAlign:"left",paddingLeft:"15px",border:"1px solid #eeeeee",width:"90px",height:"10px", fontWeight:"normal",verticalAlign:"middle"}} >
                        {info.weekends+1+"주차"}
                    </th>
                    <th  style={{paddingLeft:"15px", border:"1px solid #eeeeee",textAlign:"left",width:"150px", verticalAlign:"middle", fontWeight:"normal" }}>
                     {(info.cur/info.max*100).toFixed(0)>100 ? "100": (info.cur/info.max*100).toFixed(0)}% {info.cur>info.max ? "출석완료":"결석"} 
                    </th>
                    <th align="center" style={{ border:"1px solid #eeeeeee", width: "80px" }}>
                        <div  style={{ height:"70px" }}>
                            {(info.cur/info.max*100).toFixed(0)>=100 ? <CircularProgressbar 
                            value={(info.cur/info.max*100).toFixed(0)} text={(info.cur/info.max*100).toFixed(0)>=100 ? "100" : (info.cur/info.max*100).toFixed(0)}/>
                            :    <CircularProgressbar 
                            value={(info.cur/info.max*100).toFixed(0)} text={(info.cur/info.max100).toFixed(0)>=100 ? "100" : (info.cur/info.max*100).toFixed(0)}
                            styles={buildStyles({
                                textColor: "#FD841F",
                                pathColor: "#FD841F",
                                trailColor: "#dddddd",
                                textSize: "20px",
                            })}/>
                            }
                            
                        </div>
                    </th>
                    <th  style={{ border:"1px solid #eeeeee",textAlign:"left",paddingLeft:"15px",paddingTop:"25px", verticalAlign:"center" }} >
                        <MDBBtn style={{textDecorate:"none"}}  color='link' rounded size='sm' href={info.url} target='_blank'>{info.head}</MDBBtn>
                    </th>
                </tr>
            </MDBTableBody>
        )))
    }
       
    return (
        <div className="contentBody" style={{marginLeft:"13%", marginRight:"13%"}}>
            {
                !dataArr ? <Loading/> : 
                
                <div className="autoMargin" style={ { width: "100%" } }>
                    <h1 style={{marginLeft:"2%",fontFamily:"NanumSquareNeo-Variable"}}>
                        강좌
                    </h1>
                    
                    <table style={{ marginTop:"10px",marginBottom:"20px",width:"100%", textAlign: "center" }}>
                        <tbody>
                            <tr>
                                { subject2(dataArr, selectedNum) }
                            </tr>
                        </tbody>
                    </table>
                    <Card style={{padding:"40px"}}>
                    { title && <h1 style={{marginBottom:"15px",fontSize:"31px",fontFamily:"NanumSquareNeo-Variable",fontWeight:"lighter"}}>{title}</h1> }
                    <h style={{fontWeight:"bold",marginLeft:"5px",marginTop:"10px",marginBottom:"5px",fontFamily:"GowunBatang-Regular"}}>
                        수업 진행률
                    </h>
                    <Card style={{fontFamily:"NanumSquareNeo-Variable",height:"120px",marginBottom:"20px"}}>
                    <Table style={{marginTop:"7px",border:"white none", width: "100%"}}>
                        <tbody>
                            <tr>
                                { print_checktable(load_checktable(dataArr, selectedNum)) }
                            </tr>
                        </tbody>
                    </Table>
                    </Card>
                    <h style={{fontWeight:"bold",marginLeft:"5px",marginTop:"20px",marginBottom:"5px",fontFamily:"GowunBatang-Regular",fontSize:"16px"}}>
                        주차별 학습
                    </h>
                    <MDBTable style={{fontFamily: "SUIT-Regular",height:"100px",width:"100%", fontSize:"15px", textAlign: "center", border: "1px solid #dddddd",borderRadius:"10px"}}>
                        <MDBTableHead>
                            <tr>
                                <th style={{textAlign:"left",paddingLeft:"13px",border:"1px solid #dddddd", background:"#eeeeee" }}>학습 주차</th>
                                <th style={{textAlign:"left",paddingLeft:"13px",border:"1px solid #dddddd", background:"#eeeeee" }}>출석여부</th>
                                <th style={{textAlign:"left",paddingLeft:"13px",border:"1px solid #dddddd", background:"#eeeeee" }}>진행률</th>
                                <th style={{textAlign:"left",paddingLeft:"25px",border:"1px solid #dddddd", background:"#eeeeee" }}>동영상 제목</th>
                            </tr> 
                        </MDBTableHead>
                        { print_table(load_table(dataArr, selectedNum)) }
                    </MDBTable>
                    </Card>
                </div>
            }
        </div>
    );
};

export default MainPage;