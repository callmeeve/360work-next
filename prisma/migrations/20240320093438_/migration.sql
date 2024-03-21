-- DropForeignKey
ALTER TABLE `manager` DROP FOREIGN KEY `Manager_companyId_fkey`;

-- AlterTable
ALTER TABLE `manager` MODIFY `companyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
