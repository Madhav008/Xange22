const Broker = require('../models/Broker');
const User = require('../models/User');


const createBrokerHelper = async (brokerData) => {
  try {
    const newBroker = await new Broker(brokerData).save();
    return newBroker;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createBroker = async (req, res) => {
  try {
    const newBroker = await createBrokerHelper(req.body);
    res.status(201).json(newBroker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getBrokers = async (req, res) => {
  try {
    const brokers = await Broker.find();
    res.status(200).json(brokers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBroker = async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.id);
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    res.status(200).json(broker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBroker = async (req, res) => {
  try {
    const broker = await Broker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    res.status(200).json(broker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBroker = async (req, res) => {
  try {
    const broker = await Broker.findByIdAndDelete(req.params.id);
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    res.status(200).json({ message: 'Broker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUsersByBrokerId = async (req, res) => {
  try {
    const brokerId = req.params.id;
    const users = await User.find({ brokerId });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createBrokerHelper,
  createBroker,
  getBrokers,
  getBroker,
  updateBroker,
  deleteBroker,
  getUsersByBrokerId
};

