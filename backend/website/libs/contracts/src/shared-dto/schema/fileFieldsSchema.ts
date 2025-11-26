export const fileFieldsSchema = {
  type: 'object',
  properties: {
    thumbnail: {
      type: 'string',
      format: 'binary',
      description: 'The Thumbnail file must be image',
    },
    video: {
      type: 'string',
      format: 'binary',
      description: 'The video content',
    },
  },
  required: ['thumbnail', 'video'],
};
