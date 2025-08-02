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
import { handlePaste } from "../../../../utils/client/tools/clipboard";
import { CONFIG } from "../../../../utils/config";
import { Html5Qrcode } from "html5-qrcode";

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

export const setupHostClipboard = (document?: Document) =>
    handlePaste(async () => {
        const clipboard: ClipboardItem[] = await navigator.clipboard.read();
        for (const entry of clipboard) {
            for (const type of entry.types) {
                const blob = await entry.getType(type);
                if (CONFIG.mime.image.includes(type)) {
                    const file = new File([blob], "clipboard-image.png", {
                        type: blob.type,
                    });

                    const html5QrCode = new Html5Qrcode("qr-reader-results");

                    html5QrCode
                        .scanFile(file, true)
                        .then((decodedText) => {
                            let answerSDP = document?.getElementById(
                                "answerSDP",
                            ) as HTMLInputElement | null;

                            if (!answerSDP) return;

                            answerSDP.value = decodedText;
                            window?.completeLocalNetworkConnection?.();
                        })
                        .catch((err) => {
                            console.error(
                                "Clipboard did not contain a valid QR Code...",
                                err,
                            );
                        });
                }
            }
        }
    });

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

export const setupClientClipboard = (document?: Document) =>
    handlePaste(async () => {
        const clipboard: ClipboardItem[] = await navigator.clipboard.read();
        for (const entry of clipboard) {
            for (const type of entry.types) {
                const blob = await entry.getType(type);
                if (CONFIG.mime.image.includes(type)) {
                    const file = new File([blob], "clipboard-image.png", {
                        type: blob.type,
                    });

                    const html5QrCode = new Html5Qrcode("qr-reader-results");

                    html5QrCode
                        .scanFile(file, true)
                        .then((decodedText) => {
                            let offerSDP = document?.getElementById(
                                "offerSDP",
                            ) as HTMLInputElement | null;

                            if (!offerSDP) return;

                            offerSDP.value = decodedText;
                            window?.startLocalNetworkReceiverConnection();
                        })
                        .catch((err) => {
                            console.error(
                                "Clipboard did not contain a valid QR Code...",
                                err,
                            );
                        });
                }
            }
        }
    });
