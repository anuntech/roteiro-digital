-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_roteiros-digitais" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visit" DATETIME NOT NULL,
    "service" DECIMAL NOT NULL,
    "technician" TEXT,
    "at" TEXT,
    "classification" TEXT,
    "service_status" TEXT,
    "form_of_payment" TEXT,
    "parcel" TEXT,
    "parts" DECIMAL,
    "mo" DECIMAL,
    "tax" DECIMAL,
    "receipt" DECIMAL,
    "observation" TEXT,
    "photo" TEXT
);
INSERT INTO "new_roteiros-digitais" ("classification", "form_of_payment", "id", "mo", "observation", "parcel", "parts", "receipt", "service", "service_status", "tax", "technician", "visit") SELECT "classification", "form_of_payment", "id", "mo", "observation", "parcel", "parts", "receipt", "service", "service_status", "tax", "technician", "visit" FROM "roteiros-digitais";
DROP TABLE "roteiros-digitais";
ALTER TABLE "new_roteiros-digitais" RENAME TO "roteiros-digitais";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
