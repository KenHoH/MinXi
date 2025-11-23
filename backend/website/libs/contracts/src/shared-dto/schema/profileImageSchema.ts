export const profileImageSchema = {
  type: 'object',
  properties: {
    profileImage: {
      type: 'string',
      format: 'binary',
      description: 'The profile picture image file.',
    },
  },
  required: ['profileImage'],
};
