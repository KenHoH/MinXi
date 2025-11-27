export const createProfileSchema = {
  type: 'object',
  properties: {
    profile: {
      type: 'string',
      format: 'binary',
      description: 'profile image file (required)',
    },
    creator_id: {
      type: 'number',
      description: 'ID of the user ',
      example: 1,
    },
    description: {
      type: 'string',
      description: 'Content description',
      example: 'This is user profile description',
    },
  },
  required: ['profile', 'creator_id', 'description'],
};
