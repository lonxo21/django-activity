import { getIfFileAlreadyUploaded } from "@/api/apiCalls";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { VStack, Center, Spinner, Wrap, HStack } from "@chakra-ui/react"
import { IAlreadyUploadedPortfolios } from "@/interfaces/ApiInterfaces";
import { IPortfoliosChartData, IStackedChartData } from "@/interfaces/ChartInterfaces";
import { StackedAreaChart } from "./StackedAreaChart";
import { ValueLineChart } from "./ValueLineChart";
import { ChartForm } from "./ChartForm";
import { DeleteDialog } from "./DeleteDialog";
import { TradingDialog } from "./TradingDialog";


export function ChartPage(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [portfoliosInfo, setPortfoliosInfo] = useState<IAlreadyUploadedPortfolios| undefined>(undefined);
    const [chartData, setChartData] = useState<IPortfoliosChartData>();

    useEffect(()=>{
        getIfFileAlreadyUploaded().then((alreadyUploadedPortfolios : IAlreadyUploadedPortfolios | undefined)=>{
            if (alreadyUploadedPortfolios) {
                setPortfoliosInfo(alreadyUploadedPortfolios)
                setLoading(false)
            } else {
                navigate("/")
            }
        })
    } , [])

    return (
        <VStack className="fullWidth">
        {
        [
        loading && <Center key={"spin"}> <Spinner/> </Center>,
        
        !loading && portfoliosInfo &&
        <Center key={"form"} className="formContainer">
            <HStack>
            <ChartForm portfoliosInfo={portfoliosInfo} setChartData={setChartData}/>
            <VStack>
            <TradingDialog/>
            <DeleteDialog/>
            </VStack>
            </HStack>
        </Center>,
        !loading && chartData &&
        <VStack key="chars" className="chartsContainer">
            <ValueLineChart valueChartData={chartData.valueChartData}/>
            <Wrap className="fullWidth">
                {
                    chartData.stackedChartData.map((stackedChartData: IStackedChartData)=>{
                    return <StackedAreaChart stackedChartData={stackedChartData} key={"stacked"+stackedChartData.name}/>
                    })
                }
            </Wrap>
        </VStack>
        ]
        }
        </VStack>
    )
}