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
    `liked_notification_disabled` BOOLEAN NOT NULL DEFAULT false,
    `comments_notification_disabled` BOOLEAN NOT NULL DEFAULT false,
    `followers_notification_disabled` BOOLEAN NOT NULL DEFAULT false,
    `area_id` INTEGER NOT NULL,

    UNIQUE INDEX `User_username_area_id_key`(`username`, `area_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator_id` INTEGER NOT NULL,
    `follower_id` INTEGER NOT NULL,

    INDEX `Follow_follower_id_idx`(`follower_id`),
    UNIQUE INDEX `Follow_creator_id_follower_id_key`(`creator_id`, `follower_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friend` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `friend_id` INTEGER NOT NULL,

    INDEX `Friend_friend_id_idx`(`friend_id`),
    UNIQUE INDEX `Friend_user_id_friend_id_key`(`user_id`, `friend_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
