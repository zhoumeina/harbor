import { NgModule, ModuleWithProviders, Provider, APP_INITIALIZER } from '@angular/core';

import { LOG_DIRECTIVES } from './log/index';
import { FILTER_DIRECTIVES } from './filter/index';
import { ENDPOINT_DIRECTIVES } from './endpoint/index';
import { REPOSITORY_DIRECTIVES } from './repository/index';
import { TAG_DIRECTIVES } from './tag/index';

import { REPLICATION_DIRECTIVES } from './replication/index';
import { CREATE_EDIT_RULE_DIRECTIVES } from './create-edit-rule/index';
import { LIST_REPLICATION_RULE_DIRECTIVES } from './list-replication-rule/index';

import { CREATE_EDIT_ENDPOINT_DIRECTIVES } from './create-edit-endpoint/index';

import { SERVICE_CONFIG, IServiceConfig } from './service.config';

import { CONFIRMATION_DIALOG_DIRECTIVES } from './confirmation-dialog/index';
import { INLINE_ALERT_DIRECTIVES } from './inline-alert/index';
import { DATETIME_PICKER_DIRECTIVES } from './datetime-picker/index';
import { VULNERABILITY_DIRECTIVES } from './vulnerability-scanning/index';
import { PUSH_IMAGE_BUTTON_DIRECTIVES } from './push-image/index';
import { CONFIGURATION_DIRECTIVES } from './config/index';
import { JOB_LOG_VIEWER_DIRECTIVES } from './job-log-viewer/index';
import { PROJECT_POLICY_CONFIG_DIRECTIVES } from './project-policy-config/index';
import { HBR_GRIDVIEW_DIRECTIVES } from './gridview/index';
import { REPOSITORY_GRIDVIEW_DIRECTIVES } from './repository-gridview/index';
import { OPERATION_DIRECTIVES } from './operation/index';
import { LABEL_DIRECTIVES } from "./label/index";
import { CREATE_EDIT_LABEL_DIRECTIVES } from "./create-edit-label/index";
import { LABEL_PIECE_DIRECTIVES } from "./label-piece/index";
import { HELMCHART_DIRECTIVE } from "./helm-chart/index";
import {
  SystemInfoService,
  SystemInfoDefaultService,
  AccessLogService,
  AccessLogDefaultService,
  EndpointService,
  EndpointDefaultService,
  ReplicationService,
  ReplicationDefaultService,
  RepositoryService,
  RepositoryDefaultService,
  TagService,
  TagDefaultService,
  ScanningResultService,
  ScanningResultDefaultService,
  ConfigurationService,
  ConfigurationDefaultService,
  JobLogService,
  JobLogDefaultService,
  ProjectService,
  ProjectDefaultService,
  LabelService,
  LabelDefaultService,
  HelmChartService,
  HelmChartDefaultService
} from './service/index';
import {
  ErrorHandler,
  DefaultErrorHandler
} from './error-handler/index';
import { SharedModule } from './shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { TranslateServiceInitializer } from './i18n/index';
import { DEFAULT_LANG_COOKIE_KEY, DEFAULT_SUPPORTING_LANGS, DEFAULT_LANG } from './utils';
import { ChannelService } from './channel/index';
import { OperationService } from  './operation/operation.service';

/**
 * Declare default service configuration; all the endpoints will be defined in
 * this default configuration.
 */
