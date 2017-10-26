package data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.LinkedBlockingQueue;

import javax.websocket.Session;

import org.grain.thread.AsyncThreadManager;
import org.grain.thread.ICycle;
import org.grain.threadmsg.ThreadMsgManager;
import org.grain.websokcetlib.WSManager;
import org.grain.websokcetlib.WsPacket;

import action.ChatActionMongodb;
import action.ChatGroupUserAction;
import dao.model.base.ChatGroupUser;
import msg.MsgOpCodeChat;
import protobuf.msg.UserOfflineMsg.UserOffline;
import protobuf.ws.LoginChatProto.GroupMessageS;
import protobuf.ws.LoginChatProto.UserKickS;
import protobuf.ws.LoginChatProto.UserMessageS;
import ws.WsOpCodeChat;

public class OnlineUserMongodb implements ICycle {
	private UserData userData;
	private Session session;
	private String token;
	private boolean isKick = false;
	private boolean isDisConnect = false;
	// 自身在哪个线程，哪个优先级
	private int[] threadPriority;
	private LinkedBlockingQueue<ChatObj> userChatQueue = new LinkedBlockingQueue<ChatObj>();
	private ArrayList<ChatObj> handleUserChat = new ArrayList<ChatObj>();
	private LinkedBlockingQueue<ChatObj> groupChatQueue = new LinkedBlockingQueue<ChatObj>();
	private ArrayList<ChatObj> handleGroupChat = new ArrayList<ChatObj>();
	private List<UserData> friendList;

	public OnlineUserMongodb(UserData userData, Session session, String token, List<UserData> friendList) {
		this.userData = userData;
		this.session = session;
		this.token = token;
		this.friendList = friendList;
	}

	public UserData getUserData() {
		return userData;
	}

	public String getToken() {
		return token;
	}

	public String getUserId() {
		return userData.getUserId();
	}

	public String getSessionId() {
		return session.getId();
	}

	public boolean isKick() {
		return isKick;
	}

	public void setKick(boolean isKick) {
		if (!this.isKick) {
			UserKickS.Builder builder = UserKickS.newBuilder();
			builder.setWsOpCode(WsOpCodeChat.USER_KICK_S);
			builder.setMsg("xxx");
			WsPacket wsPacket = new WsPacket(WsOpCodeChat.USER_KICK_S, builder.build());
			send(wsPacket);
		}
		this.isKick = isKick;
	}

	public boolean isDisConnect() {
		return isDisConnect;
	}

	public void setDisConnect(boolean isDisConnect) {
		this.isDisConnect = isDisConnect;
	}

	public int[] getThreadPriority() {
		return threadPriority;
	}

	public void setThreadPriority(int[] threadPriority) {
		this.threadPriority = threadPriority;
	}

	public void close() {
		if (!isDisConnect) {
			try {
				this.session.close();
			} catch (IOException e) {
				WSManager.log.error("关闭session异常", e);
			}
		}
	}

	public void clear() {
		close();
		userData = null;
		session = null;
		userChatQueue.clear();
		userChatQueue = null;
		handleUserChat.clear();
		handleUserChat = null;
		groupChatQueue.clear();
		groupChatQueue = null;
		handleGroupChat.clear();
		handleGroupChat = null;
	}

	public boolean send(WsPacket wsPacket) {
		try {
			session.getBasicRemote().sendObject(wsPacket);
			return true;
		} catch (Exception e) {
			WSManager.log.error("发送给客户端异常wsOpcode:" + wsPacket.getWsOpCode(), e);
			return false;
		}
	}

	public boolean addUserChatQueue(ChatObj chat) {
		try {
			userChatQueue.put(chat);
			return true;
		} catch (InterruptedException e) {
			WSManager.log.error("addUserChatQueue error", e);
			return false;
		}
	}

	public boolean addGroupChatQueue(ChatObj chat) {
		try {
			groupChatQueue.put(chat);
			return true;
		} catch (InterruptedException e) {
			WSManager.log.error("addGroupChatQueue error", e);
			return false;
		}
	}

	public ArrayList<ChatObj> getHandleUserChat() {
		handleUserChat.clear();
		userChatQueue.drainTo(handleUserChat);
		return handleUserChat;
	}

	public ArrayList<ChatObj> getHandleGroupChat() {
		handleGroupChat.clear();
		groupChatQueue.drainTo(handleGroupChat);
		return handleGroupChat;
	}

	@Override
	public void cycle() throws Exception {
		// 扫描自身消息队列发送消息
		// 如果被踢或者自行断开，走下线流程
		if (isKick || isDisConnect) {
			AsyncThreadManager.removeCycle(this, threadPriority[0], threadPriority[1]);
			return;
		}
		ArrayList<ChatObj> userChatArray = getHandleUserChat();
		ArrayList<ChatObj> groupChatArray = getHandleGroupChat();
		// 发送此次轮训的用户聊天
		if (userChatArray.size() != 0) {
			Map<String, List<ChatObj>> userChatMap = getUserChatMap(userChatArray);
			sendUserChat(userChatMap);
		}
		// 发送此次轮训的组聊天
		if (groupChatArray.size() != 0) {
			Map<String, List<ChatObj>> groupChatMap = getGroupChatMap(groupChatArray);
			sendGroupChat(groupChatMap);
		}
	}

