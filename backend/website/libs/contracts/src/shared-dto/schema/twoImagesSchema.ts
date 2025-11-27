export const twoImagesSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
      description: 'The thumbnail image file.',
    },
    secondImage: {
      type: 'string',
      format: 'binary',
      description: 'The content image file.',
    },
  },
  required: ['image', 'secondImage'],
};
