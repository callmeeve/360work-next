/*
  Warnings:

  - Added the required column `clockIn` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clockOut` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `clockIn` DATETIME(3) NOT NULL,
    ADD COLUMN `clockOut` DATETIME(3) NOT NULL;
