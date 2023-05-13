import "vidstack/styles/base.css";
// the following styles are optional - remove to go headless.
import "vidstack/styles/ui/buttons.css";
import "vidstack/styles/ui/sliders.css";

import {MediaPlayer, MediaOutlet, useMediaRemote} from "@vidstack/react";
import {Fragment, useEffect, useRef, useState} from 'react';
import {checkIfWalletIsConnected, connectWallet, getBalance, getBalanceToken} from "./utils/wallet";
import {createNewFlow, deleteExistingFlow} from "./utils/superfluid";


//const receiver = '0x358A4567d62b6632169BBAdfA0884aB56b315c24';
const receiver = '0x2819Db886a1C12C74Edf3514F831dfA00bFc101F';
//const flowRate = "100000000";

const flowRate = "5787037037037";

/*
    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
      window.ethereum?.removeListener("chainChanged", refreshChain)
}*/

function App() {
    const [playing, setPlaying] = useState('carga');
    const [flow, setFlow] = useState(null);
    const [startBlockchainCommunication, setStartBlockchainCommunication] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [balance, setBalance] = useState(null);
    const [isConnectingToWallet, setIsConnectingToWallet] = useState(true);
    const [currentAccount, setCurrentAccount] = useState();

    const player = useRef(null);
    const remote = useMediaRemote(player);


    useEffect(() => {
        checkIfWalletIsConnected().then((account) => {
            setCurrentAccount(account);
        }).catch(() => setIsConnectingToWallet(false));
    }, []);

    useEffect(() => {
        setIsConnectingToWallet(false);
        setErrorMessage(null);
        //getBalanceToken('0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f').then((b) => setBalance(b));
    }, [currentAccount]);

    useEffect(() => {
        setLoading(false);
        console.log('llegaaaaaa', flow)
        if(flow) {
            console.log('con flujo en mano')
            remote.play();
        }
    }, [flow]);

    useEffect(() => {
        if(startBlockchainCommunication === 'start') {
            setLoading(true);
            createNewFlow(receiver, flowRate).then((flow) => {
                setFlow(flow);
            }).catch(console.error)
        }
    }, [startBlockchainCommunication]);

    /*player?.addEventListener('play', () => {
        setStartBlockchainCommunication(true);
    });

    player?.addEventListener('pause', () => {
        setLoading(true);
        deleteExistingFlow(receiver).then(() => setLoading(false)).catch(console.error);
    });*/

    useEffect(() =>{
        setLoading(true);
        deleteExistingFlow(receiver).then(() => setLoading(false)).catch(console.error);
    }, []);

    function onPointerUp(e) {
        // - We are providing the "trigger" here.
        // - The media play event will have this pointer event in its chain.
        remote.togglePaused(e);
    }

    function render() {
        if (isLoading) return 'We are communicating with the blockchain.....';

        return (
            <div className="App">
                {/*_renderBalance()*/}
                {_renderErrorMessage()}
                {_renderConnectButton()}
                {_renderVideoPlayer()}
                <button onClick={onPointerUp}>test</button>
            </div>
        );
    }

    function _renderErrorMessage() {
        return (<div>{errorMessage}</div>)
    }

    function _renderConnectButton() {
        if(isConnectingToWallet) {
            return (
                <div>Connecting....</div>
            );
        }

        if(currentAccount) {
            return (
                <div>Connected to metamask</div>
            )
        }

        return (
            <button onClick={_onConnectToWalletHandler}>Connect to your Wallet</button>
        );
    }

    function _renderVideoPlayer() {
        return (
            <Fragment>
                <MediaPlayer
                    ref={player}
                    src="https://customer-wo7syqqap4g20awy.cloudflarestream.com/0d58d9d181fb619cce31def2509af262/manifest/video.m3u8"
                    poster="https://customer-wo7syqqap4g20awy.cloudflarestream.com/0d58d9d181fb619cce31def2509af262/thumbnails/thumbnail.jpg"
                    aspectRatio={16/9}
                    onPlay={() => {
                        setStartBlockchainCommunication('start');
                    }}
                >
                    <MediaOutlet />
                </MediaPlayer>
            </Fragment>
        );
    }

    function _renderBalance() {
        return (
            <div>{JSON.stringify(balance)}</div>
        )
    }

    function _onPlayStopHandler() {
        setPlaying(!playing);
    }

    async function _onConnectToWalletHandler() {
        setIsConnectingToWallet(true);

        try {
            const account = await connectWallet();

            setCurrentAccount(account);
        } catch (e) {
            setIsConnectingToWallet(false);
            setErrorMessage('Error connecting to the wallet');
        }

    }
    return render();
}

export default App;
