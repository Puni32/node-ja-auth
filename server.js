require('dotenv').config();
const express = require('express');
const connectToDB = require("./database/db");
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require('./routes/admin-routes');
const uploadimageRoutes = require('./routes/image-routes')
connectToDB();

const app = express();
const port = 6900;
 // middleware
 app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/home",homeRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/image",uploadimageRoutes)

app.listen(port,() => {
    console.log(`server is now listening to port ${port}`);
})




