
import {throwError as observableThrowError,  Observable } from "rxjs";
import { Injectable, Inject } from "@angular/core";
import { Http, Response, ResponseContentType } from "@angular/http";
import { map, catchError } from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

import { RequestQueryParams } from "./RequestQueryParams";
import { HelmChartItem, HelmChartVersion, HelmChartDetail } from "./interface";
import { SERVICE_CONFIG, IServiceConfig } from "../service.config";
import { HTTP_JSON_OPTIONS, HTTP_GET_OPTIONS } from "../utils";


/**
 * Define service methods for handling the helmchart related things.
 * Loose couple with project module.
 *
 **
 * @abstract
 * class RepositoryService
 */
export abstract class HelmChartService {
  /**
   * Get all helm charts info
   *  ** deprecated param projectName Id of the project
   *  ** deprecated param queryParams options params for query data
   */
  abstract getHelmCharts(
    projectName: string,
    queryParams?: RequestQueryParams
  ): Observable<HelmChartItem[]>;

  /**
   * Delete an helmchart
   *  ** deprecated param projectId Id of the project
   *  ** deprecated param chartId ID of helmChart in this specific project
   */
  abstract deleteHelmChart(projectId: number | string, chartId: number): Observable<any>;

  /**
   * Get all the versions of helmchart
   *  ** deprecated param projectName Id of the project
   *  ** deprecated param chartName ID of the helm chart
   *  ** deprecated param queryParams option params for query
   */
  abstract getChartVersions(
    projectName: string,
    chartName: string,
  ): Observable<HelmChartVersion[]>;

  /**
   * Delete a version of helmchart
   *  ** deprecated param projectName ID of the project
   *  ** deprecated param chartName ID of the chart you want to delete
   *  ** deprecated param version name of the version
   */
  abstract deleteChartVersion(projectName: string, chartName: string, version: string): Observable<any>;

  /**
   * Get the all details of an helmchart
   *  ** deprecated param projectName ID of the project
   *  ** deprecated param chartname ID of the chart
   *  ** deprecated param version name of the chart's version
   *  ** deprecated param queryParams options
   */
  abstract getChartDetail(
    projectName: string,
    chartname: string,
    version: string,
  ): Observable<HelmChartDetail>;

  /**
   * Download an specific verison
   *  ** deprecated param projectName ID of the project
   *  ** deprecated param filename ID of the helm chart
   *  ** deprecated param version Name of version
   *  ** deprecated param queryParams options
   */
  abstract downloadChart(
    projectName: string,
    filename: string,
  ): Observable<any>;

  /**
   * Upload chart and prov files to chartmuseam
   *  ** deprecated param projectName Name of the project
   *  ** deprecated param chart chart file
   *  ** deprecated param prov prov file
   */
  abstract uploadChart (
    projectName: string,
    chart: File,
    prov: File
  ): Observable<any>;
}

/**
 * Implement default service for helm chart.
 */
@Injectable()
export class HelmChartDefaultService extends HelmChartService {
  constructor(
    private http: Http,
    @Inject(SERVICE_CONFIG) private config: IServiceConfig
  ) {
    super();
  }

  private extractData(res: Response) {
    if (res.text() === "") {
      return [];
    }
    return res.json() || [];
  }

  private extractHelmItems(res: Response) {
    if (res.text() === "") {
      return [];
    }
    let charts = res.json();
    if (charts) {
      return charts.map( chart => {
        return {
          name: chart.Name,
          total_versions: chart.total_versions,
          created: chart.Created,
          icon: chart.Icon,
          home: chart.Home};
      });
    } else {
      return [];
    }
  }

  private handleErrorObservable(error: HttpErrorResponse) {
    return observableThrowError(error.message || error);
  }

  public getHelmCharts(
    projectName: string,
  ): Observable<HelmChartItem[]> {
    if (!projectName) {
      return observableThrowError("Bad argument, No project id to get helm charts");
    }

    return this.http
      .get(`${this.config.helmChartEndpoint}/${projectName}/charts`, HTTP_GET_OPTIONS)
      .pipe(map(response => {
         return this.extractHelmItems(response);
      }))
      .pipe(catchError(error => {
        return this.handleErrorObservable(error);
      }));
  }

  public deleteHelmChart(projectId: number | string, chartId: number): any {
    if (!chartId) {
      observableThrowError("Bad argument");
    }

    return this.http
      .delete(`${this.config.helmChartEndpoint}/${projectId}/${chartId}`)
      .pipe(map(response => {
        return this.extractData(response);
      }))
      .pipe(catchError(this.handleErrorObservable));
  }

  public getChartVersions(
    projectName: string,
    chartName: string,
  ): Observable<HelmChartVersion[]> {
    return this.http.get(`${this.config.helmChartEndpoint}/${projectName}/charts/${chartName}`, HTTP_GET_OPTIONS)
    .pipe(map(response => {
      return this.extractData(response);
    }))
    .pipe(catchError(this.handleErrorObservable));
  }

  public deleteChartVersion(projectName: string, chartName: string, version: string): any {
    return this.http.delete(`${this.config.helmChartEndpoint}/${projectName}/charts/${chartName}/${version}`, HTTP_JSON_OPTIONS)
    .pipe(map(response => {
      return this.extractData(response);
    }))
    .pipe(catchError(this.handleErrorObservable));
  }

  public getChartDetail (
    projectName: string,
    chartName: string,
    version: string,
  ): Observable<HelmChartDetail> {
    return this.http.get(`${this.config.helmChartEndpoint}/${projectName}/charts/${chartName}/${version}`)
    .pipe(map(response => {
      return this.extractData(response);
    }))
    .pipe(catchError(this.handleErrorObservable));
  }

  public downloadChart(
    projectName: string,
    filename: string,
  ): Observable<any> {
    return this.http.get(`${this.config.downloadChartEndpoint}/${projectName}/${filename}`, {
      responseType: ResponseContentType.Blob,
    })
    .pipe(map(response => {
      return {
        filename: filename.split('/')[1],
        data: response.blob()
      };
    }))
    .pipe(catchError(this.handleErrorObservable));
  }


  public uploadChart(
    projectName: string,
    chart?: File,
    prov?: File
  ): Observable<any> {
    let formData = new FormData();
    let uploadURL = `${this.config.helmChartEndpoint}/${projectName}/charts`;
    if (chart) {
      formData.append('chart', chart);
    }
    if (prov) {
      formData.append('prov', prov);
      if (!chart) {
        uploadURL = `${this.config.helmChartEndpoint}/${projectName}/prov`;
      }
    }
    return this.http.post(uploadURL, formData, {
      responseType: ResponseContentType.Json
    })
    .pipe(map(response => this.extractData(response)))
    .pipe(catchError(this.handleErrorObservable));
  }
}
