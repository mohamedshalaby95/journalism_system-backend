const express=require('express')
require('express-async-errors');
const app=express()
const userRouter=require('./src/routes/users')
const handleError=require('./src/middelewares/handelError')
const authRouter=require('./src/routes/login')
const adminAuthRouter=require('./src/routes/adminLogin')
const adminRouter=require('./src/routes/admin')
var cors = require('cors')

const port=process.env.PORT||3000
 app.use(cors())
require('dotenv/config')
require('./config/connectdb')()


app.use(express.json())

app.use('/user',userRouter)

app.use('/login',authRouter)
app.use('/admin',adminRouter)
app.use('/adminAuth',adminAuthRouter)
app.use(handleError)






app.listen(port,(error)=>{
    if(error) console.log("error on server")
     console.log(`server listen on ${port}`)
    
})