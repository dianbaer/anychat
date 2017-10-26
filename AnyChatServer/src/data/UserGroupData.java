package data;

import net.sf.json.JSONObject;

public class UserGroupData {
	private String userGroupId;
	private String userGroupName;
	private String userGroupParentId;
	private String userGroupCreateTime;
	private String userGroupUpdateTime;
	private int userGroupState;
	private String userGroupTopId;

	public UserGroupData(JSONObject userGroupData) {
		if (userGroupData.containsKey("userGroupId")) {
			this.userGroupId = userGroupData.getString("userGroupId");
		}
		if (userGroupData.containsKey("userGroupName")) {
			this.userGroupName = userGroupData.getString("userGroupName");
		}
		if (userGroupData.containsKey("userGroupParentId")) {
			this.userGroupParentId = userGroupData.getString("userGroupParentId");
		}
		if (userGroupData.containsKey("userGroupCreateTime")) {
			this.userGroupCreateTime = userGroupData.getString("userGroupCreateTime");
		}
		if (userGroupData.containsKey("userGroupUpdateTime")) {
			this.userGroupUpdateTime = userGroupData.getString("userGroupUpdateTime");
		}
		if (userGroupData.containsKey("userGroupState")) {
			this.userGroupState = userGroupData.getInt("userGroupState");
		}
		if (userGroupData.containsKey("userGroupTopId")) {
			this.userGroupTopId = userGroupData.getString("userGroupTopId");
		}
	}

	public String getUserGroupId() {
		return userGroupId;
	}

	public void setUserGroupId(String userGroupId) {
		this.userGroupId = userGroupId;
	}

	public String getUserGroupName() {
		return userGroupName;
	}

	public void setUserGroupName(String userGroupName) {
		this.userGroupName = userGroupName;
	}

	public String getUserGroupParentId() {
		return userGroupParentId;
	}

	public void setUserGroupParentId(String userGroupParentId) {
		this.userGroupParentId = userGroupParentId;
	}

	public String getUserGroupCreateTime() {
		return userGroupCreateTime;
	}

	public void setUserGroupCreateTime(String userGroupCreateTime) {
		this.userGroupCreateTime = userGroupCreateTime;
	}

	public String getUserGroupUpdateTime() {
		return userGroupUpdateTime;
	}

	public void setUserGroupUpdateTime(String userGroupUpdateTime) {
		this.userGroupUpdateTime = userGroupUpdateTime;
	}

	public int getUserGroupState() {
		return userGroupState;
	}

	public void setUserGroupState(int userGroupState) {
		this.userGroupState = userGroupState;
	}

	public String getUserGroupTopId() {
		return userGroupTopId;
	}

	public void setUserGroupTopId(String userGroupTopId) {
		this.userGroupTopId = userGroupTopId;
	}

}
