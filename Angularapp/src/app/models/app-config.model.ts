export interface IAppConfig {
  interfaceURL: string;
  oRes : IUserinInfoData;
  CSP_EntityDetails: IEntityDetails;
  CSP_FXPricingURL: string;
  CSP_FX_Order_CCY_Pairs_Common_Data: string;
  CSP_UpdateCIRPFormName: string;
  CSP_FormOldNewFlag: string;
  FormTimeOut: number;
  CSP_UpdateCIRPPageHeaderName: number;
  CSP_IsDemo: boolean;
  CSP_PortalAccess: string;
  CSP_IsKYCDoneAtSecStage: boolean;
  CSP_EFX_NewTransactionAccountDetails: string;
  CSP_EFXSpread: string;
  BidAskSpread_BPS_YesNo: string;
  TwoFactorAuthenticationMethod: string;
  TwoFactorAuthenticationEnabledFor: string;
  TwoFactorOTPValidityPeriod: string;
  TwoFactorOTPAttemptCount: string;
  TwoFactorAuthenticationOTPDigits: string;
  CSP_UpdateKYCPageHeader: string;
  CSP_UpdateKYCFormName: string;
  CSP_KYCFormFlag: string;
  CSP_EFX_Timer: number;
  CSP_Company_Logo: string; //Added by Ketan S. on 16-Sep-2021
  BankBaseCCy: string; //Added by Ruchira M on 11-oct-2021
  CSP_ShowFDCD: string; //Added by Ruchira M on 11-Nov-2021
  CSP_EditProfileControlEnabled: boolean;
  CSP_DocGen_Virtual_Path: string;
  CSP_FXD_Timer: number;
  CSP_Show_FundDetails_RatioAndPerformance: boolean;
  CSP_FacilityCode: string;
  CSP_EnableRegisterFor: string;
  CSP_GroupName: string;
  CSP_MenuTypes: string;
  CSP_VisibleAddAccountAndPortfolioButton: boolean;
  CSP_Ticker: boolean;
  BestPrice_PremiumRoundingDecimals: number;
  CSP_FXD_Mode: string;
  CSP_Pitchbook_UserID: string;
  CSP_DashboardPDFpath: string;
  CSP_showhideBankBSB: boolean;
  CSP_FXTimerVisible: boolean;
  ipAddress: string;
  authUrl: string;
  apiBaseUrl: string;
  newsImgResourcePath: string; //Added by Apurva K on 08-May-2023
  isHashingEnabled: boolean;
  hkey: string;
  sessionIdle: number; //Added for Idle logout || Kaustubh S || 15-Sep-2023
  idlePopupCountdown: number; //Added for session idle popup || Kaustubh S || 16-Nov-2023
  CSP_DisplayFXDLandingYN: boolean; //Added by Urmila A | for showing FXD landing page| 2-Nov-23
}

interface IEntityDetails {
  Entity_ID: string;
  Entity_Name: string;
  Entity_Code: string;
}
interface IUserinInfoData{
  csvOfMappedEntityIDs : string;
  externalUserID : string;
  groupID : string;
  homeEntityID : string;
  homeEntityName : string;
  issuer : string;
  name : string;
  previousLoginTime : string;
  previousLogoutTime : string;
  primaryEmailAddress : string;
  secondaryEmailAddress : string;
  sub : string;
  userID : string;
  userName : string;
  userRole : string;
}
