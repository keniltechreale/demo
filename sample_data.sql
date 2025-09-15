-- Sample Data Insertion Script for PiuPiu Backend
-- This script populates the database with sample data for testing

USE piupiu;

-- Insert sample vehicle types
INSERT INTO `vehicle_type` (`id`, `name`, `vehicle_image`, `status`, `description`, `passengerCapacity`) VALUES
(1, 'Motorcycle', 'motorcycle.jpg', 'active', 'Fast and efficient for quick deliveries', 1),
(2, 'Car', 'car.jpg', 'active', 'Comfortable 4-seater vehicle', 4),
(3, 'Van', 'van.jpg', 'active', 'Large capacity for bulk deliveries', 8),
(4, 'Bicycle', 'bicycle.jpg', 'active', 'Eco-friendly option for short distances', 1),
(5, 'Truck', 'truck.jpg', 'active', 'Heavy duty for large shipments', 2);

-- Insert sample categories
INSERT INTO `categories` (`id`, `name`, `description`, `type`, `status`, `createdAt`, `updatedAt`, `image`, `passengerCapacity`, `vehicleType`, `category`, `stars`, `keywords`, `role`, `link`) VALUES
(1, 'Express Delivery', 'Fast delivery service', 'vehicle', 'active', NOW(), NOW(), 'express.jpg', 1, 1, NULL, 4.5, '["fast", "urgent", "quick"]', 'driver', '/express'),
(2, 'Standard Delivery', 'Regular delivery service', 'vehicle', 'active', NOW(), NOW(), 'standard.jpg', 4, 2, NULL, 4.2, '["standard", "reliable", "comfortable"]', 'driver', '/standard'),
(3, 'Bulk Delivery', 'Large quantity delivery service', 'vehicle', 'active', NOW(), NOW(), 'bulk.jpg', 8, 3, NULL, 4.0, '["bulk", "large", "commercial"]', 'driver', '/bulk'),
(4, 'Eco Delivery', 'Environmentally friendly delivery', 'vehicle', 'active', NOW(), NOW(), 'eco.jpg', 1, 4, NULL, 4.8, '["eco", "green", "sustainable"]', 'driver', '/eco'),
(5, 'Heavy Cargo', 'Heavy and large item delivery', 'vehicle', 'active', NOW(), NOW(), 'heavy.jpg', 2, 5, NULL, 4.3, '["heavy", "cargo", "industrial"]', 'driver', '/heavy');

-- Insert sample users (customers and drivers)
INSERT INTO `users` (`id`, `user_id`, `email`, `country_code`, `phone_number`, `referral_code`, `role`, `profile_picture`, `verify_account`, `biometric_lock`, `is_business_account`, `status`, `refer_friends_with`, `pincode`, `region`, `country`, `state`, `city`, `address`, `name`, `date_of_birth`, `fcm_token`, `driver_available`, `ongoing_rides`, `is_driver_online`, `driver_vehicle_type`, `driver_vehicle_category`, `currency`, `password`) VALUES
-- Customer users
(1, 'CUST001', 'john.doe@email.com', '+1', '5551234567', 'REF001', 'customer', 'john_profile.jpg', 1, 0, 0, 'active', 'REF001', '12345', 'East', 'USA', 'New York', 'New York', '123 Main St, New York, NY', 'John Doe', '1990-05-15', 'fcm_token_1', NULL, NULL, NULL, NULL, NULL, 'USD', '$2b$10$hashedpassword123'),
(2, 'CUST002', 'jane.smith@email.com', '+1', '5559876543', 'REF002', 'customer', 'jane_profile.jpg', 1, 1, 0, 'active', 'REF002', '54321', 'West', 'USA', 'California', 'Los Angeles', '456 Oak Ave, LA, CA', 'Jane Smith', '1988-12-20', 'fcm_token_2', NULL, NULL, NULL, NULL, NULL, 'USD', '$2b$10$hashedpassword456'),
(3, 'CUST003', 'mike.wilson@email.com', '+1', '5554567890', 'REF003', 'customer', 'mike_profile.jpg', 1, 0, 1, 'active', 'REF003', '67890', 'South', 'USA', 'Texas', 'Houston', '789 Pine St, Houston, TX', 'Mike Wilson', '1992-08-10', 'fcm_token_3', NULL, NULL, NULL, NULL, NULL, 'USD', '$2b$10$hashedpassword789'),

