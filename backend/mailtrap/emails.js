const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplates.js");
const { mailTrapClient, sender } = require("./mailtrap.config.js");

const sendVerificationEmail = async (email, verificationToken) =>{
    const recipient = [{email}];
    try{
        const response = await mailTrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify Your Email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category:"Email Verification",
        });
        console.log("Email Sent Successfully",response);
    }catch(error){
        console.error("Error sending verification : ", error);
        throw new Error(`Error sending email: ${error.message}`);
    }
}

const sendWelcomeEmail = async (email,name) =>{
    const recipient = [{email}];
    try{
        const response = await mailTrapClient.send({
            from:sender,
            to:recipient,
            template_uuid: "475b9f38-2754-4445-be5d-55a3fb57edcc",
            template_variables: {
            "company_info_name": "MERN AUTH COMPANY",
            "name": name,
            }
        });
        console.log("Welcome Email Sent Successfully",response);
    }
    catch (error){
        console.error("Error sending welcome email : ", error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
}

const sendResetPasswordEmail = async (email, resetURL) =>{
    const recipient = [{email}];
    try{
        const response = await mailTrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset your Password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category:"Password Reset",
        });
        console.log("Reset Password Email Sent Successfully",response);
    }catch(error){
        console.error("Error sending reset password email : ", error);
        throw new Error(`Error sending reset password email: ${error.message}`);
    }
}

const sendResetSuccessEmail = async (email) =>{
    const recipient = [{email}];
    try{
        const response = await mailTrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password Reset Successful",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset",
        });
        console.log("Reset Success Email Sent Successfully",response);
    }catch(error){
        console.error("Error sending reset success email : ", error);
        throw new Error(`Error sending reset success email: ${error.message}`);
    }
}
module.exports = {sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail}