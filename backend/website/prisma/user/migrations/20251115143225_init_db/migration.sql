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
