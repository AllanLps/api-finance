/*
  Warnings:

  - You are about to drop the column `descrioption` on the `Goals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Goals" DROP COLUMN "descrioption",
ADD COLUMN     "description" TEXT;
