import aws from "aws-sdk"
const sns=new aws.SNS()
import axios from "axios"


const publishToSNS = (message) =>
  sns.publish({
      Message: message,
      TopicArn: process.env.SNS_TOPIC_ARN,
    }).promise();

const buildEmailBody = (id, form) => {
  return `
         Message: ${form.message}
         Name: ${form.name}
         Email: ${form.email}
         Service information: ${id.sourceIp} - ${id.userAgent}
      `;
};


export const staticMailer=async(event)=>{
    console.log("Event:::",event);
    const data = JSON.parse(event.body)
    const emailBody = buildEmailBody(event.requestContext.identity, data);


    await publishToSNS(emailBody);


    
  await axios.post("https://502b9fki3l.execute-api.us-east-1.amazonaws.com/dev/subscribe",
      { email: data.email }
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log("Error subscribing user:::", error);
    });



    return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Credentials": false, 
    },
    body: JSON.stringify({ message: "OK" }),
    };
     
}