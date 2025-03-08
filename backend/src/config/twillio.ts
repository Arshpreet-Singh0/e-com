import twilio from "twilio";

const twilioClient = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

export default twilioClient;