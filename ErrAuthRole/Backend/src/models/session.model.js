import mongoose  from 'mongoose';


const sessonSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            index:true,
        },
        currentRefreshTokenHash:{
            type:String,
            required:true,
        },
        deviceInfo:{
            type:String,
            default:'Unknown Device'
        },
        userAgent:{
            type:String,
            default:'Unknown User Agent',
        
        },
        ipAddress:{
            type:String,
            default:'Unknown IP',
        },
        expiresAt:{
            type:Date,
            required:true,
            index:true
        },
        lastUsedAt:{
            type:Date,
            default:Date.now,

        },
        
        revokedAt:{
            type:Date,
            default:null
        }
    },
    {
        timestamps:true
    }
)



sessionSchema.methods.isValid = function (){
    return !this.revokedAt && this.expiredAt > new Date()
}


const Session = mongoose.model('Session',sessionSchema)

export default Session;
