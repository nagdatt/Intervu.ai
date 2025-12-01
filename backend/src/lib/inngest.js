import {Inngest} from "inngest";
import { ENV } from "./env.js";
import {User} from "../models/Users.js";
import { connectDB } from "./db.js";
export const inngest = new Inngest({name:"Intervu-ai"});
const syncUser=inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async({event})=>{
        await connectDB();
        const {id,email_addresses,first_name,last_name,image_url}=event.data;
        const newUser={
            clerkId:id,
            name:`${first_name|| ""} ${last_name||""}`,
            email:email_addresses[0].email_address,
            profileImage:image_url
        }
        // const userExists=await User.findOne({clerkId});
        await User.create(newUser);
    }
)
const deleteUserFromDB=inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.deleted"},
    async({event})=>{
        await connectDB();
        const {id}=event.data;
      
        // const userExists=await User.findOne({clerkId});
        await User.delete({clerkId:id});
    }
)
export const functions=[syncUser,deleteUserFromDB]