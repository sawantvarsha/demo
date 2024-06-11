export const environment = {
  production: true,
  interfaceURL: window.location.protocol + '//' + window.location.host + '/ClientPortalServer/api/',
  domainURL: window.location.host,
  // interfaceURL: 'https://gatewaymarkets.finiq-connect.com/ClientPortalServer/api/',
  assetURL: 'assets',
  lssURL: 'https://gatemarkets.finiq-connect.com/FinIQAPIGateway',
  socketURL: '/FinIQService/WSCallback.svc',
  name: 'prod',
  isSSL: window.location.protocol === 'https:',
  sslURL: '1finiq.finiq-connect.com',
  mapleAssetURL: 'assets/Instant-Pricer/', // RizwanS || To Access Instant Pricer || 12 Jul 2023
  workbenchDocUrl:
    "https://euroconnect.test-equity-connect.com/FinIQService/RMWorkstation_JSON.svc/Get_Uploaded_Documents_API/",
};
