import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/로고.png"
import LoginForm from "./LoginForm"
import Card from 'react-bootstrap/Card';
import { loginPromise } from "./Crawl";

const LoginPage = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const flag = useRef();
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        if(flag.isLoading === undefined || !flag.isLoading) {
            flag.isLoading = true;
            loginPromise({ uid: id, upw: password })
                .then(result => {
                    if(result.data) {
                        navigate("/main", {
                            state: {
                                uid: id, 
                                upw: password
                            }
                        });
                    }
                    else
                        alert("로그인에 실패하였습니다.");
                })
                .catch(err => {
                    console.error(err);
                    alert("로그인에 실패하였습니다.");
                })
                .finally(() => {
                    flag.isLoading = false;
                });
        }
    }

    const onKeyPress = (e) => {
        if(e.key == "Enter")
            login(e);
    }

    return (
        <Card style={{ marginRight:"35%", marginLeft:"35%", marginTop:"10%"}}>
        <div style={{marginLeft:"auto", marginRight:"auto"}} onKeyDown={ onKeyPress } >
            <img style={{  margin: "30px", marginBottom:"60px"}} src={logo} alt="logo"/>
            <br/>
            <LoginForm id={id} setId={setId} password={password} setPassword={setPassword}/>
            {/* <>id:&nbsp;&nbsp;&nbsp;</>
            <input type="text" name="uid" onChange={ e => setId(e.target.value) }/>  <br/> 
            <>pw: </>
            <input type="password" name="upw" onChange={ e => setPassword(e.target.value) }/>
            <button  style={{margin:10}}onClick={ login }>login</button> */}
            <br/> <br/> 
        </div>
        </Card>
    );
};

export default LoginPage;