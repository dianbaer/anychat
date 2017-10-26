/*
Navicat MySQL Data Transfer

Source Server         : localhost_3307
Source Server Version : 50505
Source Host           : localhost:3307
Source Database       : chat

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-05-22 14:02:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for chat
-- ----------------------------
DROP TABLE IF EXISTS `chat`;
CREATE TABLE `chat` (
  `chat_id` varchar(64) NOT NULL,
  `chat_content` varchar(2000) NOT NULL COMMENT '聊天内容',
  `from_user_id` varchar(64) NOT NULL COMMENT '谁发送的',
  `to_type` tinyint(4) NOT NULL COMMENT '1：用户，2：组',
  `to_type_id` varchar(64) NOT NULL COMMENT '接受者id，根据类型不同接受者是用户或者组',
  `chat_state` tinyint(4) NOT NULL COMMENT '1：存在，2：已删除',
  `chat_type` tinyint(4) NOT NULL COMMENT '1：已发送，2：已收到 相对于个人对个人',
  `chat_create_time` datetime NOT NULL,
  PRIMARY KEY (`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for chat_group
-- ----------------------------
DROP TABLE IF EXISTS `chat_group`;
CREATE TABLE `chat_group` (
  `chat_group_id` varchar(64) NOT NULL,
  `chat_group_name` varchar(255) NOT NULL,
  `chat_group_create_time` datetime NOT NULL,
  `user_group_id` varchar(64) DEFAULT NULL COMMENT '用户组id，空非用户组，不为空是以用户组创建的群组',
  PRIMARY KEY (`chat_group_id`),
  UNIQUE KEY `user_group_id` (`user_group_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for chat_group_user
-- ----------------------------
DROP TABLE IF EXISTS `chat_group_user`;
CREATE TABLE `chat_group_user` (
  `user_id` varchar(64) NOT NULL,
  `chat_group_id` varchar(64) NOT NULL,
  `chat_group_user_real_name` varchar(255) DEFAULT NULL,
  `chat_group_user_role` tinyint(4) NOT NULL COMMENT '1：管理员，2：普通组员',
  `chat_group_user_update_time` datetime NOT NULL COMMENT '收到消息最后的时间，在后面的就是没收到的',
  UNIQUE KEY `user_id` (`user_id`,`chat_group_id`) USING BTREE,
  KEY `chat_group_id` (`chat_group_id`),
  CONSTRAINT `chat_group_user_ibfk_1` FOREIGN KEY (`chat_group_id`) REFERENCES `chat_group` (`chat_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
