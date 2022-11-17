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


    return (
        <>
            <TabMenu/>
            <h1>과제 페이지</h1>
            { loading && <p>Loading...</p> }
            { data && <pre>{ JSON.stringify(data, null, 2) }</pre> }
        </>
    );
}
export default AssignPage;