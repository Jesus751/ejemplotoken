const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');




const validarJWT = async (req= request, res= response, next) => {
    
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: "no existe token"
        });
    }

    try {
        
       const {uid}= jwt.verify(token, process.env.SECRETORPRIVATEKEY);

       // leer el usuario que corresponde el uid
       const usuario = await Usuario.findById(uid);
      // Validar si el usuario existe en la base de datos
       if(!usuario){
        return res.status(401).json({
            msg: 'Usuario no existe en la db'

        });
       }
      // Usuario Validar si l usuario esta activo
       if(!usuario.estado){
        return res.status(401).json({
            msg: 'Usuario desabilitado'

        });
       }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            Error: "Token no valido"
        });
        
    }
}


module.exports= { 
    validarJWT
}