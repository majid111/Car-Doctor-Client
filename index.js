const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// const uri = 'mongodb://localhost:27017';
// const uri = "mongodb+srv://<username>:<password>@cluster0.bi44cht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.bi44cht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //should comment below line
    // await client.connect();

    const servicesCollection = client
      .db("carDoctorDB")
      .collection("Services");

      //creating a car service
    app.post("/carServices", async (req, res) => {
      const newServices = req.body;
      const result = await servicesCollection.insertOne(newServices);
      res.send(result);
    });

    //gettiing all services from car service
    app.get("/carServices", async (req, res) => {
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // getting individual car service by id
    app.get("/carServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    //update car service by id
    app.put("/carServices/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updatedCarServices = req.body;

      const carServices = {
        $set: {
          photoUrl: updatedCarServices.photoUrl,
          touristsSpotName: updatedCarServices.touristsSpotName,
          countryName: updatedCarServices.countryName,
          location: updatedCarServices.location,
          shortDescription: updatedCarServices.shortDescription,
          averageCost: updatedCarServices.averageCost,
          seasonality: updatedCarServices.seasonality,
          travelTime: updatedCarServices.travelTime,
          totaVisitorsPerYear: updatedCarServices.totaVisitorsPerYear,
          email: updatedCarServices.email,
          userName: updatedCarServices.userName,
        },
      };

      const result = await servicesCollection.updateOne(
        filter,
        carServices,
        options
      );
      res.send(result);
    });

    // deleting individual car services by id
    app.delete("/carServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });


    
    

    // Send a ping to confirm a successful connection
    //should comment below line
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car Doctor server is running");
});

app.listen(port, () => {
  console.log(`Car Doctor server is running on ${port}`);
});
