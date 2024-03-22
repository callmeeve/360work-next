/*
  Warnings:

  - Added the required column `managerId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` ADD COLUMN `managerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `taskreport` ADD COLUMN `status` ENUM('UNVERIFIED', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'UNVERIFIED';

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Manager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
