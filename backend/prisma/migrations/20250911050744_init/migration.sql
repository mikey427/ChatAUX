/*
  Warnings:

  - You are about to drop the `Entry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Memory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[spotifyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Memory" DROP CONSTRAINT "Memory_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "spotifyData" JSONB,
ADD COLUMN     "spotifyId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."Entry";

-- DropTable
DROP TABLE "public"."Memory";

-- CreateIndex
CREATE UNIQUE INDEX "User_spotifyId_key" ON "public"."User"("spotifyId");
