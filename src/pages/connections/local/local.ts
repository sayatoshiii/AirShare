import {
    initialiseConnection,
    sendMessageLocalNetwork,
} from "../../../../utils/client/connections/local/connection";
import { startLocalNetworkReceiverConnection } from "../../../../utils/client/connections/local/receiver";
import {
    completeLocalNetworkConnection,
    startLocalNetworkSenderConnection,
} from "../../../../utils/client/connections/local/sender";
import { MessageType } from "../../../../utils/client/connections/shared/types";

declare global {
    interface Window {
        startLocalNetworkSenderConnection: () => void;
        startLocalNetworkReceiverConnection: () => void;
        completeLocalNetworkConnection: () => void;
        sendMessageLocalNetwork: (document?: Document) => void;
    }
}

export const setupHost = async (document?: Document) => {
    const peerConnection = await initialiseConnection();

    window.startLocalNetworkSenderConnection = () => {
        startLocalNetworkSenderConnection(peerConnection);
    };

    window.completeLocalNetworkConnection = () => {
        const answerSDP = (
            document?.getElementById("answerSDP") as HTMLInputElement | null
        )?.value;
        if (!answerSDP) return;

        completeLocalNetworkConnection(peerConnection, answerSDP);
    };

    window.sendMessageLocalNetwork = () => {
        const message = (
            document?.getElementById("localMessage") as HTMLInputElement | null
        )?.value;
        if (!message) return;

        sendMessageLocalNetwork(MessageType.TEXT, message);
    };
};

export const setupClient = async (document?: Document) => {
    const peerConnection = await initialiseConnection();

    window.startLocalNetworkReceiverConnection = () => {
        const offerSDP = (
            document?.getElementById("offerSDP") as HTMLInputElement | null
        )?.value;
        if (!offerSDP) return;

        startLocalNetworkReceiverConnection(peerConnection, offerSDP);
    };

    window.sendMessageLocalNetwork = () => {
        const message = (
            document?.getElementById("localMessage") as HTMLInputElement | null
        )?.value;
        if (!message) return;

        sendMessageLocalNetwork(MessageType.TEXT, message);
    };
};
