import { getItem, GROUP_LABEL, Types } from './document';
import { EOSIO_ENDPOINT, EOS_PK, EOS_USER } from './config'

console.log("eos endpoint", EOSIO_ENDPOINT)

const { Api, JsonRpc, RpcError } = require('eosjs');

const fetch = require('node-fetch');

const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');

const { TextEncoder, TextDecoder } = require('util');

console.log("Creating signature provider");

const signatureProvider = new JsSignatureProvider([EOS_PK]);

console.log("Creating RPC");

const rpc = new JsonRpc(EOSIO_ENDPOINT, { fetch });

console.log("Creating API");

const eosApi = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

export const runAction = async (action, data) => {

  //console.log("About to run action:", action, "with data:", JSON.stringify(data));

  return eosApi.transact({
    actions: [{
      account: 'dao.hypha',
      name: action,
      authorization: [{
        actor: EOS_USER,
        permission: 'active',
      }],
      data: data,
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
}

export const closeProposal = 
(proposal_hash) => {
  return runAction('closedocprop', {
    proposal_hash
  });
}
