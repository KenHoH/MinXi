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

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_content_id_content_area_id_fkey` FOREIGN KEY (`content_id`, `content_area_id`) REFERENCES `Content`(`content_id`, `area_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
