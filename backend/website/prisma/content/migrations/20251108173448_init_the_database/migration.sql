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

    PRIMARY KEY (`content_id`, `area_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `file_id` INTEGER NOT NULL AUTO_INCREMENT,
    `filepath` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NULL,
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
