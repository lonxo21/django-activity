import { LineChart, Line, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parseMoney, parseDate } from '@/utils';
import { ITooltipPayload, IValueChartData } from '@/interfaces/ChartInterfaces';

export function ValueLineChart({valueChartData}:{valueChartData:IValueChartData}){
    const renderTooltipContent = (o : any) => {
      const { payload, label } : {payload:Array<ITooltipPayload>, label: string}= o;
    
      return payload && label && (
        <div className="valueChartTooltip" key={label}>
          <p>{`${parseDate(label)}`}</p>
          <ul>
            {payload.map((entry: ITooltipPayload, index: number) => (
              <li key={`${label}-${index}`} style={{ color: entry.stroke }}>
                {`${entry.name}: ${parseMoney(entry.value)}`}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    return (
      <ResponsiveContainer width={"100%"} aspect={2.4}>
        <LineChart
          data={valueChartData.chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Fecha" tickFormatter={parseDate} interval="preserveStartEnd" tickMargin={10}/>
          <YAxis domain={["dataMin", "auto"]} tickFormatter={parseMoney}  width={150} tickCount={10}/>
          <Tooltip content={renderTooltipContent}/>
          <Legend />
          {
            Object.entries(valueChartData.chartData[0]).map((key_value:[string,any], index:number)=>{
              const key :string = key_value[0]
              if (key != "Fecha"){
                return <Line dot={false} key={"line"+index} type="monotone" isAnimationActive={false}
                dataKey={key} stroke={valueChartData.colors[key]} activeDot={{ r: 8 }}/>

              }
            })
          }
        </LineChart>
      </ResponsiveContainer>
    )
}