-- CreateTable
CREATE TABLE `APIKey` (
    `api_key_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `api_key_ref` VARCHAR(36) NOT NULL,
    `api_key_title` VARCHAR(125) NOT NULL DEFAULT '',
    `api_key_name` VARCHAR(125) NOT NULL DEFAULT '',
    `api_key_value` VARCHAR(255) NOT NULL,
    `api_key_enabled` BOOLEAN NOT NULL DEFAULT true,
    `api_key_created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `api_key_updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `APIKey_api_key_id_key`(`api_key_id`),
    UNIQUE INDEX `APIKey_api_key_value_key`(`api_key_value`),
    PRIMARY KEY (`api_key_ref`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `APIKeyToPermission` (
    `api_key_to_permission_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `api_key_to_permission_ref` VARCHAR(36) NOT NULL,
    `api_key_ref` VARCHAR(36) NOT NULL,
    `permission_ref` VARCHAR(36) NOT NULL,
    `permission_enabled` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `APIKeyToPermission_api_key_to_permission_id_key`(`api_key_to_permission_id`),
    UNIQUE INDEX `APIKeyToPermission_api_key_ref_permission_ref_key`(`api_key_ref`, `permission_ref`),
    PRIMARY KEY (`api_key_to_permission_ref`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `permission_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `permission_ref` VARCHAR(36) NOT NULL,
    `permission_name` VARCHAR(125) NOT NULL,
    `permission_group` VARCHAR(255) NOT NULL,
    `permission_scope` ENUM('public', 'private', 'public_or_private') NOT NULL,
    `permission_title` VARCHAR(125) NULL,
    `permission_description` VARCHAR(255) NULL,
    `permission_enabled` BOOLEAN NOT NULL DEFAULT true,
    `permission_created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `permission_updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `Permission_permission_id_key`(`permission_id`),
    UNIQUE INDEX `Permission_permission_name_permission_scope_key`(`permission_name`, `permission_scope`),
    PRIMARY KEY (`permission_ref`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `article_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `price` FLOAT NOT NULL,
    `currency_id` INTEGER UNSIGNED NOT NULL,
    `provider_id` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `Article_article_id_key`(`article_id`),
    PRIMARY KEY (`article_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Provider` (
    `provider_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `provider_code` VARCHAR(200) NOT NULL,
    `provider_name` VARCHAR(200) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `Provider_provider_id_key`(`provider_id`),
    UNIQUE INDEX `Provider_provider_code_key`(`provider_code`),
    PRIMARY KEY (`provider_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency` (
    `currency_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `currency_code` CHAR(3) NOT NULL,
    `currency_name` VARCHAR(200) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `Currency_currency_id_key`(`currency_id`),
    UNIQUE INDEX `Currency_currency_code_key`(`currency_code`),
    PRIMARY KEY (`currency_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `APIKeyToPermission` ADD CONSTRAINT `APIKeyToPermission_api_key_ref_fkey` FOREIGN KEY (`api_key_ref`) REFERENCES `APIKey`(`api_key_ref`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `APIKeyToPermission` ADD CONSTRAINT `APIKeyToPermission_permission_ref_fkey` FOREIGN KEY (`permission_ref`) REFERENCES `Permission`(`permission_ref`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `Provider`(`provider_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_currency_id_fkey` FOREIGN KEY (`currency_id`) REFERENCES `Currency`(`currency_id`) ON DELETE CASCADE ON UPDATE CASCADE;
