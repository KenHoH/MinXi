/*
  Warnings:

  - Made the column `board_thumbnail` on table `board` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `board` MODIFY `board_thumbnail` VARCHAR(191) NOT NULL;
