import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IStackedChartData, QuantityOfStock } from '@/interfaces/ChartInterfaces';
import { ITooltipPayload } from '@/interfaces/ChartInterfaces';
import { parseDate, percentageFormat, parseMoney, reverseArray, parseQuantity } from '@/utils';
import { Heading, VStack, Wrap } from '@chakra-ui/react';
import '@/styles/chartPage.css'

export function StackedAreaChart({stackedChartData}:{stackedChartData:IStackedChartData}){
    const getPercent = (value:number, total:number) => {
        const ratio = total > 0 ? value / total : 0;
      
        return percentageFormat(ratio);
    };

    const renderTooltipContent = (o : any) => {
      const { payload, label } : {payload:Array<ITooltipPayload>, label: string}= o;
      const total = payload.reduce((result:number, entry: ITooltipPayload) => result + entry.value, 0);
    
      return payload && label && (
        <div className="stackedChartTooltip" key={label}>
          <p className="total">{`${parseDate(label)} (Total: ${parseMoney(total)})`}</p>
          <ul className="list">
            {reverseArray(payload).map((entry: ITooltipPayload, index:number) => (
              <li key={`${label}-${index}`} style={{ color: entry.fill }}>
                {`${entry.name}: ${parseMoney(entry.value)}(${getPercent(entry.value, total)})`}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    return (
        <VStack className='stackedChartContainer'>
        <Heading>{stackedChartData.name}:</Heading>
        <Wrap className='stockQuantity'><p>Cantidad de cada inversion:</p>{reverseArray(stackedChartData.quantityOfStockes).map((quantityOfStock:QuantityOfStock)=>{
            return <p key={quantityOfStock.name} style={{color:quantityOfStock.color}}>
              {quantityOfStock.name}: {parseQuantity(quantityOfStock.quantity)}</p>
        })}
        </Wrap>
        <ResponsiveContainer width={"100%"} aspect={1} className="stackedChartResponsiveContainer" >
        <AreaChart
        data={stackedChartData.chartData}
        stackOffset="expand"
        margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
        }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={parseDate} interval="preserveStartEnd" tickMargin={10}/>
            <YAxis domain={['dataMin', 'dataMax']} tickFormatter={percentageFormat} width={100} 
            ticks={[0, 0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]}/>
            <Tooltip content={renderTooltipContent}/>
            {stackedChartData.quantityOfStockes.map((quantityOfStock, index)=>{
                return <Area key={stackedChartData.name+"-"+quantityOfStock.name} type="monotone" dataKey={quantityOfStock.name} 
                stackId="1" stroke={"black"} fill={quantityOfStock.color} isAnimationActive={false}
                name={(stackedChartData.quantityOfStockes.length - index).toString()+": "+quantityOfStock.name}/>
            })}
        </AreaChart>
        </ResponsiveContainer>
        </VStack>
    )
}