-- Driver users
(4, 'DRIV001', 'alex.brown@email.com', '+1', '5551112222', 'REF004', 'driver', 'alex_profile.jpg', 1, 0, 0, 'active', 'REF004', '11111', 'North', 'USA', 'Illinois', 'Chicago', '321 Elm St, Chicago, IL', 'Alex Brown', '1985-03-25', 'fcm_token_4', '["monday", "tuesday", "wednesday", "thursday", "friday"]', '[]', 1, '1', '1', 'USD', '$2b$10$hashedpassword111'),
(5, 'DRIV002', 'sarah.davis@email.com', '+1', '5553334444', 'REF005', 'driver', 'sarah_profile.jpg', 1, 1, 0, 'active', 'REF005', '22222', 'Central', 'USA', 'Ohio', 'Columbus', '654 Maple St, Columbus, OH', 'Sarah Davis', '1987-07-12', 'fcm_token_5', '["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]', '[]', 1, '2', '2', 'USD', '$2b$10$hashedpassword222'),
(6, 'DRIV003', 'david.lee@email.com', '+1', '5555556666', 'REF006', 'driver', 'david_profile.jpg', 1, 0, 0, 'active', 'REF006', '33333', 'East', 'USA', 'Florida', 'Miami', '987 Cedar St, Miami, FL', 'David Lee', '1990-11-30', 'fcm_token_6', '["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]', '[]', 0, '3', '3', 'USD', '$2b$10$hashedpassword333'),
(7, 'DRIV004', 'emma.wilson@email.com', '+1', '5557778888', 'REF007', 'driver', 'emma_profile.jpg', 1, 1, 0, 'active', 'REF007', '44444', 'West', 'USA', 'Washington', 'Seattle', '147 Birch St, Seattle, WA', 'Emma Wilson', '1986-09-18', 'fcm_token_7', '["monday", "tuesday", "wednesday", "thursday", "friday"]', '[]', 1, '4', '4', 'USD', '$2b$10$hashedpassword444'),
(8, 'DRIV005', 'james.martin@email.com', '+1', '5559990000', 'REF008', 'driver', 'james_profile.jpg', 1, 0, 0, 'active', 'REF008', '55555', 'South', 'USA', 'Georgia', 'Atlanta', '258 Spruce St, Atlanta, GA', 'James Martin', '1989-04-05', 'fcm_token_8', '["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]', '[]', 1, '5', '5', 'USD', '$2b$10$hashedpassword555');

-- Insert sample vehicles for drivers
INSERT INTO `vehicles` (`id`, `user`, `type`, `vehicle_platenumber`, `vehicle_model`, `vehicle_color`, `verified`, `showCard`, `documents`, `category`) VALUES
(1, 4, 1, 'MC-1234', 'Honda CBR600RR', 'Red', 1, 1, '["license", "insurance", "registration"]', 1),
(2, 5, 2, 'CA-5678', 'Toyota Camry', 'Blue', 1, 1, '["license", "insurance", "registration", "inspection"]', 2),
(3, 6, 3, 'VN-9012', 'Ford Transit', 'White', 1, 1, '["license", "insurance", "registration", "commercial"]', 3),
(4, 7, 4, 'BC-3456', 'Trek FX2', 'Green', 1, 1, '["helmet", "safety_gear"]', 4),
(5, 8, 5, 'TR-7890', 'Freightliner M2', 'Black', 1, 1, '["license", "insurance", "registration", "commercial", "cdl"]', 5);

-- Insert sample user locations for drivers
INSERT INTO `user_locations` (`id`, `user`, `latitude`, `longitude`, `status`, `online_since`, `total_online_hours`, `average_daily_hours`, `days_online`) VALUES
(1, 4, '40.7128', '-74.0060', 1, NOW(), 120.5, 8.5, 15),
(2, 5, '39.9612', '-82.9988', 1, NOW(), 95.2, 7.2, 12),
(3, 6, '25.7617', '-80.1918', 0, NULL, 78.9, 6.5, 10),
(4, 7, '47.6062', '-122.3321', 1, NOW(), 110.3, 8.8, 14),
(5, 8, '33.7490', '-84.3880', 1, NOW(), 88.7, 7.1, 11);

