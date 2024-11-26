/*
  Warnings:

  - You are about to drop the `technicals` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `checklistAnuntech` ADD COLUMN `technical_id` INTEGER NULL;

-- DropTable
DROP TABLE `technicals`;
