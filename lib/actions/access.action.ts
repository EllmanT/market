'use server'

import { currentUser } from "@clerk/nextjs/server"

// Initialising the schematic  SDK

import { SchematicClient } from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_API_KEY;

const client = new SchematicClient({apiKey})

// Get a temporary access token

export async function getTemporaryAccessToken(){
    console.log("Getting the temp access token");

    const user = await currentUser();

    if(!user){
        console.log("No user found , returning null")
        return null;
    }
    console.log(`Issuing the temp access token for the user :${user.id}`);

    const resp = await client.accesstokens.issueTemporaryAccessToken({
        resourceType:"company",
        lookup:{id:user.id},
    });
    console.log("response token", resp.data.token)
    console.log(`Token response received:`, resp.data?"Token received": " No token in the response");

    return resp.data?.token;
}