/*
  Warnings:

  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `rating` on the `feedbacks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_productId_fkey";

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER NOT NULL;

-- DropTable
DROP TABLE "products";