-- Insert sample wallets for users
INSERT INTO `wallets` (`id`, `user`, `amount`, `currency`, `symbol`, `onholdAmount`, `status`) VALUES
(1, 1, 150.00, 'USD', '$', 0.00, 'active'),
(2, 2, 75.50, 'USD', '$', 0.00, 'active'),
(3, 3, 200.00, 'USD', '$', 0.00, 'active'),
(4, 4, 320.75, 'USD', '$', 25.00, 'active'),
(5, 5, 180.25, 'USD', '$', 0.00, 'active'),
(6, 6, 95.00, 'USD', '$', 0.00, 'active'),
(7, 7, 275.50, 'USD', '$', 15.00, 'active'),
(8, 8, 145.75, 'USD', '$', 0.00, 'active');

-- Insert sample bank accounts for users
INSERT INTO `bank_accounts` (`id`, `user`, `holderName`, `routingNumber`, `accountNumber`, `dateOfBirth`, `address`, `city`, `state`, `postalCode`, `status`, `bankName`, `bankCode`, `branchCode`) VALUES
(1, 4, 'Alex Brown', '021000021', '1234567890', '1985-03-25', '321 Elm St', 'Chicago', 'IL', '60601', 'active', 'Chase Bank', 'CHASE', 'CHI001'),
(2, 5, 'Sarah Davis', '021000021', '0987654321', '1987-07-12', '654 Maple St', 'Columbus', 'OH', '43201', 'active', 'Bank of America', 'BOA', 'COL001'),
(3, 6, 'David Lee', '021000021', '1122334455', '1990-11-30', '987 Cedar St', 'Miami', 'FL', '33101', 'active', 'Wells Fargo', 'WF', 'MIA001'),
(4, 7, 'Emma Wilson', '021000021', '5566778899', '1986-09-18', '147 Birch St', 'Seattle', 'WA', '98101', 'active', 'US Bank', 'USB', 'SEA001'),
(5, 8, 'James Martin', '021000021', '9988776655', '1989-04-05', '258 Spruce St', 'Atlanta', 'GA', '30301', 'active', 'Citibank', 'CITI', 'ATL001');

-- Insert sample emergency contacts for users
INSERT INTO `emergency_contacts` (`id`, `user_id`, `contact_name`, `relationship`, `phone_number`, `email`, `country_code`, `isoCode`, `verified`) VALUES
(1, 1, 'Mary Doe', 'Spouse', '5551234568', 'mary.doe@email.com', '+1', 'US', 1),
(2, 2, 'Tom Smith', 'Brother', '5559876544', 'tom.smith@email.com', '+1', 'US', 1),
(3, 3, 'Lisa Wilson', 'Sister', '5554567891', 'lisa.wilson@email.com', '+1', 'US', 1),
(4, 4, 'Robert Brown', 'Father', '5551112223', 'robert.brown@email.com', '+1', 'US', 1),
(5, 5, 'Jennifer Davis', 'Mother', '5553334445', 'jennifer.davis@email.com', '+1', 'US', 1);

-- Insert sample user addresses
INSERT INTO `useraddress` (`id`, `user`, `type`, `name`, `address`, `pin_code`, `mobile_number`) VALUES
(1, '1', 'home', 'Home Address', '123 Main St, New York, NY', '12345', '5551234567'),
(2, '1', 'work', 'Work Address', '456 Business Ave, New York, NY', '12345', '5551234567'),
(3, '2', 'home', 'Home Address', '456 Oak Ave, LA, CA', '54321', '5559876543'),
(4, '3', 'home', 'Home Address', '789 Pine St, Houston, TX', '67890', '5554567890'),
(5, '4', 'home', 'Home Address', '321 Elm St, Chicago, IL', '11111', '5551112222');

