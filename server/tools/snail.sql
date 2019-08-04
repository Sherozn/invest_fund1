DROP TABLE IF EXISTS `funds`;

CREATE TABLE `funds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `as_type` int(11) NOT NULL,
  `commission` float NOT NULL,
  `count` int(11) DEFAULT 0,
  `ready_money` float DEFAULT NULL,
  `step_cycle` int(11) DEFAULT NULL,
  `step_day` int(11) DEFAULT NULL,
  `single_week` int(11) DEFAULT 0,
  `step_money` float DEFAULT NULL,
  `harvest_line` float DEFAULT NULL,
  `harvest_money` float DEFAULT NULL,
  `is_delete` boolean DEFAULT false,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `fund_items`;

CREATE TABLE `fund_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fund_id` int(11) NOT NULL,
  `date` varchar(100) NOT NULL,
  `net` float NOT NULL,
  `busi_code` int(11) NOT NULL,
  `commission` float NOT NULL,
  `share` float DEFAULT 0.0,
  `amount` float NOT NULL,
  `cost` float NOT NULL,
  `real_money` float NOT NULL,
  `invest_money` float NOT NULL,
  `average_price` float NOT NULL,
  `sum_amount` float DEFAULT 0.0,
  `sum_share` float DEFAULT 0.0,
  `sum_commission` float DEFAULT 0.0,
  `goal_value` float DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  foreign key(fund_id) references funds(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
