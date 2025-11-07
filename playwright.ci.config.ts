import base from './playwright.config';

export default{
    ...base,
    retries: Number(process.env.PW_RETRIES ?? 2),
    reporter: [['line'], ['html'], ['allure-playwright']],
    use: { ...base.use, trace: 'retain-on-failure', launchOptions: { slowMo: 1000} },
}