-- Insert sample city management data
INSERT INTO `city_managements` (`id`, `country`, `state`, `city`, `currency`, `code`, `symbol`, `vehicleTypes`, `documents`, `distanceUnit`, `status`) VALUES
(1, 'USA', 'New York', 'New York', 'USD', 'NYC', '$', '[1, 2, 4]', '["license", "insurance", "registration"]', 'miles', 'active'),
(2, 'USA', 'California', 'Los Angeles', 'USD', 'LAX', '$', '[1, 2, 3, 4]', '["license", "insurance", "registration", "inspection"]', 'miles', 'active'),
(3, 'USA', 'Texas', 'Houston', 'USD', 'HOU', '$', '[1, 2, 3, 5]', '["license", "insurance", "registration", "commercial"]', 'miles', 'active'),
(4, 'USA', 'Florida', 'Miami', 'USD', 'MIA', '$', '[1, 2, 4]', '["license", "insurance", "registration"]', 'miles', 'active'),
(5, 'USA', 'Georgia', 'Atlanta', 'USD', 'ATL', '$', '[1, 2, 3, 5]', '["license", "insurance", "registration", "commercial"]', 'miles', 'active');

-- Insert sample price management data
INSERT INTO `price_managements` (`id`, `vehicleType`, `country`, `state`, `city`, `currency`, `currencySymbol`, `pricePerKg`, `pricePerKm`, `pricePerMin`, `minimumFareUSD`, `baseFareUSD`, `commissionPercentage`, `userCancellationTimeLimit`, `userCancellationCharges`, `waitingTimeLimit`, `waitingChargesUSD`, `nightCharges`, `priceNightCharges`, `status`, `vehicleCategory`) VALUES
(1, 1, 'USA', 'New York', 1, 'USD', '$', 2.50, 1.20, 0.30, 5.00, 3.00, 15.00, 5, 2.00, 10, 0.50, 1, 1.50, 'active', 1),
(2, 2, 'USA', 'California', 2, 'USD', '$', 3.00, 1.50, 0.40, 7.00, 4.00, 18.00, 5, 3.00, 10, 0.75, 1, 2.00, 'active', 2),
(3, 3, 'USA', 'Texas', 3, 'USD', '$', 4.50, 2.00, 0.50, 10.00, 6.00, 20.00, 5, 4.00, 15, 1.00, 1, 3.00, 'active', 3),
(4, 4, 'USA', 'Florida', 4, 'USD', '$', 1.50, 0.80, 0.20, 3.00, 2.00, 12.00, 5, 1.50, 8, 0.25, 0, 0.00, 'active', 4),
(5, 5, 'USA', 'Georgia', 5, 'USD', '$', 6.00, 2.50, 0.60, 15.00, 8.00, 25.00, 5, 6.00, 20, 1.50, 1, 4.00, 'active', 5);

-- Insert sample rides data
INSERT INTO `rides` (`id`, `origin`, `destination`, `date`, `rideId`, `passengerId`, `driverId`, `numberOfPassengers`, `fare`, `status`, `vehicleType`, `distanceInkm`, `durationInmins`, `paymentMethod`, `notes`, `vehicleId`, `originLocation`, `destinationLocation`, `currencyCode`, `currencySymbol`) VALUES
(1, '123 Main St, New York', '456 Business Ave, New York', '2024-01-15 09:00:00', 'RIDE001', 1, 4, 1, 25.50, 'completed', 1, 5.2, 15, 'wallet', 'Handle with care', 1, '{"lat": 40.7128, "lng": -74.0060}', '{"lat": 40.7589, "lng": -73.9851}', 'USD', '$'),
(2, '456 Oak Ave, LA', '789 Shopping Center, LA', '2024-01-15 10:30:00', 'RIDE002', 2, 5, 2, 35.75, 'completed', 2, 8.5, 22, 'card', 'Fragile items', 2, '{"lat": 39.9612, "lng": -82.9988}', '{"lat": 39.9612, "lng": -82.9988}', 'USD', '$'),
(3, '789 Pine St, Houston', '321 Industrial Park, Houston', '2024-01-15 11:15:00', 'RIDE003', 3, 6, 1, 45.00, 'in_progress', 3, 12.3, 35, 'wallet', 'Heavy equipment', 3, '{"lat": 25.7617, "lng": -80.1918}', '{"lat": 25.7617, "lng": -80.1918}', 'USD', '$');

