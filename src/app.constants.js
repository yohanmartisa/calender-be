// API
export const API_ATTACHMENT_HEADER_CONTENT_DISPOSITION = o => `attachment; filename=${o.filename}`;
export const API_EXPOSE_HEADER_CONTENT_DISPOSITION = 'Content-disposition';

// QUERY
export const QUERY_ORDER_DESC = 'DESC';
export const QUERY_ORDER_ASC = 'ASC';

// VALIDATION
export const VALIDATIONS = {
  UNIQUE: key => `The ${key} has already been taken.`,
  DATE_RANGE: () => 'Filter date range exceed allowed duration.'
};

// STORAGE
export const STORAGE_IMAGES_ROOT_DIR = 'storage/public/images/';
export const STORAGE_TUGS_BASE_DIR = 'tugs/';

// DATETIME
export const TIMEZONE = 'Asia/Makassar'; // GMT +08:00
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_EMAIL_FORMAT = 'MMM DD, YYYY';
export const DATE_TIME_EMAIL_FORMAT = 'DD MMM YYYY HH:mm:ss [(WITA)]';
export const DATE_TIME_EXCEL_FORMAT = 'DD-MMM-YY HH:mm:ss [(WITA)]';
export const START_DAY_TIME = {
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}; // `moment-js` time object
export const END_DAY_TIME = {
  hour: 23,
  minute: 59,
  second: 59,
  millisecond: 999
}; // `moment-js` time object

// LOG
export const LOG_LEVEL_ERROR = 'error';
export const LOG_LEVEL_WARN = 'warn';
export const LOG_LEVEL_INFO = 'info';

// STRINGS
export const EMPTY_STRING = '';
export const PIPE_SEPARATOR = '|';
export const NOT_AVAILABLE = 'N/A';
export const BOCT = 'BoCT';
export const DEFAULT_VESSEL_NAME = 'default';
export const UNREGISTERED_COMPANY = 'Unregistered Company';

// EMAIL
export const EMAIL_SUBJECT = 'Tugboat Feeder Report';
export const EMAIL_FOOTER_TEXT = `
------------------------------------------------------------------------------
This e-mail including its attachments is confidential and may be privileged,
as it is only intended for the named addressee. If you are not the intended
recipient; (a) please notify us immediately by returning this e-mail, delete
the document from your system and including from any data retention media; and
(b) you are strictly prohibited (i) to disclose or use the information
contained in it; and (ii) from reading, printing, copying, forwarding, or
saving it, or taking any action in reliance upon it. This e-mail does not
necessarily represent any opinions or official statements of the company.
------------------------------------------------------------------------------
`;
export const EMAIL_FOOTER_HTML = `
<p>------------------------------------------------------------------------------</p>
<p><small>This e-mail including its attachments is confidential and may be privileged,
as it is only intended for the named addressee. If you are not the intended
recipient; (a) please notify us immediately by returning this e-mail, delete
the document from your system and including from any data retention media; and
(b) you are strictly prohibited (i) to disclose or use the information
contained in it; and (ii) from reading, printing, copying, forwarding, or
saving it, or taking any action in reliance upon it. This e-mail does not
necessarily represent any opinions or official statements of the company.</small></p>
<p>------------------------------------------------------------------------------</p>
`;
export const EMAIL_START_HTML_HEAD = '<html><head>';
export const EMAIL_END_HTML_HEAD = '</head>';
export const EMAIL_START_HTML_BODY = '<body><hr>';
export const EMAIL_END_HTML_BODY = '</body></html>';
export const EMAIL_SENDER = '"No Reply" <noreply@banpuindo.co.id>';
export const EMAIL_DATETIME_FORMAT = 'DD-MMM-YYYY HH:mm:ss';
export const EMAIL_SUBJECT_DATE_FORMAT = 'DD MMM YYYY';
export const EMAIL_DEFAULT_ATTACHMENT_FILENAME = 'attachment';
export const EMAIL_ATTACHMENT_CONTENT_DISPOSITION = 'attachment';
export const EMAIL_ATTACHMENT_FILENAME_REGEX = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

export const RECAP_EMAIL_HTML_STYLE = `
<style>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
th, td {
  padding: 5px;
}
th {
  background: #f0f0f0;
}
</style>`;
