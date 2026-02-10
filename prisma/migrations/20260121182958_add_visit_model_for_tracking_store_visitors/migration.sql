-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "visitorId" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visit_visitorId_storeId_visitDate_key" ON "Visit"("visitorId", "storeId", "visitDate");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
