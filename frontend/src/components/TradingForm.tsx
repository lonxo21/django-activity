import { Form, Button, message } from "antd"
import { PlusOutlined } from '@ant-design/icons';
import '@/styles/chartPage.css'
import { Center } from "@chakra-ui/react";
import { ITradingForm, ITradingFormOptions, ITradingRequest, ITradingRequestEntry } from "@/interfaces/ApiInterfaces";
import { TradingFormRow } from "./TradingFormRow";
import { postTradingOperations } from "@/api/apiCalls";
import { useState } from "react";

export function TradingForm ({tradingOptions, setIsModalOpen}:
    {tradingOptions: ITradingFormOptions, setIsModalOpen:React.Dispatch<React.SetStateAction<boolean>>}){
    const [form] = Form.useForm();
    const [error, setError] = useState<boolean>(false);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    const successInTradingPost = () => {
        messageApi.success('¡Compraventas guardadas!');
    };

    const parseDataToStringDate = (data:ITradingForm) : ITradingRequest => {
        const tradingRequestEntryList : ITradingRequestEntry[] = [];
            data.trading.forEach((tradingFormEntry)=>{
                tradingRequestEntryList.push(
                    {   buyOrSell: tradingFormEntry.buyOrSell,
                        portfolioId : tradingFormEntry.portfolioId,
                        stockId: tradingFormEntry.stockId,
                        price: tradingFormEntry.price,
                        date: tradingFormEntry.date.format("YYYY-MM-DD"),
                    }
                )
            })
            const dataWithStringDate : ITradingRequest = {trading: tradingRequestEntryList}
            return dataWithStringDate
    }

    const onFinish = (data:ITradingForm)=>{
        if (data.trading.length != 0){
            setLoadingUpload(true)
            const dataWithStringDate : ITradingRequest = parseDataToStringDate(data)
            console.log(dataWithStringDate)
            postTradingOperations(dataWithStringDate).then((result:boolean)=>{
                setLoadingUpload(false)
                if (result){
                    successInTradingPost()
                    form.resetFields()
                    setError(false)
                    setIsModalOpen(false)
                } else {
                    setError(true)
                }
            })
        }
    }

    return (
        <Form
        name="tradingForm"
        onFinish={onFinish}
        className="fullWidth"
        autoComplete="off"
        form={form}
        >
            {contextHolder}
            <Form.List name="trading">
            {(fields, { add, remove }) => (
                <>
                {fields.map(({ key, name, ...restField }) => (
                    <TradingFormRow key={"row"+key} name={name} restField={restField} remove={remove} tradingOptions={tradingOptions}/>
                ))}
                <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Agregar compraventa
                    </Button>
                </Form.Item>
                </>
            )}
            </Form.List>
            <Form.Item>
            <Center>
            <Button type="primary" htmlType="submit" loading={loadingUpload}>
                Enviar
            </Button>
            </Center>
            {error && <p style={{color:"red"}}>Hubo un problema al subir las compraventas</p>}
            </Form.Item>
        </Form>
    )
}