
const mongoose = require("mongoose");

const connectionReqestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message: `{VALUE} is incorrect!!!`
        },
        required:true,
    }
},{timestamps:true});

//optimizing search
connectionReqestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionReqestSchema.pre("save",function (next){
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("apbe apne ap ko nahi bhej sakte!!!");
    }

    next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionReqestSchema);
module.exports = ConnectionRequest;
