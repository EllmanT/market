import {
    anthropic,
    createNetwork,
    getDefaultRoutingAgent,
} from "@inngest/agent-kit"
import {createServer} from "@inngest/agent-kit/server"
import { inngest } from "./client";
import { databaseAgent } from "./agents/databaseAgent";
import Events from "@/constants/constants";
import { docScanningAgent } from "./agents/docScanningAgent";

const agentNetwork = createNetwork({

    name:"Agent Team",
    agents:[databaseAgent, docScanningAgent],
    defaultModel: anthropic({
        model: "claude-3-5-sonnet-latest",
        defaultParameters:{
            max_tokens:1000,
        }
    }),
    defaultRouter:({network})=>{
        const savedToDatabase = network.state.kv.get("save-to-database");
         const wrongDocType = network.state.kv.get("wrong-doc-type");
         const zimraUploadError = network.state.kv.get("zimra-upload-error");
         const stampDocument =network.state.kv.get("stamp-document");
         if(savedToDatabase !==undefined || wrongDocType ||zimraUploadError|| stampDocument){
            // Terminate the agent process if the data has been saved to the database
  console.log("⛔ Terminating agent here");
            return undefined;
        }

        return getDefaultRoutingAgent()
    }
})

export const server = createServer({
    agents:[databaseAgent, docScanningAgent],
    networks:[agentNetwork]
});

export const extractAndSavePDF = inngest.createFunction(
    {id: "Extract PDF and Save in Database"},
    {event: Events.EXTRACT_DATA_AND_SAVE_TO_DB},


    async({event})=>{
        const result = await agentNetwork.run(
            `
            Ensure that the document is an invoice, receipt, or credit note or debit note. If document is something else like a  vat certificate or tax clearance or any other type of document then terminate the process immediately and return an error message that the document is invalid.
            Extract the key data from this pdf: ${event.data.url}. also send the docId ${event.data.docId} and the fileId ${event.data.fileId}, Once the data is extracted , save it to the database using the docId: ${event.data.docId} and then delete the old document in the database in this location ${event.data.fileId}.
             You can  terminate the agent process Once the document is successflly saved to the database or  if the process fails.
             
             `
        )
    
        
        return result.state.kv.get("doc")
    }

)