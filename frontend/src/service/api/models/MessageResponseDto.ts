/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MessageResponseDto = {
    /**
     * Message ID
     */
    id: string;
    /**
     * Room ID
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
    /**
     * Author name
     */
    authorName: string;
    /**
     * Author profile URL
     */
    authorProfileUrl: string;
};

