const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const PostSchema = new Scheme({
    user:{
        type: Scheme.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar:{
        type: String
    },
    likes: [
        {
            user: {
                type: Scheme.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Scheme.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.Now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.Now
    }
});

module.exports = Post = mongoose.model('post',PostSchema);