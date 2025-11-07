import base from './playwright.config';

export default {
  ...base,
  use: { ...base.use, trace: 'on', video: 'on', screenshot: 'on' },
};