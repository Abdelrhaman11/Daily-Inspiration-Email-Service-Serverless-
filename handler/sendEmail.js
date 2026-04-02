import sendgrid from "@sendgrid/mail"
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
import axios from "axios"

export const sendEmail= async (event,context,callback)=>{
    const randQuote=await getQuote()
    const emailHTML=createEmailHTML(randQuote)
    const subs= await getSubs()
    // const mailData=JSON.parse(event.body)
    // console.log("mailData:::", mailData);

    const data={
        // to:mailData.email,
        to:subs,
        from:"abdokhaledhamed38@gmail.com",
        subject:`Daily Inspiration ${new Date().toDateString()}`,
        html:emailHTML,
    }

    try{
        await sendgrid.sendMultiple(data)
        const response={
            statusCode:200,
            body:JSON.stringify({
                success:true
            })
        }
        callback(null,response)
    }catch(error){
        return {
        statusCode:500,
        body:JSON.stringify({error:error.message})
        }
    }
 
}


const getQuote=async()=>{

    const getQuotes=await axios.get("https://502b9fki3l.execute-api.us-east-1.amazonaws.com/dev/quotes")

    const length = getQuotes.data.quotes.length;
    const randomQuote = getQuotes.data.quotes[Math.floor(Math.random() * length)];

     return randomQuote;

}


const getSubs=async()=>{

    const subscribers=await axios.get("https://502b9fki3l.execute-api.us-east-1.amazonaws.com/dev/getSubscribers")
    const list=[]
    subscribers.data.map((sub)=>{
        list.push(sub.email)
    })

    return list;

}




const createEmailHTML = (randQuote) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
   
    
    <body>
      <div class="container", style="min-height: 40vh;
      padding: 0 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;"> 
       <div class="card" style="margin-left: 20px;margin-right: 20px;">
          <div style="font-size: 14px;">
          <div class='card' style=" background: #f0c5c5;
          border-radius: 5px;
          padding: 1.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;">
      
        <p>${randQuote.quote}</p>
        <blockquote>by ${randQuote.author}</blockquote>
      
    </div>
          <br>
          </div>
          
         
          <div class="footer-links" style="display: flex;justify-content: center;align-items: center;">
            <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">Unsubscribe?</a>
            <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">About Us</a>
         
          </div>
          </div>
      
            </div>
           
    </body>
    </html>`;
};
