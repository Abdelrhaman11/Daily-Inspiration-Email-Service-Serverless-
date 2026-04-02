import AWS  from "aws-sdk";
AWS.config.update({region:process.env.REGION})
const s3= new AWS.S3()



export const getQuotes=async(event,context,callback)=>{
    console.log("Incoming:::", event);



    s3.getObject({
        Bucket: "myquotesbuckett",
        Key: "quotes.json"
    },
    function (err,data) {
        if(err){
            console.error(err)
            callback(new Error(err))
            return;
        }else{
            const json =JSON.parse(data.Body)
            console.log("JSON:::", json);

          const response = {
           headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": "*", 
           },
           statusCode: 200,
           body: JSON.stringify(json)
          
        }

            callback(null , response)




            
        }

    },

)




    
    const result=await s3.listObjectsV2({
        Bucket:process.env.BUCKET_NAME
    }).promise()

    const quotes=result.Contents.map(content=>content.Key)

    const response={
        statusCode:200,
        headers:{
            "Access-Control-Allow-Origin":"*"
        },
        body:JSON.stringify({
            quotes:quotes
        })
    }

    callback(null,response)
    
}