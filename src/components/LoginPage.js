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
        <div onKeyDown={ onKeyPress }>
            <input type="text" name="uid" onChange={ e => setId(e.target.value) }/>
            <input type="password" name="upw" onChange={ e => setPassword(e.target.value) }/>
            <input type="submit" onClick={ login } value="로그인"/>
        </div>
    );
};

export default LoginPage;