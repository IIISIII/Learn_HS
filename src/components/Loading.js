import {Loader, Oval} from "react-loader-spinner"
const Loading = () => {
    return (
            <Oval
                color="#3d66ba"
                height={50}
                width={50}
                timeout={3000}
            />

    );
}

export default Loading;