-- AlterTable
ALTER TABLE `user` ADD COLUMN `comments_notification` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `followers_notification` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `liked_notification` BOOLEAN NOT NULL DEFAULT false;
