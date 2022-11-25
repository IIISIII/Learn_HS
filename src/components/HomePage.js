import { useEffect } from "react";
import { useNavigate } from "react-router";

const HomePage = ({ sessionKey }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(sessionKey === undefined || sessionKey === null)
            sessionKey = sessionStorage.getItem("sessionKey");

        if(sessionKey === null)
            navigate("/");
    }, []);

    return (
        <div className="contentBody">
            <h1>홈페이지</h1>
        </div>
    );
};

export default HomePage;