-- Insert sample transactions
INSERT INTO `transactions` (`id`, `user`, `rideId`, `transactionType`, `amount`, `currency`, `transactionId`, `status`, `purpose`, `type`, `method`, `category`) VALUES
(1, 1, 1, 'debit', 25.50, 'USD', 'TXN001', 'success', 'Ride payment', 'ride', 'wallet', 'ride'),
(2, 4, 1, 'credit', 21.68, 'USD', 'TXN002', 'success', 'Ride earnings', 'ride', 'wallet', 'ride'),
(3, 2, 2, 'debit', 35.75, 'USD', 'TXN003', 'success', 'Ride payment', 'ride', 'card', 'ride'),
(4, 5, 2, 'credit', 29.32, 'USD', 'TXN004', 'success', 'Ride earnings', 'ride', 'wallet', 'ride');

-- Insert sample notifications
INSERT INTO `notifications` (`id`, `type`, `user`, `admin`, `title`, `body`, `isRead`, `meta_data`) VALUES
(1, 'ride_request', 4, NULL, 'New Ride Request', 'You have a new ride request from John Doe', 0, '{"rideId": "RIDE001", "passengerName": "John Doe"}'),
(2, 'ride_accepted', 1, NULL, 'Ride Accepted', 'Alex Brown has accepted your ride request', 0, '{"rideId": "RIDE001", "driverName": "Alex Brown"}'),
(3, 'ride_completed', 1, NULL, 'Ride Completed', 'Your ride has been completed successfully', 0, '{"rideId": "RIDE001", "amount": 25.50}'),
(4, 'payment_received', 4, NULL, 'Payment Received', 'Payment received for ride RIDE001', 0, '{"rideId": "RIDE001", "amount": 21.68}');

-- Insert sample feedback data
INSERT INTO `feedbacks` (`id`, `question`, `keywords`, `status`, `role`) VALUES
(1, 'How was your ride experience?', '["comfort", "safety", "cleanliness"]', 'active', 'customer'),
(2, 'How was the customer service?', '["communication", "professionalism", "helpfulness"]', 'active', 'customer'),
(3, 'How was the driving experience?', '["traffic", "road_conditions", "navigation"]', 'active', 'driver'),
(4, 'How was the app functionality?', '["ease_of_use", "reliability", "features"]', 'active', 'customer');

-- Insert sample ratings
INSERT INTO `ratings` (`id`, `user`, `ride`, `rating`, `comment`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 5.0, 'Excellent service! Driver was very professional and on time.', NOW(), NOW()),
(2, 4, 1, 5.0, 'Great customer, very polite and understanding.', NOW(), NOW()),
(3, 2, 2, 4.5, 'Good ride, driver was friendly and careful with my items.', NOW(), NOW()),
(4, 5, 2, 4.0, 'Nice customer, smooth delivery experience.', NOW(), NOW());

-- Insert sample testimonials
INSERT INTO `testimonials` (`id`, `image`, `name`, `description`, `status`) VALUES
(1, 'testimonial1.jpg', 'John Doe', 'PiuPiu has revolutionized my delivery experience. Fast, reliable, and professional service!', 'active'),
(2, 'testimonial2.jpg', 'Sarah Davis', 'As a driver, I love the flexibility and earning potential. Great platform for drivers!', 'active'),
(3, 'testimonial3.jpg', 'Mike Wilson', 'Excellent customer support and easy-to-use app. Highly recommended!', 'active');

-- Insert sample blogs
INSERT INTO `blogs` (`id`, `image`, `title`, `subtitle`, `description`, `status`, `author`, `author_image`) VALUES
(1, 'blog1.jpg', 'The Future of Delivery Services', 'How technology is transforming logistics', 'In this comprehensive guide, we explore how emerging technologies are reshaping the delivery industry...', 'active', 'PiuPiu Team', 'team.jpg'),
(2, 'blog2.jpg', 'Driver Safety Guidelines', 'Essential safety tips for delivery drivers', 'Safety should always be the top priority for delivery drivers. Here are some essential guidelines...', 'active', 'Safety Expert', 'expert.jpg'),
(3, 'blog3.jpg', 'Customer Satisfaction in Delivery', 'Building lasting relationships through service', 'Customer satisfaction is the cornerstone of any successful delivery business. Learn how to...', 'active', 'Customer Success', 'success.jpg');

