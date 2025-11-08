/*
  Warnings:

  - Made the column `title` on table `content` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `content` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `content` MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;
