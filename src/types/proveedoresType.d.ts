/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */

export type precioType = {
  fecha: string
  [key:string]: string
}

export type frutaType = {
  [hey: string]: {
      arboles: number,
      hectareas: number
  }
}

type GGNtype = {
  code: string,
  fechaVencimiento: string,
  paises: string[]
  tipo_fruta: string[]
}

type ICAtype = {
  code: string,
  tipo_fruta: string[],
  fechaVencimiento: string,
}

export type proveedoresType = {
  _id: string
  PREDIO: string
  ICA: ICAtype
  'CODIGO INTERNO': number
  GGN: GGNtype
  tipo_fruta: frutaType
  PROVEEDORES: string
  DEPARTAMENTO: string
  urlArchivos?: ArrayBuffer[]
  activo:boolean
  precio:precioType
  SISPAP: boolean,
  precioFijo: boolean,
  
  telefono_predio: string,
  contacto_finca: string,
  correo_informes: string,
  telefono_propietario: string,
  propietario: string,
  razon_social: string,
  nit_facturar: string,

  departamento: string,
  municipio: string,
  canastillas: number
} 
