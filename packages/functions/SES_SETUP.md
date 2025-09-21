# AWS SES Email Configuration

This document describes how to configure AWS Simple Email Service (SES) for sending reminder emails in the AGT-Tauglich application.

## Required Environment Variables

The following environment variables must be configured in your Firebase Functions environment:

### AWS Credentials
- `AWS_ACCESS_KEY_ID` - AWS access key with SES permissions
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key

### SES Configuration
- `SES_REGION` - AWS region where SES is configured (default: `eu-central-1`)
- `SES_FROM_EMAIL` - Verified sender email address in SES
- `SES_FROM_NAME` - Display name for the sender (default: `rescueTABLET`)

## AWS SES Setup

1. **Verify Your Email Domain/Address**
   - Go to AWS SES Console
   - Verify the domain or email address you want to send from
   - Set `SES_FROM_EMAIL` to the verified address

2. **Create IAM User with SES Permissions**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ses:SendEmail",
           "ses:SendRawEmail"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. **Configure Environment Variables**
   ```bash
   # Set in Firebase Functions
   firebase functions:config:set \
     aws.access_key_id="YOUR_ACCESS_KEY" \
     aws.secret_access_key="YOUR_SECRET_KEY" \
     ses.region="eu-central-1" \
     ses.from_email="noreply@yourcomany.com" \
     ses.from_name="Your Company Name"
   ```

## Testing

The email service automatically detects test environments and uses mock implementations during testing. In production, it will use SES to send actual emails.

## Error Handling

Email sending errors are logged but do not break the reminder flow. Failed emails should be monitored through Firebase Functions logs.

## Regional Considerations

- Use `eu-central-1` (Frankfurt) for European compliance
- Ensure your SES account is out of sandbox mode for production use
- Configure bounce and complaint handling as required by AWS SES policies