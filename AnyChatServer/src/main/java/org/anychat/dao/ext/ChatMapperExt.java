package org.anychat.dao.ext;

import java.util.List;

import org.anychat.model.base.Chat;
import org.anychat.model.ext.ChatCriteriaExt;

public interface ChatMapperExt {

	long countByExample(ChatCriteriaExt example);

	List<Chat> selectByExample(ChatCriteriaExt example);
}