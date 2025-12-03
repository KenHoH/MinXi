-- AlterTable
ALTER TABLE `room` ADD COLUMN `communityId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Communities` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `pictureUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Communities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
