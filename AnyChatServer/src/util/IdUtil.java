package util;

import java.util.UUID;

public class IdUtil {
	public static String getUuid() {
		String uuid = UUID.randomUUID().toString().trim().replaceAll("-", "");
		return uuid;
	}
}
