/*
  Warnings:

  - You are about to drop the column `password` on the `manager` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[secretKey]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `secretKey` to the `Manager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `manager` DROP COLUMN `password`,
    ADD COLUMN `secretKey` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Manager_secretKey_key` ON `Manager`(`secretKey`);
