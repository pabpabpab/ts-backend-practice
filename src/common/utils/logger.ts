import fs from 'fs';
import path from 'path';
import {Singleton} from '../decorators/singleton';

@Singleton
export default class Logger {
    constructor(
        protected dirname: string = 'logs',
        protected filename: string = 'error-log.txt'
    ) {}

    protected async checkDir(dirname = this.dirname) {
        return fs.promises.access(dirname)
            .then(() => true)
            .catch(() => {
                return fs.mkdir(dirname, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`Directory «${dirname}» is created.`);
                })
            });
    }

    async logToFile(info: string) {
        await this.checkDir();

        let filePath = path.join(process.cwd(), this.dirname, this.filename);

        const txtLog = `Now is ${new Date()}\r\n${info}`;

        fs.writeFile(filePath, txtLog, { encoding: "utf-8", flag: "a+"},(err) => {
            if (err) {
                console.log('Ошибка записи в лог:', err.message);
            }
        });
    }
}

//export const loggerInstance = new Logger();