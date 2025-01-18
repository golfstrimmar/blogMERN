import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../API/axios";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Pagination,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import AddPostModal from "../../components/AddPostModal";
import "./Posts.scss";
import { useAuth } from "../../context/AuthContext";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [openAddPostModal, setOpenAddPostModal] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [postToEdit, setPostToEdit] = useState(null);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  // ----------------------------------------
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts`,
          {
            params: { sortBy, order },
          }
        );
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch posts");
        setLoading(false);
      }
    };
    fetchPosts();
  }, [sortBy, order]);
  // -----------------------------------
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // -----------------------------------
  const handleEditPost = (post) => {
    setPostToEdit(post); // Устанавливаем пост, который редактируется
    setOpenAddPostModal(true); // Открываем модалку
  };
  // -----------------------------------
  const handleUpdatePost = async (postId, updatedData) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/posts/${postId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedPost = response.data;
      console.log(updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, ...updatedPost } : post
        )
      );
      handleCloseAddPostModal();
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post");
    }
  };
  // -----------------------------------
  const deletePost = async (postId) => {
    setDeletingPostId(postId);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setDeletingPostId(null);
    } catch (err) {
      setError("Failed to delete post");
      setDeletingPostId(null);
    }
  };
  // -----------------------------------
  const handleExited = () => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletingPostId)
    );
    setDeletingPostId(null);
  };
  // -----------------------------------
  const handleAddPost = async (newPost) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts`
      );
      setPosts(response.data);
    } catch (err) {
      setError("Failed to add post");
    }
  };
  // -----------------------------------
  const handleOpenAddPostModal = () => {
    setOpenAddPostModal(true);
  };
  // -----------------------------------
  const handleCloseAddPostModal = () => {
    setOpenAddPostModal(false);
  };
  // -----------------------------------
  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  //--------------------------------------------
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  // -----------------------------------
  // const updateLikes = async (postId, likesData) => {
  //   try {
  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_API_URL}/posts/${postId}/likes`,
  //       likesData
  //       // {
  //       //   headers: {
  //       //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       //   },
  //       // }
  //     );
  //     const updatedPost = response.data;
  //     // Обновляем только один пост в списке
  //     setPosts((prevPosts) =>
  //       prevPosts.map((post) =>
  //         post._id === postId ? {...post, ...updatedPost} : post
  //       )
  //     );
  //   } catch (err) {
  //     console.error('Error updating likes:', err);
  //     setError('Failed to update likes.');
  //   }
  // };
  const updateLikes = async (postId, likesData) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/posts/${postId}/likes`,
        likesData
      );
      const updatedPost = response.data;
      // Обновляем только тот пост, который был изменен
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                positiveLikes: updatedPost.positiveLikes,
                negativeLikes: updatedPost.negativeLikes,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error updating likes:", err);
      setError("Failed to update likes.");
    }
  };
  const inkpositiveLikes = (
    postId,
    currentPositiveLikes,
    currentNegativeLikes
  ) => {
    const newPositiveLikes = currentPositiveLikes + 1;
    updateLikes(postId, {
      positiveLikes: newPositiveLikes,
      negativeLikes: currentNegativeLikes, // передаём текущее значение для второго поля
    });
  };
  const inknegativeLikes = (
    postId,
    currentPositiveLikes,
    currentNegativeLikes
  ) => {
    const newNegativeLikes = currentNegativeLikes + 1;
    updateLikes(postId, {
      positiveLikes: currentPositiveLikes, // передаём текущее значение для первого поля
      negativeLikes: newNegativeLikes,
    });
  };
  // -----------------------------------
  // -----------------------------------
  return (
    <div className="page posts">
      <h1>Posts</h1>
      {isAuthenticated && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddPostModal}
          sx={{ marginBottom: 3 }}
        >
          Add New Post
        </Button>
      )}
      {/* Sorting Selects */}
      <Divider sx={{ marginBottom: 3, marginTop: 3 }} />
      <div className="sort-controls">
        <FormControl sx={{ minWidth: 150, marginRight: 2 }}>
          <InputLabel id="sortBy-label">Sort By</InputLabel>
          <Select
            labelId="sortBy-label"
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="createdAt">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="tags">Tags</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="order-label">Order</InputLabel>
          <Select
            labelId="order-label"
            value={order}
            label="Order"
            onChange={(e) => setOrder(e.target.value)}
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </Select>
        </FormControl>
      </div>
      {/* Проверка на наличие постов */}
      {posts.length === 0 ? (
        <Typography variant="h5" color="textSecondary">
          No posts available.
        </Typography>
      ) : (
        <>
          <section className="posts-list">
            <TransitionGroup>
              {currentPosts.map((post, index) => (
                <CSSTransition
                  key={post._id}
                  timeout={500}
                  classNames="fade-slide"
                  onExited={handleExited}
                >
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      {post.imageUrl && (
                        <img
                          src={`${post.imageUrl}`}
                          alt={post.title}
                          style={{
                            width: "100%",
                            maxHeight: "400px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Typography variant="h2" component="h1" gutterBottom>
                        <Link to={`/post/${post._id}`}>
                          {indexOfFirstPost + index + 1}. {post.title}
                        </Link>
                      </Typography>
                      <Typography component="p">{post.text}</Typography>
                      {/* Date */}
                      {post.createdAt && (
                        <Typography variant="body2" color="textSecondary">
                          Created on: {formatDate(post.createdAt)}
                        </Typography>
                      )}
                      {/* User */}
                      {post.user && post.user.fullName ? (
                        <Typography variant="body2" color="textSecondary">
                          Author: {post.user.fullName}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Author: Unknown
                        </Typography>
                      )}
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 ? (
                        <Typography variant="body2" color="textSecondary">
                          Tags:{" "}
                          {post.tags.map((tag, idx) => (
                            <span key={idx} style={{ marginRight: "5px" }}>
                              #{tag}
                            </span>
                          ))}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No tags
                        </Typography>
                      )}
                      {/* Views*/}
                      {post.viewsCount ? (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <VisibilityIcon sx={{ marginRight: 0.5 }} />{" "}
                          {post.viewsCount}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          <span>It has not been viewed yet.</span>
                        </Typography>
                      )}
                      {/*likes*/}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ display: "flex", gap: "5px" }}
                      >
                        <ThumbUpIcon
                          onClick={() => {
                            inkpositiveLikes(
                              post._id,
                              post.positiveLikes,
                              post.negativeLikes
                            );
                          }}
                        />{" "}
                        {post.positiveLikes}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ display: "flex", gap: "5px" }}
                      >
                        <ThumbDownIcon
                          onClick={() => {
                            inknegativeLikes(
                              post._id,
                              post.positiveLikes,
                              post.negativeLikes
                            );
                          }}
                        />{" "}
                        {post.negativeLikes}
                      </Typography>
                      {/*EditPost*/} {/*Delete*/}
                      {isAuthenticated &&
                        currentUser &&
                        post.user &&
                        post.user._id === currentUser._id && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              startIcon={<EditIcon />}
                              onClick={() => handleEditPost(post)}
                            >
                              Edit
                            </Button>
                            <Button
                              startIcon={<DeleteIcon />}
                              color="error"
                              onClick={() => deletePost(post._id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                    </CardContent>
                  </Card>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </section>
          {/* Пагинация */}
          <Pagination
            count={Math.ceil(posts.length / postsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}
      <AddPostModal
        open={openAddPostModal}
        onClose={handleCloseAddPostModal}
        onAddPost={handleAddPost}
        postToEdit={postToEdit}
        onUpdatePost={handleUpdatePost}
      />
    </div>
  );
};
export default Posts;
