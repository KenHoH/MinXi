-- CreateTable
CREATE TABLE `Content` (
    `content_id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator_id` INTEGER NOT NULL,
    `parent_id` INTEGER NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `post_type` ENUM('TEXT', 'IMAGE', 'VIDEO') NOT NULL,
    `visibilityPrivate` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `comments` INTEGER NOT NULL DEFAULT 0,
    `pins` INTEGER NOT NULL DEFAULT 0,
    `reports` INTEGER NOT NULL DEFAULT 0,
    `area_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Content_content_id_area_id_key`(`content_id`, `area_id`),
    PRIMARY KEY (`content_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `file_id` INTEGER NOT NULL AUTO_INCREMENT,
    `content_id` INTEGER NOT NULL,
    `filepath` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NULL,

    UNIQUE INDEX `File_content_id_filepath_key`(`content_id`, `filepath`),
    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `Content`(`content_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
