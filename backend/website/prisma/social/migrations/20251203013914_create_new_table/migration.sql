/*
  Warnings:

  - You are about to drop the column `communityId` on the `room` table. All the data in the column will be lost.
  - You are about to drop the `communities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_communityId_fkey`;

-- DropIndex
DROP INDEX `Room_communityId_fkey` ON `room`;

-- AlterTable
ALTER TABLE `room` DROP COLUMN `communityId`;

-- DropTable
DROP TABLE `communities`;

-- CreateTable
CREATE TABLE `CommunityGroup` (
    `id` VARCHAR(191) NOT NULL,
    `communityId` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CommunityGroup_communityId_idx`(`communityId`),
    INDEX `CommunityGroup_groupId_idx`(`groupId`),
    UNIQUE INDEX `CommunityGroup_communityId_groupId_key`(`communityId`, `groupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
