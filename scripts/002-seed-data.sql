-- Insert sample users for testing
INSERT INTO users (telegram_id, name, age, gender, bio, profile_picture) VALUES
('123456789', 'Alice Johnson', 25, 'female', 'Love hiking and photography! Looking for someone to explore the world with.', '/placeholder.svg?height=400&width=400'),
('987654321', 'Bob Smith', 28, 'male', 'Software developer by day, chef by night. Let''s cook something amazing together!', '/placeholder.svg?height=400&width=400'),
('456789123', 'Emma Wilson', 23, 'female', 'Yoga instructor and dog lover. Seeking genuine connections and good vibes.', '/placeholder.svg?height=400&width=400'),
('789123456', 'David Brown', 30, 'male', 'Travel enthusiast and coffee addict. Always up for an adventure!', '/placeholder.svg?height=400&width=400'),
('321654987', 'Sarah Davis', 26, 'female', 'Artist and bookworm. Looking for someone who appreciates creativity and deep conversations.', '/placeholder.svg?height=400&width=400')
ON CONFLICT (telegram_id) DO NOTHING;