export const DefaultServiceConfig: IServiceConfig = {
  systemInfoEndpoint: "/api/systeminfo",
  repositoryBaseEndpoint: "/api/repositories",
  logBaseEndpoint: "/api/logs",
  targetBaseEndpoint: "/api/targets",
  replicationBaseEndpoint: "/api/replications",
  replicationRuleEndpoint: "/api/policies/replication",
  replicationJobEndpoint: "/api/jobs/replication",
  vulnerabilityScanningBaseEndpoint: "/api/repositories",
  projectPolicyEndpoint: "/api/projects/configs",
  projectBaseEndpoint: "/api/projects",
  enablei18Support: false,
  langCookieKey: DEFAULT_LANG_COOKIE_KEY,
  supportedLangs: DEFAULT_SUPPORTING_LANGS,
  defaultLang: DEFAULT_LANG,
  langMessageLoader: "local",
  langMessagePathForHttpLoader: "i18n/langs/",
  langMessageFileSuffixForHttpLoader: "-lang.json",
  localI18nMessageVariableMap: {},
  configurationEndpoint: "/api/configurations",
  scanJobEndpoint: "/api/jobs/scan",
  labelEndpoint: "/api/labels",
  helmChartEndpoint: "/api/chartrepo",
  downloadChartEndpoint: "/chartrepo"
};

/**
 * Define the configuration for harbor shareable module
 *
 **
 * interface HarborModuleConfig
 */
export interface HarborModuleConfig {
  // Service endpoints
  config?: Provider;

  // Handling error messages
  errorHandler?: Provider;

  // Service implementation for system info
  systemInfoService?: Provider;

  // Service implementation for log
  logService?: Provider;

  // Service implementation for endpoint
  endpointService?: Provider;

  // Service implementation for replication
  replicationService?: Provider;

  // Service implementation for repository
  repositoryService?: Provider;

  // Service implementation for tag
  tagService?: Provider;

  // Service implementation for vulnerability scanning
  scanningService?: Provider;

  // Service implementation for configuration
  configService?: Provider;

  // Service implementation for job log
  jobLogService?: Provider;

  // Service implementation for project policy
  projectPolicyService?: Provider;

  // Service implementation for label
  labelService?: Provider;

  // Service implementation for helmchart
  helmChartService?: Provider;
}

/**
 **
 *  ** deprecated param {AppConfigService} configService
 * returns
 */
export function initConfig(translateInitializer: TranslateServiceInitializer, config: IServiceConfig) {
  return (init);
  function init() {
    translateInitializer.init({
      enablei18Support: config.enablei18Support,
      supportedLangs: config.supportedLangs,
      defaultLang: config.defaultLang,
      langCookieKey: config.langCookieKey
    });
  }
}

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    LOG_DIRECTIVES,
    FILTER_DIRECTIVES,
    ENDPOINT_DIRECTIVES,
    REPOSITORY_DIRECTIVES,
    TAG_DIRECTIVES,
    CREATE_EDIT_ENDPOINT_DIRECTIVES,
    CONFIRMATION_DIALOG_DIRECTIVES,
    INLINE_ALERT_DIRECTIVES,
    REPLICATION_DIRECTIVES,
    LIST_REPLICATION_RULE_DIRECTIVES,
    CREATE_EDIT_RULE_DIRECTIVES,
    DATETIME_PICKER_DIRECTIVES,
    VULNERABILITY_DIRECTIVES,
    PUSH_IMAGE_BUTTON_DIRECTIVES,
    CONFIGURATION_DIRECTIVES,
    JOB_LOG_VIEWER_DIRECTIVES,
    PROJECT_POLICY_CONFIG_DIRECTIVES,
    LABEL_DIRECTIVES,
    CREATE_EDIT_LABEL_DIRECTIVES,
    LABEL_PIECE_DIRECTIVES,
    HBR_GRIDVIEW_DIRECTIVES,
    REPOSITORY_GRIDVIEW_DIRECTIVES,
    OPERATION_DIRECTIVES,
    HELMCHART_DIRECTIVE
  ],
  exports: [
    LOG_DIRECTIVES,
    FILTER_DIRECTIVES,
    ENDPOINT_DIRECTIVES,
    REPOSITORY_DIRECTIVES,
    TAG_DIRECTIVES,
    CREATE_EDIT_ENDPOINT_DIRECTIVES,
    CONFIRMATION_DIALOG_DIRECTIVES,
    INLINE_ALERT_DIRECTIVES,
    REPLICATION_DIRECTIVES,
    LIST_REPLICATION_RULE_DIRECTIVES,
    CREATE_EDIT_RULE_DIRECTIVES,
    DATETIME_PICKER_DIRECTIVES,
    VULNERABILITY_DIRECTIVES,
    PUSH_IMAGE_BUTTON_DIRECTIVES,
    CONFIGURATION_DIRECTIVES,
    JOB_LOG_VIEWER_DIRECTIVES,
    TranslateModule,
    PROJECT_POLICY_CONFIG_DIRECTIVES,
    LABEL_DIRECTIVES,
    CREATE_EDIT_LABEL_DIRECTIVES,
    LABEL_PIECE_DIRECTIVES,
    HBR_GRIDVIEW_DIRECTIVES,
    REPOSITORY_GRIDVIEW_DIRECTIVES,
    OPERATION_DIRECTIVES,
    HELMCHART_DIRECTIVE
  ],
  providers: []
})

