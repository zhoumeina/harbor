
import {throwError as observableThrowError,  Observable } from "rxjs";

import {catchError, map} from 'rxjs/operators';
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
import { Injectable } from '@angular/core';

import { Http, URLSearchParams } from '@angular/http';



import {HTTP_JSON_OPTIONS, buildHttpRequestOptions, HTTP_GET_OPTIONS} from "../shared/shared.utils";

@Injectable()
export class ProjectService {

  constructor(private http: Http) {}

  getProject(projectId: number): Observable<any> {
    return this.http
               .get(`/api/projects/${projectId}`, HTTP_GET_OPTIONS).pipe(
               map(response => response.json()),
               catchError(error => observableThrowError(error)), );
  }

  listProjects(name: string, isPublic: number, page?: number, pageSize?: number): Observable<any> {
    let params = new URLSearchParams();
    if (page && pageSize) {
      params.set('page', page + '');
      params.set('page_size', pageSize + '');
    }
    if (name && name.trim() !== "") {
      params.set('name', name);
    }
    if (isPublic !== undefined) {
      params.set('public', '' + isPublic);
    }

    return this.http
               .get(`/api/projects`, buildHttpRequestOptions(params)).pipe(
               map(response => response),
               catchError(error => observableThrowError(error)), );
  }

  createProject(name: string, metadata: any): Observable<any> {
    return this.http
               .post(`/api/projects`,
                JSON.stringify({'project_name': name, 'metadata': {
                  public: metadata.public ? 'true' : 'false',
                }})
                , HTTP_JSON_OPTIONS).pipe(
               map(response => response.status),
               catchError(error => observableThrowError(error)), );
  }

  toggleProjectPublic(projectId: number, isPublic: string): Observable<any> {
    return this.http
               .put(`/api/projects/${projectId}`, { 'metadata': {'public': isPublic} }, HTTP_JSON_OPTIONS).pipe(
               map(response => response.status),
               catchError(error => observableThrowError(error)), );
  }

  deleteProject(projectId: number): Promise<any> {
    return this.http
               .delete(`/api/projects/${projectId}`).toPromise()
               .then(response => response.status)
               .catch(error => Promise.reject(error));
  }

  checkProjectExists(projectName: string): Observable<any> {
    return this.http
               .head(`/api/projects/?project_name=${projectName}`).pipe(
               map(response => response.status),
               catchError(error => observableThrowError(error)), );
  }

  checkProjectMember(projectId: number): Observable<any> {
    return this.http
               .get(`/api/projects/${projectId}/members`, HTTP_GET_OPTIONS).pipe(
               map(response => response.json()),
               catchError(error => observableThrowError(error)), );
  }
}
