package dao.model.ext;

import java.util.Date;

public class ChatCriteriaExt {

	private Byte toType;
	private String toTypeId;
	private String fromUserId;
	private Date chatCreateTime;
	private Byte chatState;
	private int limitStart;
	private int pageSize;

	public Byte getToType() {
		return toType;
	}

	public void setToType(Byte toType) {
		this.toType = toType;
	}

	public String getToTypeId() {
		return toTypeId;
	}

	public void setToTypeId(String toTypeId) {
		this.toTypeId = toTypeId;
	}

	public String getFromUserId() {
		return fromUserId;
	}

	public void setFromUserId(String fromUserId) {
		this.fromUserId = fromUserId;
	}

	public Date getChatCreateTime() {
		return chatCreateTime;
	}

	public void setChatCreateTime(Date chatCreateTime) {
		this.chatCreateTime = chatCreateTime;
	}

	public Byte getChatState() {
		return chatState;
	}

	public void setChatState(Byte chatState) {
		this.chatState = chatState;
	}

	public int getLimitStart() {
		return limitStart;
	}

	public void setLimitStart(int limitStart) {
		this.limitStart = limitStart;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

}
