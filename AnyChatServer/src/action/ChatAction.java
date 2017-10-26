package action;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.grain.mariadb.MybatisManager;

import config.ChatConfig;
import dao.dao.base.ChatMapper;
import dao.dao.ext.ChatMapperExt;
import dao.model.base.Chat;
import dao.model.base.ChatCriteria;
import dao.model.ext.ChatCriteriaExt;
import protobuf.ws.LoginChatProto.ChatMessageData;
import tool.StringUtil;
import tool.TimeUtils;
import util.IdUtil;

public class ChatAction {
	public static List<Chat> getChatList(int toType, String toTypeId, int chatType, Date chatCreateTime) {
		SqlSession sqlSession = null;
		List<Chat> chatList = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatMapper chatMapper = sqlSession.getMapper(ChatMapper.class);
			ChatCriteria chatCriteria = new ChatCriteria();
			ChatCriteria.Criteria criteria = chatCriteria.createCriteria();
			if (toType == ChatConfig.TO_TYPE_USER || toType == ChatConfig.TO_TYPE_GROUP) {
				criteria.andToTypeEqualTo((byte) toType);
			}
			if (!StringUtil.stringIsNull(toTypeId)) {
				criteria.andToTypeIdEqualTo(toTypeId);
			}
			if (chatType == ChatConfig.CHAT_TYPE_SEND || chatType == ChatConfig.CHAT_TYPE_RECEIVE) {
				criteria.andChatTypeEqualTo((byte) chatType);
			}
			if (chatCreateTime != null) {
				criteria.andChatCreateTimeGreaterThan(chatCreateTime);
			}
			criteria.andChatStateEqualTo((byte) ChatConfig.CHAT_STATE_EXIST);
			chatCriteria.setOrderByClause("chat_create_time asc");
			chatList = chatMapper.selectByExample(chatCriteria);
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("获取聊天异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return chatList;
	}

	public static long getUserChatNum(String toTypeId, String fromUserId, String chatCreateTime) {
		if (StringUtil.stringIsNull(toTypeId) || StringUtil.stringIsNull(fromUserId)) {
			return 0;
		}
		Date date = null;
		if (!StringUtil.stringIsNull(chatCreateTime)) {
			date = TimeUtils.stringToDateDay(chatCreateTime);
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatMapperExt chatMapperExt = sqlSession.getMapper(ChatMapperExt.class);
			ChatCriteriaExt chatCriteria = new ChatCriteriaExt();

			chatCriteria.setToType((byte) ChatConfig.TO_TYPE_USER);

			chatCriteria.setToTypeId(toTypeId);
			chatCriteria.setFromUserId(fromUserId);
			if (date != null) {
				chatCriteria.setChatCreateTime(date);
			}
			chatCriteria.setChatState((byte) ChatConfig.CHAT_STATE_EXIST);
			long result = chatMapperExt.countByExample(chatCriteria);
			return result;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("获取聊天异常", e);
			return 0;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static List<Chat> getUserChatList(String toTypeId, String fromUserId, int start, int pageSize) {
		if (StringUtil.stringIsNull(toTypeId) || StringUtil.stringIsNull(fromUserId)) {
			return null;
		}
		List<Chat> chatList = null;
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatMapperExt chatMapperExt = sqlSession.getMapper(ChatMapperExt.class);
			ChatCriteriaExt chatCriteria = new ChatCriteriaExt();

			chatCriteria.setToType((byte) ChatConfig.TO_TYPE_USER);

			chatCriteria.setToTypeId(toTypeId);
			chatCriteria.setFromUserId(fromUserId);
			chatCriteria.setLimitStart(start);
			chatCriteria.setPageSize(pageSize);
			chatCriteria.setChatState((byte) ChatConfig.CHAT_STATE_EXIST);
			chatList = chatMapperExt.selectByExample(chatCriteria);
			return chatList;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("获取聊天异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static long getGroupChatNum(String toTypeId, String chatCreateTime) {
		if (StringUtil.stringIsNull(toTypeId)) {
			return 0;
		}
		Date date = null;
		if (!StringUtil.stringIsNull(chatCreateTime)) {
			date = TimeUtils.stringToDateDay(chatCreateTime);
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatMapper chatMapper = sqlSession.getMapper(ChatMapper.class);
			ChatCriteria chatCriteria = new ChatCriteria();
			ChatCriteria.Criteria criteria = chatCriteria.createCriteria();
			criteria.andToTypeEqualTo((byte) ChatConfig.TO_TYPE_GROUP);

			criteria.andToTypeIdEqualTo(toTypeId);
			if (date != null) {
				criteria.andChatCreateTimeLessThan(date);
			}
			criteria.andChatStateEqualTo((byte) ChatConfig.CHAT_STATE_EXIST);
			chatCriteria.setOrderByClause("chat_create_time asc");
			long result = chatMapper.countByExample(chatCriteria);
			return result;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("获取聊天异常", e);
			return 0;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static List<Chat> getGroupChatList(String toTypeId, int start, int pageSize) {
		if (StringUtil.stringIsNull(toTypeId)) {
			return null;
		}
		List<Chat> chatList = null;
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatMapper chatMapper = sqlSession.getMapper(ChatMapper.class);
			ChatCriteria chatCriteria = new ChatCriteria();
			ChatCriteria.Criteria criteria = chatCriteria.createCriteria();
			criteria.andToTypeEqualTo((byte) ChatConfig.TO_TYPE_GROUP);

			criteria.andToTypeIdEqualTo(toTypeId);

			criteria.andChatStateEqualTo((byte) ChatConfig.CHAT_STATE_EXIST);
			chatCriteria.setLimitStart(start);
			chatCriteria.setPageSize(pageSize);
			chatCriteria.setOrderByClause("chat_create_time asc");

			chatList = chatMapper.selectByExample(chatCriteria);
			return chatList;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("获取聊天异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static Chat createChat(String chatContent, int toType, String toTypeId, String fromUserId) {
		if (StringUtil.stringIsNull(chatContent) || StringUtil.stringIsNull(toTypeId) || StringUtil.stringIsNull(fromUserId)) {
			return null;
		}
		if (toType != ChatConfig.TO_TYPE_USER && toType != ChatConfig.TO_TYPE_GROUP) {
			return null;
		}
		Chat chat = new Chat();
		Date date = new Date();
		chat.setChatId(IdUtil.getUuid());
		chat.setChatCreateTime(date);
		chat.setChatContent(chatContent);
		chat.setFromUserId(fromUserId);
		chat.setToType((byte) toType);
		chat.setToTypeId(toTypeId);
		chat.setChatState((byte) ChatConfig.CHAT_STATE_EXIST);
		chat.setChatType((byte) ChatConfig.CHAT_TYPE_SEND);

		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatMapper chatMapper = sqlSession.getMapper(ChatMapper.class);
			int result = chatMapper.insert(chat);
			if (result == 0) {
				MybatisManager.log.warn("创建聊天内容失败");
				return null;
			}
			sqlSession.commit();
			return chat;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("创建聊天内容异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static Chat getChatById(String chatId) {
		if (StringUtil.stringIsNull(chatId)) {
			return null;
		}
		SqlSession sqlSession = null;
		Chat chat;
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatMapper chatMapper = sqlSession.getMapper(ChatMapper.class);
			chat = chatMapper.selectByPrimaryKey(chatId);
			if (chat == null) {
				MybatisManager.log.warn("通过chatId:" + chatId + "获取聊天内容为空");
			}
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("获取聊天内容异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return chat;
	}

	public static boolean updateChat(List<String> chatIdList) {
		if (chatIdList == null || chatIdList.size() == 0) {
			return false;
		}
		SqlSession sqlSession = null;
		Chat chat = new Chat();
		chat.setChatType((byte) ChatConfig.CHAT_TYPE_RECEIVE);
		try {
			sqlSession = MybatisManager.getSqlSession();
			ChatMapper chatMapper = sqlSession.getMapper(ChatMapper.class);
			ChatCriteria chatCriteria = new ChatCriteria();
			ChatCriteria.Criteria criteria = chatCriteria.createCriteria();
			criteria.andChatIdIn(chatIdList);
			int result = chatMapper.updateByExampleSelective(chat, chatCriteria);
			if (result == 0) {
				MybatisManager.log.warn("修改用户聊天内容失败");
				return false;
			}
			if (result != chatIdList.size()) {
				MybatisManager.log.warn("修改用户聊天内容失败,提交" + chatIdList.size() + "条，修改" + result + "条");
			}
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改用户聊天内容异常", e);
			return false;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return true;
	}

	public static ChatMessageData.Builder getChatMessageDataBuilder(Chat chat) {
		ChatMessageData.Builder chatMessageDataBuilder = ChatMessageData.newBuilder();
		chatMessageDataBuilder.setChatId(chat.getChatId());
		chatMessageDataBuilder.setChatContent(chat.getChatContent());
		chatMessageDataBuilder.setChatCreateTime(TimeUtils.dateToString(chat.getChatCreateTime()));
		chatMessageDataBuilder.setUserId(chat.getFromUserId());
		return chatMessageDataBuilder;
	}
}
