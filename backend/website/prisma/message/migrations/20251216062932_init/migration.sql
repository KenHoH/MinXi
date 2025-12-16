-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `mediaUrl` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'TEXT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorName` VARCHAR(191) NULL,
    `authorProfileUrl` VARCHAR(191) NULL,
    `authorId` INTEGER NOT NULL,

    INDEX `Message_roomId_idx`(`roomId`),
    INDEX `Message_roomId_createdAt_idx`(`roomId`, `createdAt`),
    INDEX `Message_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
