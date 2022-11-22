import {Loader, Oval} from "react-loader-spinner"
const Loading = () => {
    return (
        <div style={{marginLeft:"49%", marginTop:"300px"}}>
            <Oval
                color="#3d66ba"
                height={50}
                width={50}
                timeout={3000}
                
            />
        </div>
    );
}

export default Loading;