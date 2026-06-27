import mongoose from 'mongoose';




const userSchema = new mongoose.Schema(
    {
        userName:{
            type:String,
            required:[true,'Username is required'],
            trim:true,
        },

        isEmailVerified:{
            type:Boolean,
            default:false,
        },

        email:{
            type:String,
            required:[true,'Email is required'],
            unique:true,
            lowercase:true,
            trim:true
        },
        
        password:{
            type:String,
            required:[true,'Password is required'],
            minLength:[6,'Password must be atleast 6 characters'],
            select:false ,

        },

        role:{
            type:String,
            enum:['user','admin'],
            default:'user',
        }
    },
    {
        timestamps:true
    }
)





userSchema.pre('save',
    async  function (next){
        if (!this.isModified('password')){
            return next()
        }


        const salt =await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(this.password,salt);
        next();
    }
)



/** \
 * @param {string} candidatePassword 
 * @returns {Promise<boolean>} 
 */


userSchema.methods.comparePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
}


const User = mongoose.model('User',userSchema);

export default User;