export interface IAccessRoles {
    id: string;
    title: string;
    date: string;
}


export interface IData {
    content: string;
    resultConversation?: IAccessRoles;
    id?: string;
    title?: string;
    date?: string;
}

export interface IMessage {
    id: string;
    role: string;
    content: string;
    date: string;
}

export interface IDataRequest {
    messages: IMessage[];
    conversation_id?: string; // This denotes the property can be string or undefined
}

export interface IResult  {
    id?: string;
    choices?: {
      messages: {
        id?: string;
        date?: string;
        content: string;
      }[];
    }[];
    history_metadata?: {
      conversation_id: string;
      title: string;
      date: string;
    };
    error?: string;
  };