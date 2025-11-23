export const twoProfileImagesSchema = {
  type: 'object',
  properties: {
    profileImage: {
      type: 'string',
      format: 'binary',
      description: 'The first profile image file.',
    },
    secondProfileImage: {
      type: 'string',
      format: 'binary',
      description: 'The second profile image file.',
    },
  },
  required: ['profileImage', 'secondProfileImage'],
};
