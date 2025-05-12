import { VStack, Button, Wrap } from "@chakra-ui/react"
import { DatePicker, ConfigProvider, InputNumber, Form, theme } from "antd"
import esES from 'antd/locale/es_ES'
import { IChartRequest, IPortfolioInfo, IChartsForm, IAlreadyUploadedPortfolios } from "@/interfaces/ApiInterfaces"
import { IPortfoliosChartData } from "@/interfaces/ChartInterfaces"
import { getChartData } from "@/api/apiCalls"
import { useState } from "react"
import dayjs from 'dayjs';
import 'dayjs/locale/es'
import '@/styles/chartPage.css'
import { moneyValidator, parseStringDataToDayJs } from "@/utils"
dayjs.locale('es')

const { RangePicker } = DatePicker;

export function ChartForm({portfoliosInfo, setChartData}:
    {portfoliosInfo:IAlreadyUploadedPortfolios, setChartData:React.Dispatch<React.SetStateAction<IPortfoliosChartData|undefined>>})
    {
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const initialValues = (portfoliosInfo:IAlreadyUploadedPortfolios) : Object => {
        const result = {portfolios: Array(), 
            dateRange:[parseStringDataToDayJs(portfoliosInfo.minDate), parseStringDataToDayJs(portfoliosInfo.maxDate)]
        }
        portfoliosInfo.portfolios.forEach((portfolioInfo)=>{
            result.portfolios.push({
                startValue: 1_000_000_000,
                id: portfolioInfo.id
            })
        })
        return result
    }

    const requestChartData = (data:IChartsForm) =>{
        setLoadingUpload(true)
        const portfolioIds : number[] = portfoliosInfo.portfolios.map((portfolio)=>portfolio.id)
        const startDate = data.dateRange[0].format("YYYY-MM-DD")
        const endDate = data.dateRange[1].format("YYYY-MM-DD")
        const query : IChartRequest = {portfolioIds: portfolioIds, startDate: startDate, endDate: endDate}
        getChartData(query).then((portfoliosChartData : IPortfoliosChartData | undefined)=>{
            if (portfoliosChartData){
                setChartData(portfoliosChartData);
                setError(false);
            } else {
                setError(true);
            }
            setLoadingUpload(false)
        })
    }

    return <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
        <Form
            name="form"
            onFinish={requestChartData}
            initialValues={initialValues(portfoliosInfo)}
            className="fullWidth"
        >
        <VStack>
        <ConfigProvider locale={esES}>
            <Form.Item
            label="Intervalo de fechas"
            name={["dateRange"]}
            rules={[{ required: true, message: 'La fecha de busqueda es obligatoria' }]}
            >
                <RangePicker  format={"DD-MM-YYYY"} allowClear={false} minDate={parseStringDataToDayJs(portfoliosInfo.minDate)}
                maxDate={parseStringDataToDayJs(portfoliosInfo.maxDate)}/>
            </Form.Item>
        </ConfigProvider>
        <Button type="submit" loading={loadingUpload} loadingText={"Solicitando Datos"} className="button">Buscar gráficos</Button>
        {error && <p style={{color:"red"}}>Problemas al solicitar la información de los gráficos</p>}
        </VStack>
        </Form>
    </ConfigProvider>
}