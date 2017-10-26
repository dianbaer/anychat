package dao.dao.ext;

import java.util.List;

import dao.model.base.Chat;
import dao.model.ext.ChatCriteriaExt;

public interface ChatMapperExt {

	long countByExample(ChatCriteriaExt example);

	List<Chat> selectByExample(ChatCriteriaExt example);
}