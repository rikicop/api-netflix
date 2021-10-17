const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
//Usualmente si vas a crear algo es POST
//Y si vas a pedir(fetch) algo es GET
//Debes usar async y await por que no sabes
//Que respuesta dará el servidor
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    //Así lo voy a enviar a la BD
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //Busca el user
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("password o username erroneos!");

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("password o username erroneos!");

    //Esta info user._id user.isAdmin
    //La va a guardar en el token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    //Un truco para no devolver a la BD
    //El pass Encriptado(eg: "fgdfgFGFDasd")
    //Si no el normal(eg: "123456")
    // Destructurar
    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});
//Debo expotar la Route
module.exports = router;
