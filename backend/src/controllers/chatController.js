import { use } from "react";
import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res){
    try{
        const token=chatClient.createToken(req.user.clerkId);
        console.log("Generated Stream token for user:",{token,
            userId:req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.image

        });
        //using clerkId as userId in stream
        return res.status(200).json({token,
            userId:req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.image

        });
    }
    catch(error){
        console.error("Error generating Stream token:",error);
        return res.status(500).json({message:"Internal Server Error"+error.message});
    }
}