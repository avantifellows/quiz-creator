const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AF_ACCESS_KEY_ID,
  secretAccessKey: process.env.AF_SECRET_ACCESS_KEY,
  region: 'ap-south-1',
});

const sns = new AWS.SNS();

function publishMessage(message) {
  const TopicArn = process.env.AF_TOPIC_ARN;
  const environment = process.env.APP_ENV ?? 'production';
  const Message = JSON.stringify({ environment, ...message });
  const params = { Message, TopicArn };

  if (environment === 'testing') {
    console.info('[SNS DEBUG] publishing message : ', Message);
    return;
  }

  sns.publish(params, (error, data) => {
    if (error) {
      console.error('[SNS ERROR] publishing message : ', Message, error);
    } else {
      console.info('[SNS SUCCESS] publishing message : ', Message, data.MessageId);
    }
  });
}

module.exports = { publishMessage };
