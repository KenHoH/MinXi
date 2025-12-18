import { get } from 'http';

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
  findOneByName: 'user.findOneByName',
  findOneById: 'user.findOneById',
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
  updateComment: 'content.comment',
  updateReport: 'content.report',
  updateScore: 'content.score',
  setUserContentPrivacy: 'content.userContentPrivacy',
  setPrivate: 'content.private',
  setPublic: 'content.public',
  findAll: 'content.findAll',
  findAllPage: 'content.findAllPage',
  findAllGlobalPage: 'content.findAllGlobalPage',
  findGlobal: 'content.findGlobal',
  findOne: 'content.findOne',
  getStats: 'content.getStats',
  getByUser: 'content.getByUser',
  getByUserAll: 'content.getByUserAll',
  getByUserAllPublic: 'content.getByUserAllPublic',
  getFile: 'content.getFile',
  getFiles: 'content.getFiles',
  getFollowingContent: 'content.getFollowingContent',
  getFriendContent: 'content.getFriendContent',
  getLikedByUser: 'content.getLikedByUser',
  getPinnedByUser: 'content.getPinnedByUser',
  getAncestorPost: 'content.getAncestorPost',
  getChildPost: 'content.getChildPost',
  getFullPost: 'content.getFullPost',
  remove: 'content.remove',
};

export const HISTORY_MSG = {
  upsert: 'history.upsert',
  getByUser: 'history.getByUser',
  getByUserAndContent: 'history.getByUserAndContent',
  deleteByContentId: 'history.deleteByContentId',
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
  getContentIdsByBoardId: 'board.getContentIdsByBoardId',
  getContentByBoardId: 'board.getContentByBoardId',
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

  getFollowingCount: 'connection.getFollowingCount',
  getFollowersInstanceByCreator: 'connection.getFollowersInstanceByCreator',
  getFriendsInstanceByUser: 'connection.getFriendsInstanceByUser',
  getFollowingInstanceByUser: 'connection.getFollowingInstanceByUser',
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
  getAllGroupFromCommunities: 'social.getAllGroupFromCommunities',

  addUserToRoom: 'social.addUserToRoom',
  addGroupToCommunities: 'social.addGroupToCommunities',
  removeGroupFromCommunities: 'social.removeGroupFromCommunities',
  removeUserFromRoom: 'social.removeUserFromRoom',
  updateParticipantRole: 'social.updateParticipantRole',
  getTotalParticipants: 'social.getTotalParticipants',
  getParticipantDM: 'social.getParticipantDM',

  sendMessage: 'social.sendMessage',
  getMessage: 'social.getMessage',

  findDM: 'social.findDM',
  getAllDM: 'social.getAllDM',
  getRoomDMByUserId: 'social.getRoomDMByUserId',
  getRoomGroupJoinedByUserId: 'social.getRoomGroupJoinedByUserId',
  getRoomGroupAll: 'social.getRoomGroupAll',
  getRoomCommunityJoinedByUserId: 'social.getRoomCommunityJoinedByUserId',
  getRoomCommunityAll: 'social.getRoomCommunityAll',
  getInstanceParticipant: 'social.getInstanceParticipant',

  getMedia: 'social.getMedia',
  deleteMessageByRoom: 'social.deleteMessageByRoom',
  deleteMessage: 'social.deleteMessage',
  deleteRoom: 'social.deleteRoom',
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
