const express = require("express");
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors())



const uri = `mongodb+srv://${process.env.SECRET_KEY}:${process.env.SECRET_HASH}@cluster0.nrvwj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        await client.connect();
        const database  = client.db('car_mechanic');
        const servicesCollection = database.collection('services');

        // Post Application Programming Interface
        app.post('/services', async(req,res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result) 
        });


        // Get all Data From The Server
        app.get('/services', async(req,res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });


        // Get Single Service
        app.get('/services/:id',async(req,res) => {
            const id = req.params.id;
            console.log(id,'getting id');
            const query = {_id : ObjectId(id)};
            const result = await servicesCollection.findOne(query);
            res.json(result);
        });


       // DELETE Application Programming Interface
        app.delete('/services/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })
       
    } finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req,res) => {
    res.send('Running The Genious Server');
})


app.listen(port, () => {
    console.log(`Listening to the ${port} port successfully`);
})