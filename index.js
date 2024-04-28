const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Moiddleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9hcdyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    

        const spotCollection = client.db('globifyDB').collection('touristSpot');
        app.post('/touristSpot', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotCollection.insertOne(newSpot);
            res.send(result);
        })

        // all tourist spot 
        app.get('/touristSpot', async (req, res) => {
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/touristSort', async (req, res) => {
            // const query = { cost: price };
            const cursor = spotCollection.find(query, options).sort({ cost: 1 });
            const result = await cursor.toArray();
            res.send(result);
        })


        // myList 
        app.get('/tourist/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await spotCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/touristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotCollection.findOne(query);
            res.send(result);
        })

        app.get('/touristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotCollection.findOne(query);
            res.send(result);
        })


        // card  updated 
        app.put('/touristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedSpot = req.body;
            const spot = {
                $set: {
                    name: updatedSpot.name,
                    country: updatedSpot.country,
                    location: updatedSpot.location,
                    photo: updatedSpot.photo,
                    cost: updatedSpot.cost,
                    season: updatedSpot.season,
                    travelTime: updatedSpot.travelTime,
                    totalVisitors: updatedSpot.totalVisitors,
                    description: updatedSpot.description,
                    userName: updatedSpot.userName,
                    userEmail: updatedSpot.userEmail,
                }
            }
            const result = await spotCollection.updateOne(filter, spot, options);
            res.send(result);
        })

        // Delete 
        app.delete('/touristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotCollection.deleteOne(query);
            res.send(result);
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


app.get('/', (req, res) => {
    res.send('Tourism-server is running');
})

app.listen(port, () => {
    console.log(`Tourism-server is running on port:${port}`);
})