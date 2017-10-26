package action;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.grain.mariadb.MybatisManager;

import config.ChatGroupUserConfig;
import dao.dao.base.ChatGroupUserMapper;
import dao.model.base.ChatGroupUser;
import dao.model.base.ChatGroupUserCriteria;
import tool.StringUtil;

public class ChatGroupUserAction {
	public static List<ChatGroupUser> getChatGroupUserList(String userId, String chatGroupId) {

		SqlSession sqlSession = null;
		List<ChatGroupUser> chatGroupUserList = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatGroupUserMapper chatGroupUserMapper = sqlSession.getMapper(ChatGroupUserMapper.class);
			ChatGroupUserCriteria chatGroupUserCriteria = new ChatGroupUserCriteria();
			ChatGroupUserCriteria.Criteria criteria = chatGroupUserCriteria.createCriteria();
			if (!StringUtil.stringIsNull(userId)) {
				criteria.andUserIdEqualTo(userId);
			}
			if (!StringUtil.stringIsNull(chatGroupId)) {
				criteria.andChatGroupIdEqualTo(chatGroupId);
			}
			chatGroupUserList = chatGroupUserMapper.selectByExample(chatGroupUserCriteria);
			if (chatGroupUserList == null) {
				MybatisManager.log.warn("通过userId:" + userId + ",chatGroupId:" + chatGroupId + "获取聊天组为空");
			}
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("获取聊天组异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return chatGroupUserList;
	}

	public static ChatGroupUser updateChatGroupUser(String userId, String chatGroupId, Date chatCreateTime) {
		if (StringUtil.stringIsNull(userId) || StringUtil.stringIsNull(chatGroupId)) {
			return null;
		}
		List<ChatGroupUser> chatGroupUserList = getChatGroupUserList(userId, chatGroupId);
		if (chatGroupUserList == null || chatGroupUserList.size() == 0) {
			return null;
		}
		ChatGroupUser chatGroupUser = new ChatGroupUser();
		chatGroupUser.setUserId(userId);
		chatGroupUser.setChatGroupId(chatGroupId);
		chatGroupUser.setChatGroupUserUpdateTime(chatCreateTime);
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatGroupUserMapper chatGroupUserMapper = sqlSession.getMapper(ChatGroupUserMapper.class);
			ChatGroupUserCriteria chatGroupUserCriteria = new ChatGroupUserCriteria();
			ChatGroupUserCriteria.Criteria criteria = chatGroupUserCriteria.createCriteria();
			criteria.andUserIdEqualTo(userId);
			criteria.andChatGroupIdEqualTo(chatGroupId);
			criteria.andChatGroupUserUpdateTimeLessThan(chatCreateTime);
			int result = chatGroupUserMapper.updateByExampleSelective(chatGroupUser, chatGroupUserCriteria);
			if (result != 1) {
				MybatisManager.log.warn("修改聊天组用户失败");
				return null;
			}
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改聊天组用户异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return getChatGroupUserList(userId, chatGroupId).get(0);
	}

	public static ChatGroupUser createChatGroupUser(String userId, String chatGroupId, String chatGroupUserRealName, int chatGroupUserRole) {
		if (StringUtil.stringIsNull(userId) || StringUtil.stringIsNull(chatGroupId)) {
			return null;
		}
		ChatGroupUser chatGroupUser = new ChatGroupUser();
		chatGroupUser.setUserId(userId);
		chatGroupUser.setChatGroupId(chatGroupId);
		if (!StringUtil.stringIsNull(chatGroupUserRealName)) {
			chatGroupUser.setChatGroupUserRealName(chatGroupUserRealName);
		}
		if (chatGroupUserRole == ChatGroupUserConfig.CHAT_GROUP_USER_ROLE_ADMIN) {
			chatGroupUser.setChatGroupUserRole((byte) chatGroupUserRole);
		} else {
			chatGroupUser.setChatGroupUserRole((byte) ChatGroupUserConfig.CHAT_GROUP_USER_ROLE_MEMBER);
		}
		chatGroupUser.setChatGroupUserUpdateTime(new Date());
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatGroupUserMapper chatGroupUserMapper = sqlSession.getMapper(ChatGroupUserMapper.class);
			int result = chatGroupUserMapper.insert(chatGroupUser);
			if (result == 0) {
				MybatisManager.log.warn("创建聊天组用户失败");
				return null;
			}
			sqlSession.commit();
			return chatGroupUser;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("创建聊天组用户异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}
}
