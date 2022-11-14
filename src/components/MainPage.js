import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getCrawlData } from "./Crawl";

const MainPage = () => {
    const [data, setData] = useState();
    const [loading, setLoaing] = useState(true);
    const location = useLocation();

    const uid = location.state.uid;
    const upw = location.state.upw;

    const getData = () => {
        setLoaing(true);
        getCrawlData({ uid, upw })
            .then(res => JSON.stringify(res.data, null, 2))
            .then(setData)
            .then(() => setLoaing(false))
            .then(() => {
                setTimeout(getData, 1000)
            })
            .catch(console.error);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            { loading && <p>Loading...</p> }
            { data && <pre>{ data }</pre>}
        </>
    );
};

export default MainPage;