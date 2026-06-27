import User from "../models/user.model.js";


const userRepository = {
    /**
     * @param {string} email 
     * @returns {Promise<Object|null>}
     */

    findByEmail: async (email)=>{
        return await User.findOne({email})

    },

    findByEmailWithPassword: async (email)=>{
        return await User.findOne({email}).select('+password')

    },

    /**
     * @param {string} id 
     * @returns {Promise<Object|null>}
     */

    findById: async (id)=>{
        return await User.findById(id)
    },

    /**
     *  @param {object} userData 
     *  @returns {Promise<Object>}
     */

    createUser: async ({userName,email,password})=>{
        return await User.create({userName,email,password})
    },

    /**
     * @returns {Promise<Array>}
     */

    findAll: async ()=>{
        return await User.find()
    },

    /**
     * @param {string} id 
     * @returns {Promise<Object|null>}
     */
    deleteById: async (id)=>{
       return  await User.findByIdAndDelete(id)
    },

    /**
     * @param {string} id 
     * @param {string} role 
     * @returns {Promise<Object|null>}
     */
    
    updateRole: async (id,role)=>{
        return await User.findByIdAndUpdate(id,{role},{new:true})
    },


    /**
     * @param {string} id 
     * @param {Object} data 
     * @returns {Promise<Object|null>}
     */

    updateProfile: async (id,data)=>{
        return await User.findByIdAndUpdate(id,data,{
            new:true,
            runValidators:true
        })
    }
}


export default userRepository;
