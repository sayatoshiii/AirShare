import QRCode from "qrcode";
import {
    handleLocalNetworkMessage,
    setLocalNetworkDataChannel,
} from "./connection";
import { MessageType, type Message } from "../shared/types";
import { CONFIG } from "../../../config";

export const startLocalNetworkReceiverConnection = async (
    peerConnection: RTCPeerConnection,
    offerSDP: string,
) => {
    console.info("Receiving connection on local network...");

    setupLocalReceiverDataChannel(peerConnection);
    await createLocalAnswer(peerConnection, offerSDP);
    setupLocalReceiverICE(peerConnection);
};

export const setupLocalReceiverDataChannel = (
    peerConnection: RTCPeerConnection,
) => {
    peerConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        const dataChannelName = CONFIG.connection.local.dataChannel.name;

        dataChannel.onopen = () => {
            console.info(`Data channel '${dataChannelName}' opened!`);
            dataChannel.send(
                JSON.stringify({
                    type: MessageType.CONNECTED,
                    message: "Receiver connected!",
                } as Message),
            );
        };

        dataChannel.onmessage = (event) => {
            console.log("Message from host:", event.data);
            handleLocalNetworkMessage(event.data);
        };

        setLocalNetworkDataChannel(dataChannel);
    };
};

export const createLocalAnswer = async (
    peerConnection: RTCPeerConnection,
    offerSDP: string,
) => {
    const offerDescription = new RTCSessionDescription(
        JSON.parse(atob(offerSDP)),
    );
    await peerConnection.setRemoteDescription(offerDescription);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
};

export const setupLocalReceiverICE = (peerConnection: RTCPeerConnection) => {
    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) return;

        const answerSDP = btoa(JSON.stringify(peerConnection.localDescription));
        const answerSDPQRData = await QRCode.toDataURL(answerSDP);

        const img = document.createElement("img");
        img.src = answerSDPQRData;
        img.alt = "QR Code";
        img.style.width = "256px";
        img.style.height = "256px";

        document.body.appendChild(img);
    };
};
