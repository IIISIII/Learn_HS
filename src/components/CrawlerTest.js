import axios from "axios";
import { useState } from "react";

const url = "https://crawler-hansung.herokuapp.com/crawl";

const getData = (params) => {
    return axios.post(url, params);
}

const CrawlingTest = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState();

    const login = (e) => {
        e.preventDefault();

        console.log("wait for server response");

        
    }

    return (
        <>
            <input type="text" name="uid" onChange={ e => setId(e.target.value) }/>
            <input type="password" name="upw" onChange={ e => setPassword(e.target.value) }/>
            <button onClick={ login }>login</button>
            { data && <pre>{ data }</pre> }
        </>
    );
};

export default CrawlingTest;