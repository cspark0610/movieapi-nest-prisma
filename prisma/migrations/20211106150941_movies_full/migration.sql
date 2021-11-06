-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customers" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerEmail" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Sale" ("customerEmail", "id", "price") SELECT "customerEmail", "id", "price" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
CREATE UNIQUE INDEX "Sale_id_key" ON "Sale"("id");
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stock" INTEGER NOT NULL,
    "rentalPrice" INTEGER NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "transactionId" INTEGER,
    CONSTRAINT "Movie_id_fkey" FOREIGN KEY ("id") REFERENCES "Sale" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Movie_id_fkey" FOREIGN KEY ("id") REFERENCES "Rental" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Movie_id_fkey" FOREIGN KEY ("id") REFERENCES "Like" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "Movie_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Movie" ("available", "description", "id", "rentalPrice", "salePrice", "stock", "title") SELECT "available", "description", "id", "rentalPrice", "salePrice", "stock", "title" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_id_key" ON "Movie"("id");
CREATE TABLE "new_Rental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerEmail" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Rental" ("customerEmail", "id", "price") SELECT "customerEmail", "id", "price" FROM "Rental";
DROP TABLE "Rental";
ALTER TABLE "new_Rental" RENAME TO "Rental";
CREATE UNIQUE INDEX "Rental_id_key" ON "Rental"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");
