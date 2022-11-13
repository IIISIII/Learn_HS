import axios from "axios";
import { useState } from "react";

const url = "/api/crawl";

const getData = (params) => {
    return axios.post(url, params);
}

const CrawlingTest = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState();
    const [loading, setLoaing] = useState(false);

    const login = (e) => {
        e.preventDefault();

        const params = { uid: id, upw: password };

        console.log("wait for server response");

        setLoaing(true);

        getData(params)
            .then(res => JSON.stringify(res, null, 2))
            .then(setData)
            .then(() => setLoaing(false))
            .catch(console.error);
    }

    return (
        <>
            <input type="text" name="uid" onChange={ e => setId(e.target.value) }/>
            <input type="password" name="upw" onChange={ e => setPassword(e.target.value) }/>
            <button onClick={ login }>login</button>
            { loading && <p>Loading...</p> }
            { data && <pre>{ data }</pre> }
        </>
    );
};

export default CrawlingTest;