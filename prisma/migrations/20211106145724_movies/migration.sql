/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Movie` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Sale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerEmail" TEXT NOT NULL,
    "price" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerEmail" TEXT NOT NULL,
    "price" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Like" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "likes" INTEGER NOT NULL,
    "customers" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stock" INTEGER NOT NULL,
    "rentalPrice" INTEGER NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Movie_id_fkey" FOREIGN KEY ("id") REFERENCES "Sale" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Movie_id_fkey" FOREIGN KEY ("id") REFERENCES "Rental" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Movie_id_fkey" FOREIGN KEY ("id") REFERENCES "Like" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_Movie" ("available", "description", "id", "rentalPrice", "salePrice", "stock", "title") SELECT "available", "description", "id", "rentalPrice", "salePrice", "stock", "title" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_id_key" ON "Movie"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_id_key" ON "Sale"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rental_id_key" ON "Rental"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_id_key" ON "Like"("id");
