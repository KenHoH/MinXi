/*
  Warnings:

  - You are about to alter the column `post_type` on the `content` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `content` MODIFY `post_type` VARCHAR(191) NOT NULL;
