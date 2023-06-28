-- DELETE FROM users;
-- DELETE FROM properties;
-- DELETE FROM reservations;
-- DELETE FROM property_reviews;

INSERT INTO users (name, email, password) 
VALUES ('Christian D', 'chris@gmail.com', '2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Alexa A', 'amazon@amazon.ca', '2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Siri A', 'apple@apple.ca', '2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES 
  (2, 'Cozy Retreat', 'A charming cottage in the countryside', 'https://example.com/thumbnail1.jpg', 'https://example.com/cover1.jpg', 150, 2, 1, 2, 'United States', '123 Main Street', 'Seattle', 'Washington', '12345'),
  (1, 'Modern City Loft', 'Stylish apartment in the heart of downtown', 'https://example.com/thumbnail2.jpg', 'https://example.com/cover2.jpg', 200, 1, 1, 1, 'United States', '456 Elm Street', 'New York City', 'New York', '67890'),
  (3, 'Seaside Villa', 'Luxurious beachfront villa with stunning ocean views', 'https://example.com/thumbnail3.jpg', 'https://example.com/cover3.jpg', 500, 3, 2, 3, 'Spain', '789 Beach Road', 'Barcelona', 'Catalonia', '54321');


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES 
  ('2023-07-01', '2023-07-10', 1, 2),
  ('2023-08-15', '2023-08-22', 2, 3),
  ('2023-09-05', '2023-09-12', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES 
  (2, 1, 1, 4, 'Great experience! The property exceeded our expectations.'),
  (3, 2, 2, 5, 'Highly recommended! The property had amazing amenities and a beautiful view.'),
  (1, 3, 3, 3, 'Decent stay. The property could use some improvements.');


