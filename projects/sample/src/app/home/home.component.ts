import { authConfig } from '../configs/auth.config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../configs/auth-code-flow.config';
import { fullConfig } from "../configs/full.config";
import { JsonEditorComponent } from "ang-jsoneditor";
import { authSapConfig } from "../configs/auth-sap.config";
import { authCodeFlowSapConfig } from "../configs/auth-code-flow-sap.config";

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  loginFailed: boolean = false;
  userProfile: object;
  selectedConfig: any = { ...authConfig };
  currentConfig: any = { ...authConfig };

  storedConfigs: StoredConfig[] = [];

  @ViewChild('configEditor', { static: true }) configEditor: JsonEditorComponent;

  constructor(private oauthService: OAuthService) {
  }

  ngOnInit() {
    this.storedConfigs = JSON.parse(localStorage.getItem(STORED_CONFIG_STORAGE_KEY_NAME)) || [];
    /*
        this.oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
            if (!this.oauthService.hasValidIdToken() || !this.oauthService.hasValidAccessToken()) {
              this.oauthService.initImplicitFlow('some-state');
            }
        });
    */
  }

  async loginImplicit() {

    // Tweak config for implicit flow
    this.oauthService.configure(this.currentConfig);
    await this.oauthService.loadDiscoveryDocument();

    this.oauthService.initLoginFlow('/passed-state;p1=1;p2=2')
    // the parameter here is optional. It's passed around and can be used after logging in
  }

  async loginCode() {
    // Tweak config for code flow
    this.oauthService.configure(this.currentConfig);
    await this.oauthService.loadDiscoveryDocument();

    this.oauthService.initCodeFlow('/passed-state;p1=1;p2=2');
    // the parameter here is optional. It's passed around and can be used after logging in
  }

  logout() {
    this.oauthService.logOut();
  }

  loadUserProfile(): void {
    this.oauthService.loadUserProfile().then(up => (this.userProfile = up));
  }

  get givenName() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['given_name'];
  }

  get familyName() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['family_name'];
  }

  refresh() {
    this.oauthService.oidc = true;

    if (this.oauthService.responseType === 'code') {
      this.oauthService
        .refreshToken()
        .then(info => console.debug('refresh ok', info))
        .catch(err => console.error('refresh error', err));
    } else {
      this.oauthService
        .silentRefresh()
        .then(info => console.debug('refresh ok', info))
        .catch(err => console.error('refresh error', err));
    }
  }

  set requestAccessToken(value: boolean) {
    this.oauthService.requestAccessToken = value;
    localStorage.setItem('requestAccessToken', '' + value);
  }

  get requestAccessToken() {
    return this.oauthService.requestAccessToken;
  }

  get id_token() {
    return this.oauthService.getIdToken();
  }

  get access_token() {
    return this.oauthService.getAccessToken();
  }

  get id_token_expiration() {
    return this.oauthService.getIdTokenExpiration();
  }

  get access_token_expiration() {
    return this.oauthService.getAccessTokenExpiration();
  }

  implicitWithSapServer() {
    this.selectedConfig = { ...authSapConfig };
    this.currentConfig = { ...authSapConfig };
    sessionStorage.setItem('flow', 'implicit');
  }

  implicitWithTestServer() {
    this.selectedConfig = { ...authConfig };
    this.currentConfig = { ...authConfig };
    sessionStorage.setItem('flow', 'implicit');
  }

  codeWithTestServer() {
    this.selectedConfig = { ...authCodeFlowConfig };
    this.currentConfig = { ...authCodeFlowConfig };
    sessionStorage.setItem('flow', 'code');
  }

  codeWithSapServer() {
    this.selectedConfig = { ...authCodeFlowSapConfig };
    this.currentConfig = { ...authCodeFlowSapConfig };
    sessionStorage.setItem('flow', 'code');
  }

  loadFullConfig() {
    this.selectedConfig = { ...fullConfig, ...this.currentConfig };
  }

  updateConfig() {
    this.currentConfig = this.configEditor.get();
  }

  saveCurrentConfig() {
    let storedConfigs = JSON.parse(localStorage.getItem(STORED_CONFIG_STORAGE_KEY_NAME)) || [] as StoredConfig[];
    const newConfig: StoredConfig = {
      name: prompt() || 'unnamed config',
      config: this.currentConfig
    };

    storedConfigs.push(newConfig);
    localStorage.setItem(STORED_CONFIG_STORAGE_KEY_NAME, JSON.stringify(storedConfigs));
    this.storedConfigs = storedConfigs;
  }

  loadStoredConfig(config: AuthConfig) {
    this.selectedConfig = config;
    this.currentConfig = config;
  }
}

interface StoredConfig {
  name: string;
  config: AuthConfig;
}

const STORED_CONFIG_STORAGE_KEY_NAME = 'oauth-configs';
