import { Form, Button, message } from "antd"
import { PlusOutlined } from '@ant-design/icons';
import '@/styles/chartPage.css'
import { Center } from "@chakra-ui/react";
import { ITradingError, ITradingErrorInfo, ITradingForm, ITradingFormOptions, ITradingRequest, ITradingRequestEntry } from "@/interfaces/ApiInterfaces";
import { TradingFormRow } from "./TradingFormRow";
import { postTradingOperations } from "@/api/apiCalls";
import { useState } from "react";
import { parseTradingFromEntryToRequestEntry } from "@/utils";

export function TradingForm ({tradingOptions, setIsModalOpen}:
    {tradingOptions: ITradingFormOptions, setIsModalOpen:React.Dispatch<React.SetStateAction<boolean>>}){
    const [form] = Form.useForm();
    const [tradingErrors, setTradingErrors] = useState<ITradingErrorInfo[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    const successInTradingPost = () => {
        messageApi.success('¡Compraventas guardadas!');
    };

    const parseDataToStringDate = (data:ITradingForm) : ITradingRequest => {
        const tradingRequestEntryList : ITradingRequestEntry[] = 
        data.trading.map((tradingFormEntry)=>parseTradingFromEntryToRequestEntry(tradingFormEntry))
        const dataWithStringDate : ITradingRequest = {trading: tradingRequestEntryList}
        return dataWithStringDate
    }

    const onFinish = (data:ITradingForm)=>{
        if (data.trading.length != 0){
            setLoadingUpload(true)
            setError(false)
            const dataWithStringDate : ITradingRequest = parseDataToStringDate(data)
            postTradingOperations(dataWithStringDate).then((tradingError:ITradingError)=>{
                setLoadingUpload(false)
                if (tradingError.serverError){
                    setError(true);
                }
                else if (tradingError.tradingErrorList.length == 0){
                    successInTradingPost()
                    form.resetFields()
                    setTradingErrors([])
                    setIsModalOpen(false)
                } else {
                    setTradingErrors(tradingError.tradingErrorList)
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
                    <TradingFormRow key={"row"+key} name={name} restField={restField} remove={remove} tradingOptions={tradingOptions}
                    form={form}/>
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
            </Form.Item>
            {tradingErrors.map((tradingError)=>{
                return <p style={{color:"red"}}>La {tradingError.buyOrSell} de la acción {tradingError.stockName} en el
                portafolio {tradingError.portfolioName} por {tradingError.price} en la fecha {tradingError.date} no
                se pudo realizar por: {tradingError.errorReason}</p>
            })}
            {error && <p style={{color:"red"}}>Error al comunicarse con el servidor</p>}
        </Form>
    )
}