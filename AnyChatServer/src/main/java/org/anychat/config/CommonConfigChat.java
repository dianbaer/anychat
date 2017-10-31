package org.anychat.config;

import java.util.Properties;

public class CommonConfigChat {
	/**
	 * 身份系统地址
	 */
	public static String IDENTITY_URL;
	/**
	 * mongodb ip
	 */
	public static String MONGODB_URL;
	/**
	 * mongodb 端口
	 */
	public static int MONGODB_PORT;
	/**
	 * mongodb用户名
	 */
	public static String MONGODB_USERNAME;
	/**
	 * mongodb密码
	 */
	public static String MONGODB_PASSWORD;
	/**
	 * mongodb数据库
	 */
	public static String MONGODB_DBNAME;
	/**
	 * 是否使用mongodb存储聊天记录
	 */
	public static boolean IS_USE_MONGODB;

	public static void init(Properties properties) {
		IDENTITY_URL = properties.getProperty("identityUrl");
		MONGODB_URL = properties.getProperty("mongodbUrl");
		MONGODB_PORT = Integer.valueOf(properties.getProperty("mongodbPort"));
		MONGODB_USERNAME = properties.getProperty("mongodbUsername");
		MONGODB_PASSWORD = properties.getProperty("mongodbPassword");
		MONGODB_DBNAME = properties.getProperty("mongodbDBName");
		IS_USE_MONGODB = Boolean.valueOf(properties.getProperty("isUseMongodb"));
	}
}
