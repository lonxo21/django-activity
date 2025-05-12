import { Image, VStack, Heading, Box, FileUpload, Icon, Center, Button, Spinner, Field, NumberInput, InputGroup,  } from "@chakra-ui/react"
import { ConfigProvider, Form, InputNumber, Upload, theme  } from "antd"
import { InboxOutlined } from '@ant-design/icons';
import { IHomeInput } from "@/interfaces/ApiInterfaces"
import { uploadFile, getIfFileAlreadyUploaded } from "@/api/apiCalls"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router";
import "@/styles/homePage.css"
import { moneyValidator } from "@/utils"

const { Dragger } = Upload;

export function HomePage(){
    const navigate = useNavigate();
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        getIfFileAlreadyUploaded().then((alreadyUploadedPortfolios : Object | undefined)=>{
            if (alreadyUploadedPortfolios) {
                navigate("/graficos");
            } else {
                setLoading(false);
            }
        })
    } , [])

    const onSubmit = (data: IHomeInput) => {
        setLoadingUpload(true);
        uploadFile(data).then((success:boolean) => {
            setLoadingUpload(false);
            if (success) {
                setError(false);
                navigate("/graficos");
            } else {
                setError(true);
            }
        })
    }

    return (
    loading ?
    <Center> <Spinner/> </Center>
    :
    <Center>
    <VStack>
      <Image rounded="md" src="abaqus.png" alt="Abaqus" className="photo"/>
      <Center h="20">
        <Heading>Bienvenido a Abaqus, inserta tus portafolios aquí:</Heading>
      </Center>
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
        <Form
            name="form"
            onFinish={onSubmit}
            initialValues={{"initialValue": 1000000000}}
            className="fullWidth"
        >
            <VStack>
                <Form.Item
                name="file" style={{width:"100%"}} valuePropName="file"
                rules={[{ required: true, message: 'Debe proveer un excel con portafolios' }]}
                >
                    <Dragger multiple={false} maxCount={1} beforeUpload={()=>false}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text"  >Seleccione o arrastre un archivo</p>
                        <p className="ant-upload-hint"  >
                        El archivo debe ser de tipo excel (.xlsx)
                        </p>
                    </Dragger>
                </Form.Item>
                <Form.Item
                name="initialValue"
                rules={[{ required: true, message: 'Debe ingresar un valor inicial' },
                        { type: "number", message: 'Debe ser mayor a cero', validator:moneyValidator}]}
                >
                    <InputNumber
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    style={{width:"100%"}}/>
                </Form.Item>
                <Button type="submit" loading={loadingUpload} loadingText={"Ingresando datos"} className="button">Ingresar</Button>
                {error && <p style={{color:"red"}}>Problemas al subir los portafolios</p>}
            </VStack>
        </Form>
        </ConfigProvider>
    </VStack>
    </Center>
    )
}