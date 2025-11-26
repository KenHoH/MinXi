/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `file` table. All the data in the column will be lost.
  - Made the column `type` on table `file` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `file` DROP COLUMN `thumbnail`,
    MODIFY `type` VARCHAR(191) NOT NULL DEFAULT 'thumbnail';
