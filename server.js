const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.db || 'mongodb://localhost:27017/formData';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Create a Schema and Model
const FormSchema = new mongoose.Schema({
  name: String,
  amount: String,
  date: String
});

const Form = mongoose.model('Form', FormSchema);

// Routes
app.post('/api/submit', async (req, res) => {
  try {
    const formData = new Form(req.body);
    await formData.save();
    res.status(201).send('Form data saved successfully');
  } catch (error) {
    res.status(400).send('Error saving form data');
  }
});

app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).send('Error fetching form data');
  }
});

app.put('/api/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, date } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(id, { name, amount, date }, { new: true });
    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(400).send('Error updating form data');
  }
});

app.delete('/api/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Form.findByIdAndDelete(id);
    res.status(200).send('Form data deleted successfully');
  } catch (error) {
    res.status(400).send('Error deleting form data');
  }
});

// Start the server
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
