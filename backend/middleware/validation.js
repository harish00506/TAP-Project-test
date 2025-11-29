const Joi = require('joi');

// Validation for user registration
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
  });
  return schema.validate(data);
};

// Validation for user login
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  });
  return schema.validate(data);
};

// Validation for leave request
const leaveRequestValidation = (data) => {
  const schema = Joi.object({
    leaveType: Joi.string().valid('sick', 'casual', 'vacation').required().messages({
      'string.empty': 'Leave type is required',
      'any.only': 'Leave type must be sick, casual, or vacation',
    }),
    startDate: Joi.date().min('now').required().messages({
      'date.base': 'Start date must be a valid date',
      'date.min': 'Start date cannot be in the past',
      'any.required': 'Start date is required',
    }),
    endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
      'date.base': 'End date must be a valid date',
      'date.min': 'End date must be after or equal to start date',
      'any.required': 'End date is required',
    }),
    totalDays: Joi.number().min(0.5).required().messages({
      'number.base': 'Total days must be a number',
      'number.min': 'Total days must be at least 0.5',
      'any.required': 'Total days is required',
    }),
    reason: Joi.string().min(10).max(500).required().messages({
      'string.empty': 'Reason is required',
      'string.min': 'Reason must be at least 10 characters',
      'string.max': 'Reason must not exceed 500 characters',
    }),
  });
  return schema.validate(data);
};

// Validation for manager actions (approve/reject)
const managerActionValidation = (data) => {
  const schema = Joi.object({
    managerComment: Joi.string().min(5).max(500).required().messages({
      'string.empty': 'Manager comment is required',
      'string.min': 'Comment must be at least 5 characters',
      'string.max': 'Comment must not exceed 500 characters',
    }),
  });
  return schema.validate(data);
};

// Validation for profile update
const updateProfileValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
    }),
    currentPassword: Joi.string().when('newPassword', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    newPassword: Joi.string().min(6).messages({
      'string.min': 'Password must be at least 6 characters',
    }),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  leaveRequestValidation,
  managerActionValidation,
  updateProfileValidation,
};
