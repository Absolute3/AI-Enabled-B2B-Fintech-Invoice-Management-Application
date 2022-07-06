import '../index.css'
import React from 'react';
import { TableContainer, TableHead, Paper, Table, TableRow, TableCell, TableBody } from "@mui/material";
import { Checkbox, TablePagination, TextField,Dialog, DialogActions, DialogContent, DialogContentText } from "@material-ui/core";
import { useEffect, useState } from 'react';
import { getData, updateUser, deleteUser,  getSearch, predict} from '../services/data';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import Arrow from "./Arrow";
import EditUser from './EditUser';
import RightAddButton from './RightAddUser';
import AdvSearch from "./AdvSearch";
import { Alert } from '@mui/material';

export default function MyGrid() {
  const [data,setData] = useState([]);
  const [pageSize, setPageSize] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState({business_code:'',buisness_year:'', baseline_create_date:'', invoice_id:'', cust_number:'', doc_id:'', due_in_date:'', total_open_amount:'', posting_date:'', document_type:'', cust_payment_terms:'',invoice_currency:'', clear_date:'', document_create_date:'', posting_id:''});
  const [edit, setEdit] = useState({sl_no:'', invoice_currency:'',cust_payment_terms:'', name_customer:''});
  const [adv, setadv] = useState({business_code:'',buisness_year:'', baseline_create_date:'', invoice_id:'', cust_number:'', doc_id:'', due_in_date:'', total_open_amount:'', posting_date:'', document_type:'', cust_payment_terms:'',invoice_currency:'', clear_date:'', document_create_date:'', posting_id:''})
  
  var {business_code, buisness_year, baseline_create_date, area_business, invoice_id, cust_number, doc_id, due_in_date, total_open_amount, posting_date, document_type, cust_payment_terms,invoice_currency,clear_date, document_create_date, posting_id} = user;
  var {sl_no,invoice_currency, cust_payment_terms } = edit;
  var {invoice_id, doc_id, buisness_year,cust_number} = adv

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [count, setCount] = React.useState(0);
  const [anaopen, setanaopen] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState('sl_no');
  const [order, setOrder] = React.useState('ASC');
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState('');


  //Opens the pop up for analytics view
  const anaHandler = () => {
    setanaopen(true);
    }
  
  //Handles input to convert them to search results
  let inputHandler = (e) => {
      var lowerCase = e.target.value.toLowerCase();
      setInput(lowerCase);
      }
  
  //Closes the pop up for analytics view
  const anaClose = () => {
      setanaopen(false);
    }

  //Change Handler for edit which handles changes and sets edit using destructuring
  const changeHandler = (e) => {
    const {name, value} = e.target;
    setEdit({...edit,[name] :value});
  }

  //Handle Click open
  const handleClickOpen = () => {
    setOpen(true);
  };

  //Edit Handler to open the Edit dialog box
  const editHandler = () => {
  setOpen(true);
  }

  // Delete Handler, deletes Invoice and reloads document
  const deleteHandler = async (e) => {
      let response =  await deleteUser(sl_no);
      document.location.reload(true)
    }
  
  //Filters the data for the edit pop up box
  const checkHandler = (e, sl_no) => {
    if (e.target.checked){ 
    let edit = data.filter(user => user.sl_no == sl_no)[0];
    setEdit(edit)
    }
  }

  //Handles the predict and sets the predicted values
  const handlePredict = () => {
    let data = {
     
      name_customer:edit.name_customer,
      business_code: edit.business_code,
      cust_number: edit.cust_number,
      clear_date: edit.clear_date,
      buisness_year: edit.buisness_year,
      doc_id: edit.doc_id,
      posting_date: edit.posting_date,
      due_in_date: edit.due_in_date,
      baseline_create_date: edit.baseline_create_date,
      cust_payment_terms: edit.cust_payment_terms,
      converted_usd: edit.invoice_currency==="CAD"?edit.total_open_amount*0.79:edit.total_open_amount}
      
      let age = predict(data)
  }

  //Handles the search box to open the pop up
  const searchHandler = () => {
    setSearch(true);
  }

  //Handles the advanced search box set the values
  const advSearchHandler = (e) => {
      const {name, value} = e.target;
      setadv({...adv,[name] :value});
  }
  
  //Gets the results from backend
  const handleSearch = async (update) => {
    if(update){
      let response = await getSearch(adv);     
      console.log()
      window.alert('Found match at Serial Number ' + response[0].sl_no)
      setadv({business_code:'',buisness_year:'', baseline_create_date:'', invoice_id:'', cust_number:'', doc_id:'', due_in_date:'', total_open_amount:'', posting_date:'', document_type:'', cust_payment_terms:'',invoice_currency:'', clear_date:'', document_create_date:'', posting_id:''})
    }
    setSearch(false);
}

  //Handles close for updating the invoice 
  const handleClose = async (update) => {
    if (update){
      let response = await updateUser(edit);
      document.location.reload(true)
    }
    setOpen(false);
  };

  //Handles the page changes for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //Handles the rows per page changes for pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Handles the sortings for the table
  const sortingHandler = (newField) =>{
    if (orderBy == newField){
      let newOrder = order == "ASC" ? "DESC" : "ASC";
      setOrder(newOrder)
    }
    else{
      setOrder("ASC");
    }
    setOrderBy(newField);
  } 

  //Use effect to get the data from backend
  useEffect(async function () {
    let data = await getData(page, rowsPerPage, order, orderBy);
    setData(data['data']);
    setCount(data['count']);
  }, [rowsPerPage, page, order, orderBy]);

  return <>
    <div classname = "grid">
    <div className='box-container grid'>
    <div className = "left">
      
      <Stack direction="row" spacing={3}>
        <Button style = {{height : 50, width:100, background: "#16aef2",borderColor: "#16aef2"}} variant="contained" onClick = {handlePredict}>Predict</Button>

        {/* Analytics view and its related function  */}
        <Button style = {{height : 50, backgroundColor:"#2D3C49",borderColor:"#16aef2",color:'white', width:150}} variant="outlined" onClick = {anaHandler}>Analytics View</Button>
        <Dialog
        open={anaopen}
        onClose={anaClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <Alert variant="outlined" severity="warning">Sorry, this feature is not currently available</Alert>
          </DialogContentText>
        </DialogContent>
      </Dialog>
        {/* Advanced view and its related functions */}
        <AdvSearch invoice_id = {  invoice_id }  cust_number = {cust_number} doc_id = { doc_id } buisness_year = {buisness_year} handleSearch={handleSearch} open = {search} changeHandleSearch = {advSearchHandler} />
        <Button style = {{height : 50,backgroundColor : "#2D3C49",borderColor:"#16aef2" , color:'white', width:150}} variant="outlined" onClick = {searchHandler}>Advance Search</Button>
        
        
        <Button style = {{height:50, width:20}}onClick = {() => document.location.reload(true)}><RefreshIcon /></Button>
    </Stack>   
      
      </div>
      <div className = "center">  
        <TextField  className = 'search-box' style = {{outline :"None",background:'white' , color:'white'}} id="standard-basic" label="Search" variant="outlined" onClick = {() => window.alert('Sorry, this feature does not work')}  onChange = {() => window.alert('Sorry, this feature does not work')}/> 
        </div>
      
      <div className = "right">
      <Stack direction="row" spacing={3}>
      <RightAddButton />

      <EditUser invoice_currency = {  invoice_currency }  cust_payment_terms = {cust_payment_terms} sl_no = { sl_no } handleClose={handleClose} open = {open} changeHandler = {changeHandler}/>
      <Button className = 'border' sx = {{width : 120, height : 50,borderColor:"white",color : "white"}} variant="outlined" onClick={editHandler} >Edit</Button>

      <Button style = {{width : 120, height : 50,borderColor:"white" ,color : "white"}} variant="outlined" onClick={(e) => deleteHandler(e)}>Delete</Button>
    
    </Stack>
        </div>
    </div>      
    </div>
    <div class = "grid">

    {/* Table to display the data */}
    <TableContainer component={Paper} style = {{backgroundColor:"#31414F", outlineStyle:"solid"}} className = "grid">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead >
          <TableRow >
              <TableCell  style ={{color:"white"}} align=""><Arrow order = {order} /></TableCell>
              <TableCell onClick = {() => sortingHandler("sl_no")} style ={{color:"white"}} align="">Sl No</TableCell>
              <TableCell onClick = {() => sortingHandler("business_code")} style ={{color:"white"}} align="">Business Code</TableCell>
              <TableCell onClick = {() => sortingHandler("cust_number")} style ={{color:"white"}} align="">Customer number</TableCell>
              <TableCell onClick = {() => sortingHandler("clear_date")} style ={{color:"white"}} align="">Clear Date</TableCell>
              <TableCell onClick = {() => sortingHandler("buisness_year")} style ={{color:"white"}} align="">Business Year</TableCell>
              <TableCell onClick = {() => sortingHandler("doc_id")} style ={{color:"white"}} align="">Document ID</TableCell>
              <TableCell onClick = {() => sortingHandler("posting_date")} style ={{color:"white"}} align="">Posting Date</TableCell>
              <TableCell onClick = {() => sortingHandler("document_create_date")} style ={{color:"white"}} align="">Document Create Date</TableCell>
              <TableCell onClick = {() => sortingHandler("due_in_date")} style ={{color:"white"}} align="">Due In Date</TableCell>
              <TableCell onClick = {() => sortingHandler("invoice_currency")} style ={{color:"white"}} align="">Invoice Currency</TableCell>
              <TableCell onClick = {() => sortingHandler("document_type")} style ={{color:"white"}} align="">Document Type</TableCell>
              <TableCell onClick = {() => sortingHandler("posting_id")} style ={{color:"white"}} align="">Posting Code</TableCell>
              <TableCell onClick = {() => sortingHandler("total_open_amount")} style ={{color:"white"}} align="">Total Open Amount</TableCell>
              <TableCell onClick = {() => sortingHandler("baseline_create_date")} style ={{color:"white"}} align="">Baseline Create Date</TableCell>
              <TableCell onClick = {() => sortingHandler("cust_payment_terms")} style ={{color:"white"}} align="">Customer Payment terms</TableCell>
              <TableCell onClick = {() => sortingHandler("invoice_id")} style ={{color:"white"}} align="">Invoice ID</TableCell>
              <TableCell onClick = {() => sortingHandler("aging_bucket")} style ={{color:"white"}}align="">Aging Bucket</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data.map(user => (
            <TableRow
              key={user.sl_no}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >          
            <TableCell component="th" scope="user"><Checkbox color="default" onClick={(e) => checkHandler(e,user.sl_no)}/></TableCell>
            <TableCell style ={{color:"white"}} align="center" component="th" scope="user">{user.sl_no}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.business_code}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.cust_number}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.clear_date}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.buisness_year}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.doc_id}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.posting_date}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.document_create_date}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.due_in_date}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.invoice_currency}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.document_type}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.posting_id}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.total_open_amount}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.baseline_create_date}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.cust_payment_terms}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.invoice_id}</TableCell>
            <TableCell style ={{color:"white"}} align="center">{user.aging_bucket}</TableCell>
        </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      {/* <Pagination
      
      style = {{color:"white", borderColor:"white"}}
      count={count} 
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      pageSize={pageSize}
      onPageSizeChange={(newPage) => setPageSize(newPage)}
  /> */}
  <TablePagination
      rowsPerPageOptions={[5, 10, 25, 100]}
      style = {{ color:"white", borderColor:"white", margin:0, display:"flex", textAlign:"right"}}
      count={count}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </div>
    </>
}