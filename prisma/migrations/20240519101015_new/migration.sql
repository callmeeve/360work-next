/*
  Warnings:

  - You are about to drop the column `status` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `status`,
    ADD COLUMN `checkInImage` VARCHAR(191) NULL,
    ADD COLUMN `checkOutImage` VARCHAR(191) NULL,
    ADD COLUMN `statusIn` ENUM('PRESENT', 'ABSENT', 'LATE', 'OVER_TIME', 'LEAVE', 'LEAVE_EARLY') NULL,
    ADD COLUMN `statusOut` ENUM('PRESENT', 'ABSENT', 'LATE', 'OVER_TIME', 'LEAVE', 'LEAVE_EARLY') NULL;
