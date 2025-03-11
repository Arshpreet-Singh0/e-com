/*
  Warnings:

  - Added the required column `embedding` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "embedding",
ADD COLUMN     "embedding" JSONB NOT NULL;
