import './MyVideos.css';
import {Fragment} from "react";
import VideoPlayer from "../../components/VideoPlayer.jsx";
import Header from "../../components/Header/Header.jsx";

const receiver = '0x2819Db886a1C12C74Edf3514F831dfA00bFc101F';
const flowRate = "5787037037037";

function MyVideos() {

    function render() {
        return (
            <Fragment>
                {_showHeader()}
                {_renderVideoViewArea()}
            </Fragment>
        )
    }

    function _showHeader() {
        return (
            <Header account={localStorage.getItem('account')}  balance={'0.01'}/>
        )
    }

    function _renderVideoViewArea() {
        return (
            <VideoPlayer
                receiver={receiver}
                flowRate={flowRate}
                onFlowCreated={(flow) => {
                    console.log(flow)
                }}
            />
        )
    }


    return render();
}

export default MyVideos;