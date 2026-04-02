
import AWS  from "aws-sdk";
const USERS_TABLE = process.env.USERS_TABLE;
AWS.config.update({ region: process.env.REGION });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
import uuid from "uuid"

export const subscribeUser=(event , context , callback)=>{

    const data =JSON.pars(event.body)
    console.log("Event:::", data);
    const timestamp= new Date().getTime()

    if(typeof data.email !== "string"){
        console.error("Email must be a string")
        return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if(!isValidEmail){
        console.error("Invalid email format")
        return;
    }

    const params={
        TableName:USERS_TABLE,
        Item:{
            id:uuid.v1(),
            email:isValidEmail,
            subscriber: true,
            createdAt:timestamp,
            updatedAt:timestamp,

        },
        ConditionExpression: "attribute_not_exists(email)"
    }

    dynamoDb.put(params, (error,data)=>{
        if(error){
            console.error(error)

            if (error.code === "ConditionalCheckFailedException"){
                return callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Email already exists" })
                });
            }
            
        }

        const response={
            statusCode:200,
            body:JSON.stringify({
                message:`sucessfully subcribed ${params.Item.email}`,
                item:params.Item
            })
        }
        callback(null, response)
    })

    
}