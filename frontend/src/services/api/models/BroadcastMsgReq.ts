/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BroadcastMsgReq = {
    roomId: string;
    /**
     * Message ID
     */
    id: string;
    /**
     * Message content
     */
    content: string;
    /**
     * Media URL
     */
    mediaUrl?: string;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Author user ID
     */
    authorId: number;
};

