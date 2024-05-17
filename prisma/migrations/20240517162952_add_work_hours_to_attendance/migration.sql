-- AlterTable
ALTER TABLE `attendance` MODIFY `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'OVER_TIME', 'LEAVE', 'LEAVE_EARLY') NULL;
