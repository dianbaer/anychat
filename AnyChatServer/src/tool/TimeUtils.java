
package tool;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.grain.websokcetlib.WSManager;

public class TimeUtils {
	public static SimpleDateFormat longDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	public static SimpleDateFormat shortDateFormat = new SimpleDateFormat("yyyy-MM-dd");

	public static String dateToString(Date date) {
		if (date == null) {
			return null;
		}
		return longDateFormat.format(date);
	}

	public static Date stringToDateDay(String time) {
		if (StringUtil.stringIsNull(time)) {
			return null;
		}
		Date date;
		try {
			date = shortDateFormat.parse(time);
			return date;
		} catch (ParseException e) {
			WSManager.log.error("TimeUtils.stringToDateDay error", e);
			return null;
		}

	}
}
