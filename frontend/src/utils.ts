import dayjs from 'dayjs';

export function parseDate(date:string) : string {
    const splittedDate : string[] = date.split("-")
    const day : string = splittedDate[2]
    const month : string = splittedDate[1]
    const year : string = splittedDate[0]
    return day+"-"+month+"-"+year
}

export function roundDecimals(decimal:number) : string {
    return decimal.toFixed(2);
}

export function percentageFormat(decimal:number) : string{
    return (decimal*100).toFixed(1) + "%"
}

// export function parseMoney(decimal:number) : string {
//     return `$${decimal.toFixed(0)}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
// }

export function parseMoney(decimal:number) : string {
    return `$${decimal.toFixed(2).replace(".", ",")}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function parseQuantity(decimal:number) : string {
    return `${decimal.toFixed(2).replace(".", ",")}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const reverseArray = (array :Array<any>) : Array<any> => {
  const arrayLength : number = array.length
  const newArray = new Array(arrayLength)
  for (let i = 0; i < arrayLength; i++){
    newArray[i] = array[arrayLength-1-i]
  } 
  return newArray
}

export const parseStringDataToDayJs = (date:string) : dayjs.Dayjs => {
    const splittedDate : string[] = date.split("-")
    const day : number = Number(splittedDate[2])
    const month : number = Number(splittedDate[1])
    const year : number = Number(splittedDate[0])
    return dayjs(new Date(year, month-1, day))
}

export const moneyValidator = (_:any,value: any) : Promise<Error|void>=>{
    if (value > 0) {return Promise.resolve()}
    else {return Promise.reject(new Error("Debe ser mayor a cero!"))}
} 