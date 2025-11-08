/*
  Warnings:

  - A unique constraint covering the columns `[username,area_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `area_id` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `area_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_area_id_key` ON `User`(`username`, `area_id`);
