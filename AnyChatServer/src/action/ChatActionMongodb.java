package action;

import java.util.Date;
import java.util.List;

import org.bson.conversions.Bson;
import org.grain.mongo.MongodbManager;

import com.mongodb.client.model.Filters;

import config.ChatConfig;
import data.ChatConfigMongodb;
import data.ChatObj;
import protobuf.ws.LoginChatProto.ChatMessageData;
import tool.StringUtil;
import tool.TimeUtils;
import util.IdUtil;

public class ChatActionMongodb {
	public static void createChatUserToUserCollection(String key1, String key2) {
		boolean result = MongodbManager.createCollection(getUserToUserCollectionName(key1, key2));
	}

	public static String getUserToUserCollectionName(String key1, String key2) {
		if (key1.hashCode() > key2.hashCode()) {
			String temp = key1;
			key1 = key2;
			key2 = temp;
		}
		String collectionName = key1 + "_" + key2;
		return collectionName;
	}

	public static void createChatGroupCollection(String chatGroupId) {
		boolean result = MongodbManager.createCollection(chatGroupId);
	}

	public static ChatObj createChat(String chatContent, int toType, String toTypeId, String fromUserId) {
		if (StringUtil.stringIsNull(chatContent) || StringUtil.stringIsNull(toTypeId) || StringUtil.stringIsNull(fromUserId)) {
			return null;
		}
		if (toType != ChatConfigMongodb.TO_TYPE_USER && toType != ChatConfigMongodb.TO_TYPE_GROUP) {
			return null;
		}
		ChatObj chatObj = new ChatObj();
		Date date = new Date();
		chatObj.setChatId(IdUtil.getUuid());
		long time = ((int) (date.getTime() / 1000)) * 1000L;
		chatObj.setChatCreateTime(String.valueOf(time));
		chatObj.setChatContent(chatContent);
		chatObj.setFromUserId(fromUserId);
		chatObj.setToType(toType);
		chatObj.setToTypeId(toTypeId);
		chatObj.setChatState(ChatConfig.CHAT_STATE_EXIST);
		chatObj.setChatType(ChatConfig.CHAT_TYPE_SEND);
		boolean result = false;
		if (toType == ChatConfigMongodb.TO_TYPE_USER) {
			result = MongodbManager.insertOne(getUserToUserCollectionName(fromUserId, toTypeId), chatObj);
		} else {
			result = MongodbManager.insertOne(toTypeId, chatObj);
		}
		if (result) {
			return chatObj;
		} else {
			return null;
		}

	}

	public static ChatMessageData.Builder getChatMessageDataBuilder(ChatObj chatObj) {
		ChatMessageData.Builder chatMessageDataBuilder = ChatMessageData.newBuilder();
		chatMessageDataBuilder.setChatId(chatObj.getChatId());
		chatMessageDataBuilder.setChatContent(chatObj.getChatContent());
		chatMessageDataBuilder.setChatCreateTime(TimeUtils.dateToString(new Date(Long.valueOf(chatObj.getChatCreateTime()))));
		chatMessageDataBuilder.setUserId(chatObj.getFromUserId());
		return chatMessageDataBuilder;
	}

	public static List<ChatObj> getChatList(String fromUserId, String toTypeId, int chatType) {
		Bson filter = Filters.and(Filters.eq(ChatObj.FROM_USER_ID, fromUserId), Filters.eq(ChatObj.CHAT_TYPE, chatType));
		List<ChatObj> list = MongodbManager.find(getUserToUserCollectionName(fromUserId, toTypeId), filter, ChatObj.class, 0, 0);
		return list;
	}

	public static List<ChatObj> getChatList(String toTypeId, String chatCreateTime) {
		Bson filter = Filters.gt(ChatObj.CHAT_CREATE_TIME, chatCreateTime);
		List<ChatObj> list = MongodbManager.find(toTypeId, filter, ChatObj.class, 0, 0);
		return list;
	}

