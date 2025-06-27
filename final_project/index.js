const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    // Verificar si existe un token en la sesión
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        
        // Verificar el token JWT
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Usuario no autenticado" });
            }
            req.user = user; // Guardar los datos del usuario en la solicitud
            next(); // Continuar con el siguiente middleware/ruta
        });
    } else {
        return res.status(403).json({ message: "Usuario no logueado" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
