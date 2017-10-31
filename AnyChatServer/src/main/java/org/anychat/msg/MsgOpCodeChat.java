package org.anychat.msg;

import org.grain.threadmsg.ThreadMsgManager;
import org.grain.websokcetlib.WSMsg;

public class MsgOpCodeChat {
	/**
	 * 用户下线
	 */
	public static String USER_OFFLINE = "USER_OFFLINE";

	public static void init() {
		// 用户下线，socket断开链接，socket建立链接都归属线程1，优先级1
		ThreadMsgManager.addMapping(USER_OFFLINE, new int[] { 1, 1 });
		ThreadMsgManager.addMapping(WSMsg.WEBSOCKET_CLIENT_DISCONNECT, new int[] { 1, 1 });
		ThreadMsgManager.addMapping(WSMsg.WEBSOCKET_CLIENT_CREATE_CONNECT, new int[] { 1, 1 });
	}
}