-- Insert sample FAQs
INSERT INTO `faqs` (`id`, `question`, `answer`, `serial_number`, `status`) VALUES
(1, 'How do I track my delivery?', 'You can track your delivery in real-time through our mobile app. Simply go to the "My Rides" section and select your active ride.', 1, 'active'),
(2, 'What payment methods are accepted?', 'We accept various payment methods including credit/debit cards, digital wallets, and cash payments.', 2, 'active'),
(3, 'How do I become a driver?', 'To become a driver, download our app, complete the registration process, submit required documents, and pass our verification process.', 3, 'active'),
(4, 'What if my delivery is delayed?', 'If your delivery is delayed, you will be notified through the app. You can also contact our customer support for assistance.', 4, 'active');

-- Insert sample legal content
INSERT INTO `legalcontents` (`id`, `type`, `content`, `last_updated`) VALUES
(1, 'terms_and_conditions', 'These Terms and Conditions govern your use of the PiuPiu delivery service...', NOW()),
(2, 'privacy_policy', 'This Privacy Policy describes how PiuPiu collects, uses, and protects your personal information...', NOW());

-- Insert sample coupons
INSERT INTO `coupons` (`id`, `code`, `title`, `subTitle`, `usage_limit`, `start_date`, `end_date`, `type`, `minPurchaseAmount`, `maxDiscountAmount`, `isSpecificCoupon`, `isExpired`, `count`, `createdAt`, `updatedAt`, `status`) VALUES
(1, 'WELCOME20', 'Welcome Discount', 'Get 20% off your first ride', 1, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'percentage', 10.00, 20.00, 0, 0, 0, NOW(), NOW(), 'active'),
(2, 'SAVE10', 'Save $10', 'Flat $10 discount on rides over $50', 100, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 'fixed_money', 50.00, 10.00, 0, 0, 0, NOW(), NOW(), 'active'),
(3, 'NEWUSER', 'New User Special', '50% off for new users', 1, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 'percentage', 5.00, 25.00, 0, 0, 0, NOW(), NOW(), 'active');

-- Insert sample refer friends section
INSERT INTO `refer_friends_section` (`id`, `type`, `title`, `subTitle`, `code`, `description`, `walletAmount`) VALUES
(1, 'customer', 'Refer Friends', 'Earn rewards for every friend you refer', 'REFER', 'Invite your friends to PiuPiu and earn $10 for each successful referral!', 10),
(2, 'driver', 'Driver Referral', 'Help us grow our driver network', 'DRIVER', 'Refer qualified drivers and earn $25 for each successful driver signup!', 25);

-- Insert sample careers
INSERT INTO `careers` (`id`, `role`, `title`, `description`, `location`, `requirements`, `salaryRange`, `category`) VALUES
(1, 'Software Engineer', 'Full Stack Developer', 'We are looking for a talented Full Stack Developer to join our team...', 'New York, NY', '["JavaScript", "Node.js", "React", "MySQL", "3+ years experience"]', '$80,000 - $120,000', 1),
(2, 'Operations Manager', 'Delivery Operations Manager', 'Join our operations team to help manage and optimize delivery processes...', 'Los Angeles, CA', '["Logistics", "Team Management", "Analytics", "5+ years experience"]', '$70,000 - $100,000', 2);

-- Insert sample career applications
INSERT INTO `career_applications` (`id`, `career_id`, `name`, `email`, `phone_number`, `message`, `resume`, `status`) VALUES
(1, 1, 'John Developer', 'john.dev@email.com', '5551234567', 'I am very interested in this position and believe my skills align perfectly...', 'resume_john.pdf', 'pending'),
(2, 2, 'Jane Manager', 'jane.manager@email.com', '5559876543', 'I have extensive experience in operations management and would love to contribute...', 'resume_jane.pdf', 'reviewed');

-- Insert sample contact us messages
INSERT INTO `contact_us` (`id`, `first_name`, `last_name`, `email`, `phone_number`, `message`, `replied`, `replyContent`) VALUES
(1, 'Alice', 'Johnson', 'alice.johnson@email.com', '5551111111', 'I have a question about your delivery service...', 1, 'Thank you for your inquiry. Our team will get back to you shortly.'),
(2, 'Bob', 'Williams', 'bob.williams@email.com', '5552222222', 'I would like to provide feedback about my recent experience...', 0, NULL);

