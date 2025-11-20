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
  Checkbox,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const BusinessResultsTable = ({ businesses, onAddToTracking }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const [selectedBusinesses, setSelectedBusinesses] = useState([]);

  // Sorting function
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtering and sorting
  const filteredAndSortedBusinesses = useMemo(() => {
    let filtered = businesses.filter(business =>
      business.name.toLowerCase().includes(filterText.toLowerCase()) ||
      business.formatted_address.toLowerCase().includes(filterText.toLowerCase()) ||
      (business.types && business.types.some(type => 
        type.toLowerCase().includes(filterText.toLowerCase())
      ))
    );

    filtered.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

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
  }, [businesses, filterText, orderBy, order]);

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

  // Handle individual business selection
  const handleBusinessSelect = (businessId) => {
    setSelectedBusinesses(prev => {
      if (prev.includes(businessId)) {
        return prev.filter(id => id !== businessId);
      } else {
        return [...prev, businessId];
      }
    });
  };

  // Handle select all on current page
  const handleSelectAllOnPage = () => {
    const currentPageIds = paginatedBusinesses.map(b => b.place_id);
    const allSelected = currentPageIds.every(id => selectedBusinesses.includes(id));
    
    if (allSelected) {
      // Deselect all on current page
      setSelectedBusinesses(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      // Select all on current page
      setSelectedBusinesses(prev => {
        const newSelected = [...prev];
        currentPageIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  // Handle select all across all pages
  const handleSelectAll = () => {
    if (selectedBusinesses.length === filteredAndSortedBusinesses.length) {
      setSelectedBusinesses([]);
    } else {
      setSelectedBusinesses(filteredAndSortedBusinesses.map(b => b.place_id));
    }
  };

  // Add selected businesses to tracking
  const handleAddToTracking = () => {
    if (selectedBusinesses.length > 0) {
      const businessesToAdd = selectedBusinesses.map(businessId => {
        const business = businesses.find(b => b.place_id === businessId);
        return {
          ...business,
          contact_status: 'Not Contacted',
          notes: '',
          follow_up_date: '',
          last_contact_date: '',
          priority: 'Medium',
          added_date: new Date().toISOString().split('T')[0]
        };
      });
      
      onAddToTracking(businessesToAdd);
      setSelectedBusinesses([]);
    }
  };

  // Check if all on current page are selected
  const isAllSelectedOnPage = paginatedBusinesses.length > 0 && 
    paginatedBusinesses.every(business => selectedBusinesses.includes(business.place_id));

  // Check if some on current page are selected
  const isSomeSelectedOnPage = paginatedBusinesses.some(business => 
    selectedBusinesses.includes(business.place_id)
  );

  // Check if all businesses are selected
  const isAllSelected = businesses.length > 0 && selectedBusinesses.length === businesses.length;

  // Check if some businesses are selected
  const isSomeSelected = selectedBusinesses.length > 0;

  return (
    <Paper elevation={2}>
      {/* Header with Add to Tracking Button */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Search Results</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddToTracking}
            disabled={selectedBusinesses.length === 0}
            color="primary"
          >
            Add {selectedBusinesses.length > 0 ? `${selectedBusinesses.length} ` : ''}to Tracking
          </Button>
        </Box>
        
        {/* Filter Bar */}
        <TextField
          fullWidth
          label="Filter results"
          placeholder="Search by business name, address, or business type..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          size="small"
        />
      </Box>

      {/* Selection Summary */}
      {isSomeSelected && (
        <Alert severity="info" sx={{ mx: 2, mt: 2 }}>
          {selectedBusinesses.length} business{selectedBusinesses.length !== 1 ? 'es' : ''} selected
          {selectedBusinesses.length < businesses.length && (
            <span> • Click "Select All" to select all {businesses.length} results</span>
          )}
        </Alert>
      )}

      {/* Results Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={isSomeSelected && !isAllSelected}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  title="Select all businesses"
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={createSortHandler('name')}
                >
                  Business Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Address</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'rating'}
                  direction={orderBy === 'rating' ? order : 'asc'}
                  onClick={createSortHandler('rating')}
                >
                  Rating
                </TableSortLabel>
              </TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Business Types</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBusinesses.map((business) => (
              <TableRow key={business.place_id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedBusinesses.includes(business.place_id)}
                    onChange={() => handleBusinessSelect(business.place_id)}
                    title={`Select ${business.name}`}
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {business.name}
                  </Typography>
                  {business.place_id && (
                    <Typography variant="caption" color="text.secondary">
                      ID: {business.place_id.slice(-8)}
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {business.formatted_address}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  {business.rating ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={`${business.rating}★`}
                        color="primary"
                        variant="outlined"
                      />
                      {business.user_ratings_total && (
                        <Typography variant="caption" color="text.secondary">
                          ({business.user_ratings_total})
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No rating
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {business.formatted_phone_number && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={`tel:${business.formatted_phone_number}`}
                          sx={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {business.formatted_phone_number}
                        </Typography>
                      </Box>
                    )}
                    {business.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WebsiteIcon fontSize="small" color="action" />
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={business.website} 
                          target="_blank"
                          sx={{ textDecoration: 'none', color: 'primary.main' }}
                        >
                          Visit Website
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {business.types ? (
                      business.types.slice(0, 3).map((type, index) => (
                        <Chip
                          key={index}
                          label={type.replace(/_/g, ' ')}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No types
                      </Typography>
                    )}
                    {business.types && business.types.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{business.types.length - 3} more
                      </Typography>
                    )}
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
    </Paper>
  );
};

export default BusinessResultsTable;