	@Override
	public void onAdd() throws Exception {
		// 加入场景时xxx
		// 发送用户数据
		Map<String, List<ChatObj>> chatMap = new HashMap<String, List<ChatObj>>();
		for (int i = 0; i < friendList.size(); i++) {
			UserData friend = friendList.get(i);
			// 排除自己
			if (friend.getUserId().equals(getUserId())) {
				continue;
			}
			// 为空跳过
			List<ChatObj> list = ChatActionMongodb.getChatList(friend.getUserId(), getUserId(), ChatConfigMongodb.CHAT_TYPE_SEND);
			if (list == null || list.size() == 0) {
				continue;
			}
			chatMap.put(friend.getUserId(), list);
		}
		sendUserChat(chatMap);
		// 发送组数据
		List<ChatGroupUser> chatGroupUserList = ChatGroupUserAction.getChatGroupUserList(getUserId(), null);
		if (chatGroupUserList != null && chatGroupUserList.size() != 0) {
			for (int i = 0; i < chatGroupUserList.size(); i++) {
				ChatGroupUser chatGroupUser = chatGroupUserList.get(i);
				List<ChatObj> chatList = ChatActionMongodb.getChatList(chatGroupUser.getChatGroupId(), String.valueOf(chatGroupUser.getChatGroupUserUpdateTime().getTime()));
				if (chatList != null && chatList.size() > 0) {
					sendGroupChat(chatList, chatGroupUser.getChatGroupId());
				}
			}
		}
	}

	public void sendGroupChat(Map<String, List<ChatObj>> chatMap) {
		Object[] keySetArray = chatMap.keySet().toArray();
		for (int i = 0; i < keySetArray.length; i++) {
			String chatGroupId = String.valueOf(keySetArray[i]);
			List<ChatObj> chatList = chatMap.get(chatGroupId);
			sendGroupChat(chatList, chatGroupId);
		}
	}

	public void sendGroupChat(List<ChatObj> chatList, String chatGroupId) {
		GroupMessageS.Builder builder = GroupMessageS.newBuilder();
		builder.setChatGroupId(chatGroupId);
		builder.setWsOpCode(WsOpCodeChat.GROUP_MESSAGE_S);
		for (int j = 0; j < chatList.size(); j++) {
			ChatObj chat = chatList.get(j);
			builder.addMessage(ChatActionMongodb.getChatMessageDataBuilder(chat));
		}
		// 用户已经不在这个组里也没关系，接收到不处理就好了
		WsPacket wsPacket = new WsPacket(WsOpCodeChat.GROUP_MESSAGE_S, builder.build());
		send(wsPacket);
	}

	public void sendUserChat(Map<String, List<ChatObj>> chatMap) {
		Object[] keySetArray = chatMap.keySet().toArray();
		for (int i = 0; i < keySetArray.length; i++) {
			String userId = String.valueOf(keySetArray[i]);
			List<ChatObj> chatList = chatMap.get(userId);
			UserMessageS.Builder builder = UserMessageS.newBuilder();
			builder.setUserId(userId);
			builder.setWsOpCode(WsOpCodeChat.USER_MESSAGE_S);
			for (int j = 0; j < chatList.size(); j++) {
				ChatObj chat = chatList.get(j);
				builder.addMessage(ChatActionMongodb.getChatMessageDataBuilder(chat));
			}
			// 非现在用户列表的消息发出去也没关系，用户不接受就好了
			WsPacket wsPacket = new WsPacket(WsOpCodeChat.USER_MESSAGE_S, builder.build());
			send(wsPacket);
		}
	}

	public static Map<String, List<ChatObj>> getUserChatMap(List<ChatObj> chatList) {
		Map<String, List<ChatObj>> chatMap = new HashMap<String, List<ChatObj>>();
		for (int i = 0; i < chatList.size(); i++) {
			ChatObj chat = chatList.get(i);
			List<ChatObj> userChatList = null;
			if (!chatMap.containsKey(chat.getFromUserId())) {
				userChatList = new ArrayList<ChatObj>();
				chatMap.put(chat.getFromUserId(), userChatList);
			}
			userChatList = chatMap.get(chat.getFromUserId());
			userChatList.add(chat);
		}
		return chatMap;
	}

	public static Map<String, List<ChatObj>> getGroupChatMap(List<ChatObj> chatList) {
		Map<String, List<ChatObj>> chatMap = new HashMap<String, List<ChatObj>>();
		for (int i = 0; i < chatList.size(); i++) {
			ChatObj chat = chatList.get(i);
			List<ChatObj> groupChatList = null;
			if (!chatMap.containsKey(chat.getToTypeId())) {
				groupChatList = new ArrayList<ChatObj>();
				chatMap.put(chat.getToTypeId(), groupChatList);
			}
			groupChatList = chatMap.get(chat.getToTypeId());
			groupChatList.add(chat);
		}
		return chatMap;
	}

	@Override
	public void onRemove() throws Exception {
		// 离开场景时xxx
		// 发布离线消息
		UserOffline.Builder builder = UserOffline.newBuilder();
		builder.setUserId(getUserId());
		ThreadMsgManager.dispatchThreadMsg(MsgOpCodeChat.USER_OFFLINE, builder.build(), this);
	}
}
