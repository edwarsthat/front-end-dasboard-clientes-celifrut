/* eslint-disable prettier/prettier */

export type precioProveedorType = {
    _id: string
    fecha: string
    tipoFruta: string
    exportacion: exportacionesType
    frutaNacional: number
    descarte: number
    predios: string[]
    week: number
    year: number
    comentario: string
}

interface exportacionesType {
    [key: string]: number
}