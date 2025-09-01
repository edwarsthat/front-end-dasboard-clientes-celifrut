import type { precioProveedorType } from "./preciosTypes"
import type { proveedoresType } from "./proveedoresType"

export type preciosResponseType = {
    success:boolean
    user: {
        email:string
        name:string
        proveedorData: proveedoresType[]
        preciosData: precioProveedorType[]
    }
}