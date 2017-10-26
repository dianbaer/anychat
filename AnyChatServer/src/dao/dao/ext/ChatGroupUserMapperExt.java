package dao.dao.ext;

import java.util.List;

import dao.model.base.ChatGroup;
import dao.model.base.ChatGroupUserCriteria;

public interface ChatGroupUserMapperExt {
	List<ChatGroup> selectByExample(ChatGroupUserCriteria example);
}