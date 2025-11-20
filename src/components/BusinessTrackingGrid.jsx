import React, { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
} from '@mui/icons-material';

const BusinessTrackingGrid = ({ 
  trackedBusinesses, 
  onUpdateBusiness, 
  onDeleteBusiness
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [orderBy, setOrderBy] = useState('added_date');
  const [order, setOrder] = useState('desc');
  const [filterText, setFilterText] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);

  // Contact status options
  const contactStatuses = [
    'Not Contacted',
    'Initial Contact Made',
    'Follow-up Sent',
    'Meeting Scheduled',
    'Proposal Sent',
    'Negotiating',
    'Closed - Won',
    'Closed - Lost',
    'Not Interested'
  ];

  // Sorting function
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtering and sorting
  const filteredAndSortedBusinesses = useMemo(() => {
    let filtered = trackedBusinesses.filter(business =>
      (business.name?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (business.formatted_address?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (business.contact_status?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
      (business.notes?.toLowerCase() || '').includes(filterText.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle date fields specially
      if (orderBy === 'added_date' || orderBy === 'follow_up_date' || orderBy === 'last_contact_date') {
        // Convert to Date objects for proper comparison
        const aDate = aValue ? new Date(aValue) : new Date(0);
        const bDate = bValue ? new Date(bValue) : new Date(0);
        
        if (order === 'desc') {
          return bDate - aDate; // Newest first
        }
        return aDate - bDate; // Oldest first
      }

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Handle string comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    return filtered;
  }, [trackedBusinesses, filterText, orderBy, order]);

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated data
  const paginatedBusinesses = filteredAndSortedBusinesses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const createSortHandler = (property) => (event) => {
    handleRequestSort(property);
  };

  // Edit business
  const handleEditBusiness = (business) => {
    setEditingBusiness(business);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingBusiness) {
      onUpdateBusiness(editingBusiness);
      setEditDialogOpen(false);
      setEditingBusiness(null);
    }
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingBusiness(null);
  };

  // Export tracking data
  const handleExport = (format) => {
    if (trackedBusinesses.length === 0) return;

    if (format === 'csv') {
      exportToCSV();
    } else if (format === 'excel') {
      exportToExcel();
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Business Name', 'Address', 'Phone', 'Website', 'Rating', 
      'Contact Status', 'Notes', 'Follow-up Date', 'Last Contact Date', 
      'Priority', 'Added Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...trackedBusinesses.map(business => [
        `"${business.name}"`,
        `"${business.formatted_address}"`,
        `"${business.formatted_phone_number || 'N/A'}"`,
        `"${business.website || 'N/A'}"`,
        business.rating || 'N/A',
        `"${business.contact_status}"`,
        `"${business.notes || ''}"`,
        `"${business.follow_up_date || ''}"`,
        `"${business.last_contact_date || ''}"`,
        `"${business.priority || 'Medium'}"`,
        `"${business.added_date || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business_tracking_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(trackedBusinesses.map(business => ({
        'Business Name': business.name,
        'Address': business.formatted_address,
        'Phone': business.formatted_phone_number || 'N/A',
        'Website': business.website || 'N/A',
        'Rating': business.rating || 'N/A',
        'Contact Status': business.contact_status,
        'Notes': business.notes || '',
        'Follow-up Date': business.follow_up_date || '',
        'Last Contact Date': business.last_contact_date || '',
        'Priority': business.priority || 'Medium',
        'Added Date': business.added_date || ''
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Business Tracking');
      
      XLSX.writeFile(workbook, `business_tracking_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed - Won': return 'success';
      case 'Closed - Lost': return 'error';
      case 'Not Interested': return 'error';
      case 'Negotiating': return 'warning';
      case 'Proposal Sent': return 'info';
      case 'Meeting Scheduled': return 'info';
      case 'Follow-up Sent': return 'warning';
      case 'Initial Contact Made': return 'primary';
      default: return 'default';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={2}>
      {/* Header and Actions */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Business Tracking Grid</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Export to CSV">
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('csv')}
                disabled={trackedBusinesses.length === 0}
              >
                CSV
              </Button>
            </Tooltip>
            <Tooltip title="Export to Excel">
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('excel')}
                disabled={trackedBusinesses.length === 0}
              >
                Excel
              </Button>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Filter Bar */}
        <TextField
          fullWidth
          label="Filter tracking data"
          placeholder="Search by business name, address, status, or notes..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          size="small"
        />
      </Box>

      {/* Tracking Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={createSortHandler('name')}
                >
                  Business Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'contact_status'}
                  direction={orderBy === 'contact_status' ? order : 'asc'}
                  onClick={createSortHandler('contact_status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Follow-up Date</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={createSortHandler('priority')}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'added_date'}
                  direction={orderBy === 'added_date' ? order : 'asc'}
                  onClick={createSortHandler('added_date')}
                >
                  Added Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBusinesses.map((business) => (
              <TableRow key={business.place_id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {business.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {business.formatted_address}
                  </Typography>
                  {business.rating && (
                    <Chip
                      size="small"
                      label={`${business.rating}★ (${business.user_ratings_total || 0})`}
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {business.formatted_phone_number && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" component="a" href={`tel:${business.formatted_phone_number}`}>
                          {business.formatted_phone_number}
                        </Typography>
                      </Box>
                    )}
                    {business.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WebsiteIcon fontSize="small" color="action" />
                        <Typography variant="body2" component="a" href={business.website} target="_blank">
                          Visit Website
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={business.contact_status}
                    color={getStatusColor(business.contact_status)}
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {business.notes || 'No notes'}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {business.follow_up_date || 'Not set'}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={business.priority || 'Medium'}
                    color={getPriorityColor(business.priority)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {business.added_date || 'Unknown'}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit tracking info">
                      <IconButton size="small" onClick={() => handleEditBusiness(business)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from tracking">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => onDeleteBusiness(business.place_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredAndSortedBusinesses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCancelEdit} maxWidth="md" fullWidth>
        <DialogTitle>Edit Business Tracking</DialogTitle>
        <DialogContent>
          {editingBusiness && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">{editingBusiness.name}</Typography>
              
              <FormControl fullWidth>
                <InputLabel>Contact Status</InputLabel>
                <Select
                  value={editingBusiness.contact_status}
                  label="Contact Status"
                  onChange={(e) => setEditingBusiness({
                    ...editingBusiness,
                    contact_status: e.target.value
                  })}
                >
                  {contactStatuses.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={editingBusiness.notes || ''}
                onChange={(e) => setEditingBusiness({
                  ...editingBusiness,
                  notes: e.target.value
                })}
                placeholder="Add notes about this business..."
              />
              
              <TextField
                fullWidth
                label="Follow-up Date"
                type="date"
                value={editingBusiness.follow_up_date || ''}
                onChange={(e) => setEditingBusiness({
                  ...editingBusiness,
                  follow_up_date: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                fullWidth
                label="Last Contact Date"
                type="date"
                value={editingBusiness.last_contact_date || ''}
                onChange={(e) => setEditingBusiness({
                  ...editingBusiness,
                  last_contact_date: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editingBusiness.priority || 'Medium'}
                  label="Priority"
                  onChange={(e) => setEditingBusiness({
                    ...editingBusiness,
                    priority: e.target.value
                  })}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BusinessTrackingGrid;
