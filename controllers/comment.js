import Comment from '../models/comments.js';


export const getComments = async (req, res) => {

    try {
        const comment = await Comment.find();

        if(!comment || comment.length === 0) return false
        

        res.status(200).json({ comments: comment });

    }catch (err) {
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
}