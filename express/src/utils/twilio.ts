

export const sendSms=(text:string,number:string)=>{
    const accountSid = process.env.ACCOUNTSID;
    const authToken = process.env.TIWLIOAUTHTOKEN;
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: text,
            from: process.env.TWILIONUMBER,
            to: '+916232725216'
        })
        .then((message: { sid: string; }) => console.log(message.sid))
        .catch((error: Error) => console.error(error));
        
}
