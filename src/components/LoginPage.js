import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/로고.png"
import LoginForm from "./LoginForm"
import Card from 'react-bootstrap/Card';
import { loginPromise } from "./Crawl";
import Loading from "./Loading";
import Button from 'react-bootstrap/Button';

const LoginPage = ({ onLoginSuccess = f => {} }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [loginFail,setFail] = useState(false);
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        if(!isLoading) {
            setLoading(true);
            loginPromise({ uid: id, upw: password })
                .then(result => {
                    if(result.data !== null) {
                        onLoginSuccess(result.data);
                        sessionStorage.setItem("name", result.data);
                        navigate("/main", {
                            state: {
                                uid: id, 
                                upw: password
                            }
                        });
                    }
                    else
                        setFail(true);
                })
                .catch(err => {
                    console.error(err);
                    setFail(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    const onKeyPress = (e) => {
        if(e.key == "Enter")
            login(e);
    }

    return (
        <>
            {
                 (
                    <>
                    { isLoading && <Loading/> }  
                    <div style={{paddingTop:"100px" ,paddingBottom:"100px", position:"relative"}}>
                        
                    
                    <Card style={{ marginRight:"38%", marginLeft:"38%", height:"550px"}}>
                    <div style={{marginLeft:"auto", marginRight:"auto"}} onKeyDown={ onKeyPress } >
                        {/* <img style={{ width:200, margin: "30px", marginBottom:"60px"}} src={logo} alt="logo"/> */}
                        <br/>
                        
                        <h1 style={{textAlign:"center", paddingBottom:"30px",  marginTop:"30px",fontFamily:"Rubik", fontWeight:"normal", fontSize:"45px", color:"#555555"}}>Login</h1>
    
                        <LoginForm id={id} setId={setId} password={password} setPassword={setPassword}/>
                        <Button style={{fontFamily:"Rubik",marginTop:"20px",height:"45px",width:"300px",backgroundColor:"#9F73AB", border:"none", color:"white"}} onClick={(e)=>login(e)} size="lg">
                    Log in
                        </Button>
                        <br/>
                    
                    </div>
                    {loginFail && 
                    <p style={{fontFamily:"SUIT-Regular",marginLeft:"31px", marginTop:"20px",fontSize:"13px",color:"#FF003E"}}> 로그인에 실패하였습니다.<br/>학생 ID와 비밀번호를 확인해주세요.</p>}
                    </Card>
                </div>
                </>
                )
            }
            
        </>
        
    );
};

export default LoginPage;