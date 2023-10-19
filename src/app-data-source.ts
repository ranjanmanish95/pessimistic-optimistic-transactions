import { DataSource } from "typeorm"

const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "master",
    entities: ["src/entity/*.ts"],
    logging: true,
    synchronize: true,
})

export default myDataSource;