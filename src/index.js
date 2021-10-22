import "regenerator-runtime/runtime";
import { closeProposal } from "./eos";
import fs from 'fs'
import { queryCustom } from "./dgraph";
import { ROOT_HASH } from "./config";
import winston from "winston";

const BLOCK_SLEEP = 2500;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const getProposalsQuery = () => `
{
  proposals(func: eq(hash, "${ROOT_HASH}")) {
    proposal {
      hash
    }
  }
}
`

const logFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const getLogger = () => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      logFormat
    ), 
    transports: [
      new winston.transports.File({ filename: `logs/${(new Date()).toISOString()}.error.log`, level: 'error' }),
      new winston.transports.File({ filename: `logs/${(new Date()).toISOString()}.info.log`, level: 'info' })
    ]
  });
};

let logger = getLogger();

const launch = async () => {
    
    try {

      logger.log({ level: 'info', message: `=== Fetching proposals ===` });

      const data = (await queryCustom(getProposalsQuery())).data.proposals;

      if (data.length === 0) {
        logger.info("No pending proposals found");
        return;
      }

      let proposals = data[0].proposal;

      proposals.forEach(async (proposal) => {

        try {
          await closeProposal(proposal.hash);
          logger.info("Proposal: ", proposal.hash, "closed succesfully");
        }
        catch (error) {
          logger.error("Error while closing proposal:", proposal.hash, '\n', error);
        }

      });
    } 
    catch (error) {
      logger.error("Something happend while fetching proposals", error);
    }
}

setInterval(launch, 3 * HOUR);

launch();