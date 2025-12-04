import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body
        const userId = req.user._id;
        const clerkId = req.user.clerkId;
        if (!problem || !difficulty) {
            return res.status(400).json({ message: "Problem and difficulty are required" })
        }

        //generate a unique callId for the session
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        //create a session in db
        const newSession = await Session.create({
            problem: problem,
            difficulty: difficulty,
            host: userId,
            callId: callId
        });
        //create a video call in stream
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: { problem, difficulty, sessionId: newSession._id.toString() }
            }
        })

        //create a chat session in stream
        const channel = chatClient.channel("messaging", callId, {
            name: `${problem} Session`,
            members: [clerkId]
        })

        await channel.create();



        return res.status(201).json({
            session: newSession
        })
    } catch (error) {
        console.error("Error createSession:", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function getActiveSessions(req, res) {
    try {
        const sessions = await Session.find({ status: 'active' })
            .populate("host", "name profileImage email clerkId")
            .sort({ createdAt: -1 })
            .limit(20);
        return res.status(200).json({ sessions });
    } catch (error) {
        console.error("Error getActiveSessions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyRecentSessions(req, res) {
    try {
        //user either host or participant
        const userId = req.user._id;
        const sessions = await Session.find({
            status: "completed",
            $or: [{ host: userId }, { participant: userId }]
        }).sort({ createdAt: -1 }).limit(20)
        return res.status(200).json({ sessions });
    } catch (error) {
        console.error("Error getMyRecentSessions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getSessionById(req, res) {
    try {
        const { id } = req.params
        const session = await Session.findById(id)
            .populate("host", "name profileImage email clerkId")
            .populate("participant", "name profileImage email clerkId");
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        return res.status(200).json({ session });
    } catch (error) {
        console.error("Error getSessionById:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function joinSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;
        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        //check if session is already full
        if (session.participant) {
            return res.status(409).json({ message: "Session is already full" });
        }
        //host cannot join as participant
        if (session.host.toString() === userId.toString()) {
            return res.status(400).json({ message: "Host cannot join as participant" });
        }
        //check if session is completed
        if (session.status !== "active") {
            return res.status(400).json({ message: "Cannot join a completed session" });
        }


        session.participant = userId;
        await session.save();
        //add participant to stream video call
        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);
        return res.status(200).json({ session });


    } catch (error) {
        console.error("Error joinSession:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        //only host can end the session
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only host can end the session" });
        }
        if (session.status === "completed") {
            return res.status(400).json({ message: "Session is already completed" });
        }

        //delete stream video call
        const call = await streamClient.video.call("default", session.callId)
        await call.delete({ hard: true });

        //delete stream chat channel
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();

        //update session status to completed
        session.status = "completed";
        await session.save();

        return res.status(200).json({ message: "Session ended successfully" });
    } catch (error) {
        console.error("Error endSession:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}