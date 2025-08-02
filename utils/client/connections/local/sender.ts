import QRCode from "qrcode";
import { setLocalNetworkDataChannel } from "./connection";

export const startLocalNetworkSenderConnection = async (
    peerConnection: RTCPeerConnection,
) => {
    console.info("Starting connection on local network...");

    await setupLocalDataChannel(peerConnection);
    await createLocalOffer(peerConnection);
    setupICE(peerConnection);
};

export const setupLocalDataChannel = async (
    peerConnection: RTCPeerConnection,
) => {
    const dataChannelName = "air-share-local";

    const dataChannel = peerConnection.createDataChannel(dataChannelName);

    dataChannel.onopen = () => {
        console.info(`Data channel '${dataChannelName}' opened!`);
        dataChannel.send("Test");
    };

    dataChannel.onmessage = (event) => {
        console.log("Received from peer:", event.data);
    };

    setLocalNetworkDataChannel(dataChannel);
};

export const createLocalOffer = async (peerConnection: RTCPeerConnection) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

export const setupICE = (peerConnection: RTCPeerConnection) => {
    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) return;

        const offerSDP = btoa(JSON.stringify(peerConnection.localDescription));
        const offerSDPQRData = await QRCode.toDataURL(offerSDP);

        const img = document.createElement("img");
        img.src = offerSDPQRData;
        img.alt = "QR Code";
        img.style.width = "256px";
        img.style.height = "256px";

        document.body.appendChild(img);

        console.log("Offer SDP:", offerSDP);
    };
};

export const completeLocalNetworkConnection = async (
    peerConnection: RTCPeerConnection,
    answerSDP: string,
) => {
    const answerDesc = new RTCSessionDescription(JSON.parse(atob(answerSDP)));
    await peerConnection.setRemoteDescription(answerDesc);
    console.log("Answer SDP applied. Waiting for DataChannel to open...");
};
