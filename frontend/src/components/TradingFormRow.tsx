import { DatePicker, ConfigProvider, InputNumber, Form, Radio, Select, Flex, Divider } from "antd"
import { MinusCircleOutlined } from '@ant-design/icons';
import esES from 'antd/locale/es_ES'
import dayjs from 'dayjs';
import 'dayjs/locale/es'
import '@/styles/chartPage.css'
import { moneyValidator, parseStringDataToDayJs } from "@/utils";
import { ITradingFormOptions, ITradingStockOptions } from "@/interfaces/ApiInterfaces";
import { useState } from "react";
dayjs.locale('es')

export function TradingFormRow({name, restField, remove, tradingOptions}:
    {name:number, restField: {fieldKey?: number;}, remove:(index: number | number[]) => void, tradingOptions: ITradingFormOptions}){
    
    const [stockOptions, setStockOptions] = useState<ITradingStockOptions[]>([])
    
    return <div>
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
            <DatePicker format={"DD-MM-YYYY"} allowClear={false} className="modalFormItem" 
            minDate={parseStringDataToDayJs(tradingOptions.minDate)} maxDate={parseStringDataToDayJs(tradingOptions.maxDate)}/>
        </Form.Item>
    </ConfigProvider>
    <MinusCircleOutlined onClick={() => remove(name)} />
    </Flex>
    <Divider className="dividerFormDialog"/>
    </div>
}