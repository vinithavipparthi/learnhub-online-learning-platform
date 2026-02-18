require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/config');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const adminRoutes = require('./routes/admin');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Seed demo data
const seedData = async () => {
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      // Create demo teacher
      let teacher = await User.findOne({ email: 'teacher@demo.com' });
      if (!teacher) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        teacher = new User({
          name: 'Demo Teacher',
          email: 'teacher@demo.com',
          password: hashedPassword,
          role: 'teacher'
        });
        await teacher.save();
      }

      // Demo courses by category
      const courses = [
        { title: 'Python for Beginners', description: 'Learn Python from scratch', price: 29.99, category: 'Programming', teacher: teacher._id },
        { title: 'Web Development with React', description: 'Master React.js and build modern web apps', price: 49.99, category: 'Programming', teacher: teacher._id },
        { title: 'JavaScript Advanced', description: 'Advanced JavaScript concepts and patterns', price: 39.99, category: 'Programming', teacher: teacher._id },
        { title: 'UI/UX Design Masterclass', description: 'Design beautiful user interfaces', price: 59.99, category: 'Design', teacher: teacher._id },
        { title: 'Figma for Designers', description: 'Complete Figma tutorial for professionals', price: 44.99, category: 'Design', teacher: teacher._id },
        { title: 'Business Strategy 101', description: 'Learn business fundamentals', price: 34.99, category: 'Business', teacher: teacher._id },
        { title: 'Digital Marketing Guide', description: 'Master digital marketing strategies', price: 54.99, category: 'Business', teacher: teacher._id },
        { title: 'Data Science Basics', description: 'Introduction to data science and analytics', price: 64.99, category: 'Programming', teacher: teacher._id },
        { title: 'Machine Learning 101', description: 'Start your ML journey', price: 69.99, category: 'Programming', teacher: teacher._id },
        { title: 'Mobile App Development', description: 'Build iOS and Android apps', price: 59.99, category: 'Programming', teacher: teacher._id },
        { title: 'Leadership Skills', description: 'Become an effective leader', price: 39.99, category: 'Business', teacher: teacher._id },
        { title: 'Creative Writing', description: 'Master the art of creative writing', price: 29.99, category: 'Writing', teacher: teacher._id }
      ];

      await Course.insertMany(courses);
      console.log('✅ Demo courses seeded successfully!');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

seedData();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('OLP Backend'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));