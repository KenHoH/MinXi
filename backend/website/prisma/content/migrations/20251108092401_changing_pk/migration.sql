/*
  Warnings:

  - The primary key for the `content` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX `Content_content_id_area_id_key` ON `content`;

-- AlterTable
ALTER TABLE `content` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`content_id`, `area_id`);
