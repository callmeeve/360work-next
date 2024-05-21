/*
  Warnings:

  - You are about to drop the column `workEnd` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `workStart` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `workEnd`,
    DROP COLUMN `workStart`;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `workEnd` DATETIME(3) NULL,
    ADD COLUMN `workStart` DATETIME(3) NULL;
