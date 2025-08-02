import { MessageType, type Message } from "../shared/types";

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

export const sendMessageLocalNetwork = (type: MessageType, message: string) => {
    if (!dataChannel) return;
    dataChannel.send(
        JSON.stringify({
            type,
            message,
        } as Message),
    );
};

export const handleLocalNetworkMessage = (serialisedMessage: string) => {
    const message: Message = JSON.parse(serialisedMessage);

    switch (message.type) {
        case MessageType.CONNECTED:
            console.info("Acknowledged peer connection!");
            break;
        case MessageType.TEXT:
            console.info(`Received text '${message?.message}'`);
            break;
    }
};
