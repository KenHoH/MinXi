-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `profile_picture` VARCHAR(191) NOT NULL,
    `follower` INTEGER NOT NULL,
    `total_like` INTEGER NOT NULL,
    `total_reports` INTEGER NOT NULL,
    `content_visibilityPrivate` BOOLEAN NOT NULL DEFAULT false,
    `pinned_visibilityPrivate` BOOLEAN NOT NULL DEFAULT false,
    `liked_visibilityPrivate` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
