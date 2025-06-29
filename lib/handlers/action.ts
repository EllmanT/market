"use server"
import { ZodError, ZodSchema } from "zod";
import {  ValidationError } from "../http-errors";
import {  Session } from "@clerk/nextjs/server";



type ActionOptions<T>={
    params?:T;
    schema?:ZodSchema<T>;
    authorize?:boolean
};

async function action<T>({
    params,
    schema,
    authorize = false
}:ActionOptions<T>){
    if(schema && params){
        try {
            
        } catch (error) {
            if(error instanceof ZodError){
                return new ValidationError(
                    error.flatten().fieldErrors as Record<string,string[]>
                )
            }else{
                return new Error("Schema validation failed")
            }
        }
    }

    const session :Session | null = null;

    if(authorize){
        // session = await auth()
        // if(!session){
        //     return new UnauthorisedError();
        // }
    }
    return {params, session}
}

export default action 