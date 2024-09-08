const express = require('express');
const UserModel = require('../database/models/user.model');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/registrationConfirmation/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'ID is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID is not valid',
      });
    }

    const userFind = await UserModel.findById(id);

    if (!userFind) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    await UserModel.findByIdAndUpdate(userFind._id, {
      $set: { is_verified: true },
    });

    return res.status(200).json({
      message: 'Successfully activated your account',
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
});

module.exports = router;
