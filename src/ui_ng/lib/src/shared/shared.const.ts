// Copyright (c) 2017 VMware, Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
export const supportedLangs = ['en-us', 'zh-cn', 'es-es', 'fr-fr'];
export const enLang = "en-us";
export const languageNames = {
  "en-us": "English",
  "zh-cn": "中文简体",
  "es-es": "Español",
  "fr-fr": "Français"
};
export const enum AlertType {
  DANGER, WARNING, INFO, SUCCESS
}

export const dismissInterval = 10 * 1000;
export const httpStatusCode = {
  "Unauthorized": 401,
  "Forbidden": 403
};
export const enum ConfirmationTargets {
  EMPTY,
  PROJECT,
  PROJECT_MEMBER,
  USER,
  POLICY,
  TOGGLE_CONFIRM,
  TARGET,
  REPOSITORY,
  TAG,
  CONFIG,
  CONFIG_ROUTE,
  CONFIG_TAB,
  HELM_CHART
}

export const enum ActionType {
  ADD_NEW, EDIT
}

export const ListMode = {
  READONLY: "readonly",
  FULL: "full"
};

export const CommonRoutes = {
  SIGN_IN: "/sign-in",
  EMBEDDED_SIGN_IN: "/harbor/sign-in",
  SIGN_UP: "/sign-in?sign_up=true",
  EMBEDDED_SIGN_UP: "/harbor/sign-in?sign_up=true",
  HARBOR_ROOT: "/harbor",
  HARBOR_DEFAULT: "/harbor/projects"
};

export const enum ConfirmationState {
  NA, CONFIRMED, CANCEL
}

export const enum ConfirmationButtons {
  CONFIRM_CANCEL, YES_NO, DELETE_CANCEL, CLOSE, REPLICATE_CANCEL
}

export const LabelColor = [
  { 'color': '#000000', 'textColor': 'white' }, { 'color': '#61717D', 'textColor': 'white' },
  { 'color': '#737373', 'textColor': 'white' }, { 'color': '#80746D', 'textColor': 'white' },
  { 'color': '#FFFFFF', 'textColor': 'black' }, { 'color': '#A9B6BE', 'textColor': 'black' },
  { 'color': '#DDDDDD', 'textColor': 'black' }, { 'color': '#BBB3A9', 'textColor': 'black' },
  { 'color': '#0065AB', 'textColor': 'white' }, { 'color': '#343DAC', 'textColor': 'white' },
  { 'color': '#781DA0', 'textColor': 'white' }, { 'color': '#9B0D54', 'textColor': 'white' },
  { 'color': '#0095D3', 'textColor': 'black' }, { 'color': '#9DA3DB', 'textColor': 'black' },
  { 'color': '#BE90D6', 'textColor': 'black' }, { 'color': '#F1428A', 'textColor': 'black' },
  { 'color': '#1D5100', 'textColor': 'white' }, { 'color': '#006668', 'textColor': 'white' },
  { 'color': '#006690', 'textColor': 'white' }, { 'color': '#004A70', 'textColor': 'white' },
  { 'color': '#48960C', 'textColor': 'black' }, { 'color': '#00AB9A', 'textColor': 'black' },
  { 'color': '#00B7D6', 'textColor': 'black' }, { 'color': '#0081A7', 'textColor': 'black' },
  { 'color': '#C92100', 'textColor': 'white' }, { 'color': '#CD3517', 'textColor': 'white' },
  { 'color': '#C25400', 'textColor': 'white' }, { 'color': '#D28F00', 'textColor': 'white' },
  { 'color': '#F52F52', 'textColor': 'black' }, { 'color': '#FF5501', 'textColor': 'black' },
  { 'color': '#F57600', 'textColor': 'black' }, { 'color': '#FFDC0B', 'textColor': 'black' },
];

export const RoleMapping = { 'projectAdmin': 'MEMBER.PROJECT_ADMIN', 'developer': 'MEMBER.DEVELOPER', 'guest': 'MEMBER.GUEST' };

export const DefaultHelmIcon = '/static/images/helm-gray.png';

export enum Roles {
  PROJECT_ADMIN = 1,
  DEVELOPER = 2,
  GUEST = 3,
  OTHER = 0,
}
