import { Modal, Button, ConfigProvider, theme, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react"
import { TradingForm } from "./TradingForm";
import '@/styles/chartPage.css'
import { Center } from "@chakra-ui/react";
import { getTradingFormOptions } from "@/api/apiCalls";
import { ITradingFormOptions } from "@/interfaces/ApiInterfaces";

export function TradingDialog() {
    const [tradingOptions, setTradingOptions] = useState<ITradingFormOptions|undefined>()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(()=>{
        getTradingFormOptions().then((tradingFormOptions: ITradingFormOptions|undefined)=>{
            if (tradingFormOptions){
                setTradingOptions(tradingFormOptions)
                setError(false)
            } else {
                setError(true)
            }
        })
    },[])


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const Title = ()=>{
        return <div style={{display:"flex", justifyContent:"center", marginBottom:"2%"}}>
                    <h1>Compraventas</h1>
                </div>
    }

    return <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
    <Button type="primary" onClick={showModal} size="large" style={{color:"black"}}>
        Hacer compraventas
    </Button>
    <Modal title={<Title/>} open={isModalOpen} onCancel={handleCancel} footer={[]}
    width={{xs: '100%', sm: '100%', md: '90%', lg: '80%', xl: '70%', xxl: '60%',}}>
        {tradingOptions ? 
            <TradingForm tradingOptions={tradingOptions} setIsModalOpen={setIsModalOpen}/> : 
            <Center><Spin indicator={<LoadingOutlined spin/>} size="large"/></Center>}
        {error && <Center style={{color: "red"}}>Error al cargar las opciones de compraventa</Center>}
    </Modal>
    </ConfigProvider>
}