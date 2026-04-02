import AWS  from "aws-sdk";
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const deleteSubscriber = (event, context, callback) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      id: event.pathParameters.userId,
    },
  };

  dynamoDb.delete(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({ data: "Deletion Successful!" }),
    };
    callback(null, response);
  });
};
