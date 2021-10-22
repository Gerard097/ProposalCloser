import "regenerator-runtime/runtime";
import { closeProposal } from "./eos";
import fs from 'fs'
import { queryCustom } from "./dgraph";
import { ROOT_HASH } from "./config";

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

const launch = async () => {
    
    try {

      console.log("Fetching proposals...", getProposalsQuery());

      const data = (await queryCustom(getProposals())).data.proposals;

      if (data.length === 0) {
        console.log("No pending proposals found");
        return;
      }

      let proposals = data[0].proposal;

      proposals.forEach(async (proposal) => {

        try {
          await closeProposal(proposal.hash);
          console.log("Proposal: ", proposal.hash, "closed succesfully");
        }
        catch (error) {
          console.error("Error while closing proposal:", proposal.hash, '\n', error);
        }

      });
    } 
    catch (error) {
      console.error("Something happend while fetching proposals", error);
    }
}

setInterval(launch, MINUTE);

launch();