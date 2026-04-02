import AWS  from "aws-sdk";
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getSubscriber = (event, context, callback) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      id: event.pathParameters.userId,
    },
  };

  dynamoDb.get(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }

    const response = data.Item? {
          statusCode: 200,
          body: JSON.stringify(data.Item),
        }: {
          statusCode: 404,
          body: JSON.stringify({ message: "Subscriber Not Found" }),
        };
    callback(null, response);
  });
};
