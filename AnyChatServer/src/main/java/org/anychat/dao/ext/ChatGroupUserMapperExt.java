package org.anychat.dao.ext;

import java.util.List;

import org.anychat.model.base.ChatGroup;
import org.anychat.model.base.ChatGroupUserCriteria;

public interface ChatGroupUserMapperExt {
	List<ChatGroup> selectByExample(ChatGroupUserCriteria example);
}