const AWS = require("aws-sdk");

const sns = new AWS.SNS();
function publishMessage(sessionId) {
  const topicArn = "arn:aws:sns:ap-south-1:111766607077:sessionCreator";

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
