import base from './playwright.config';

export default{
    ...base,
    reporter: [['line'], ['html'], ['allure-playwright']],
    use: { ...base.use, trace: 'retain-on-failure', launchOptions: { slowMo: 1000} },
}