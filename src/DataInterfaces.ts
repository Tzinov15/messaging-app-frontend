import { AvatarProps } from "./AvatarGenerator";
export interface IClientUser {
  username: string;
  avatar: AvatarProps;
}

// Shape of the data that comes in to a client from the Server
// See IOutgoingMessageData on the Server
export interface IIncomingMessageData {
  author: string;
  recipient: string;
  msg: string;
  timestamp: string;
  action: "USER_MESSAGE";
  avatarOptions: AvatarProps;
}

// Shape of the data that comes in to a client from the Server
// See IOutgoingMessageData on the Server
export interface IIncomingMessageData {
  author: string;
  recipient: string;
  msg: string;
  timestamp: string;
  action: "USER_MESSAGE";
  avatarOptions: AvatarProps;
}

export interface IIncomingNewClientData {
  action: "CLIENT_NEW";
  messages: IIncomingMessageData[];
  users: IClientUser[];
}

export interface IIncomingConnectedClientData {
  action: "CLIENT_CONNECT" | "CLIENT_DISCONNECT";
  users: IClientUser[];
  updatedClient: string;
}

export interface IIncomingPongMessage {
  action: "PONG";
}
