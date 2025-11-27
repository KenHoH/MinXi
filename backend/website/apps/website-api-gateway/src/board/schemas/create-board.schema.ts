export const createBoardSchema = {
  type: 'object',
  properties: {
    thumbnail: {
      type: 'string',
      format: 'binary',
      description: 'thumbnail image file (required)',
    },
    creator_id: {
      type: 'number',
      description: 'ID of the user ',
      example: 1,
    },
    area_id: {
      type: 'number',
      description: 'ID of the area ',
      example: 1,
    },
    title: {
      type: 'string',
      description: 'Board title',
      example: 'This is board title',
    },
    description: {
      type: 'string',
      description: 'Board description',
      example: 'This is board description',
    },
    visibility: {
      type: 'boolean',
      description: 'Board visibility status',
      example: true,
    },
    contents: {
      type: 'array',
      items: {
        type: 'number',
      },
      description: 'Content ids',
    },
  },
  required: [
    'thumbnail',
    'creator_id',
    'description',
    'title',
    'visibility',
    'contents',
  ],
};
