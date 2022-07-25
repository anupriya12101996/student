const mongoose=require('mongoose');

mongoose.connect("mongodb+srv://anupriya:anupriya@development.pcb0t6z.mongodb.net/?retryWrites=true&w=majority").then(()=>{
console.log(`connection successful`);
}).catch((e)=>{
console.log(`no connection`);
})