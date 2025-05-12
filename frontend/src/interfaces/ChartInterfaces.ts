export interface IPortfoliosChartData {
    stackedChartData : IStackedChartData[]
    valueChartData: IValueChartData
}

export interface IStackedChartData {
    name: string,
    startValue: number,
    quantityOfStockes: QuantityOfStock[],
    chartData: Object[],
}

export interface QuantityOfStock {
    name: string,
    quantity: number,
    color: string,
}

export interface IValueChartData{
    colors: Record<string,string>,
    chartData: Object[],
}

export interface ITooltipInfo {
    label : string,
    payload: ITooltipPayload[]
}

export interface ITooltipPayload {
    fill: string,
    value: number,
    name: string,
    stroke: string,
}