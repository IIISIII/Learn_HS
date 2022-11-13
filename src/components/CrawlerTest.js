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
            <div style={{margin:20}}>
                <h>id:&nbsp;&nbsp;&nbsp;</h>
                <input type="text" name="uid" onChange={ e => setId(e.target.value) }/>  <br/> 
                <h>pw: </h>
                <input type="password" name="upw" onChange={ e => setPassword(e.target.value) }/>
                <button  style={{margin:10}}onClick={ login }>login</button>
                <br/> <br/> 
                { loading && <p> &nbsp;Loading...</p> }
                { data && <pre>{ data }</pre> }
            </div>
        </>
    );
};

export default CrawlingTest;