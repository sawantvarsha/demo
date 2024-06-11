export const environment = {
  production: false,
  interfaceURL: 'https://sit-finiqlcm.test-1finiq.com/FinIQAPIGateway/api/',  
  domainURL: 'sit-finiqlcm.test-1finiq.com',
  lssURL: 'https://sit-finiqlcm.test-1finiq.com/FinIQAPIGateway',
  assetURL: '../../assets',
  isSSL: window.location.protocol === 'https:',
  sslURL: '',
  name: 'dev',
  hostedApp: '',
  asseturl:'/assets/',   
  mapleAssetURL: 'assets/Instant-Pricer/', // RizwanS || To Access Instant Pricer || 12 Jul 2023
  SignalREndpoint:'', // LGTGTWINT-1934 || Rizwan S || 05 Jun 2023  

  //Added FXD interface URL by Urmila A | 28-Aug-23 | for Euroconnect HSBC CH entity | start
  interfaxeURL_fxcommon_FXD: 'https://sit-euroconnect.test-1finiq.com/FinIQAPIGateway/api/fxcommonfunction/', 
  interfaxeURL_common_FXD: 'https://sit-euroconnect.test-1finiq.com/FinIQAPIGateway/api/common/v1/', //modified by UrmilaA | 5-Jan-24
  interfaxeURL_bestprice_FXD: 'https://sit-euroconnect.test-1finiq.com/FinIQAPIGateway/api/fxobestprice/', 
  interfaxeURL_staticcontrol_FXD: 'https://sit-euroconnect.test-1finiq.com/FinIQAPIGateway/api/getstaticcontroldata/v1/GetStaticControlData/', 
  interfaxeURL_DateCal_FXD: 'https://sit-euroconnect.test-1finiq.com/FinIQAPIGateway/api/DateCalculationApi/', 
  interfaxeURL_DocGen_FXD: 'https://sit-euroconnect.test-1finiq.com/FinIQAPIGateway/api/docgenapi/', 
  FXD_domainURL : 'sit-euroconnect.test-1finiq.com'
  //Added FXD interface URL by Urmila A | 28-Aug-23 | for Euroconnect HSBC CH entity | ends

};