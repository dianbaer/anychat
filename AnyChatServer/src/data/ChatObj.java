package data;

import org.grain.mongo.MongoObj;

public class ChatObj extends MongoObj {
	public static String CHAT_ID = "chatId";
	public static String CHAT_CONTENT = "chatContent";
	public static String FROM_USER_ID = "fromUserId";
	public static String TO_TYPE = "toType";
	public static String TO_TYPE_ID = "toTypeId";
	public static String CHAT_STATE = "chatState";
	public static String CHAT_TYPE = "chatType";
	public static String CHAT_CREATE_TIME = "chatCreateTime";
	private String chatId;
	// 聊天内容
	private String chatContent;
	// 谁发送的
	private String fromUserId;
	// 1：用户，2：组
	private int toType;
	// 接受者id，根据类型不同接受者是用户或者组
	private String toTypeId;
	// 1：存在，2：已删除
	private int chatState;
	// 1：已发送，2：已收到 相对于个人对个人
	private int chatType;
	private String chatCreateTime;

	public String getChatId() {
		return chatId;
	}

	public void setChatId(String chatId) {
		this.chatId = chatId;
	}

	public String getChatContent() {
		return chatContent;
	}

	public void setChatContent(String chatContent) {
		this.chatContent = chatContent;
	}

	public String getFromUserId() {
		return fromUserId;
	}

	public void setFromUserId(String fromUserId) {
		this.fromUserId = fromUserId;
	}

	public int getToType() {
		return toType;
	}

	public void setToType(int toType) {
		this.toType = toType;
	}

	public String getToTypeId() {
		return toTypeId;
	}

	public void setToTypeId(String toTypeId) {
		this.toTypeId = toTypeId;
	}

	public int getChatState() {
		return chatState;
	}

	public void setChatState(int chatState) {
		this.chatState = chatState;
	}

	public int getChatType() {
		return chatType;
	}

	public void setChatType(int chatType) {
		this.chatType = chatType;
	}

	public String getChatCreateTime() {
		return chatCreateTime;
	}

	public void setChatCreateTime(String chatCreateTime) {
		this.chatCreateTime = chatCreateTime;
	}

}
