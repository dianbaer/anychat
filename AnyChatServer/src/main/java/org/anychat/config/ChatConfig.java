package org.anychat.config;

public class ChatConfig {
	/**
	 * 发送对象的类型，用户
	 */
	public static int TO_TYPE_USER = 1;
	/**
	 * 发送对象的类型，组
	 */
	public static int TO_TYPE_GROUP = 2;
	/**
	 * 内容是否删除，未删除
	 */
	public static int CHAT_STATE_EXIST = 1;
	/**
	 * 内容是否删除，已删除
	 */
	public static int CHAT_STATE_DELETE = 2;
	/**
	 * 信息发送的状态，已发送
	 */
	public static int CHAT_TYPE_SEND = 1;
	/**
	 * 信息发送的状态，已收到
	 */
	public static int CHAT_TYPE_RECEIVE = 2;

}
