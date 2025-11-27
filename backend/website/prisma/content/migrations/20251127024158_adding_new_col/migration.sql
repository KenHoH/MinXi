/*
  Warnings:

  - Added the required column `published_at` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `parent_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `content` ADD COLUMN `published_at` DATETIME(3) NOT NULL;
