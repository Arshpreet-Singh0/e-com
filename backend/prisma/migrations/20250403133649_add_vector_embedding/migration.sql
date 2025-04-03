/*
  Warnings:

  - Changed the type of `embedding` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN IF EXISTS "embedding";

ALTER TABLE "Product" ADD COLUMN "embedding" jsonb;


