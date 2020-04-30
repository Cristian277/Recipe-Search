SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
	`userId` tinyint(2) NOT NULL,
	`userName` varchar(8) COLLATE utf8_unicode_ci NOT NULL,
	`password` varchar(72) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `recipes`;

CREATE TABLE `recipes` (
  `recipeId` mediumint(9) NOT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `userId` smallint(6) NULL,
  `image` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `calories` int(11) DEFAULT NULL
  
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);
  
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipeId`);

ALTER TABLE `users`
  MODIFY `userId` tinyint(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
  
ALTER TABLE `recipes`
  MODIFY `recipeId` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;