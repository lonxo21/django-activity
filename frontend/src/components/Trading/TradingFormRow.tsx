import { DatePicker, ConfigProvider, InputNumber, Form, Radio, Select, Flex, Divider, Tooltip } from "antd"
import type { FormInstance } from "antd/lib";
import { MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import esES from 'antd/locale/es_ES'
import dayjs from 'dayjs';
import 'dayjs/locale/es'
import '@/styles/chartPage.css'
import { moneyValidator, parseStringDataToDayJs, parseTradingFromEntryToRequestEntry } from "@/utils";
import { ITradingFormEntry, ITradingFormOptions, ITradingPreviewData, ITradingStockOptions } from "@/interfaces/ApiInterfaces";
import { useState } from "react";
import { TradingPreview } from "./TradingPreview";
import { getTradingPreview } from "@/api/apiCalls";
dayjs.locale('es')

export function TradingFormRow({name, restField, remove, tradingOptions, form}:
    {name:number, restField: {fieldKey?: number;}, remove:(index: number | number[]) => void, 
    tradingOptions: ITradingFormOptions, form: FormInstance}){
    
    const [stockOptions, setStockOptions] = useState<ITradingStockOptions[]>([]);
    const [previewData, setPreviewData] = useState<ITradingPreviewData|undefined>(undefined);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [previewError, setPreviewError] = useState<boolean>(false);

    const fetchAndShowReview = ()=>{
        const tradingFormEntry : ITradingFormEntry = form.getFieldValue(["trading", name]);
        if (Object.keys(tradingFormEntry).length < 5){
            return
        }
        setShowPreview(true);
        const tradingRequestEntry = parseTradingFromEntryToRequestEntry(tradingFormEntry);
        getTradingPreview(tradingRequestEntry).then((tradingPreviewData)=>{
            if (tradingPreviewData) {
                setPreviewData(tradingPreviewData);
                setPreviewError(false);
            } else {
                setPreviewError(true);
            }
        })
    }
    
    return <Flex vertical>
    <Flex gap={"1%"} vertical={false} className="modalFormLine" align="center" justify="center">
    <Form.Item 
        {...restField}
        name={[name, 'buyOrSell']}
        rules={[{ required: true, message: 'Obligatorio' }]}
        className="modalRadioItem"
    >
        <Radio.Group
            style={{display: "flex", flexDirection: 'column'}}
            options={[{ value: 1, label: 'Compra' },{ value: 2, label: 'Venta' }]}
        />
    </Form.Item>
    <Form.Item
        {...restField}
        name={[name, 'portfolioId']}
        rules={[{ required: true, message: 'Debe seleccionar un portafolio' }]}
        className="modalFormItem"
    >
        <Select
            showSearch
            placeholder="Portafolio"
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={tradingOptions.portfolioOptions}
            onSelect={(_, payload)=>setStockOptions(payload.stockOptions)}
        />
    </Form.Item>
    <Form.Item
        {...restField}
        name={[name, 'stockId']}
        rules={[{ required: true, message: 'Debe seleccionar una acción' }]}
        className="modalFormItem"
    >
        <Select
            showSearch
            placeholder="Acción"
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={stockOptions}
        />
    </Form.Item>
    <Form.Item
        {...restField}
        name={[name, 'price']}
        rules={[{ required: true, message: 'Debe seleccionar una precio' }, 
                { type: "number", message: 'Debe ser mayor a cero', validator:moneyValidator}]}
        className="modalFormItem"
    >
        <InputNumber
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
            className="modalFormItem" min={0 as number}
        />
    </Form.Item>
    <ConfigProvider locale={esES} key={"dateProvider"+name}>
        <Form.Item
        {...restField}
        name={[name, "date"]}
        rules={[{ required: true, message: 'Debe seleccionar fecha de compraventa' }]}
        className="modalFormItem"
        initialValue={parseStringDataToDayJs(tradingOptions.minDate)}
        >
            <DatePicker format={"DD-MM-YYYY"} allowClear={false} className="modalFormItem" placement="bottomLeft" showNow={false}
            minDate={parseStringDataToDayJs(tradingOptions.minDate)} maxDate={parseStringDataToDayJs(tradingOptions.maxDate)}/>
        </Form.Item>
    </ConfigProvider>
    <Tooltip title={"Previsualizar compraventa"}>
        <SearchOutlined onClick={fetchAndShowReview}/>
    </Tooltip>
    <MinusCircleOutlined onClick={() => remove(name)} />
    </Flex>
    {showPreview && <TradingPreview previewData={previewData} setShowPreview={setShowPreview} error={previewError}
                    setError={setPreviewError}/>}
    <Divider className="dividerFormDialog"/>
    </Flex>
}