const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

// Configure the SNS client
const snsClient = new SNSClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AF_ACCESS_KEY_ID,
    secretAccessKey: process.env.AF_SECRET_ACCESS_KEY,
  },
});

async function publishMessage(message) {
  const TopicArn = process.env.AF_TOPIC_ARN;
  const environment = process.env.APP_ENV ?? 'production';
  const Message = JSON.stringify({ environment, ...message });

  if (environment === 'testing') {
    console.info('[SNS DEBUG] publishing message : ', Message);
    return;
  }

  const params = {
    Message,
    TopicArn,
  };

  try {
    const command = new PublishCommand(params);
    const data = await snsClient.send(command);
    console.info('[SNS SUCCESS] publishing message : ', Message, data.MessageId);
  } catch (error) {
    console.error('[SNS ERROR] publishing message : ', Message, error);
  }
}

module.exports = { publishMessage };
