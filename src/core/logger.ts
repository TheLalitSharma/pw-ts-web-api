export class Logger {
  static info(msg: string) {
    console.info(`ℹ️  ${msg}`);
  }
  static warn(msg: string) {
    console.warn(`⚠️  ${msg}`);
  }
  static error(msg: string) {
    console.error(`❌ ${msg}`);
  }
}