-- Insert sample weekly statements
INSERT INTO `weekly_statement` (`id`, `file`, `startDate`, `endDate`, `user`) VALUES
(1, 'statement_user4_week1.pdf', '2024-01-01', '2024-01-07', 4),
(2, 'statement_user5_week1.pdf', '2024-01-01', '2024-01-07', 5),
(3, 'statement_user6_week1.pdf', '2024-01-01', '2024-01-07', 6);

-- Insert sample cashout requests
INSERT INTO `cashout_requests` (`id`, `user`, `amount`, `status`, `payment_proof`, `bankAccount`, `message`) VALUES
(1, 4, 100.00, 'pending', 'proof1.pdf', 1, 'Monthly cashout request'),
(2, 5, 75.50, 'approved', 'proof2.pdf', 2, 'Weekly cashout request'),
(3, 6, 50.00, 'in_progress', 'proof3.pdf', 3, 'Emergency cashout request');

-- Insert sample OTP records
INSERT INTO `otp` (`id`, `user`, `otp`, `type`, `createAt`) VALUES
(1, '1', '1234', 'register', NOW()),
(2, '4', '5678', 'login', NOW()),
(3, '2', '9012', 'forgot_password', NOW());

-- Insert sample countries data
INSERT INTO `countries` (`countryCode`, `currencyCode`, `currencyName`, `currencySymbol`, `shortName`, `longName`, `alpha2`, `alpha3`, `isoNumericCode`, `ioc`, `capitalCity`, `tld`, `symbol`) VALUES
('US', 'USD', 'US Dollar', '$', 'USA', 'United States of America', 'US', 'USA', '840', 'USA', 'Washington', '.us', '$'),
('CA', 'CAD', 'Canadian Dollar', 'C$', 'Canada', 'Canada', 'CA', 'CAN', '124', 'CAN', 'Ottawa', '.ca', 'C$'),
('GB', 'GBP', 'British Pound', '£', 'UK', 'United Kingdom', 'GB', 'GBR', '826', 'GBR', 'London', '.uk', '£'),
('DE', 'EUR', 'Euro', '€', 'Germany', 'Germany', 'DE', 'DEU', '276', 'GER', 'Berlin', '.de', '€'),
('AU', 'AUD', 'Australian Dollar', 'A$', 'Australia', 'Australia', 'AU', 'AUS', '036', 'AUS', 'Canberra', '.au', 'A$');

-- Insert sample documents configuration
INSERT INTO `documents` (`id`, `title`, `key`, `maxFileCounts`, `maxSize`, `description`, `isRequired`, `status`, `vehicleTypes`) VALUES
(1, 'Driver License', 'driver_license', 1, 5, 'Valid driver license', 1, 1, '[1, 2, 3, 5]'),
(2, 'Vehicle Insurance', 'vehicle_insurance', 1, 5, 'Vehicle insurance certificate', 1, 1, '[1, 2, 3, 5]'),
(3, 'Vehicle Registration', 'vehicle_registration', 1, 5, 'Vehicle registration document', 1, 1, '[1, 2, 3, 5]'),
(4, 'Commercial License', 'commercial_license', 1, 5, 'Commercial driver license', 0, 1, '[3, 5]'),
(5, 'Safety Equipment', 'safety_equipment', 2, 3, 'Safety equipment certification', 0, 1, '[4]');

-- Insert sample admin user (if not exists)
INSERT INTO `admin` (`id`, `name`, `email`, `password`, `last_login`) VALUES
(1, 'Admin', 'admin@piupiu.com', '$2b$10$adminhashedpassword123', NOW())
ON DUPLICATE KEY UPDATE last_login = NOW();

-- Display summary of inserted data
SELECT 'Data Insertion Complete!' as Status;
SELECT COUNT(*) as TotalUsers FROM users;
SELECT COUNT(*) as TotalDrivers FROM users WHERE role = 'driver';
SELECT COUNT(*) as TotalVehicles FROM vehicles;
SELECT COUNT(*) as TotalVehicleTypes FROM vehicle_type;
SELECT COUNT(*) as TotalCategories FROM categories;
SELECT COUNT(*) as TotalRides FROM rides;
SELECT COUNT(*) as TotalTransactions FROM transactions;
