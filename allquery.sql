CREATE DATABASE piupiu;

USE piupiu;

-- piupiu.admin definition

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `name` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(62) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.bank_accounts definition

CREATE TABLE `bank_accounts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user` int NOT NULL,
  `holderName` varchar(255) NOT NULL,
  `routingNumber` varchar(255) DEFAULT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(200) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','onhold','transactionInProcess') DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `bankName` varchar(255) DEFAULT NULL,
  `bankCode` varchar(250) DEFAULT NULL,
  `branchCode` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.blogs definition

CREATE TABLE `blogs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `author` varchar(100) DEFAULT NULL,
  `author_image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.city_managements definition

CREATE TABLE `city_managements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `country` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `currency` varchar(50) DEFAULT NULL,
  `code` varchar(5) DEFAULT NULL,
  `symbol` varchar(25) DEFAULT NULL,
  `vehicleTypes` json DEFAULT NULL,
  `documents` json DEFAULT NULL,
  `distanceUnit` enum('km','miles') DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.contact_us definition

CREATE TABLE `contact_us` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone_number` varchar(16) DEFAULT NULL,
  `message` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `replied` tinyint(1) DEFAULT NULL,
  `replyContent` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.countries definition

CREATE TABLE `countries` (
  `countryCode` varchar(10) NOT NULL,
  `currencyCode` varchar(38) DEFAULT NULL,
  `currencyName` varchar(130) DEFAULT NULL,
  `currencySymbol` text,
  `shortName` varchar(50) DEFAULT NULL,
  `longName` varchar(50) DEFAULT NULL,
  `alpha2` varchar(2) DEFAULT NULL,
  `alpha3` varchar(3) DEFAULT NULL,
  `isoNumericCode` varchar(3) DEFAULT NULL,
  `ioc` varchar(3) DEFAULT NULL,
  `capitalCity` varchar(25) DEFAULT NULL,
  `tld` varchar(3) DEFAULT NULL,
  `symbol` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`countryCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE career_applications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  career_id INT ,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NULL,
  message TEXT NULL,
  resume TEXT NOT NULL,
  status ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired') DEFAULT 'pending',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
-- piupiu.coupons definition

CREATE TABLE `coupons` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subTitle` varchar(255) DEFAULT NULL,
  `usage_limit` int DEFAULT '1',
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `type` enum('percentage','fixed_money') DEFAULT NULL,
  `minPurchaseAmount` decimal(10,2) DEFAULT NULL,
  `maxDiscountAmount` decimal(10,2) DEFAULT NULL,
  `applicableCategories` json DEFAULT NULL,
  `applicableUser` json DEFAULT NULL,
  `isSpecificCoupon` tinyint(1) DEFAULT '0',
  `isExpired` tinyint(1) DEFAULT '0',
  `count` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` enum('active','inactive') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.documents definition

CREATE TABLE `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT NULL,
  `key` varchar(30) DEFAULT NULL,
  `maxFileCounts` int DEFAULT NULL,
  `maxSize` int DEFAULT NULL,
  `description` varchar(40) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isRequired` tinyint(1) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `vehicleTypes` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.faqs definition

CREATE TABLE `faqs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` text,
  `answer` text NOT NULL,
  `serial_number` int NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.feedbacks definition

CREATE TABLE `feedbacks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `keywords` json DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` enum('customer','driver') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.legalcontents definition

CREATE TABLE `legalcontents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('terms_and_conditions','privacy_policy') NOT NULL,
  `content` text,
  `last_updated` datetime DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.otp definition

CREATE TABLE `otp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(10) DEFAULT NULL,
  `otp` varchar(4) DEFAULT NULL,
  `type` enum('emergency_contact','register','login','forgot_mpin','pickup','delivered','forgot_password') DEFAULT NULL,
  `createAt` datetime DEFAULT NULL,
  `ride` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=720 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.refer_friends_section definition

CREATE TABLE `refer_friends_section` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(10) NOT NULL,
  `title` varchar(100) NOT NULL,
  `subTitle` varchar(255) NOT NULL,
  `code` varchar(5) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `walletAmount` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.testimonials definition

CREATE TABLE `testimonials` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(100) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.useraddress definition

CREATE TABLE `useraddress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(5) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `pin_code` varchar(10) DEFAULT NULL,
  `mobile_number` varchar(16) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.users definition

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `country_code` varchar(6) DEFAULT NULL,
  `phone_number` varchar(18) DEFAULT NULL,
  `referral_code` varchar(10) DEFAULT NULL,
  `role` enum('customer','driver') DEFAULT NULL,
  `profile_picture` varchar(70) DEFAULT NULL,
  `verify_account` tinyint(1) DEFAULT '0',
  `biometric_lock` tinyint(1) DEFAULT '0',
  `is_business_account` tinyint(1) DEFAULT '0',
  `status` enum('active','inactive','deleted') DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `refer_friends_with` varchar(10) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `region` varchar(25) DEFAULT NULL,z`
  `country` varchar(20) DEFAULT NULL,
  `state` varchar(25) DEFAULT NULL,
  `city` varchar(16) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `driver_available` json DEFAULT NULL,
  `ongoing_rides` json DEFAULT NULL,
  `is_driver_online` tinyint(1) DEFAULT NULL,
  `driver_vehicle_type` varchar(55) DEFAULT NULL,
  `driver_vehicle_category` varchar(55) DEFAULT NULL,
  `currency` varchar(50) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.vehicle_type definition

CREATE TABLE `vehicle_type` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `vehicle_image` varchar(65) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` varchar(500) DEFAULT NULL,
  `passengerCapacity` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.weekly_statement definition

CREATE TABLE `weekly_statement` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `file` varchar(255) DEFAULT NULL,
  `startDate` varchar(255) DEFAULT NULL,
  `endDate` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.cashout_requests definition

CREATE TABLE `cashout_requests` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user` int unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','in_progress','approved','rejected') NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_proof` varchar(255) DEFAULT NULL,
  `bankAccount` int unsigned NOT NULL,
  `message` varchar(500) DEFAULT NULL,
  `transaction` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cashoutuser` (`user`),
  KEY `fk_bankAccount` (`bankAccount`),
  CONSTRAINT `fk_bankAccount` FOREIGN KEY (`bankAccount`) REFERENCES `bank_accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cashoutuser` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.categories definition

CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `type` enum('career','vehicle','feedback','footer') DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `passengerCapacity` int DEFAULT NULL,
  `vehicleType` int unsigned DEFAULT NULL,
  `category` int unsigned DEFAULT NULL,
  `stars` decimal(3,1) DEFAULT NULL,
  `keywords` json DEFAULT NULL,
  `role` enum('customer','driver') DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_vehicleType_new` (`vehicleType`),
  CONSTRAINT `fk_vehicleType_new` FOREIGN KEY (`vehicleType`) REFERENCES `vehicle_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.emergency_contacts definition

CREATE TABLE `emergency_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `contact_name` varchar(20) DEFAULT NULL,
  `relationship` varchar(20) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `country_code` varchar(10) DEFAULT NULL,
  `isoCode` varchar(10) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `emergency_contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.notifications definition

CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `user` int unsigned DEFAULT NULL,
  `admin` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `body` varchar(255) NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `meta_data` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  KEY `admin` (`admin`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`admin`) REFERENCES `admin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.price_managements definition

CREATE TABLE `price_managements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `vehicleType` int unsigned NOT NULL,
  `country` varchar(20) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `city` int unsigned DEFAULT NULL,
  `currency` varchar(17) DEFAULT NULL,
  `currencySymbol` varchar(10) DEFAULT NULL,
  `pricePerKg` decimal(10,2) NOT NULL,
  `pricePerKm` decimal(10,2) NOT NULL,
  `pricePerMin` decimal(10,2) NOT NULL,
  `minimumFareUSD` decimal(10,2) NOT NULL,
  `baseFareUSD` decimal(10,2) NOT NULL,
  `commissionPercentage` decimal(5,2) NOT NULL,
  `userCancellationTimeLimit` int NOT NULL,
  `userCancellationCharges` decimal(10,2) NOT NULL,
  `waitingTimeLimit` int DEFAULT NULL,
  `waitingChargesUSD` decimal(10,2) DEFAULT NULL,
  `nightCharges` tinyint(1) DEFAULT '0',
  `priceNightCharges` decimal(10,2) NOT NULL,
  `nightStartTime` TIME DEFAULT NULL,
  `nightEndTime` TIME DEFAULT NULL,
  `status` varchar(10) DEFAULT 'active',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `scheduleRideCharges` int DEFAULT NULL,
  `vehicleCategory` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_vehicleType` (`vehicleType`),
  KEY `fk_city` (`city`),
  KEY `fk_vehiclecategory_new` (`vehicleCategory`),
  CONSTRAINT `fk_city` FOREIGN KEY (`city`) REFERENCES `city_managements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_vehiclecategory_new` FOREIGN KEY (`vehicleCategory`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_vehicleType` FOREIGN KEY (`vehicleType`) REFERENCES `vehicle_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.user_locations definition

CREATE TABLE `user_locations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user` int unsigned NOT NULL,
  `latitude` varchar(20) DEFAULT NULL,
  `longitude` varchar(20) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `online_since` datetime DEFAULT NULL,
  `total_online_hours` float DEFAULT '0',
  `average_daily_hours` float DEFAULT '0',
  `days_online` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  CONSTRAINT `user_locations_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.vehicles definition

CREATE TABLE `vehicles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user` int unsigned NOT NULL,
  `type` int unsigned DEFAULT NULL,
  `vehicle_platenumber` varchar(30) DEFAULT NULL,
  `vehicle_model` varchar(20) DEFAULT NULL,
  `vehicle_color` varchar(15) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `showCard` tinyint(1) DEFAULT '0',
  `documents` json NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  KEY `vehicles_ibfk_2` (`type`),
  KEY `fk_category_new` (`category`),
  CONSTRAINT `fk_category_new` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vehicles_ibfk_2` FOREIGN KEY (`type`) REFERENCES `vehicle_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.wallets definition

CREATE TABLE `wallets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user` int unsigned DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `symbol` varchar(10) DEFAULT NULL,
  `onholdAmount` decimal(10,2) DEFAULT NULL,
  `status` enum('active','inactive','onhold') DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `fk_walletusers` (`user`),
  CONSTRAINT `fk_walletusers` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.careers definition

CREATE TABLE `careers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `requirements` json DEFAULT NULL,
  `salaryRange` varchar(255) DEFAULT NULL,
  `category` int unsigned DEFAULT NULL,
  `postedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  CONSTRAINT `careers_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.rides definition

CREATE TABLE `rides` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `origin` varchar(200) DEFAULT NULL,
  `destination` varchar(200) DEFAULT NULL,
  `date` datetime NOT NULL,
  `rideId` varchar(20) DEFAULT NULL,
  `passengerId` int unsigned NOT NULL,
  `driverId` int unsigned DEFAULT NULL,
  `numberOfPassengers` int DEFAULT NULL,
  `fare` float DEFAULT NULL,
  `status` enum('pending','driverAccepted','booked','in_progress','completed','cancelled','scheduled','reminderSent','finishTrip') DEFAULT NULL,
  `vehicleType` int unsigned DEFAULT NULL,
  `distanceInkm` float DEFAULT NULL,
  `durationInmins` float DEFAULT NULL,
  `paymentMethod` varchar(20) DEFAULT NULL,
  `notes` varchar(50) DEFAULT NULL,
  `customerRating` decimal(3,1) DEFAULT NULL,
  `driverRating` decimal(3,1) DEFAULT NULL,
  `cancellationReason` varchar(25) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `driverAcceptStatus` varchar(20) DEFAULT NULL,
  `passengersAudioInstructions` varchar(100) DEFAULT NULL,
  `passengersTextInstructions` varchar(300) DEFAULT NULL,
  `vehicleId` int unsigned DEFAULT NULL,
  `originLocation` json DEFAULT NULL,
  `destinationLocation` json DEFAULT NULL,
  `isScheduled` tinyint(1) DEFAULT '0',
  `otpVerfied` tinyint(1) DEFAULT '0',
  `customerFeedBack` json DEFAULT NULL,
  `customerComment` varchar(500) DEFAULT NULL,
  `coupon` int unsigned DEFAULT NULL,
  `finalAmount` float DEFAULT NULL,
  `paymentSuccessful` tinyint(1) DEFAULT '0',
  `driverComment` varchar(255) DEFAULT NULL,
  `driverFeedBack` json DEFAULT NULL,
  `paymentStatus` varchar(50) DEFAULT NULL,
  `currencyCode` varchar(50) DEFAULT NULL,
  `currencySymbol` varchar(50) DEFAULT NULL,
  `driverCommissionPer` float DEFAULT NULL,
  `driverCommissionAmount` float DEFAULT NULL,
  `driversTip` decimal(10,2) DEFAULT NULL,
  `isNotified` tinyint(1) DEFAULT '0',
  `mapScreenshot` varchar(255) DEFAULT NULL,
  `file` varchar(150) DEFAULT NULL,
  `dropOffTime` datetime DEFAULT NULL,
  `pickupTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `passengerId` (`passengerId`),
  KEY `driverId` (`driverId`),
  KEY `vehicleType` (`vehicleType`),
  KEY `fk_vehicle` (`vehicleId`),
  KEY `fk_coupon` (`coupon`),
  CONSTRAINT `fk_coupon` FOREIGN KEY (`coupon`) REFERENCES `coupons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_vehicle` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rides_ibfk_1` FOREIGN KEY (`passengerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rides_ibfk_2` FOREIGN KEY (`driverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rides_ibfk_3` FOREIGN KEY (`vehicleType`) REFERENCES `vehicle_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=277 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- piupiu.transactions definition

CREATE TABLE `transactions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user` int NOT NULL,
  `rideId` int unsigned DEFAULT NULL,
  `transactionType` enum('credit','debit') DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `transactionId` varchar(255) DEFAULT NULL,
  `status` enum('success','failed','intialized','inprogress','successful') DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `type` enum('ride','wallet','tip','cashout') DEFAULT NULL,
  `tx_ref` varchar(255) DEFAULT NULL,
  `flw_ref` varchar(255) DEFAULT NULL,
  `device_fingerprint` varchar(255) DEFAULT NULL,
  `charged_amount` decimal(10,2) DEFAULT NULL,
  `app_fee` decimal(10,2) DEFAULT NULL,
  `merchant_fee` decimal(10,2) DEFAULT NULL,
  `processor_response` varchar(255) DEFAULT NULL,
  `auth_model` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `narration` varchar(255) DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `amount_settled` decimal(10,2) DEFAULT NULL,
  `customer` json DEFAULT NULL,
  `currentWalletbalance` decimal(10,2) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `method` varchar(100) DEFAULT NULL,
  `category` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rideId` (`rideId`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`rideId`) REFERENCES `rides` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `ratings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user` INT UNSIGNED NOT NULL,
  `driver` INT UNSIGNED DEFAULT NULL,
  `ride` INT UNSIGNED DEFAULT NULL,
  `type` VARCHAR(255) DEFAULT NULL,
  `reason` VARCHAR(255) DEFAULT NULL,
  `stars` DECIMAL(3,1) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rating_user` (`user`),
  KEY `fk_rating_driver` (`driver`),
  KEY `fk_rating_ride` (`ride`),
  CONSTRAINT `fk_rating_user` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rating_driver` FOREIGN KEY (`driver`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rating_ride` FOREIGN KEY (`ride`) REFERENCES `rides` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `additional_fees` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('VAT', 'PlatformFee', 'AdminFee') NOT NULL,
  `percentage` FLOAT NOT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `applyOn` ENUM('ride_total', 'cashout') DEFAULT 'ride_total',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `referrals` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `referrer_id` INT UNSIGNED NOT NULL,
  `referee_id` INT UNSIGNED DEFAULT NULL,
  `referral_code` VARCHAR(50) NOT NULL,
  `status` ENUM('pending','completed','expired') DEFAULT 'pending',
  `valid_until` DATE DEFAULT NULL,
  `referrer_use_count` INT DEFAULT 0,      
  `referee_use_count` INT DEFAULT 0,   
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_referral_referrer` (`referrer_id`),
  KEY `fk_referral_referee` (`referee_id`),
  CONSTRAINT `fk_referral_referrer` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_referral_referee` FOREIGN KEY (`referee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


`