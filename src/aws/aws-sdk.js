const AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1",
});

const sns = new AWS.SNS();
function publishMessage(sessionId) {
  const topicArn = process.env.NEXT_PUBLIC_TOPIC_ARN;

  const params = {
    Message: sessionId.toString(),
    TopicArn: topicArn,
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.error("Error publishing message:", err);
    } else {
      console.log("Message published:", data.MessageId);
    }
  });
}

module.exports = {
  publishMessage,
};
