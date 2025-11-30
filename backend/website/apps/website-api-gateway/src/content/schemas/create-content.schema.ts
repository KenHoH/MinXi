export const createContentSchema = {
  type: 'object',
  properties: {
    thumbnail: {
      type: 'string',
      format: 'binary',
      description: 'Thumbnail image file (required for content creation)',
    },
    contents: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
      description: 'Content files - images or videos (1-5 files required)',
    },
    creator_id: {
      type: 'number',
      description: 'ID of the content creator',
      example: 1,
    },
    area_id: {
      type: 'number',
      description: 'Area ID (1-3)',
      example: 1,
    },
    post_type: {
      type: 'string',
      description: 'Type of post',
      example: 'image',
    },
    title: {
      type: 'string',
      description: 'Content title',
      example: 'My awesome post',
    },
    description: {
      type: 'string',
      description: 'Content description',
      example: 'This is a great content',
    },
    visibilityPrivate: {
      type: 'boolean',
      description: 'Visibility of the content (private or not)',
      example: false,
    },
    parent_id: {
      type: 'number',
      description: 'Parent content ID (optional)',
      example: null,
    },
    published_at: {
      type: 'string',
      description: 'Publication date in ISO format',
      example: '2024-01-01T00:00:00Z',
    },
  },
  required: [
    'creator_id',
    'area_id',
    'post_type',
    'title',
    'description',
    'published_at',
  ],
};
