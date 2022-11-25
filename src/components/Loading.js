import { Oval } from "react-loader-spinner"
const Loading = () => {
    return (
        <div style={{position:"absolute", backgroundColor:"rgba(248,249,250,0.5)",zIndex:"10",width:"100%",height:"100%"  }}>
            <div style={ { marginLeft:"48%", marginTop:"270px"} }>
                <Oval
                    color="#3d66ba"
                    height={50}
                    width={50}
                    timeout={3000}
                />
            </div>
        </div>
    );
}

export default Loading;