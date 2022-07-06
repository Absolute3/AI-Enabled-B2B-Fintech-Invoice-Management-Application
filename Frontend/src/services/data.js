import axios from "axios";

export const getData = async (start, limit, order, orderBy) => {
    let str = "start="+(start*limit)+"&limit="+limit+"&orderby="+orderBy+"&order="+order;
    let response = await axios.get("http://localhost:8080/hrcbackend/Dataloading?"+str);
    let data = response.data.backend;
    let count = response.data.count;
    data.map((backend, index) => ({...backend, "id":index}))
    return {data,count};
}

export const addUser = async({business_code, buisness_year, baseline_create_date, clear_date,area_business,invoice_id, cust_number, doc_id, due_in_date, total_open_amount, posting_date, document_type, cust_payment_terms, invoice_currency, document_create_date, posting_id}) => {
    let data =  "business_code="+business_code+"&buisness_year="+buisness_year+"&baseline_create_date="+baseline_create_date+"&invoice_id="+ invoice_id+"&cust_number="+cust_number+"&doc_id="+ doc_id+ "&due_in_date=" + due_in_date+"&total_open_amount=" + total_open_amount + "&posting_date="+posting_date + "&document_type="+document_type+"&cust_payment_terms="+cust_payment_terms+"&invoice_currency="+invoice_currency+"&clear_date="+clear_date+"&document_create_date="+document_create_date+"&posting_id="+posting_id;
    let response = await axios.get("http://localhost:8080/hrcbackend/addinvoice?"+data)
    return response.data;
} 

export const updateUser = async({ sl_no,cust_payment_terms, invoice_currency }) => {
    let data = "sl_no="+sl_no+"&cust_payment_terms="+cust_payment_terms+"&invoice_currency="+invoice_currency;
    let response = await axios.get("http://localhost:8080/hrcbackend/updateinvoice?"+data);
    return response.data;
}

export const deleteUser = async( sl_no ) => {
    let data = "sl_no="+sl_no;
    let response = await axios.get("http://localhost:8080/hrcbackend/deleteinvoice?"+data);
    return response.data;
}


export const getSearch = async ({cust_number, doc_id,invoice_id, buisness_year}) => {
    let data = "cust_number="+cust_number+"&doc_id="+doc_id+"&invoice_id="+invoice_id+"&buisness_year="+buisness_year;
    let response = await axios.get("http://localhost:8080/hrcbackend/SearchInvoice?"+data);
    return response.data;
}

export const predict = async (data) => {
    let response = await axios.post('http://127.0.0.1:5000/', data);
    let doc_id = response.data[0].doc_id;
    let aging_bucket = response.data[0].aging_bucket;
    let datagot = "doc_id="+doc_id+"&aging_bucket="+aging_bucket;
    let get = await axios.get("http://localhost:8080/hrcbackend/prediction?"+datagot)
    return get.datagot;
}