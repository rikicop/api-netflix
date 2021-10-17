const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

dotenv.config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Está conectado a la BD Exitosamente..."));
}
//Tienes que hacer esto por que en realidad
//Nunca vas a enviar por postman
app.use(express.json());

//Hago una request coloco el endpoint(/api/auth)
//y digo que ese endpoint pertenece a authRoute
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(8800, () => {
  console.log("El servidor Backend está corriendo!");
});
