import lo from 'lodash';
import logger from '../../config/logger';
import transporter from '../../config/email';
import {
  EMAIL_START_HTML_BODY,
  EMAIL_END_HTML_BODY,
  EMAIL_TYPES
} from '../fixtures/email';

import { notifTugApproachPortTemplate } from './templates';

const emailSender = '"No Reply" <noreply@banpuindo.co.id>';

const templates = {
  [EMAIL_TYPES.notificationTugApproachingPort]: notifTugApproachPortTemplate
};

const TAG = 'mailHelper';

const sendMail = async (dataForTemplate, userRecipients, subject, emailType) => {
  const htmlHeader = `${templates[emailType].style()}`;
  const header = lo.template(EMAIL_START_HTML_BODY)({ header: htmlHeader });
  const html = `${header}${templates[emailType].generateHTMLTemplate(dataForTemplate, userRecipients)}${EMAIL_END_HTML_BODY}`;
  const mailOptions = {
    from: emailSender,
    to: Array.isArray(userRecipients) ? [...userRecipients.map(user => user.mail)] : userRecipients.mail || 'yohanmarettigasatu@gmail.com',
    subject,
    html
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(`${TAG}:sendMail`, JSON.stringify(error));
    } else {
      logger.info(`${TAG}:sendMail`, JSON.stringify(info));
    }
  });
};

export default { sendMail };
