-- CreateTable
CREATE TABLE `Content` (
    `content_id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator_id` INTEGER NOT NULL,
    `parent_id` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `post_type` VARCHAR(191) NOT NULL,
    `visibilityPrivate` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `comments` INTEGER NOT NULL DEFAULT 0,
    `pins` INTEGER NOT NULL DEFAULT 0,
    `reports` INTEGER NOT NULL DEFAULT 0,
    `area_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `published_at` DATETIME(3) NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`content_id`, `area_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `file_id` INTEGER NOT NULL AUTO_INCREMENT,
    `filepath` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'thumbnail',
    `content_id` INTEGER NOT NULL,
    `content_area_id` INTEGER NOT NULL,

    INDEX `File_content_id_content_area_id_idx`(`content_id`, `content_area_id`),
    UNIQUE INDEX `File_content_id_filepath_key`(`content_id`, `filepath`),
    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoryContent` (
    `user_id` INTEGER NOT NULL DEFAULT 0,
    `content_id` INTEGER NOT NULL DEFAULT 0,
    `reps` INTEGER NOT NULL DEFAULT 0,
    `liked` BOOLEAN NOT NULL DEFAULT false,
    `pinned` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`user_id`, `content_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Board` (
    `board_id` INTEGER NOT NULL AUTO_INCREMENT,
    `board_thumbnail` VARCHAR(191) NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `visibilityPrivate` BOOLEAN NOT NULL DEFAULT false,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`board_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoardContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `board_id` INTEGER NOT NULL,
    `content_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BoardContent_board_id_idx`(`board_id`),
    UNIQUE INDEX `BoardContent_board_id_content_id_key`(`board_id`, `content_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content_id` INTEGER NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `parent_id` INTEGER NULL,
    `text` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BoardContent` ADD CONSTRAINT `BoardContent_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`board_id`) ON DELETE CASCADE ON UPDATE CASCADE;
