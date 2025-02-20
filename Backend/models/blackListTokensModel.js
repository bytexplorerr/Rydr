const mongoose = require("mongoose");


/* we are creating one collection of 'blackListTokens' which contains all black listed tokens which is used to
   implement the logic of 'logout' the user,
   with the TTL (time to leave) of 24 hours.
*/
const blackListTokensSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt: { type: Date, 
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        index: { expires: 86400 } 
    }
});

// Ensure TTL index is created
blackListTokensSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

const blackListTokensModel = mongoose.models.BlacklistTokens || mongoose.model('BlacklistTokens',blackListTokensSchema);

module.exports = blackListTokensModel;