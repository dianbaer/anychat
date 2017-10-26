package data;

import net.sf.json.JSONObject;

public class UserData {
	private String userId;
	private String userName;
	private String userPhone;
	private String userEmail;
	private String userCreateTime;
	private String userUpdateTime;
	private int userState;
	private String userGroupId;
	private String userRealName;
	private int userSex;
	private int userAge;
	private String userGroupTopId;
	private int userRole;
	private String userImg;
	private String userImgUrl;

	public UserData(JSONObject userData) {
		if (userData.containsKey("userId")) {
			this.userId = userData.getString("userId");
		}
		if (userData.containsKey("userName")) {
			this.userName = userData.getString("userName");
		}
		if (userData.containsKey("userPhone")) {
			this.userPhone = userData.getString("userPhone");
		}
		if (userData.containsKey("userEmail")) {
			this.userEmail = userData.getString("userEmail");
		}
		if (userData.containsKey("userCreateTime")) {
			this.userCreateTime = userData.getString("userCreateTime");
		}
		if (userData.containsKey("userUpdateTime")) {
			this.userUpdateTime = userData.getString("userUpdateTime");
		}
		if (userData.containsKey("userState")) {
			this.userState = userData.getInt("userState");
		}
		if (userData.containsKey("userGroupId")) {
			this.userGroupId = userData.getString("userGroupId");
		}
		if (userData.containsKey("userRealName")) {
			this.userRealName = userData.getString("userRealName");
		}
		if (userData.containsKey("userSex")) {
			this.userSex = userData.getInt("userSex");
		}
		if (userData.containsKey("userAge")) {
			this.userAge = userData.getInt("userAge");
		}
		if (userData.containsKey("userGroupTopId")) {
			this.userGroupTopId = userData.getString("userGroupTopId");
		}
		if (userData.containsKey("userRole")) {
			this.userRole = userData.getInt("userRole");
		}
		if (userData.containsKey("userImg")) {
			this.userImg = userData.getString("userImg");
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

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserPhone() {
		return userPhone;
	}

	public void setUserPhone(String userPhone) {
		this.userPhone = userPhone;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getUserCreateTime() {
		return userCreateTime;
	}

	public void setUserCreateTime(String userCreateTime) {
		this.userCreateTime = userCreateTime;
	}

	public String getUserUpdateTime() {
		return userUpdateTime;
	}

	public void setUserUpdateTime(String userUpdateTime) {
		this.userUpdateTime = userUpdateTime;
	}

	public int getUserState() {
		return userState;
	}

	public void setUserState(int userState) {
		this.userState = userState;
	}

	public String getUserGroupId() {
		return userGroupId;
	}

	public void setUserGroupId(String userGroupId) {
		this.userGroupId = userGroupId;
	}

	public String getUserRealName() {
		return userRealName;
	}

	public void setUserRealName(String userRealName) {
		this.userRealName = userRealName;
	}

	public int getUserSex() {
		return userSex;
	}

	public void setUserSex(int userSex) {
		this.userSex = userSex;
	}

	public int getUserAge() {
		return userAge;
	}

	public void setUserAge(int userAge) {
		this.userAge = userAge;
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

	public String getUserImg() {
		return userImg;
	}

	public void setUserImg(String userImg) {
		this.userImg = userImg;
	}

	public String getUserImgUrl() {
		return userImgUrl;
	}

	public void setUserImgUrl(String userImgUrl) {
		this.userImgUrl = userImgUrl;
	}

}
