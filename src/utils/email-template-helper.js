import Config from '../../config';
import noFeederData from './templates/no-feeder-data';
import contractEndData from './templates/contract-end-data';
import certificateExpiredData from './templates/certificate-expired-data';
import {
  EMAIL_FOOTER_TEXT,
  EMAIL_FOOTER_HTML,
  EMAIL_START_HTML_BODY,
  EMAIL_END_HTML_BODY,
  RECAP_EMAIL_HTML_STYLE,
  EMAIL_END_HTML_HEAD,
  EMAIL_START_HTML_HEAD
} from '../app.constants';

const { webUrl } = Config.get('/');

// email templates list
let templates = noFeederData;

/**
 * Generate text email body
 *
 * @param {Object} email email object
 *
 * @return {String}
 *
 */
const generateTextEmail = (email) => {
  if (!templates || !email) return null;

  if (email.type && email.type.toLowerCase().includes('contract')) {
    templates = contractEndData;
  }

  if (email.type && email.type.toLowerCase().includes('certificate')) {
    templates = certificateExpiredData;
  }

  // generate text email body
  const body = templates.generateTextTemplate(email);
  return `${body}${EMAIL_FOOTER_TEXT}`;
};

/**
 * Generate HTML email body
 *
 * @param {Object} email email object
 *
 * @return {String}
 *
 */
const generateHTMLEmail = (email) => {
  if (!templates || !email) return null;

  if (email.type && email.type.toLowerCase().includes('contract')) {
    templates = contractEndData;
  }

  if (email.type && email.type.toLowerCase().includes('certificate')) {
    templates = certificateExpiredData;
  }

  // generate HTML email body
  const header = `${EMAIL_START_HTML_HEAD}${RECAP_EMAIL_HTML_STYLE}${EMAIL_END_HTML_HEAD}`;
  const body = templates.generateHTMLTemplate(email);
  return `${header}${EMAIL_START_HTML_BODY}${body}${EMAIL_FOOTER_HTML}${EMAIL_END_HTML_BODY}`;
};

/**
 * Generate text & HTML email body
 *
 * @param {Object} email email object
 *
 * @return {Object}
 *
 */
const generate = (email) => {
  if (!email) return null;

  // add web url to email notification
  const emailNotif = Object.assign({ url: webUrl }, email);

  // generate both text & HTML email body
  const textMail = generateTextEmail(emailNotif);
  const htmlMail = generateHTMLEmail(emailNotif);
  return { text: textMail, html: htmlMail };
};

export default { generate };
