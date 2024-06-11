export class ProductDetailsRequest {
   
    
   Type: string ; //this.Multi_UCP ? this.template.schemeAlias+'' :
   AssetClass: string ; //this.Multi_UCP ?'EQ':
   Note_Asset_Class: string = "" ; //this.Multi_UCP ?'EQ':
   Template_ID: Number = 0; //this.Multi_UCP ? this.template.template_Id :
   //Entity_ID: this.selectedEntity;
   Entity_ID:Number = 0;
   CreationMode: string = "" ;
   template_Name: string = "" ; //this.Multi_UCP ? this.template.template_Name :
   Created_By: string = "" ;
   Hedging_Type: string = "" ;
   Reference_Number: string = "" ;
   Product_Name: string = "" ;
   //Link_No: Number(this.subTemplate.toM_ID==""?0:this.subTemplate.toM_ID); //subtemplate saving on draft click
   Link_No:Number = 0;
   Note_Master_Id: Number = 0;
   Minimum_Investment_Amount: Number = 0;
   PerUnit_Equivalent_Amount:Number = 0; 
   Trigger_Amount_Warning:Number = 0; 
   Minimum_Issue_Size:string = "" ; 
   Maximum_Issue_Size:string = "" ; 
   Minimum_Tolerence_Amount:Number = 0; 
   Maximum_Tolerence_Amount:Number = 0; 
   Max_Orders_Per_Product:Number = 0; 
   NM_Watch_Level_Target:Number = 0;
   NM_Watch_Level_Market:Number = 0; 
   Note_Product_Rating:string = "" ; 
   Open_Date:string = "" ; 
   Close_Date:string = "" ; 
   Participation_Rate:Number = 0; 
   ISIN:string = "" ; 
   Restructured_YN:string = "" ; 
   Transferable_YN_Flag:string = "" ; 
   Issuer:string = "" ; 
   Guarantor:string = "" ; 
   Minimum_Subsequent_Amount:Number = 0; 
   Capital_Guaranteed_Amount:Number = 0; 
   Capital_Protected_PC:Number = 0; 
   Indicative_Participation_Rate:Number = 0; 
   Actual_Participation_Rate:Number = 0; 
   AllowExtensionOfOffer_YN:string = "" ;
   Customer_Yield:Number = 0; 
   Strategy_Code:string = "" ;
   AllowOfferExtension:string = "" ;
   Redemption_Formula:string = "" ; 
   Internal_Cost:Number = 0; 
   upfront:Number = 0; 
   Certificate_YN:string = "" ; 
   PreHedged_YN:string = "" ; 
   Discounted_YN:string = "" ; 
   Coupon_Payment_YN:string = "" ; 
   Coupon_PaymentType:string = "" ; 
   CustomerSegment:string = "" ; 
   RM_Mapping:string = "" ; 
   holding_date:string = "" ; 
   Product_risk_profile:string = "" ; 
   Date_Of_SC_Approval:string = "" ; 
   Debit_CutOff_Date:string = "" ; 
   CutOff_Time:string = "" ; 
   Note_Issuer_Date_Offset:string = "" ; 
   Dealing_Online_From:string = "" ; 
   Minimum_Redemption:string = "" ; 
   Redemption_CutoffTime:string = "" ; 
   CustomTypeTradability:string = "" ; 
   Redemption_Settlement:string = "" ; 
   SoftLimit:string = "" ;
   Secret_key1:string = "" ; 
   Template_Sr_No:Number = 0; 
   Created_At:string = "" ; 
   Product_Type_To_Automate:string = "" ; 
   ThresholdAmountForNonAICustomer:Number = 0; 
   Accredited_Investor_YN:String ='Y'; 
   Remarks:string = "" ; 
   Template_Instance:Number = 0; 
   RecepieFlag:string = "" ; 
   GFM_Distributors:string = "" ; 
   Product_Catagory:string = "" ; 
   Note_Risk_Score:Number = 1; 
   Note_Scheme_Type:string = "" ; 
   //Link_No:1; 
   Current_Spot:Number = 0; 
   Note_Order_Type:string = "" ; 
   Order_Entry_Type:string = "" ; 
   Asset:string = "" ; 
   IP_Address:string = "" ; 
   EQC_Order_Type:string = "" ;
}


export class ODCUCPAppTablesData{
    Template_Code:string="";
    Template_ID: number=0;
    Field_Name: string="";
    UDF_Format: string="";
    Field_Data_Type: string="";
    // Field_Value: element.value
    Field_Value: string=""; //

  
    Field_Old_Value:string="";
    Field_Display_Name:string="";
    Reference:string ="";
}


export class ODCDynamicCustGridData{
    customerID: number = 0;
    LegCount: string = "";     
    Note_deal_Id: string = ""; 
    Field_Name: string="";
    Field_Value: string="";
    //Added by RajeshC || SAVEUCP
    NoteOrders_Clmn:string ="";
    NoteAccount_Clmn:string ="";
    NoteDealsMisc_Clmn:string = "";
    NoteMaster_Clmn:string ="";
}

export class ODCLegDetails {

}