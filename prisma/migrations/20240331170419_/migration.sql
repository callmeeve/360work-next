/*
  Warnings:

  - You are about to drop the column `clockIn` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `clockOut` on the `attendance` table. All the data in the column will be lost.
  - The values [SICK] on the enum `Attendance_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `day` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `worktime` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `checkIn` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `day` DROP FOREIGN KEY `Day_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `worktime` DROP FOREIGN KEY `WorkTime_scheduleId_fkey`;

-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `clockIn`,
    DROP COLUMN `clockOut`,
    ADD COLUMN `checkIn` DATETIME(3) NOT NULL,
    ADD COLUMN `checkOut` DATETIME(3) NULL,
    MODIFY `image` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'OVER_TIME', 'LEAVE', 'LEAVE_EARLY') NOT NULL;

-- AlterTable
ALTER TABLE `schedule` ADD COLUMN `endTime` DATETIME(3) NOT NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `day`;

-- DropTable
DROP TABLE `worktime`;
