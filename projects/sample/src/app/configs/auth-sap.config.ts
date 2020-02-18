// This api will come in the next version

import { AuthConfig } from 'angular-oauth2-oidc';

export const authSapConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://storefront.c39j2-walkersde1-d4-public.model-t.cc.commerce.ondemand.com/authorizationserver',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/index.html',

  // URL of the SPA to redirect the user after silent refresh
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: 'mobile_android',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email voucher',

  // silentRefreshShowIFrame: true,
  showDebugInformation: true,
  sessionChecksEnabled: false,
  timeoutFactor: 0.00001,
  strictDiscoveryDocumentValidation: false,
  skipIssuerCheck: true,
};
