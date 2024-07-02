const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AF_ACCESS_KEY_ID,
  secretAccessKey: process.env.AF_SECRET_ACCESS_KEY,
  region: 'ap-south-1',
});

const sns = new AWS.SNS();

function publishMessage(message) {
  const TopicArn = process.env.AF_TOPIC_ARN;
  const Message = { environment: 'production', ...message };
  const params = { Message, TopicArn };

  sns.publish(params, (error, data) => {
    if (error) {
      console.error('[SNS ERROR] publishing message : ', error);
    } else {
      console.info('[SNS SUCCESS] publishing message : ', data.MessageId);
    }
  });
}

module.exports = { publishMessage };
