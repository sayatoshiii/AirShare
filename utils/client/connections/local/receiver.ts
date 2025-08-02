import QRCode from "qrcode";
import { setLocalNetworkDataChannel } from "./connection";

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

        dataChannel.onopen = () => {
            console.info("Responder Data Channel Opened!");
            dataChannel.send("Hello from Responder!");
        };

        dataChannel.onmessage = (event) => {
            console.log("Received from Initiator:", event.data);
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

        console.log("Answer SDP:", answerSDP);
    };
};
