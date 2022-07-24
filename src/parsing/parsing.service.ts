import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize';
import * as puppeteer from 'puppeteer';
import { ParseModel } from './parsing.model';

interface IProperties {
    paymentMethod: string,
    amount: string,
    currency: string,
    sellTable: IRowTableData[],
    byTable: IRowTableData[]
}

interface IRowTableData {
    [key: string]: string
}
const URL = "https://garantex.io/p2p?utf8=%E2%9C%93&payment_method=%D0%A2%D0%B8%D0%BD%D1%8C%D0%BA%D0%BE%D1%84%D1%84&amount=200000&currency=RUB&commit=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA";
//const writeFileAsync = promisify(writeFile)

@Injectable()
export class ParsingService {
    parseInterval: ReturnType<typeof setInterval>
    constructor(
        @InjectModel(ParseModel) private ParseTable: typeof ParseModel,
    ) { 
        this.parseInterval = null
    }

    async configureBrowser() {
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(URL, {
            waitUntil: 'networkidle2',
            timeout: 0
        });
        return page
    }

    async parse(page: puppeteer.Page) {
        await page.reload()
        const results = await page.evaluate(() => {
            const properties = {} as IProperties;

            properties.paymentMethod = document.querySelector('#payment_method').getAttribute("value")
            properties.amount = document.querySelector('#amount').getAttribute("value")
            properties.currency = document.querySelector('#currency').querySelector('option[selected="selected"]').getAttribute('value')
            properties.sellTable = [],
                properties.byTable = []

            const sellRowsTable = document.querySelectorAll('.sell_table tbody tr')
            const byRowsTable = document.querySelectorAll('.buy_table tbody tr')

            sellRowsTable.forEach((sellRow) => {
                const rowTableData: IRowTableData = {}
                sellRow.querySelectorAll('td').forEach((cell, index) => {
                    switch (index) {
                        case 0: {
                            const seller = cell.querySelector('div > a').textContent
                            rowTableData.seller = seller
                        }; break;
                        case 1: {
                            const paymentMethod = cell.textContent
                            rowTableData.paymentMethod = paymentMethod
                        }; break;
                        case 2: {
                            const price = cell.textContent
                            rowTableData.price = price
                        }; break;
                        case 3: {
                            const sum = cell.textContent
                            rowTableData.sum = sum
                        }; break;
                    }
                })
                properties.sellTable.push(rowTableData)
            })

            byRowsTable.forEach((byRow) => {
                const rowTableData: IRowTableData = {}
                byRow.querySelectorAll('td').forEach((cell, index) => {
                    switch (index) {
                        case 0: {
                            const seller = cell.querySelector('div > a').textContent
                            rowTableData.seller = seller
                        }; break;
                        case 1: {
                            const paymentMethod = cell.textContent
                            rowTableData.paymentMethod = paymentMethod
                        }; break;
                        case 2: {
                            const price = cell.textContent
                            rowTableData.price = price
                        }; break;
                        case 3: {
                            const sum = cell.textContent
                            rowTableData.sum = sum
                        }; break;
                    }
                })
                properties.byTable.push(rowTableData)
            })
            return properties
        });
        const data = JSON.stringify(results)
       return await this.addParseInformationToDb(data)
    }

    async startParse() {
        const page = await this.configureBrowser();
        this.parseInterval = setInterval(async ()=>{
            if(process.env.ALLOW_PARSE === "false"){
                clearInterval(this.parseInterval)
            }
            await this.parse(page);
        },Number(process.env.DELAY_PARSING))
    }

    async addParseInformationToDb(data: string) {
        try {
           return await this.ParseTable.create({data})
        } catch (e) {
            throw new HttpException('Проблемы с добавлением данных в таблицу о криптовалюте', HttpStatus.BAD_REQUEST);
        }
    }

    async lastRecord(){
       try{
        const record = await this.ParseTable.findAll({
            limit:1,
            where:{},
            order:[['createdAt', 'DESC']]
        })

        return record[0]?.data
       }catch(e){
        throw new HttpException('Ошибка получения данных', HttpStatus.BAD_REQUEST);
       }
    }
}
