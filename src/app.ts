import * as express from "express"
import { Request, Response } from "express"
import { User } from "./entity/user.entity"
import myDataSource from "./app-data-source"

// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// create and setup express app
const app = express()
app.use(express.json())

// register routes
app.get("/users", async function (req: Request, res: Response) {
    const users = await myDataSource.getRepository(User).find()
    res.json(users)
})

app.get("/users/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(User).findOneBy({
        id: parseInt(req.params.id),
    })
    return res.send(results)
})

app.post("/users", async function (req: Request, res: Response) {
    const user = await myDataSource.getRepository(User).create(req.body)
    const results = await myDataSource.getRepository(User).save(user)
    return res.send(results)
})

app.put("/users/:id", async function (req: Request, res: Response) {
    const user = await myDataSource.getRepository(User).findOneBy({
        id: parseInt(req.params.id),
    })
    myDataSource.getRepository(User).merge(user, req.body)
    const results = await myDataSource.getRepository(User).save(user)
    return res.send(results)
})

app.delete("/users/:id", async function (req: Request, res: Response) {
    const results = await myDataSource.getRepository(User).delete(req.params.id)
    return res.send(results)
}) 

app.get('/user1', async (req, res) => {
  try {
    await myDataSource.transaction(async (transactionalEntityManager) => {
     const query = await transactionalEntityManager
     .createQueryBuilder()
     .select("user")
     .from(User,"user")
     .getOne()
      res.status(201).json({ data: query });
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/user1/:id', async (req, res) => {
  try {
    await myDataSource.transaction(async (transactionalEntityManager) => {
     const query = await transactionalEntityManager
     .createQueryBuilder()
     .select("user")
     .from(User,"user")
     .where("user.id = :id", { id: req.params.id })
     .getOne()
      res.status(201).json({ data: query });
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/user1', async (req, res) => {
    const { JrDev } = req.body;
    try {
      await myDataSource.transaction(async (transactionalEntityManager) => {
        const query = transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(JrDev)
        .execute();
        res.status(201).json({ message: 'User created successfully and data successfully inserted' });
      });
    } catch (error) {
      console.error('Transaction error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


app.put('/user1/:id', async (req, res) => {
    const { JrDev } = req.body;
    try {
      await myDataSource.manager.transaction( "SERIALIZABLE",  async (transactionalEntityManager) => { 
      await transactionalEntityManager
        .createQueryBuilder()
        .update(User)
        .set(JrDev[0])
        .where("id = :id", { id: parseInt(req.params.id) })
        .execute();
        res.status(201).json({ message: 'User updated successfully' });
      });
    } catch (error) {
      console.error('Transaction error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/user1/:id', async (req, res) => {
  try {
    await myDataSource.manager.transaction(async (transactionalEntityManager) => { 
    await transactionalEntityManager
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id: parseInt(req.params.id) })
      .execute();
      res.status(201).json({ message: 'Row deleted successfully' });
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/",  (req, res)=>{res.send("the endpoint is working")} )

// start express server
app.listen(3000, ()=>{console.log("The server is running on port 3000")})