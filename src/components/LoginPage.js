import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/로고.png"
import LoginForm from "./LoginForm"
import Card from 'react-bootstrap/Card';
import { loginPromise } from "./Crawl";
import Loading from "./Loading";
import Button from 'react-bootstrap/Button';

const LoginPage = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        if(!isLoading) {
            setLoading(true);
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
                !isLoading && (
                    <div style={{paddingTop:"100px" ,paddingBottom:"100px"}}>
                    <Card style={{ marginRight:"38%", marginLeft:"38%", height:"550px"}}>
                    <div style={{marginLeft:"auto", marginRight:"auto"}} onKeyDown={ onKeyPress } >
                        {/* <img style={{ width:200, margin: "30px", marginBottom:"60px"}} src={logo} alt="logo"/> */}
                        <br/>
                        <h1 style={{textAlign:"center", paddingBottom:"30px",  marginTop:"30px",fontFamily:"Rubik", fontWeight:"normal", fontSize:"45px"}}>Login</h1>
                        <LoginForm id={id} setId={setId} password={password} setPassword={setPassword}/>
                        <Button style={{fontFamily:"Rubik",marginTop:"20px",height:"45px",width:"300px",backgroundColor:"#9F73AB", border:"none", color:"white"}} onClick={(e)=>login(e)} size="lg">
                    Log in
                        </Button>
                        <br/> <br/> 
                    </div>
                    </Card>
                </div>
                )
            }
            { isLoading && <Loading/> }
        </>
        
    );
};

export default LoginPage;