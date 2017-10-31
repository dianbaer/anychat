package org.anychat.action;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.anychat.config.CommonConfigChat;
import org.anychat.data.UserData;
import org.anychat.data.UserGroupData;
import org.anychat.protobuf.ws.LoginChatProto.ChatUserData;
import org.grain.httpclient.HttpUtil;
import org.grain.websokcetlib.WSManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class IdentityAction {
	/**
	 * 获取用户信息
	 * 
	 * @param token
	 *            身份
	 * @return
	 */
	public static UserData getUser(String token) {
		JSONObject js = new JSONObject();
		js.put("hOpCode", "11");
		Map<String, String> header = new HashMap<>();
		header.put("hOpCode", "11");
		header.put("token", token);
		byte[] returnByte = HttpUtil.send(js.toString(), CommonConfigChat.IDENTITY_URL, header, HttpUtil.POST);
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

	/**
	 * 获取好友列表相当于组里的所有人
	 * 
	 * @param userGroupTopId
	 *            组id
	 * @param token
	 *            身份
	 * @return
	 */
	public static List<UserData> getFriendList(String userGroupTopId, String token) {
		JSONObject js = new JSONObject();
		js.put("hOpCode", "13");
		js.put("userGroupTopId", userGroupTopId);
		Map<String, String> header = new HashMap<>();
		header.put("hOpCode", "13");
		header.put("token", token);
		byte[] returnByte = HttpUtil.send(js.toString(), CommonConfigChat.IDENTITY_URL, header, HttpUtil.POST);
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

	/**
	 * 获取组的信息
	 * 
	 * @param userGroupId
	 *            组id
	 * @param token
	 *            身份
	 * @return
	 */
	public static UserGroupData getUserGroup(String userGroupId, String token) {
		JSONObject js = new JSONObject();
		js.put("hOpCode", "3");
		js.put("userGroupId", userGroupId);
		Map<String, String> header = new HashMap<>();
		header.put("hOpCode", "3");
		header.put("token", token);

		byte[] returnByte = HttpUtil.send(js.toString(), CommonConfigChat.IDENTITY_URL, header, HttpUtil.POST);
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
			UserGroupData userGroup = new UserGroupData(returnjs.getJSONObject("userGroup"));
			return userGroup;
		}
		return null;
	}

	/**
	 * 构建用户信息数据
	 * 
	 * @param userData
	 *            用户数据
	 * @param isOnline
	 *            是否在线
	 * @return
	 */
	public static ChatUserData.Builder getChatUserDataBuilder(UserData userData, boolean isOnline) {
		ChatUserData.Builder builder = ChatUserData.newBuilder();
		builder.setUserId(userData.getUserId());
		builder.setUserImg(userData.getUserImgUrl());
		builder.setUserRealName(userData.getUserRealName());
		builder.setUserRole(userData.getUserRole());
		builder.setIsOnline(isOnline);
		return builder;
	}
}
