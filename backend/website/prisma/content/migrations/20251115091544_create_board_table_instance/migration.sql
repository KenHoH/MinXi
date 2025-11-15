-- CreateTable
CREATE TABLE `Board` (
    `board_id` INTEGER NOT NULL AUTO_INCREMENT,
    `board_thumbnail` VARCHAR(191) NULL,
    `creator_id` VARCHAR(191) NOT NULL,
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

-- AddForeignKey
ALTER TABLE `BoardContent` ADD CONSTRAINT `BoardContent_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`board_id`) ON DELETE CASCADE ON UPDATE CASCADE;
