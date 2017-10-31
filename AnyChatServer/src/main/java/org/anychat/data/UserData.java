package org.anychat.data;

import net.sf.json.JSONObject;

public class UserData {
	/**
	 * 用户唯一id
	 */
	private String userId;
	/**
	 * 聊天的名字
	 */
	private String userRealName;
	/**
	 * 属于哪个组织,用于获取好友列表，组织信息
	 */
	private String userGroupTopId;
	/**
	 * 用户角色 1管理员，2普通成员
	 */
	private int userRole;
	/**
	 * 用户头像url
	 */
	private String userImgUrl;

	public UserData(JSONObject userData) {
		if (userData.containsKey("userId")) {
			this.userId = userData.getString("userId");
		}
		if (userData.containsKey("userRealName")) {
			this.userRealName = userData.getString("userRealName");
		}
		if (userData.containsKey("userGroupTopId")) {
			this.userGroupTopId = userData.getString("userGroupTopId");
		}
		if (userData.containsKey("userRole")) {
			this.userRole = userData.getInt("userRole");
		}
		if (userData.containsKey("userImgUrl")) {
			this.userImgUrl = userData.getString("userImgUrl");
		}
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserRealName() {
		return userRealName;
	}

	public void setUserRealName(String userRealName) {
		this.userRealName = userRealName;
	}

	public String getUserGroupTopId() {
		return userGroupTopId;
	}

	public void setUserGroupTopId(String userGroupTopId) {
		this.userGroupTopId = userGroupTopId;
	}

	public int getUserRole() {
		return userRole;
	}

	public void setUserRole(int userRole) {
		this.userRole = userRole;
	}

	public String getUserImgUrl() {
		return userImgUrl;
	}

	public void setUserImgUrl(String userImgUrl) {
		this.userImgUrl = userImgUrl;
	}
}
