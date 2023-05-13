import './MyVideos.css';
import ReactHlsPlayer from "react-hls-player";
import {Fragment, useRef, useState} from "react";
import {createNewFlow, deleteExistingFlow} from "../../utils/superfluid.js";

const receiver = '0x2819Db886a1C12C74Edf3514F831dfA00bFc101F';
const flowRate = "5787037037037";

function MyVideos() {
    const [flow, setFlow] = useState(null);
    const [isTalkingToBlockchain, setIsTalkingToBlockchain] = useState(false);

    const player = useRef(null);

    function render() {
        return (
            <Fragment>
                {_renderOverlay()}
                {_renderVideoPlayer()}
                <button onClick={_onPlay}>Play</button>
                <button onClick={_onPause}>Stop</button>
            </Fragment>
        )
    }

    function _renderOverlay() {
        if (isTalkingToBlockchain) {
            return <div className="overlay">
                <p>We are communicating with the blockchain.....</p>
            </div>
        }
    }

    function _renderVideoPlayer() {
        return (
            <ReactHlsPlayer
                playerRef={player}
                src="https://customer-wo7syqqap4g20awy.cloudflarestream.com/0d58d9d181fb619cce31def2509af262/manifest/video.m3u8"
                width={200}
                height={200}
            />
        );
    }

    function _onPlay() {
        setIsTalkingToBlockchain(true);
        createNewFlow(receiver, flowRate).then((flow) => {
            setFlow(flow);
            player.current.play();
            setIsTalkingToBlockchain(false);
        }).catch(console.error)
    }

    function _onPause() {
        player.current.pause();
        setIsTalkingToBlockchain(true);
        deleteExistingFlow(receiver).then(() => {
            setFlow(null);
            setIsTalkingToBlockchain(false)
        }).catch(console.error);
    }


    return render();
}

export default MyVideos;