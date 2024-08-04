'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Modal, Stack, TextField, Button, Paper } from '@mui/material';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export default function PantryTracker() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#121212"
      color="#E0E0E0"
      p={3}
      sx={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <Typography variant="h3" mb={3}>Pantry Tracker</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, width: '100%', maxWidth: '600px', bgcolor: '#1E1E1E', color: '#E0E0E0' }}
        InputProps={{
          style: { color: '#E0E0E0' },
        }}
        InputLabelProps={{
          style: { color: '#E0E0E0' },
        }}
      />
      <Box
        component={Paper}
        elevation={3}
        width="100%"
        maxWidth="800px"
        bgcolor="#1E1E1E"
        p={2}
        borderRadius="12px"
      >
        <Stack spacing={2}>
          {filteredInventory.length > 0 ? (
            filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#2E2E2E"
                p={2}
                borderRadius="8px"
              >
                <Typography variant="h6" color="#E0E0E0">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="#E0E0E0">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          ) : (
            <Typography variant="h6" color="#E0E0E0">
              No items found.
            </Typography>
          )}
        </Stack>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#1E1E1E"
          border="1px solid #333"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)', borderRadius: '12px' }}
        >
          <Typography variant="h6" color="#E0E0E0">Add Item</Typography>
          <TextField
            variant='outlined'
            label="Item Name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ input: { color: '#E0E0E0' }, bgcolor: '#333' }}
            InputProps={{
              style: { color: '#E0E0E0' },
            }}
            InputLabelProps={{
              style: { color: '#E0E0E0' },
            }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (itemName) {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }
              }}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
