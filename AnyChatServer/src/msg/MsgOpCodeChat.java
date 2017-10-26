package msg;

import org.grain.threadmsg.ThreadMsgManager;
import org.grain.websokcetlib.WSMsg;

public class MsgOpCodeChat {
	public static String USER_OFFLINE = "USER_OFFLINE";

	public static void init() {
		ThreadMsgManager.addMapping(USER_OFFLINE, new int[] { 1, 1 });
		ThreadMsgManager.addMapping(WSMsg.WEBSOCKET_CLIENT_DISCONNECT, new int[] { 1, 1 });
		ThreadMsgManager.addMapping(WSMsg.WEBSOCKET_CLIENT_CREATE_CONNECT, new int[] { 1, 1 });
	}
}
