import type { precioProveedorType } from "./preciosTypes"
import type { proveedoresType } from "./proveedoresType"
import type { tiposFrutasType } from "./tiposFrutas"

export type preciosResponseType = {
    success:boolean
    tiposFruta: tiposFrutasType[]
    user: {
        email:string
        name:string
        proveedorData: proveedoresType[]
        preciosData: precioProveedorType[]
    }
}