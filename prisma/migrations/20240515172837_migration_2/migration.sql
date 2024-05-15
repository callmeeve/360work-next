/*
  Warnings:

  - You are about to drop the column `date` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the `schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_employeeId_fkey`;

-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `date`,
    DROP COLUMN `scheduleId`;

-- DropTable
DROP TABLE `schedule`;
