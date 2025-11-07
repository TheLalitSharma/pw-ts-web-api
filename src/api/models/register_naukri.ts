export type NaukriUser = {
  mailer?: object;
  name: string;
  email: string;
  mobile: string;
  userType: 'exp' | 'fresher';
  password: string;
  othersrcp: string;
};