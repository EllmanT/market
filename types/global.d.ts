interface paginatedSearchParams{
    page?:number;
    pageSize?:number;
    query?:string;
    sort?:string;
}

type ActionResponse<T=null>={
    success:boolean;
    data?:T;
    error?:{
        message:string;
        details?:Record<string,string[]>
    };
    status?:number;
}
type ErrorResponse = ActionResponse<undefined> & { success: false };
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

// Define response structure
type DocProcessResponse = {
  docId: string;
  fileName: string;
};

interface Document{
    _id:string;
    fileName?:string;
    fileDisplayName?:string;
    
    sellerName:string;
    sellerTIN?:string;
    sellerVAT?:string;
    sellerAddress?:string;
    sellerContact?:string;
    sellerEmail?:string;

    customerName?:string;
    customerTIN?:string;
    customerVAT?:string;
    customerAddress?:string;
    customerContact?:string;
    customerEmail?:string;

    docType:string;
    currency?:string;
    pricingType?:string;
    docSummary?:string;

    docNumber?:string;
    transactionDate?:string; //not sure here on type
    transactionTotalVat?:string;
    transactionSubTotal?:string;
    transactionTotalAmount?:string;

    items?:lineItem[];

    bankingDetails?:bankDetail[]
}

interface lineItem{
    name?:string;
    quantity?:number;
    unitPrice?:number;
    totalPrice?:number;
    vatAmount?:number;
}

interface bankingDetails{
    bankName?:string;
    branchName?:string;
    accountNumber?:string;
    accountCurrency?:string;
}