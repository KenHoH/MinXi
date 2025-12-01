export const createMetadataSchema = {
  type: 'object',
  properties: {
    metadata: {
      type: 'string',
      format: 'binary',
      description: 'metadata file optional',
    },
    room_id: {
      type: 'string',
      description: 'ID of the room ',
      example: 1,
    },
    author_id: {
      type: 'number',
      description: 'ID of the author ',
      example: 1,
    },
    message: {
      type: 'string',
      description: 'Message description',
      example: 'Hello Testing Metadata',
    },
    author_name: {
      type: 'string',
      description: 'Author name',
      example: 'Hello Testing Metadata',
    },
    author_profile_url: {
      type: 'string',
      description: 'Author profile URL',
      example: 'Hello Testing Metadata',
    },
  },
  required: ['room_id', 'author_id', 'message'],
};
