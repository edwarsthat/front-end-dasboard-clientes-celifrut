/* eslint-disable prettier/prettier */

import type { tiposFrutasType } from "../../types/tiposFrutas";


export const nombreTipoFruta2 = (tipoFruta: string, tiposFrutas:tiposFrutasType[]):string => {
    if(!tipoFruta) return "N/A";
    const fruta = tiposFrutas.find(item => item._id === tipoFruta);
    return fruta ? fruta.tipoFruta : tipoFruta;
}
export const tipoCalidad = (calidadId: string, tiposFrutas:tiposFrutasType[]):string => {
    const calidad = "N/A";
    if(!calidadId) return "N/A";
    for(const tf of tiposFrutas){
        for(const calidad of tf.calidades){
            if(calidad._id === calidadId){
                return calidad.nombre;
            }
        }
    }
    return calidad;
}

export const tipoCalidadInforme = (calidadId: string, tiposFrutas:tiposFrutasType[]):string => {
    const calidad = "N/A";
    if(!calidadId) return "N/A";
    for(const tf of tiposFrutas){
        for(const calidad of tf.calidades){
            if(calidad._id === calidadId){
                return calidad.descripcion;
            }
        }
    }
    return calidad;
}