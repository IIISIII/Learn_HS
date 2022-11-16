import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getCrawlData } from "./Crawl";
import {Nav} from 'react-bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TabMenu from '../TabMenu';
import Cookies from 'universal-cookie';

const MainPage = () => {
    const [data, setData] = useState();
    const [loading, setLoaing] = useState(true);
    const location = useLocation();
    const [uid, setID] = useState(location.state.uid);
    const [upw, setPW] = useState(location.state.upw);




    const getData = () => {
        getCrawlData({ uid, upw })
            .then(setData)
            .then(() => setLoaing(false))
            // .then(() => {
            //     setTimeout(() => {
            //         setLoaing(true);
            //         getData();
            //     }, 1000)
            // })
            .catch(console.error);
    };

    useEffect(() => {
        getData();
    }, []);

    const click =(n) =>{
        const target = document.getElementById(n+"-title");
        console.log(target.textContent);
    }

    const result =(data) => 
        data.data.map((i,n)=>{
            console.log(data);
            return(
                <p key={n} id={n+"-title"} onClick={()=>click(n)}>{i.title}</p>
                )
            });

    return (
        <>
            {<TabMenu/>}
            { loading && <p>Loading...</p> }
            { data && result(data)}
        </>
    );
};

export default MainPage;