export const environment = {
  production: true,
  interfaceURL:
    window.location.protocol +
    '//' +
    window.location.host +
    '/FinIQAPIGateway/api/',
  domainURL: window.location.host,
  lssURL: window.location.protocol +
  '//' +
  window.location.host + '/FinIQAPIGateway',
  assetURL: 'assets',
  isSSL: window.location.protocol === 'https:',
  sslURL: '',
  name: 'prod',
  hostedApp: 'EuroconnectPortal/',
  asseturl: './assets/',
    //'https://euroconnect.test-equity-connect.com/FinIQWebApp/FinIQ_Connect/dist/assets/',
  mapleAssetURL: 'assets/Instant-Pricer/', // RizwanS || To Access Instant Pricer || 12 Jul 2023
  SignalREndpoint:'', // LGTGTWINT-1934 || Rizwan S || 05 Jun 2023  

 //Added FXD interface URL by Urmila A | 28-Aug-23 | for Euroconnect HSBC CH entity | start
 interfaxeURL_fxcommon_FXD: window.location.protocol +
 '//' +
 window.location.host + '/FinIQAPIGateway/api/fxcommonfunction/', 
 interfaxeURL_common_FXD: window.location.protocol +
 '//' +
 window.location.host + '/FinIQAPIGateway/api/common/v1/', // Updated by Chaitanya M | 19-Jan-2024
 interfaxeURL_bestprice_FXD: window.location.protocol +
 '//' +
 window.location.host + '/FinIQAPIGateway/api/fxobestprice/', 
 interfaxeURL_staticcontrol_FXD: window.location.protocol +
 '//' +
 window.location.host + '/FinIQAPIGateway/api/getstaticcontroldata/v1/GetStaticControlData/',
 interfaxeURL_DateCal_FXD: window.location.protocol +
 '//' +
 window.location.host + '/FinIQAPIGateway/api/DateCalculationApi/', 
 interfaxeURL_DocGen_FXD: window.location.protocol +
 '//' +
 window.location.host + '/FinIQAPIGateway/api/docgenapi/', 
 FXD_domainURL :  window.location.host
 //Added FXD interface URL by Urmila A | 28-Aug-23 | for Euroconnect HSBC CH entity | ends

};