export class HarborLibraryModule {
  static forRoot(config: HarborModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: HarborLibraryModule,
      providers: [
        config.config || { provide: SERVICE_CONFIG, useValue: DefaultServiceConfig },
        config.errorHandler || { provide: ErrorHandler, useClass: DefaultErrorHandler },
        config.systemInfoService || { provide: SystemInfoService, useClass: SystemInfoDefaultService },
        config.logService || { provide: AccessLogService, useClass: AccessLogDefaultService },
        config.endpointService || { provide: EndpointService, useClass: EndpointDefaultService },
        config.replicationService || { provide: ReplicationService, useClass: ReplicationDefaultService },
        config.repositoryService || { provide: RepositoryService, useClass: RepositoryDefaultService },
        config.tagService || { provide: TagService, useClass: TagDefaultService },
        config.scanningService || { provide: ScanningResultService, useClass: ScanningResultDefaultService },
        config.configService || { provide: ConfigurationService, useClass: ConfigurationDefaultService },
        config.jobLogService || { provide: JobLogService, useClass: JobLogDefaultService },
        config.projectPolicyService || { provide: ProjectService, useClass: ProjectDefaultService },
        config.labelService || {provide: LabelService, useClass: LabelDefaultService},
        config.helmChartService || {provide: HelmChartService, useClass: HelmChartDefaultService},
        // Do initializing
        TranslateServiceInitializer,
        {
          provide: APP_INITIALIZER,
          useFactory: initConfig,
          deps: [TranslateServiceInitializer, SERVICE_CONFIG],
          multi: true
        },
        ChannelService,
        OperationService
      ]
    };
  }

  static forChild(config: HarborModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: HarborLibraryModule,
      providers: [
        config.config || { provide: SERVICE_CONFIG, useValue: DefaultServiceConfig },
        config.errorHandler || { provide: ErrorHandler, useClass: DefaultErrorHandler },
        config.systemInfoService || { provide: SystemInfoService, useClass: SystemInfoDefaultService },
        config.logService || { provide: AccessLogService, useClass: AccessLogDefaultService },
        config.endpointService || { provide: EndpointService, useClass: EndpointDefaultService },
        config.replicationService || { provide: ReplicationService, useClass: ReplicationDefaultService },
        config.repositoryService || { provide: RepositoryService, useClass: RepositoryDefaultService },
        config.tagService || { provide: TagService, useClass: TagDefaultService },
        config.scanningService || { provide: ScanningResultService, useClass: ScanningResultDefaultService },
        config.configService || { provide: ConfigurationService, useClass: ConfigurationDefaultService },
        config.jobLogService || { provide: JobLogService, useClass: JobLogDefaultService },
        config.projectPolicyService || { provide: ProjectService, useClass: ProjectDefaultService },
        config.labelService || {provide: LabelService, useClass: LabelDefaultService},
        config.helmChartService || {provide: HelmChartService, useClass: HelmChartDefaultService},
        ChannelService,
        OperationService
      ]
    };
  }
}
