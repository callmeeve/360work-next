/*
  Warnings:

  - You are about to drop the column `email` on the `manager` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Manager_email_key` ON `manager`;

-- AlterTable
ALTER TABLE `manager` DROP COLUMN `email`,
    MODIFY `name` VARCHAR(191) NULL;
