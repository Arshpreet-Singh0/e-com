/*
  Warnings:

  - You are about to drop the column `fullName` on the `Address` table. All the data in the column will be lost.
  - Added the required column `email` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "fullName",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT;
