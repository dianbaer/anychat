package action;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.grain.mariadb.MybatisManager;

import dao.dao.base.ChatGroupMapper;
import dao.dao.ext.ChatGroupUserMapperExt;
import dao.model.base.ChatGroup;
import dao.model.base.ChatGroupCriteria;
import dao.model.base.ChatGroupUserCriteria;
import protobuf.ws.LoginChatProto.ChatGroupData;
import tool.StringUtil;
import tool.TimeUtils;
import util.IdUtil;

public class ChatGroupAction {
	public static List<ChatGroup> getChatGroupListByUserId(String userId) {

		SqlSession sqlSession = null;
		List<ChatGroup> chatGroupList = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatGroupUserMapperExt chatGroupUserMapperExt = sqlSession.getMapper(ChatGroupUserMapperExt.class);
			ChatGroupUserCriteria chatGroupUserCriteria = new ChatGroupUserCriteria();
			ChatGroupUserCriteria.Criteria criteria = chatGroupUserCriteria.createCriteria();
			criteria.andUserIdEqualTo(userId);
			chatGroupList = chatGroupUserMapperExt.selectByExample(chatGroupUserCriteria);
			if (chatGroupList == null) {
				MybatisManager.log.warn("通过userId:" + userId + "获取聊天组为空");
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
		return chatGroupList;
	}

	public static List<ChatGroup> getChatGroupList(String userGroupId) {
		SqlSession sqlSession = null;
		List<ChatGroup> chatGroupList = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatGroupMapper chatGroupMapper = sqlSession.getMapper(ChatGroupMapper.class);
			ChatGroupCriteria chatGroupCriteria = new ChatGroupCriteria();
			ChatGroupCriteria.Criteria criteria = chatGroupCriteria.createCriteria();
			if (!StringUtil.stringIsNull(userGroupId)) {
				criteria.andUserGroupIdEqualTo(userGroupId);
			}
			chatGroupList = chatGroupMapper.selectByExample(chatGroupCriteria);
			if (chatGroupList == null) {
				MybatisManager.log.warn("通过userGroupId:" + userGroupId + "获取聊天组为空");
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
		return chatGroupList;
	}

	public static ChatGroup createChatGroup(String chatGroupName, String userGroupId) {
		if (StringUtil.stringIsNull(chatGroupName)) {
			return null;
		}
		ChatGroup chatGroup = new ChatGroup();
		chatGroup.setChatGroupId(IdUtil.getUuid());
		chatGroup.setChatGroupName(chatGroupName);
		chatGroup.setChatGroupCreateTime(new Date());
		if (!StringUtil.stringIsNull(userGroupId)) {
			chatGroup.setUserGroupId(userGroupId);
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatGroupMapper chatGroupMapper = sqlSession.getMapper(ChatGroupMapper.class);
			int result = chatGroupMapper.insert(chatGroup);
			if (result == 0) {
				MybatisManager.log.warn("创建聊天组失败");
				return null;
			}
			sqlSession.commit();
			return chatGroup;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("创建聊天组异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static ChatGroupData.Builder getChatGroupDataBuilder(ChatGroup chatGroup) {
		ChatGroupData.Builder builder = ChatGroupData.newBuilder();
		builder.setChatGroupId(chatGroup.getChatGroupId());
		builder.setChatGroupName(chatGroup.getChatGroupName());
		builder.setChatGroupCreateTime(TimeUtils.dateToString(chatGroup.getChatGroupCreateTime()));
		return builder;
	}
}
