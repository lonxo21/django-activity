import dayjs from 'dayjs';

export interface IHomeInput {
    file: IFileInput,
    initialValue: number,
}

export interface IFileInput {
    file: File
}

export interface IAlreadyUploadedPortfolios {
    portfolios: IPortfolioInfo[],
    minDate: string,
    maxDate: string,
}

export interface IPortfolioInfo {
    id: number,
    name: string
}

export interface IChartRequest{
    portfolioIds: number[],
    startDate:string,
    endDate:string,
}

export interface IChartsForm {
    dateRange: dayjs.Dayjs[],
}

export interface ITradingFormOptions {
    portfolioOptions : ITradingPortfolioOptions[],
    minDate: string,
    maxDate: string,
}

export interface ITradingPortfolioOptions {
    label: string,
    value: number,
    stockOptions: ITradingStockOptions[]
}

export interface ITradingStockOptions {
    label:string,
    value: string,
}

export interface ITradingForm{
    trading : ITradingFormEntry[],
}

export interface ITradingFormEntry{
    buyOrSell: number,
    portfolioId : number,
    stockId: number,
    price: number,
    date: dayjs.Dayjs,
}

export interface ITradingRequest{
    trading: ITradingRequestEntry[],
}

export interface ITradingRequestEntry{
    buyOrSell: number,
    portfolioId : number,
    stockId: number,
    price: number,
    date: string,
}