export const USER_MSG = {
  create: 'user.createUser',
  findAll: 'user.findAllUser',
  findOne: 'user.findOneUser',
  updateProfile: 'user.updateProfile',
  remove: 'user.removeUser',
  updateRestriction: 'user.updateRestriction',
  updateFollow: 'user.updateFollow',
  updateLike: 'user.updateLike',
  updateReport: 'user.updateReport',
  findByName: 'user.findByName',
};

export const AUTH_MSG = {
  login: 'auth.login',
  refresh: 'auth.refresh',
  logout: 'auth.logout',
};

export const LOG_MSG = {
  create: 'log.create',
  findAll: 'log.findAll',
  findOne: 'log.findOne',
  findDate: 'log.findDate',
  remove: 'log.remove',
};

export const CONTENT_MSG = {
  create: 'content.create',
  createFile: 'content.createFile',
  updateView: 'content.view',
  updateLike: 'content.like',
  updatePin: 'content.pin',
  updateComment: 'content.like',
  updateReport: 'content.report',
  setPrivate: 'content.private',
  setPublic: 'content.public',
  findAll: 'content.findAll',
  findOne: 'content.findOne',
  getStats: 'content.getStats',
  getByUser: 'content.getByUser',
  getFile: 'content.getFile',
  getFiles: 'content.getFiles',
  getFollowingContent: 'content.getFollowingContent',
  getFriendContent: 'content.getFriendContent',
  remove: 'content.remove',
};

export const HISTORY_MSG = {
  upsert: 'history.upsert',
  getByUser: 'history.getByUser',
};

export const BOARD_MSG = {
  create: 'board.create',
  setPrivate: 'board.private',
  setPublic: 'board.public',
  addContent: 'board.addContent',
  removeContent: 'board.removeContent',
  updateContent: 'board.updateContent',
  deleteBoard: 'board.delete',
  getBoardByUser: 'board.getByUser',
};

export const CONNECTION_MSG = {
  createFollow: 'connection.createFollow',
  createFriend: 'connection.createFriend',
  checkFollow: 'connection.checkFollow',
  checkFriend: 'connection.checkFriend',
  checkFriendMutual: 'connection.checkFriendMutual',
  getFollowersByCreator: 'connection.getFollowersByCreator',
  getFriendsbyUser: 'connection.getFriendsbyUser',
  getFollowingByUser: 'connection.getFollowingByUser',
  deleteFriend: 'connection.deleteFriend',
  deleteFollow: 'connection.deleteFollow',
};

export const REPORT_MSG = {
  getAllReports: 'report.getAllReports',
  getReportsByUser: 'report.getReportsByUser',
  createReport: 'report.createReport',
  activateReport: 'report.activateReport',
  deactivateReport: 'report.deactivateReport',
  deleteReport: 'report.deleteReport',
};
export const ALGO_MSG = {
  findFYP: 'algo.findFYP',
  searchContent: 'algo.searchContent',
};
export const SSE_MSG = {
  sendBroadcast: 'sse.sendBroadcast',
};
export const SOCIAL_MSG = {
  createRoom: 'social.createRoom',
  getRoomInfo: 'social.getRoomInfo',
  searchRooms: 'social.searchRooms',
  getAllRoomID: 'social.getAllRoomID',

  addUserToRoom: 'social.addUserToRoom',
  removeUserFromRoom: 'social.removeUserFromRoom',
  updateParticipantRole: 'social.updateParticipantRole',
  getTotalParticipants: 'social.getTotalParticipants',
  getParticipantDM: 'social.getParticipantDM',

  sendMessage: 'social.sendMessage',
  getMessage: 'social.getMessage',

  findDM: 'social.findDM',
  getAllDM: 'social.getAllDM',

  getMedia: 'social.getMedia',
};
export const COMMENT_MSG = {
  create: 'comment.create',
  getComment: 'comment.getComment',
  deleteComment: 'comment.deleteComment',
};
export const NOTIF_MSG = {
  create: 'notif.create',
  getNotif: 'notif.getNotif',
  deleteNotif: 'notif.deleteNotif',
};
