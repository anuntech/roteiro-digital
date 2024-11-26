-- CreateTable
CREATE TABLE `checklistAnuntech` (
    `id` VARCHAR(191) NOT NULL,
    `entity_id` INTEGER NULL,
    `company_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `company_name` VARCHAR(191) NULL,
    `order_id` VARCHAR(191) NULL,
    `technical_name` VARCHAR(191) NULL,
    `order_classification` VARCHAR(191) NULL,
    `service_order_status` VARCHAR(191) NULL,
    `payment_method` VARCHAR(191) NULL,
    `payment_condition` VARCHAR(191) NULL,
    `parts_value` DOUBLE NULL,
    `labor_value` DOUBLE NULL,
    `visit_fee` DOUBLE NULL,
    `received_value` DOUBLE NULL,
    `advance_revenue` DOUBLE NULL,
    `revenue_deduction` DOUBLE NULL,
    `notes` TEXT NULL,
    `payment_receipt` TEXT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `technical` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklist_whirlpool` (
    `id` VARCHAR(191) NOT NULL,
    `entity_id` INTEGER NULL,
    `company_id` INTEGER NULL,
    `appliance_id` VARCHAR(191) NULL,
    `sku_code` VARCHAR(191) NULL,
    `purchase_date` VARCHAR(191) NULL,
    `invoice_number` VARCHAR(191) NULL,
    `invoice_photo` VARCHAR(191) NULL,
    `engineering_version` VARCHAR(191) NULL,
    `appliance_serial_number` VARCHAR(191) NULL,
    `label_photo` VARCHAR(191) NULL,
    `consumer_id` VARCHAR(191) NULL,
    `cell_phone_number` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `responsible_type` VARCHAR(191) NULL,
    `responsible_name` VARCHAR(191) NULL,
    `responsible_doc_number` VARCHAR(191) NULL,
    `order_id` VARCHAR(191) NULL,
    `confirmed_defect` VARCHAR(191) NULL,
    `confirmed_defect2` VARCHAR(191) NULL,
    `failure_photo1` VARCHAR(191) NULL,
    `failure_photo2` VARCHAR(191) NULL,
    `failure_photo3` VARCHAR(191) NULL,
    `failure_photo4` VARCHAR(191) NULL,
    `failure_photo5` VARCHAR(191) NULL,
    `technical_report` TEXT NULL,
    `signature` VARCHAR(191) NULL,
    `final_status_id` VARCHAR(191) NULL,
    `final_reason_id` VARCHAR(191) NULL,
    `rescheduling_date` DATETIME(3) NULL,
    `rescheduling_period` VARCHAR(191) NULL,
    `parts_price` DOUBLE NULL,
    `labor_price` DOUBLE NULL,
    `visit_price` DOUBLE NULL,
    `displacement_price` DOUBLE NULL,
    `total_price` DOUBLE NULL,
    `received_price` DOUBLE NULL,
    `payment_method` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `service_warranty` VARCHAR(191) NULL,
    `parts_warranty` VARCHAR(191) NULL,
    `approved` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `technicals` (
    `id` VARCHAR(191) NOT NULL,
    `technical_number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `technicals_technical_number_key`(`technical_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
