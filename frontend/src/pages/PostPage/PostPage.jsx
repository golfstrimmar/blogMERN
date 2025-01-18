import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import "./PostPage.scss";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";
// ==================
const PostPage = () => {
  const { id } = useParams(); // Получаем id из URL
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "You must be logged in to comment.",
  );
  const [userToken, setuserToken] = useState(localStorage.getItem("token"));
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentError, setCommentError] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  // ==============
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts/${id}`,
        );
        const userId = postResponse.data.user;
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/${userId}`,
        );
        setPost(postResponse.data);
        setUser(userResponse.data);
        console.log(postResponse.data.user);
        setLoading(false);
      } catch (err) {
        setError("Failed to load post data");
        setLoading(false);
      }
    };
    fetchPostData();
  }, [id]);
  useEffect(() => {
    console.log(post, user);
  }, [post, user]);
  // ==============Comments========================
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/comments/${id}`,
        );
        setComments(response.data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };
    fetchComments();
  }, [id]);
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };
  // ==============
  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  // ============================================================================
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setCommentError("To add a comment, please fill out the form.");
      return;
    }
    setCommentError("");
    setIsSubmitting(true);
    try {
      if (editingCommentId) {
        // Редактирование комментария
        await axios.put(
          `${process.env.REACT_APP_API_URL}/comments/${editingCommentId}`,
          { body: newComment },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === editingCommentId
              ? { ...comment, body: newComment }
              : comment,
          ),
        );
        setEditingCommentId(null); // Сброс редактирования
      } else {
        // Добавление нового комментария
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/comments`,
          {
            postId: id, // ID текущего поста
            body: newComment,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        setComments((prevComments) => [response.data, ...prevComments]);
      }
      setNewComment(""); // Очищаем поле
    } catch (err) {
      setErrorMessage(
        editingCommentId ? "Failed to update comment" : "Failed to add comment",
      );
      setOpenErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId),
      );
    } catch (err) {
      setErrorMessage("Failed to delete comment");
      setOpenErrorModal(true);
    }
  };
  const startEditComment = (comment) => {
    setNewComment(comment.body); // Предзаполняем текст
    setEditingCommentId(comment._id); // Устанавливаем ID редактируемого комментария
  };
  // ============================================================================
  return (
    <div className="post-page">
      <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
        {/* Выводим изображение, если оно есть */}
        {post.imageUrl && (
          <img
            src={`${post.imageUrl}`}
            alt={post.title}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
          />
        )}
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {post.text}
        </Typography>
        {user && (
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6">Posted by: {user.fullName}</Typography>
            <Typography variant="body2">Email: {user.email}</Typography>
          </Box>
        )}
        <Divider sx={{ marginBottom: 2 }} />
        {/*Comments*/}
        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Comments
          </Typography>

          {/* Форма для добавления комментария */}
          {isAuthenticated && userToken ? (
            <div className="add-comment-form">
              <TextField
                label={editingCommentId ? "Edit your comment" : "Add a Comment"}
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                value={newComment}
                onChange={handleCommentChange}
              />
              {commentError && (
                <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                  {commentError}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleCommentSubmit}
                disabled={isSubmitting}
                startIcon={<CommentIcon />}
                sx={{ marginTop: 2 }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : editingCommentId
                    ? "Save Changes"
                    : "Post Comment"}
              </Button>
              {editingCommentId && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setEditingCommentId(null);
                    setNewComment("");
                  }}
                  sx={{ marginTop: 2, marginLeft: 1 }}
                >
                  Cancel
                </Button>
              )}
            </div>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Please log in to add a comment.
            </Typography>
          )}
          {/* Отображаем комментарии */}
          <Divider sx={{ marginBottom: 3 }} />
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment._id} sx={{ marginBottom: 2 }}>
                <Typography variant="body2">
                  {comment.userId.fullName}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 2 }}
                >
                  {comment.userId.email}
                </Typography>
                <Typography variant="body1" paragraph>
                  {comment.body}
                </Typography>
                {/* Кнопки только для автора комментария */}
                {isAuthenticated &&
                  currentUser &&
                  comment.userId._id === currentUser._id && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => startEditComment(comment)}
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                <Divider />
              </Box>
            ))
          ) : (
            <Typography>No comments available</Typography>
          )}
        </Box>
        {/*Back to Posts page*/}
        <Box sx={{ marginTop: 2 }}>
          <Button variant="outlined" color="primary">
            <Link
              to="/posts"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Back to Posts page
            </Link>
          </Button>
        </Box>
      </Box>
      <ErrorModal
        open={openErrorModal}
        message={errorMessage}
        onClose={() => setOpenErrorModal(false)}
      />
    </div>
  );
};
export default PostPage;
