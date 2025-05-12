import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { deleteDataRequest } from "@/api/apiCalls"
import { useState } from "react"
import { useNavigate } from "react-router";

export function DeleteDialog(){
    const navigate = useNavigate();
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const deleteData = () => {
        setLoadingDelete(true)
        deleteDataRequest().then((result:boolean)=>{
            if (result) {
                navigate("/")
            } else {
                setError(true)
            }
            setLoadingDelete(false)
        })
    }

    return (
    <Dialog.Root role="alertdialog" closeOnInteractOutside placement={"center"} onExitComplete={()=>setError(false)}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="md" color={"black"} backgroundColor={"red"}>
          Eliminar datos
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>¿Estás seguro?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Esta acción no se puede deshacer. Los datos ya ingresados serán borrados.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" style={{backgroundColor:"red"}} onClick={deleteData} loading={loadingDelete}
               disabled={loadingDelete}>Borrar</Button>
            </Dialog.Footer>
            {error && <p style={{color:"red"}}>Hubo un problema al intentar borrar los datos</p>}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    )
}