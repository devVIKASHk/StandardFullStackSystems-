import Session from "../models/session.model.js"


const sessionRepository = {
    /**
     * Create new session.
    */
   createSession: async (sessionPayload)=>{
    return await Session.create(sessionPayload);
   },

   /**
    * Find Session By session id
    */
   findById: async (id)=>{
     return await Session.findById(id);
   },

   /**
    * Find an active session for a specific user and device info/user agent.
    */

   findActiveSession: async (userId,userAgent,ipAddress)=>{
    return await Session.findOne({
        userId,
        userAgent,
        ipAddress,
        revokedAt:null,
        expiresAt:{$gt: new Date()},
    });
   },

   /**
    * Update the refresh token has of an existing session and set lastUsedAt.
    */
   updateTokenHash: async (id,newHash)=>{
    return await Session.findByIdAndUpdate(
        id,
        {
            currentRefreshTokenHash:newHash,
            lastUsedAt: new Date(),
        },
        {new:true}
    )
   },

   /**
    *  Revoke a specific session 
    */
   revokeSession: async (id)=>{
    return await Session.findByIdAndUpdate(
        id,
        {revokedAt: new Date()},
        {new:true}
    );
   },

   /**
    * Revoke all sessions for a given user (logout from all devices.)
    */

   revokeAllUserSession: async (userId)=>{
    return await Session.updateMany(
        {userId,revokedAt:null},
        {$set:{revokedAt: new Date()}}
    )
   }
}

export default sessionRepository;