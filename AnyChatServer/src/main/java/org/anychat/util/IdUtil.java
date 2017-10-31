package org.anychat.util;

import java.util.UUID;

public class IdUtil {
	/**
	 * 获取uuid
	 * 
	 * @return
	 */
	public static String getUuid() {
		String uuid = UUID.randomUUID().toString().trim().replaceAll("-", "");
		return uuid;
	}
}
