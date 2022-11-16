import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        navigate("/main", {
            state: {
                uid: id, 
                upw: password
            }
        });
    }

    const onKeyPress = (e) => {
        if(e.key == "Enter")
            login(e);
    }

    return (
        <div onKeyDown={ onKeyPress } style={{margin:20}}>
            <>id:&nbsp;&nbsp;&nbsp;</>
            <input type="text" name="uid" onChange={ e => setId(e.target.value) }/>  <br/> 
            <>pw: </>
            <input type="password" name="upw" onChange={ e => setPassword(e.target.value) }/>
            <button  style={{margin:10}}onClick={ login }>login</button>
            <br/> <br/> 
        </div>
    );
};

export default LoginPage;