	public static ChatObj getChatById(String chatId, String chatGroupId) {
		if (StringUtil.stringIsNull(chatId) || StringUtil.stringIsNull(chatGroupId)) {
			return null;
		}
		Bson filter = Filters.eq(ChatObj.CHAT_ID, chatId);
		List<ChatObj> list = MongodbManager.find(chatGroupId, filter, ChatObj.class, 0, 0);
		if (list != null && list.size() != 0) {
			return list.get(0);
		} else {
			return null;
		}
	}

	public static ChatObj getChatById(String chatId, String key1, String key2) {
		if (StringUtil.stringIsNull(chatId) || StringUtil.stringIsNull(key1) || StringUtil.stringIsNull(key2)) {
			return null;
		}
		Bson filter = Filters.eq(ChatObj.CHAT_ID, chatId);
		List<ChatObj> list = MongodbManager.find(getUserToUserCollectionName(key1, key2), filter, ChatObj.class, 0, 0);
		if (list != null && list.size() != 0) {
			return list.get(0);
		} else {
			return null;
		}
	}

	public static boolean updateChat(List<String> chatIdList, String key1, String key2) {
		if (chatIdList == null || chatIdList.size() == 0) {
			return false;
		}
		String collectionName = getUserToUserCollectionName(key1, key2);
		for (int i = 0; i < chatIdList.size(); i++) {
			String chatId = chatIdList.get(i);
			ChatObj chat = getChatById(chatId, key1, key2);
			if (chat == null) {
				MongodbManager.log.warn("获取聊天记录失败，key1：" + key1 + ",key2:" + key2 + ",name：" + getUserToUserCollectionName(key1, key2));
			}
			chat.setChatType(ChatConfig.CHAT_TYPE_RECEIVE);
			boolean result = MongodbManager.updateById(collectionName, chat);
			if (!result) {
				MongodbManager.log.warn("修改聊天为收到失败，chatid为：" + chatId);
			}
		}
		return true;
	}

	public static long getUserChatNum(String toTypeId, String fromUserId, String chatCreateTime) {
		if (StringUtil.stringIsNull(toTypeId) || StringUtil.stringIsNull(fromUserId)) {
			return 0;
		}
		Date date = null;
		if (!StringUtil.stringIsNull(chatCreateTime)) {
			date = TimeUtils.stringToDateDay(chatCreateTime);
		}
		Bson filter = null;
		if (!StringUtil.stringIsNull(chatCreateTime)) {
			filter = Filters.lt(ChatObj.CHAT_CREATE_TIME, String.valueOf(date.getTime()));
		}
		long count = MongodbManager.count(getUserToUserCollectionName(toTypeId, fromUserId), filter);
		return count;
	}

	public static List<ChatObj> getUserChatList(String toTypeId, String fromUserId, int start, int pageSize) {
		if (StringUtil.stringIsNull(toTypeId) || StringUtil.stringIsNull(fromUserId)) {
			return null;
		}
		return MongodbManager.find(getUserToUserCollectionName(toTypeId, fromUserId), null, ChatObj.class, start, pageSize);
	}

	public static long getGroupChatNum(String toTypeId, String chatCreateTime) {
		if (StringUtil.stringIsNull(toTypeId)) {
			return 0;
		}
		Date date = null;
		if (!StringUtil.stringIsNull(chatCreateTime)) {
			date = TimeUtils.stringToDateDay(chatCreateTime);
		}
		Bson filter = null;
		if (!StringUtil.stringIsNull(chatCreateTime)) {
			filter = Filters.lt(ChatObj.CHAT_CREATE_TIME, String.valueOf(date.getTime()));
		}
		long count = MongodbManager.count(toTypeId, filter);
		return count;
	}

	public static List<ChatObj> getGroupChatList(String toTypeId, int start, int pageSize) {
		if (StringUtil.stringIsNull(toTypeId)) {
			return null;
		}
		return MongodbManager.find(toTypeId, null, ChatObj.class, start, pageSize);
	}
}
