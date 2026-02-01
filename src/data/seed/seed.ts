import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";

import { seedData } from "./data";

const { MONGO_DB_NAME, MONGO_DB_URL } = envs;

(async () => {
  try {
    await MongoDatabase.connect({
      connectionUrl: MONGO_DB_URL ?? "",
      dbName: MONGO_DB_NAME ?? "",
    });
    await main();
  } catch (error) {
    console.log("Error during seeding");
    console.log(error);
  } finally {
    await MongoDatabase.disconnect();
  }
})();

async function main() {
  console.log("SEEDING......");
  console.log("Cleaning data......");
  // 0-  clean previous
  await Promise.all([
    await UserModel.deleteMany(),
    await CategoryModel.deleteMany(),
    await ProductModel.deleteMany(),
  ])
  // 1- create users
  console.log("Creating users......");
  const seedUsers = seedData.users;
  const userIds = (await UserModel.insertMany(seedUsers)).map((user)=> ({id: user._id.toString()}));
  // 2- create categories
  console.log("Creating categories......");
  const categorySeed = seedData.categories.map((category)=> ({
    name: category.name,
    available: getRandomNumber(10) % 2 === 0,
    user: userIds[getRandomNumber(userIds.length)].id
  }))

  const categoryIds = (await CategoryModel.insertMany(categorySeed)).map((category)=> ({id: category._id.toString()}));
  
  // 3- create products
  console.log("Creating products......");
    const productSeed = seedData.products.map((product)=> ({
    name: product.name,
    description: product.descripcion,
    available: product.available,
    user: userIds[getRandomNumber(userIds.length)].id,
    category: categoryIds[getRandomNumber(categoryIds.length)].id,
  }))

  await ProductModel.insertMany(productSeed);

  console.log("SEEDED!");
}


/**
 * Generates a random integer between 0 (inclusive) and max (exclusive).
 * @param max (exclusive).
 * @returns A random integer.
 */
function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}