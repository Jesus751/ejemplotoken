const { response } = require("express");
const bcryptjs =  require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) =>{
    const {correo, password} =  req.body;

    try {
        // verificar si email existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: "Usuario/ password no son correctos - correo"
            })
        }
        // si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: "Usuario/ password no son correctos - estado- false"
            })
        }

        // verificar la contraseña
        const salto = bcryptjs.genSaltSync(10);
        const contra =  bcryptjs.hashSync(usuario.password, salto);
        const validaPassword = bcryptjs.compareSync(password, contra);

        if(!validaPassword) {
            return res.status(400).json({
                msg:"Usuario /  password no son correctos - password"
            })
        } 

        // generar el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
      return  res.status(500).json({
            msg: "Algo salio mal"
        })
        
    }



}

module.exports = {
    login
} 