/*
  Warnings:

  - A unique constraint covering the columns `[creatorId,userId,type]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Report_creatorId_userId_type_key` ON `Report`(`creatorId`, `userId`, `type`);
