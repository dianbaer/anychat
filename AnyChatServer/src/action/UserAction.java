package action;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.grain.httpclient.HttpUtil;
import org.grain.websokcetlib.WSManager;

import config.CommonConfigChat;
import data.UserData;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import protobuf.ws.LoginChatProto.ChatUserData;

public class UserAction {
	public static UserData getUser(String token) {
		JSONObject js = new JSONObject();
		js.put("hOpCode", "11");
		Map<String, String> header = new HashMap<>();
		header.put("hOpCode", "11");
		header.put("token", token);
		byte[] returnByte = HttpUtil.send(js.toString(), CommonConfigChat.UCENTER_URL, header, HttpUtil.POST);
		if (returnByte != null) {
			String str = null;
			try {
				str = new String(returnByte, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				WSManager.log.error("返回字符串解析异常", e);
			}
			JSONObject returnjs = JSONObject.fromObject(str);
			// 如果返回的是错误类型,说明用户中心拦截器没通过
			if (returnjs.getString("hOpCode").equals("0")) {
				return null;
			}
			UserData userData = new UserData(returnjs.getJSONObject("user"));
			return userData;
		}
		return null;
	}

	public static List<UserData> getFriendList(String userGroupTopId, String token) {
		JSONObject js = new JSONObject();
		js.put("hOpCode", "13");
		js.put("userGroupTopId", userGroupTopId);
		Map<String, String> header = new HashMap<>();
		header.put("hOpCode", "13");
		header.put("token", token);
		byte[] returnByte = HttpUtil.send(js.toString(), CommonConfigChat.UCENTER_URL, header, HttpUtil.POST);
		if (returnByte != null) {
			String str = null;
			try {
				str = new String(returnByte, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				WSManager.log.error("返回字符串解析异常", e);
			}
			JSONObject returnjs = JSONObject.fromObject(str);
			// 如果返回的是错误类型,说明用户中心拦截器没通过
			if (returnjs.getString("hOpCode").equals("0")) {
				return null;
			}
			JSONArray jsArray = returnjs.getJSONArray("user");
			List<UserData> list = new ArrayList<>();
			for (int i = 0; i < jsArray.size(); i++) {
				JSONObject user = jsArray.getJSONObject(i);
				UserData userData = new UserData(user);
				list.add(userData);
			}
			return list;
		}
		return null;
	}

	public static ChatUserData.Builder getChatUserDataBuilder(UserData userData, boolean isOnline) {
		ChatUserData.Builder builder = ChatUserData.newBuilder();
		builder.setUserId(userData.getUserId());
		builder.setUserImg(userData.getUserImg());
		builder.setUserRealName(userData.getUserRealName());
		builder.setUserRole(userData.getUserRole());
		builder.setIsOnline(isOnline);
		return builder;
	}
}
