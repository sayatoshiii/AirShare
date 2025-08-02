export interface Message {
    type: MessageType;
    message: string;
}

export enum MessageType {
    CONNECTED,
    TEXT,
}
