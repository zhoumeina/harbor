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
import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from "@angular/core";
import { Subscription} from "rxjs";
import {forkJoin} from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { Comparator } from "@clr/angular";

import { Endpoint } from "../service/interface";
import { EndpointService } from "../service/endpoint.service";

import { ErrorHandler } from "../error-handler/index";

import {ConfirmationMessage} from "../confirmation-dialog/confirmation-message";
import {ConfirmationAcknowledgement} from "../confirmation-dialog/confirmation-state-message";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

import {
    ConfirmationTargets,
    ConfirmationState,
    ConfirmationButtons
} from "../shared/shared.const";

import { CreateEditEndpointComponent } from "../create-edit-endpoint/create-edit-endpoint.component";
import { toPromise, CustomComparator } from "../utils";

import {operateChanges, OperateInfo, OperationState} from "../operation/operate";
import {OperationService} from "../operation/operation.service";

@Component({
    selector: "hbr-endpoint",
    templateUrl: "./endpoint.component.html",
    styleUrls: ["./endpoint.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EndpointComponent implements OnInit, OnDestroy {
    @ViewChild(CreateEditEndpointComponent)
    createEditEndpointComponent: CreateEditEndpointComponent;

    @ViewChild("confirmationDialog")
    confirmationDialogComponent: ConfirmationDialogComponent;

    targets: Endpoint[];
    target: Endpoint;

    targetName: string;
    subscription: Subscription;

    loading: boolean = false;

    creationTimeComparator: Comparator<Endpoint> = new CustomComparator<Endpoint>(
        "creation_time",
        "date"
    );

    timerHandler: any;
    selectedRow: Endpoint[] = [];

    get initEndpoint(): Endpoint {
        return {
            endpoint: "",
            name: "",
            username: "",
            password: "",
            insecure: false,
            type: 0
        };
    }

    constructor(private endpointService: EndpointService,
                private errorHandler: ErrorHandler,
                private translateService: TranslateService,
                private operationService: OperationService,
                private ref: ChangeDetectorRef) {
        this.forceRefreshView(1000);
    }

    ngOnInit(): void {
        this.targetName = "";
        this.retrieve();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    selectedChange(): void {
        this.forceRefreshView(5000);
    }

    retrieve(): void {
        this.loading = true;
        this.selectedRow = [];
        toPromise<Endpoint[]>(this.endpointService.getEndpoints(this.targetName))
            .then(targets => {
                this.targets = targets || [];
                this.forceRefreshView(1000);
                this.loading = false;
            })
            .catch(error => {
                this.errorHandler.error(error);
                this.loading = false;
            });
    }

    doSearchTargets(targetName: string) {
        this.targetName = targetName;
        this.retrieve();
    }

    refreshTargets() {
        this.retrieve();
    }

    reload($event: any) {
        this.targetName = "";
        this.retrieve();
    }

    openModal() {
        this.createEditEndpointComponent.openCreateEditTarget(true);
        this.target = this.initEndpoint;
    }

    editTargets(targets: Endpoint[]) {
        if (targets && targets.length === 1) {
            let target = targets[0];
            let editable = true;
            if (!target.id) {
                return;
            }
            let id: number | string = target.id;
            this.createEditEndpointComponent.openCreateEditTarget(editable, id);
        }
    }

    deleteTargets(targets: Endpoint[]) {
        if (targets && targets.length) {
            let targetNames: string[] = [];
            targets.forEach(target => {
                targetNames.push(target.name);
            });
            let deletionMessage = new ConfirmationMessage(
                'REPLICATION.DELETION_TITLE_TARGET',
                'REPLICATION.DELETION_SUMMARY_TARGET',
                targetNames.join(', ') || '',
                targets,
                ConfirmationTargets.TARGET,
                ConfirmationButtons.DELETE_CANCEL);
            this.confirmationDialogComponent.open(deletionMessage);
        }
    }

    confirmDeletion(message: ConfirmationAcknowledgement) {
        if (message &&
            message.source === ConfirmationTargets.TARGET &&
            message.state === ConfirmationState.CONFIRMED) {
            let targetLists: Endpoint[] = message.data;
            if (targetLists && targetLists.length) {
                let promiseLists: any[] = [];
                targetLists.forEach(target => {
                    promiseLists.push(this.delOperate(target));
                });
                Promise.all(promiseLists).then((item) => {
                    this.selectedRow = [];
                    this.reload(true);
                    this.forceRefreshView(2000);
                });
            }
        }
    }

    delOperate(target: Endpoint) {
        // init operation info
        let operMessage = new OperateInfo();
        operMessage.name = 'OPERATION.DELETE_REGISTRY';
        operMessage.data.id = target.id;
        operMessage.state = OperationState.progressing;
        operMessage.data.name = target.name;
        this.operationService.publishInfo(operMessage);

        return toPromise<number>(this.endpointService
            .deleteEndpoint(target.id))
            .then(
                response => {
                    this.translateService.get('BATCH.DELETED_SUCCESS')
                        .subscribe(res => {
                            operateChanges(operMessage, OperationState.success);
                        });
                }).catch(
                error => {
                    if (error && error.status === 412) {
                        forkJoin(this.translateService.get('BATCH.DELETED_FAILURE'),
                            this.translateService.get('DESTINATION.FAILED_TO_DELETE_TARGET_IN_USED')).subscribe(res => {
                            operateChanges(operMessage, OperationState.failure, res[1]);
                        });
                    } else {
                        this.translateService.get('BATCH.DELETED_FAILURE').subscribe(res => {
                            operateChanges(operMessage, OperationState.failure, res);
                        });
                    }
                });
    }

    // Forcely refresh the view
    forceRefreshView(duration: number): void {
        // Reset timer
        if (this.timerHandler) {
            clearInterval(this.timerHandler);
        }
        this.timerHandler = setInterval(() => this.ref.markForCheck(), 100);
        setTimeout(() => {
            if (this.timerHandler) {
                clearInterval(this.timerHandler);
                this.timerHandler = null;
            }
        }, duration);
    }
}
