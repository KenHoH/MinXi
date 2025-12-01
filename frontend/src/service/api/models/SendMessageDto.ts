/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendMessageDto = {
    /**
     * Room ID where message will be sent
     */
    roomId: string;
    /**
     * Message content
     */
    content: string;
    /**
     * Type metadata
     */
    type: string;
    /**
     * Author user ID
     */
    authorId: number;
    mediaUrl?: string;
};

