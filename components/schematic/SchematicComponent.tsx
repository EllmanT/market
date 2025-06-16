import React from 'react'
import { getTemporaryAccessToken } from '@/lib/actions/access.action';
import SchematicEmbed from './SchematicEmbeded';

async function SchematicComponent({componentId}: {componentId?:string}) {
    if(!componentId){
        return null;
    }
    const accessToken = await getTemporaryAccessToken();

    console.log("access token", accessToken)
    console.log("componentid", componentId)

    if(!accessToken){
        throw new Error("No access token found for user")
    }
  return (
    <SchematicEmbed accessToken={accessToken} componentId={componentId}/>
  )
}

export default SchematicComponent