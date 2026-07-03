-- CreateTable
CREATE TABLE `Venue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `maxCapacity` INTEGER NOT NULL,
    `images` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Venue_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `venueId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pax` INTEGER NOT NULL,
    `price` BIGINT NOT NULL,
    `features` TEXT NOT NULL,
    `bookingUrl` TEXT NOT NULL,

    INDEX `Package_venueId_idx`(`venueId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
