/*
  Warnings:

  - Added the required column `mobile` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform" TEXT NOT NULL,
    "mobile" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Device" ("auth", "createdAt", "endpoint", "expiresAt", "id", "p256dh", "updatedAt", "userId") SELECT "auth", "createdAt", "endpoint", "expiresAt", "id", "p256dh", "updatedAt", "userId" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
