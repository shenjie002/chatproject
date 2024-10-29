/*
  Warnings:

  - Added the required column `nick_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `headPic` VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN `nick_name` VARCHAR(191) NOT NULL;
