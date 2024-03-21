-- AlterTable
ALTER TABLE `employee` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `birth_date` DATETIME(3) NULL,
    MODIFY `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    MODIFY `phone` VARCHAR(191) NULL;
