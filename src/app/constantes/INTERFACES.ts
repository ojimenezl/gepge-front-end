export interface tiendaInterface {
_id?: string, 
nombre_tienda?: string,
descripcion?: string,
        correo?: string,
        precio?: string,
        horario?: string,
        abierto?: string,
        url?:string,
        vista?:string,
        lantitud?: string,
        longuitud?: string,
        responsable?: string,
        fecharegistro?: string,
        estado?: string,

}
export interface propietarioInterface{
    _id?: string,
    nombre?: string,
        cedula?: string,
        correo?: string,
        clave?: string,
        responsable?: string,
        fecharegistro?: string,
        estado?: string,
}

export interface notificacionInterface{
        _id?:string
        tokenId?:string,
        titulo?:string,
        mensaje?:string
}

export interface clienteInterface{
        _id?:string,
        tokenId?:string
}