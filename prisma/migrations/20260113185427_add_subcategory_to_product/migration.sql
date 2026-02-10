/*
  Warnings:

  - You are about to drop the `ProductSubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductSubcategory" DROP CONSTRAINT "ProductSubcategory_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductSubcategory" DROP CONSTRAINT "ProductSubcategory_subcategory_id_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "subcategory_id" INTEGER;

-- DropTable
DROP TABLE "ProductSubcategory";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
