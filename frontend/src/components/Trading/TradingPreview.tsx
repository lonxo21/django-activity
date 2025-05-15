import { ITradingPreviewData } from '@/interfaces/ApiInterfaces';
import { parseMoney, roundDecimals } from '@/utils';
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from "antd"

export function TradingPreview({previewData, setShowPreview, error, setError}:{previewData:ITradingPreviewData|undefined, 
    setShowPreview: React.Dispatch<React.SetStateAction<boolean>>, error:boolean, 
    setError: React.Dispatch<React.SetStateAction<boolean>>}){

    const closePreview = () => {
        setShowPreview(false);
        setError(false);
    };

    const getPreviewColor = (actualPreviewData : ITradingPreviewData) :string => {
        if (actualPreviewData.quantityLeftAfterAllTrades + actualPreviewData.quantityChangeByThisTrade > 0){
            return "green"
        } else {
            return "red"
        }
    }

    const getPreview = (error:boolean, previewData:ITradingPreviewData|undefined) => {
        if (error) {
            return <p style={{color:"red"}}>Error al consultar la compraventa</p>
        } else {
            if (previewData){
                return (
                <Flex vertical={false} justify='space-arround' gap={"2%"}>
                    <p>Cantidad inicial: {roundDecimals(previewData.initialQuantity)}</p> 
                    <p>Cantidad hasta la fecha de compraventa: {roundDecimals(previewData.quantityLeftUntilDate)}</p>
                    <p>Cantidad luego de todas las compraventas (cantidad disponible a intercambiar): {roundDecimals(previewData.quantityLeftAfterAllTrades)}</p>
                    <p>Precio de la acción en esta fecha: {parseMoney(previewData.priceAtDate)}</p>
                    <p style={{color: getPreviewColor(previewData)}}>
                        Cantidad que intercambiaría con esta compraventa: {roundDecimals(previewData.quantityChangeByThisTrade)}
                    </p>
                </Flex>
                )
            } else {
                return <Spin indicator={<LoadingOutlined/>}/>
            }
        }
    }

    return <Flex vertical={false} justify="space-between" className="modalFormLinePreview">
        { 
            getPreview(error, previewData)
        }
        <CloseCircleOutlined onClick={closePreview}/>
        </Flex>
}