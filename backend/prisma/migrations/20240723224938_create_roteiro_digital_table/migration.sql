-- CreateTable
CREATE TABLE "roteiros-digitais" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visit" DATETIME NOT NULL,
    "service" DECIMAL NOT NULL,
    "technician" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "service_status" TEXT NOT NULL,
    "form_of_payment" TEXT NOT NULL,
    "parcel" TEXT NOT NULL,
    "parts" DECIMAL NOT NULL,
    "mo" DECIMAL NOT NULL,
    "tax" DECIMAL NOT NULL,
    "receipt" DECIMAL NOT NULL,
    "observation" TEXT NOT NULL
);
