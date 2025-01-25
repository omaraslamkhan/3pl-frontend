import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { inventoryManagement } from 'services/inventoryManagement.service';

const initialFormData = {
  sku: "",
  product_name: "",
  quantities: 0,
  location: "",
  product_image: ''
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function AddModalForm({ open, setOpen, heading, getList, setMessage, selectedItemForEdit }) {
  const [formData, setFormData] = useState(selectedItemForEdit ? selectedItemForEdit : initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    return () => {
      setFormData({
        sku: "",
        product_name: "",
        quantities: 0,
        location: "",
        product_image: ''
      });
    }
  }, [])

  useEffect(() => {
    setFormData(selectedItemForEdit);
  }, [selectedItemForEdit])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      // For Edit
      if(selectedItemForEdit) {
        const response = await inventoryManagement.updateInventoryItem(formData);
        if(response?.message.includes('successfully')) {
          setMessage(response?.message);
          await getList();
        }
      } else {
        // For Add
        const response = await inventoryManagement.addInventoryItem(formData);
        if(response?.message.includes('successfully')) {
          setMessage(response?.message);
          await getList();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setOpen();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };
  
  const uploadImage = (file) => {
    const fileformData = new FormData();
    fileformData.append('image', file);
  
    inventoryManagement.uploadFile(fileformData)
      .then(response => {
        setFormData({
          ...formData,
          product_image: response?.url
        })
        // Handle successful upload response
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // Handle upload error
      });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={setOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {heading}
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="SKU"
            name="sku"
            value={formData?.sku}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Product Name"
            name="product_name"
            value={formData?.product_name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Quantities"
            name="quantities"
            type="number"
            value={formData?.quantities}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Location"
            name="location"
            value={formData?.location}
            onChange={handleChange}
          />
          <label htmlFor="image-upload">
            <Typography variant="subtitle1">Product Image:</Typography>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData?.product_image && (
              <div style={{ marginTop: '10px' }}>
                <img src={formData?.product_image} alt="Product Preview" style={{ width: '100px', height: '100px' }} />
              </div>
            )}
          </label>
          <br />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default AddModalForm;
