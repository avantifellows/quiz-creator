import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AF_ACCESS_KEY_ID,
  secretAccessKey: process.env.AF_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const sns = new AWS.SNS();
export function publishMessage(sessionId: string) {
  const topicArn = process.env.AF_TOPIC_ARN;

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
