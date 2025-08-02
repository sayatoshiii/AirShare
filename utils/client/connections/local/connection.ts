let dataChannel: RTCDataChannel | null = null;

export const setLocalNetworkDataChannel = (channel: RTCDataChannel) => {
    dataChannel = channel;
    console.info("The data channel has been initialised!");
};

export const getLocalNetworkDataChannel = (): RTCDataChannel | null => {
    return dataChannel;
};

export const initialiseConnection = async (): Promise<RTCPeerConnection> =>
    new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

export const sendMessageLocalNetwork = (document?: Document) => {
    const message = (
        document?.getElementById("localMessage") as HTMLInputElement | null
    )?.value;
    if (!message) return;

    if (!dataChannel) return;
    dataChannel.send(message);
};
