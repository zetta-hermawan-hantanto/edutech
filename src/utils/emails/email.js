const ErrorModel = require('../../database/models/error.model');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const { ApolloError } = require('apollo-server-express');

dotenv.config();

AWS.config.update({ region: process.env.AWS_SES_REGION });

const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION,
};

const RegistrationParamsEmail = ({ name, email, link }) => {
  if (!name || !email || !link) {
    throw new ApolloError('Name, email, link is required!');
  }

  const params = {
    Destination: {
      CcAddresses: ['hermawan.hant@gmail.com'],
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
              <html>
                <body>
                  <h1>Welcome, ${name}!</h1>
                  <p>Thank you for registering. Please click the link below to verify your email address:</p>
                  <a href="${link}">Verify Email</a>
                  <p>If you did not register for this account, please ignore this email.</p>
                </body>
              </html>
            `,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `
              Welcome, ${name}!
              
              Thank you for registering. Please click the link below to verify your email address:
              ${link}
              
              If you did not register for this account, please ignore this email.
            `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Registration Confirmation',
      },
    },
    Source: 'hermawan.hant@gmail.com',
    ReplyToAddresses: [email],
  };

  return params;
};

const REGISTRATION = async ({ name, email, link }) => {
  try {
    if (!name || !email || !link) {
      throw new ApolloError('Name, email, link is required!');
    }

    const params = RegistrationParamsEmail({ name, email, link });

    await new AWS.SES(SESConfig).sendEmail(params).promise();
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'REGISTRATION',
      parameter_function: JSON.stringify({ name, email, link }),
      path: 'src/utils/emails/email.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  REGISTRATION,
};
