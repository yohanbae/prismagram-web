import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import useInput from "../../Hooks/useInput";
import PostPresenter from "./PostPresenter";
import { ADD_COMMENT, TOGGLE_LIKE } from "./PostQueries";
import { useMutation } from "react-apollo-hooks";
import {toast} from "react-toastify";


const PostContainer = ({id, user, files, likeCount,isLiked, comments, createdAt, location, caption}) => {
    const [isLikedS, setIsLiked] = useState(isLiked);
    const [likeCountS, setLikeCount] = useState(likeCount);
    const [currentItem, setCurrentItem] = useState(0);
    const [selfComments, setSelfComments] = useState([]);

    const comment = useInput("");

    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
        variables: {postId: id}
    });
    
    const [addCommentMutation] = useMutation(ADD_COMMENT, {
        variables: {postId: id, text:comment.value}
    });



    const slide = () => {
        const totalFiles = files.length;
        if(currentItem === totalFiles -1){
            setTimeout(() => setCurrentItem(0), 3000);
        }else{
            setTimeout(() => setCurrentItem(currentItem + 1), 3000);            
        }
    };
    useEffect(() => {
        // slide();
        const totalFiles = files.length;
        if(currentItem === totalFiles -1){
            setTimeout(() => setCurrentItem(0), 3000);
        }else{
            setTimeout(() => setCurrentItem(currentItem + 1), 3000);            
        }        
      }, [currentItem]);

    const toggleLike = async() => {
        toggleLikeMutation();
        if(isLikedS === true) {
            setIsLiked(false);
            setLikeCount(likeCountS - 1);
        } else {
            setIsLiked(true);
            setLikeCount(likeCountS + 1);
        }        
    }

    const onKeyPress = async(event) => {
        const {which} = event;
        if(which === 13){
            event.preventDefault();
            try {
                const {data: {addComment} } = await addCommentMutation();
                setSelfComments([...selfComments, addComment]);      
                comment.setValue("");          
            } catch {
                toast.error("Cannot send comment");
            }


        }
        // return;
    }

    return <PostPresenter 
        user={user}
        files={files}
        likeCount={likeCountS}
        isLiked={isLikedS}
        comments={comments}
        createdAt={createdAt}
        newComment={comment}
        setIsLiked={setIsLiked}
        setLikeCount={setLikeCount}
        location={location}
        caption={caption}
        currentItem={currentItem}
        toggleLike = {toggleLike}
        onKeyPress = {onKeyPress}
        selfComments = {selfComments}
    />;
}

PostContainer.propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id:PropTypes.string.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired
    }).isRequired,
    files: PropTypes.arrayOf(
        PropTypes.shape({
            id:PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })
    ).isRequired,
    likeCount: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
        id:PropTypes.string.isRequired,
        text:PropTypes.string.isRequired,
        user: PropTypes.shape({
            id:PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
        }).isRequired
    })
    ).isRequired,
    createdAt: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    location: PropTypes.string
}

export default PostContainer;