/*
  Warnings:

  - Added the required column `scheduleId` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `scheduleId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Attendance_scheduleId_fkey` ON `attendance`(`scheduleId`);

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `Attendance_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
