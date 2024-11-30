const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();
// midleware
app.use(cors());
app.use(express.json())

// coffeeMaster
// rXg2RUBGIjVBmdxT

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lg2je.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffee")

    const userCollection = client.db("coffeeDB").collection("users")

// read/get data to localhost
app.get('/coffee',async(req,res)=>{
  const cursor = coffeeCollection.find()
  const coffees = await cursor.toArray()
  res.send(coffees)
})

// create/post
app.post('/coffee',async(req,res)=>{
  const newCoffee = req.body //get data from client side
  console.log(newCoffee);
  // send data to the database/mongoDB
 const result = await coffeeCollection.insertOne(newCoffee)
 res.send(result);
})

// update/put
app.get('/coffee/:id', async(req,res)=>{
  const id = req.params.id
  const query = { _id: new ObjectId(id)}
  const coffee = await coffeeCollection.findOne(query)
  res.send(coffee)
})

app.put('/coffee/:id',async(req,res)=>{
  const id = req.params.id
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updateCoffee = req.body
  const coffee = {
    $set:{
      name:updateCoffee.name,
       quantity:updateCoffee.quantity,
        supplier:updateCoffee.supplier, 
        taste:updateCoffee.taste, 
        category:updateCoffee.category,
         details:updateCoffee.details,
          photo:updateCoffee.photo
    }
  }
  const result = await coffeeCollection.updateOne(filter,coffee,options)
  res.send(result)
})


// delete
app.delete('/coffee/:id', async(req,res)=>{
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const result = await coffeeCollection.deleteOne(query)
  res.send(result)
})

// users related apis
// show users in localhost
app.get('/users',async(req,res)=>{
  const cursor = userCollection.find()
  const users = await cursor.toArray()
  res.send(users)
})

app.post('/users', async(req,res)=>{
  const newUser = req.body
  console.log(newUser);
  const result = await userCollection.insertOne(newUser)
  res.send(result)
})

app.patch('/users',async(req,res)=>{
  const email = req.body.email
  const filter = {email}
  const updateUser = {
    $set: {
      lastSignInTime: req.body?.lastSignInTime
    }
  }
  const result = await userCollection.updateOne(filter,updateUser)
  res.send(result)
})

app.delete('/users/:id', async(req,res)=>{
  const id = req.params.id
  const query = {_id : new ObjectId(id)}
  const result = await userCollection.deleteOne(query)
  res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Hello from coffemaker server')
})

app.listen(port,()=>{
    console.log(`Coffe maker Server is running on port ${port}`)
})