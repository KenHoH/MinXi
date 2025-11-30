export const createRoomSchema = {
  type: 'object',
  properties: {
    thumbnail: {
      type: 'string',
      format: 'binary',
      description:
        'Thumbnail image file (required for Group or Communities creation)',
    },
    members: {
      type: 'array',
      items: {
        type: 'number',
      },
      minItems: 2,
      description: 'Array of user IDs to add to the room',
    },
    owner_id: {
      type: 'number',
      description: 'ID of the Group or Community owner',
      example: 1,
    },
    room_type: {
      type: 'string',
      description: 'Type of Room, DIRECT, GROUP, COMMUNITY',
      example: 'DIRECT',
    },
    name_room: {
      type: 'string',
      description: 'Room name or Group/Community name',
      example: 'Room Name',
    },
  },
  required: ['members', 'room_type'],
};
