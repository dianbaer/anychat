package config;

import java.util.Properties;

public class CommonConfigChat {

	public static String UCENTER_URL;
	public static String MONGODB_URL;
	public static int MONGODB_PORT;
	public static String MONGODB_USERNAME;
	public static String MONGODB_PASSWORD;
	public static String MONGODB_DBNAME;
	public static boolean IS_USE_MONGODB;

	public static void init(Properties properties) {

		UCENTER_URL = properties.getProperty("uCenterUrl");

		MONGODB_URL = properties.getProperty("mongodbUrl");
		MONGODB_PORT = Integer.valueOf(properties.getProperty("mongodbPort"));
		MONGODB_USERNAME = properties.getProperty("mongodbUsername");
		MONGODB_PASSWORD = properties.getProperty("mongodbPassword");
		MONGODB_DBNAME = properties.getProperty("mongodbDBName");

		IS_USE_MONGODB = Boolean.valueOf(properties.getProperty("isUseMongodb"));

	}
}
