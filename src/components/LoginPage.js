import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/로고.png"
import LoginForm from "./LoginForm"
import Card from 'react-bootstrap/Card';
import { loginPromise } from "./Crawl";
import Loading from "./Loading";

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
                    <Card style={ { marginRight: "35%", marginLeft: "35%", marginTop: "10%" } }>
                        <div style={ { marginLeft: "10%", marginRight: "10%" } } onKeyDown={ onKeyPress } >
                            <img style={ { width: "90%", marginLeft: "5%", marginRight: "5%", marginTop: "30px", marginBottom: "30px" } } src={ logo } alt="logo"/>
                            <br/>
                            <LoginForm id={ id } setId={ setId } password={ password } setPassword={ setPassword }/>
                            <br/>
                        </div>
                    </Card>
                )
            }
            { isLoading && <Loading/> }
        </>
        
    );
};

export default LoginPage;