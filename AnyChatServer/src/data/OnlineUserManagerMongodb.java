package data;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class OnlineUserManagerMongodb {
	public static Map<String, OnlineUserMongodb> onlineUserMap = new ConcurrentHashMap<String, OnlineUserMongodb>();
	public static Map<String, String> sessionMap = new ConcurrentHashMap<String, String>();

	public static boolean addOnlineUser(OnlineUserMongodb onlineUser) {
		if (onlineUserMap.containsKey(onlineUser.getUserId())) {
			return false;
		}
		onlineUserMap.put(onlineUser.getUserId(), onlineUser);
		sessionMap.put(onlineUser.getSessionId(), onlineUser.getUserId());
		return true;
	}

	public static OnlineUserMongodb removeOnlineUser(OnlineUserMongodb onlineUser) {
		if (!onlineUserMap.containsKey(onlineUser.getUserId())) {
			return null;
		}
		OnlineUserMongodb removeOnlineUser = onlineUserMap.remove(onlineUser.getUserId());
		sessionMap.remove(onlineUser.getSessionId());
		return removeOnlineUser;
	}

	public static OnlineUserMongodb getOnlineUserByUserId(String userId) {
		return onlineUserMap.get(userId);
	}

	public static OnlineUserMongodb getOnlineUserBySessionId(String sessionId) {
		String userId = sessionMap.get(sessionId);
		if (userId == null) {
			return null;
		}
		return onlineUserMap.get(userId);
	}
}
