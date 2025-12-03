/*
  Warnings:

  - You are about to drop the column `comments_notification` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `followers_notification` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `liked_notification` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `comments_notification`,
    DROP COLUMN `followers_notification`,
    DROP COLUMN `liked_notification`,
    ADD COLUMN `comments_notification_disabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `followers_notification_disabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `liked_notification_disabled` BOOLEAN NOT NULL DEFAULT false;
