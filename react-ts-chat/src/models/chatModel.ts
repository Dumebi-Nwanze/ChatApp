import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export interface ChatModelIF {
  id: string;
  msg: string;
  sentBy: string;
  sentByID: string;
  sentAt: string;
}

export type ChatType = {
  id: string;
  msg: string;
  sentBy: string;
  sentByID: string;
  sentAt: string;
};

export default class ChatModel {
  readonly id: string;
  msg: string;
  sentBy: string;
  sentByID: string;
  sentAt: string;

  constructor({ id, msg, sentBy, sentByID, sentAt }: ChatModelIF) {
    this.id = id;
    this.msg = msg;
    this.sentBy = sentBy;
    this.sentByID = sentByID;
    this.sentAt = sentAt;
  }

  toJson = (): {} => {
    return {
      id: this.id,
      msg: this.msg,
      sentBy: this.sentBy,
      sentByID: this.sentByID,
      sentAt: this.sentAt,
    };
  };
}

export const chatFromSnap = (
  snap: QueryDocumentSnapshot<DocumentData>
): ChatModel => {
  const data = snap.data();
  return new ChatModel({
    id: data["id"],
    msg: data["msg"],
    sentBy: data["sentBy"],
    sentByID: data["sentByID"],
    sentAt: data["sentAt"],
  });
};
