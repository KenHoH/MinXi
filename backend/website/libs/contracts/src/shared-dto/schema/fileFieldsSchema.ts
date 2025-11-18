export const fileFieldsSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
      description: 'The primary image file.',
    },
    video: {
      type: 'string',
      format: 'binary',
      description: 'The associated video file.',
    },

  },
  required: ['image', 'video'], 
};
