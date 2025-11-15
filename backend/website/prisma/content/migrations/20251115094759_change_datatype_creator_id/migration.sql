/*
  Warnings:

  - You are about to alter the column `creator_id` on the `board` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `board` MODIFY `creator_id` INTEGER NOT NULL;
