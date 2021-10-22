const dotenv = require('dotenv')

console.log("About to configure with env:", process.env.ENVIRONMENT);

console.log(
dotenv.config({
  path: `${process.env.ENVIRONMENT}.env`
})
)

export const EOSIO_ENDPOINT = process.env.EOSIO_ENDPOINT;
export const DGRAPH_ENDPOINT= process.env.DGRAPH_ENDPOINT;
export const ROOT_HASH = process.env.ROOT_HASH;
export const EOS_USER = process.env.EOS_USER;
export const EOS_PK = process.env.EOS_PK;
  