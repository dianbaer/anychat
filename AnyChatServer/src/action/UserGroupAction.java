package action;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.grain.httpclient.HttpUtil;
import org.grain.websokcetlib.WSManager;

import config.CommonConfigChat;
import data.UserGroupData;
import net.sf.json.JSONObject;

public class UserGroupAction {
	public static UserGroupData getUserGroup(String userGroupId, String token) {
		JSONObject js = new JSONObject();
		js.put("hOpCode", "3");
		js.put("userGroupId", userGroupId);
		Map<String, String> header = new HashMap<>();
		header.put("hOpCode", "3");
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
			UserGroupData userGroup = new UserGroupData(returnjs.getJSONObject("userGroup"));
			return userGroup;
		}
		return null;
	}
}
