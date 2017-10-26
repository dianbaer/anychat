package ws;

import org.grain.threadwebsocket.ThreadWSManager;

import protobuf.ws.LoginChatProto.AgainConnectS;
import protobuf.ws.LoginChatProto.ChatUserOfflineS;
import protobuf.ws.LoginChatProto.ChatUserOnlineS;
import protobuf.ws.LoginChatProto.GetChatListC;
import protobuf.ws.LoginChatProto.GetChatListS;
import protobuf.ws.LoginChatProto.GroupMessageReceiveC;
import protobuf.ws.LoginChatProto.GroupMessageS;
import protobuf.ws.LoginChatProto.LoginChatServerC;
import protobuf.ws.LoginChatProto.LoginChatServerS;
import protobuf.ws.LoginChatProto.SendMessageC;
import protobuf.ws.LoginChatProto.ToUserMessageS;
import protobuf.ws.LoginChatProto.UserKickS;
import protobuf.ws.LoginChatProto.UserMessageReceiveC;
import protobuf.ws.LoginChatProto.UserMessageS;

public class WsOpCodeChat {
	// 登录请求
	public static String LOGIN_CHAT_SERVER_C = "1";
	// 登录成功后返回数据
	public static String LOGIN_CHAT_SERVER_S = "2";
	// 用户上线
	public static String USER_ONLINE_S = "3";
	// 用户下线
	public static String USER_OFFLINE_S = "4";
	// 发送消息给个人或组织
	public static String SEND_MESSAGE_C = "5";
	// 接到的个人消息
	public static String USER_MESSAGE_S = "6";
	// 接到的组织消息
	public static String GROUP_MESSAGE_S = "7";
	// 用户收到个人消息的回复
	public static String USER_MESSAGE_RECEIVE_C = "8";
	// 用户收到组织消息的回复
	public static String GROUP_MESSAGE_RECEIVE_C = "9";
	// 用户被踢下线
	public static String USER_KICK_S = "10";
	public static String AGAIN_CONNECT_S = "11";

	public static String GET_CHAT_LIST_C = "12";
	public static String GET_CHAT_LIST_S = "13";

	// 接到的自己发送给别人的消息
	public static String TO_USER_MESSAGE_S = "14";

	public static void init() {
		ThreadWSManager.addThreadMapping(LOGIN_CHAT_SERVER_C, LoginChatServerC.class, new int[] { 1, 1 });
		ThreadWSManager.addThreadMapping(LOGIN_CHAT_SERVER_S, LoginChatServerS.class, null);
		ThreadWSManager.addThreadMapping(USER_ONLINE_S, ChatUserOnlineS.class, null);
		ThreadWSManager.addThreadMapping(USER_OFFLINE_S, ChatUserOfflineS.class, null);
		ThreadWSManager.addThreadMapping(SEND_MESSAGE_C, SendMessageC.class, null);
		ThreadWSManager.addThreadMapping(USER_MESSAGE_S, UserMessageS.class, null);
		ThreadWSManager.addThreadMapping(GROUP_MESSAGE_S, GroupMessageS.class, null);
		ThreadWSManager.addThreadMapping(USER_MESSAGE_RECEIVE_C, UserMessageReceiveC.class, null);
		ThreadWSManager.addThreadMapping(GROUP_MESSAGE_RECEIVE_C, GroupMessageReceiveC.class, null);
		ThreadWSManager.addThreadMapping(USER_KICK_S, UserKickS.class, null);
		ThreadWSManager.addThreadMapping(AGAIN_CONNECT_S, AgainConnectS.class, null);
		ThreadWSManager.addThreadMapping(GET_CHAT_LIST_C, GetChatListC.class, null);
		ThreadWSManager.addThreadMapping(GET_CHAT_LIST_S, GetChatListS.class, null);
		ThreadWSManager.addThreadMapping(TO_USER_MESSAGE_S, ToUserMessageS.class, null);
	}
}
