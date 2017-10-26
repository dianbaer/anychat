package data;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class OnlineUserManager {
	public static Map<String, OnlineUser> onlineUserMap = new ConcurrentHashMap<String, OnlineUser>();
	public static Map<String, String> sessionMap = new ConcurrentHashMap<String, String>();

	public static boolean addOnlineUser(OnlineUser onlineUser) {
		if (onlineUserMap.containsKey(onlineUser.getUserId())) {
			return false;
		}
		onlineUserMap.put(onlineUser.getUserId(), onlineUser);
		sessionMap.put(onlineUser.getSessionId(), onlineUser.getUserId());
		return true;
	}

	public static OnlineUser removeOnlineUser(OnlineUser onlineUser) {
		if (!onlineUserMap.containsKey(onlineUser.getUserId())) {
			return null;
		}
		OnlineUser removeOnlineUser = onlineUserMap.remove(onlineUser.getUserId());
		sessionMap.remove(onlineUser.getSessionId());
		return removeOnlineUser;
	}

	public static OnlineUser getOnlineUserByUserId(String userId) {
		return onlineUserMap.get(userId);
	}

	public static OnlineUser getOnlineUserBySessionId(String sessionId) {
		String userId = sessionMap.get(sessionId);
		if (userId == null) {
			return null;
		}
		return onlineUserMap.get(userId);
	}
}
