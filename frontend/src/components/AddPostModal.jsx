import React, {useState, useEffect} from 'react';
import {Modal, Box, Typography, TextField, Button, Input} from '@mui/material';
import axios from '../API/axios';

const AddPostModal = ({open, onClose, onAddPost, postToEdit, onUpdatePost}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);
  const handleTagsChange = (e) => setTags(e.target.value);
  // Заполняем форму данными поста, если редактируем существующий
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setBody(postToEdit.text);
      setTags(postToEdit.tags || '');
      setImagePreview(postToEdit.imageUrl ? postToEdit.imageUrl : null);
      setImage(null);
    }
  }, [postToEdit]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  // --------------------------------
  const handleClose = () => {
    setTitle('');
    setBody('');
    setTags('');
    setImage(null);
    setImagePreview(null);
    setErrorMessage('');
    onClose();
  };
  // ---------------------------------------
  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setErrorMessage('The title and text are required.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', body);
    formData.append('tags', tags);
    formData.append('positiveLikes', 0);
    formData.append('negativeLikes', 0);
    // if (image) {
    //   formData.append('image', image);
    // }
    if (image) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        imageFormData.append('upload_preset', 'blogblog'); // Замените на ваш upload_preset из Cloudinary
        imageFormData.append('cloud_name', 'dke0nudcz'); // Замените на ваш cloud_name
        // Отправляем изображение в Cloudinary
        const imageResponse = await axios.post('https://api.cloudinary.com/v1_1/dke0nudcz/image/upload', imageFormData);
        const imageUrl = imageResponse.data.secure_url;
        formData.append('imageUrl', imageUrl); // Добавляем URL изображения в данные формы
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        setErrorMessage('Failed to upload image.');
        setIsSubmitting(false);
        return;
      }
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    // -------------------------------------------------------------
    try {
      if (postToEdit) {
        onUpdatePost(postToEdit._id, formData);
      } else {
        // const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts`, formData, {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        onAddPost(response.data);
      }
      handleClose();
    } catch (error) {
      console.error('Error occurred while submitting post:', error);
      setErrorMessage('To add a post, you need to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // ---------------------------------------------------------------------------
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{padding: 3, maxWidth: 500, margin: 'auto', backgroundColor: 'white', borderRadius: 2}}>
        <Typography variant="h6" gutterBottom>
          {postToEdit ? 'Edit Post' : 'Add New Post'}
        </Typography>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={handleTitleChange}
          sx={{marginBottom: 2}}
        />
        <TextField
          label="Text"
          fullWidth
          multiline
          rows={4}
          value={body}
          onChange={handleBodyChange}
          sx={{marginBottom: 2}}
        />
        <TextField
          label="Tags"
          fullWidth
          value={tags}
          onChange={handleTagsChange}
          sx={{marginBottom: 2}}
        />
        {/* Кастомизированное поле для загрузки изображения */}
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            sx={{width: '100%', marginBottom: 2}}
          >
            {image ? 'Image Selected' : 'Choose Image'}
          </Button>
        </label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          sx={{visibility: 'hidden', position: 'absolute'}}
        />
        {imagePreview && (
          <Box sx={{marginBottom: 2, textAlign: 'center'}}>
            <img
              src={imagePreview}
              alt="Image preview"
              style={{width: 100, height: 100, objectFit: 'cover', borderRadius: 8}}
            />
          </Box>
        )}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : postToEdit ? 'Save Changes' : 'Add Post'}
        </Button>
      </Box>
    </Modal>
  );
};
export default AddPostModal;
