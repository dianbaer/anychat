package org.anychat.config;

import java.util.Properties;

public class CommonConfigChat {

	public static String IDENTITY_URL;
	public static String MONGODB_URL;
	public static int MONGODB_PORT;
	public static String MONGODB_USERNAME;
	public static String MONGODB_PASSWORD;
	public static String MONGODB_DBNAME;
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
