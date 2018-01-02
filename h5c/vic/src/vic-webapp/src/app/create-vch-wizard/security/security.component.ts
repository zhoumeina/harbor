/*
 Copyright 2017 VMware, Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { CreateVchWizardService } from '../create-vch-wizard.service';
import { numberPattern, whiteListRegistryPattern } from '../../shared/utils/validators';
import {
  parseCertificatePEMFileContent,
  CertificateInfo,
  parsePrivateKeyPEMFileContent,
  PrivateKeyInfo
} from '../../shared/utils/certificates';

@Component({
  selector: 'vic-vch-creation-security',
  templateUrl: './security.html',
  styleUrls: ['./security.scss']
})
export class SecurityComponent {
  public form: FormGroup;
  public tlsServerCertContents: any = null;
  public tlsServerKeyContents: any = null;
  public tlsServerError: string = null;
  // array that keeps track of TLS CA files' name and content
  public tlsCaContents: any[] = [];
  public tlsCaError: string = null;
  // array that keeps track of registry CA files' name and content
  public registryCaContents: any[] = [];
  public registryCaError: string = null;
  private _isSetup = false;
  @Input() vchName: string;
  @Input() datacenter: string;

  constructor(
    private formBuilder: FormBuilder,
    private createWzService: CreateVchWizardService
  ) {
    this.form = formBuilder.group({
      enableSecureAccess: true,
      serverCertSource: 'autogenerated',
      tlsCname: ['', [
        Validators.required
      ]],
      organization: '',
      certificateKeySize: ['2048', [
        Validators.pattern(numberPattern)
      ]],
      tlsServerCert: ['', [
        Validators.required
      ]],
      tlsServerKey: ['', [
        Validators.required
      ]],
      useClientAuth: true,
      tlsCas: formBuilder.array([this.createNewFormArrayEntry('tlsCas')]),
      useWhitelistRegistry: false,
      insecureRegistries: formBuilder.array([this.createNewFormArrayEntry('insecureRegistries')]),
      whitelistRegistries: formBuilder.array([this.createNewFormArrayEntry('whitelistRegistries')]),
      registryCas: formBuilder.array([this.createNewFormArrayEntry('registryCas')])
    });

    // Since serverCertSource is autogenerated by default, disable server cert and key validations
    this.form.get('tlsServerCert').disable();
    this.form.get('tlsServerKey').disable();

    // Since useWhitelistRegistry is false by default, disable whitelistRegistries validations
    this.form.get('whitelistRegistries').disable();

    this.ensureFirstTlsCaIsRequired();
  }

  ensureFirstTlsCaIsRequired() {
    const firstTlsCa = (this.form.get('tlsCas') as FormArray).at(0).get('tlsCa');
    firstTlsCa.setValidators([Validators.required]);
    firstTlsCa.updateValueAndValidity();
  }

  addNewFormArrayEntry(controlName: string) {
    const control = this.form.get(controlName) as FormArray;
    if (!control) {
      return;
    }
    control.push(this.createNewFormArrayEntry(controlName));
  }

  createNewFormArrayEntry(controlName: string) {
    if (controlName === 'tlsCas') {
      return this.formBuilder.group({
        tlsCa: ''
      });
    } else if (controlName === 'insecureRegistries') {
      return this.formBuilder.group({
        insecureRegistryIp: '',
        insecureRegistryPort: [
          '',
          [
            Validators.maxLength(5),
            Validators.pattern(numberPattern)
          ]
        ]
      });
    } else if (controlName === 'whitelistRegistries') {
      return this.formBuilder.group({
        whitelistRegistry: ['', [
          Validators.required,
          Validators.pattern(whiteListRegistryPattern)
        ]],
        whitelistRegType: 'secure'
      });
    } else if (controlName === 'registryCas') {
      return this.formBuilder.group({
        registryCa: ''
      });
    }
  }

  removeFormArrayEntry(controlName: string, index: number) {
    const control = this.form.get(controlName) as FormArray;
    if (!control) {
      return;
    }

    if (controlName === 'tlsCas') {
      if (index > 0 || (index === 0 && control.controls.length > 1)) {
        // remove the input control only if the current control is not the first one
        // and splice the internal array
        control.removeAt(index);
        this.tlsCaContents.splice(index, 1);
      } else {
        // clear the input and shift the internal array
        this.tlsCaContents.shift();
        control.controls[index].reset();
      }
      this.ensureFirstTlsCaIsRequired();
    } else if (controlName === 'registryCas') {
      if (index > 0 || (index === 0 && control.controls.length > 1)) {
        control.removeAt(index);
        this.registryCaContents.splice(index, 1);
      } else {
        this.registryCaContents.shift();
        control.controls[index].reset();
      }
    } else {
      control.removeAt(index);
    }
  }

  onPageLoad() {

    if (this._isSetup) {
      return;
    }

    this.form.get('tlsCname').setValue(this.vchName);
    this.form.get('organization').setValue(this.vchName);

    this.form.get('serverCertSource').valueChanges
      .subscribe(v => {
        if (v === 'autogenerated') {
          this.form.get('tlsCname').enable();
          this.form.get('tlsServerCert').disable();
          this.form.get('tlsServerKey').disable();
        } else {
          this.form.get('tlsCname').disable();
          this.form.get('tlsServerCert').enable();
          this.form.get('tlsServerKey').enable();
        }
      });

    this.form.get('useWhitelistRegistry').valueChanges
      .subscribe(v => {
        if (v) {
          this.form.get('whitelistRegistries').enable();
        } else {
          this.form.get('whitelistRegistries').disable();
        }
      });

    this.form.get('useClientAuth').valueChanges
      .subscribe(v => {
        if (v) {
          this.form.get('tlsCas').enable();
        } else {
          this.form.get('tlsCas').disable();
        }
      });

    this._isSetup = true;
  }

  onCommit(): Observable<any> {
    const results: any = {};

    const enableSecureAccess = this.form.get('enableSecureAccess').value;
    const serverCertSourceValue = this.form.get('serverCertSource').value;

    const tlsCnameValue = this.form.get('tlsCname').value;
    const orgValue = this.form.get('organization').value;
    const certKeySizeValue = this.form.get('certificateKeySize').value;
    const useClientAuthValue = this.form.get('useClientAuth').value;

    // Docker API Access
    if (!enableSecureAccess) {
      // if security is off, use --no-tls-verify
      results['noTlsverify'] = true;
    } else {
      if (serverCertSourceValue === 'autogenerated') {
        if (tlsCnameValue) {
          results['tlsCname'] = tlsCnameValue;
        }
        if (orgValue) {
          results['organization'] = orgValue;
        }
        if (certKeySizeValue) {
          results['certificateKeySize'] = certKeySizeValue;
        }
      } else {
        results['tlsServerCert'] = this.tlsServerCertContents;
        results['tlsServerKey'] = this.tlsServerKeyContents;
      }

      if (!useClientAuthValue) {
        results['noTlsverify'] = true;
        results['tlsCa'] = [];
      } else {
        results['tlsCa'] = this.tlsCaContents;
      }

      // Registry Access
      const useWhitelistRegistryValue = this.form.get('useWhitelistRegistry').value;
      const insecureRegistriesValue = this.form.get('insecureRegistries').value;
      const whitelistRegistriesValue = this.form.get('whitelistRegistries').value;

      if (!useWhitelistRegistryValue) {
        results['whitelistRegistry'] = [];
        results['insecureRegistry'] = insecureRegistriesValue.filter(val => {
          return val['insecureRegistryIp'] && val['insecureRegistryPort'];
        }).map(val => `${val['insecureRegistryIp']}:${val['insecureRegistryPort']}`);
      } else {
        const white = [];
        const insecure = [];
        whitelistRegistriesValue.filter(val => {
          return val['whitelistRegistry'];
        }).forEach(val => {
          if (val['whitelistRegType'] === 'secure') {
            white.push(val['whitelistRegistry']);
          } else {
            insecure.push(val['whitelistRegistry']);
          }
        });

        results['whitelistRegistry'] = white;
        results['insecureRegistry'] = insecure;
      }

      results['registryCa'] = this.registryCaContents;
    }

    // user id, vc thumbprint and target
    results['user'] = this.createWzService.getUserId();
    results['thumbprint'] = this.createWzService.getServerThumbprint();
    results['target'] = this.createWzService.getVcHostname() + (this.datacenter ? '/' + this.datacenter : '');

    return Observable.of({ security: results });
  }

  /**
   * On Change event read the content of the file and add it to the
   * corresponding array or overwrite the value at the given index
   * @param {Event} evt change event on file input
   * @param {string} targetField used to determine which field to push data to
   * @param {number} index FormArray index
   * @param {boolean} isLast is FormArray last element
   */
  addFileContent(evt: Event, targetField: string, index: number, isLast: boolean) {
    const fr = new FileReader();
    const fileList: FileList = evt.target['files'];

    const fileReaderOnLoadFactory = (filename: string) => {
      let certificate: CertificateInfo;
      let privateKey: PrivateKeyInfo;

      switch (targetField) {
        case 'tlsServerCert': return (event) => {
          try {
            certificate = parseCertificatePEMFileContent(event.target.result);
          } catch (e) {
            // TODO: i18n-ify
            this.tlsServerError = 'Failed to parse server certificate PEM file!';
            return;
          }

          this.form.get('tlsServerCert').setValue(filename);
          this.tlsServerCertContents = {
            name: filename,
            content: event.target.result,
            expires: certificate.expires
          };
        };
        case 'tlsServerKey': return (event) => {
          try {
            privateKey = parsePrivateKeyPEMFileContent(event.target.result);
          } catch (e) {
            // TODO: i18n-ify
            this.tlsServerError = 'Failed to parse server private key PEM file!';
            return;
          }

          this.form.get('tlsServerKey').setValue(filename);
          this.tlsServerKeyContents = {
            name: filename,
            content: event.target.result,
            algorithm: privateKey.algorithm
          };
        };
        case 'tlsCas':
        case 'registryCas': return (event) => {
          let targetArray: any[];

          if (targetField === 'tlsCas') {
            targetArray = this.tlsCaContents;
          } else if (targetField === 'registryCas') {
            targetArray = this.registryCaContents;
          }

          try {
            certificate = parseCertificatePEMFileContent(event.target.result);
          } catch (e) {
            // TODO: i18n-ify
            if (targetField === 'tlsCas') {
              this.tlsCaError = 'Failed to parse client certificate PEM file!';
            } else if (targetField === 'registryCas') {
              this.registryCaError = 'Failed to parse registry certificate PEM file!';
            }
            return;
          }

          if (isLast) {
            this.addNewFormArrayEntry(targetField);
          }

          const value = {
            name: filename,
            content: event.target.result,
            expires: certificate.expires
          };

          if (targetArray[index]) {
            // overwrite if value already exists at this index
            targetArray[index] = value;
          } else {
            targetArray.push(value);
          }

          if (targetField === 'tlsCas') {
            (this.form.get('tlsCas') as FormArray).at(index).get('tlsCa').setValue(filename);
          }
        };
      }
    };

    // since input is without the 'multiple' attribute we are sure that
    // only one entry will be available under FileList
    const fileInstance: File = fileList[0];

    // TODO: i18n-ify
    if (targetField === 'tlsCas') {
      this.tlsCaError = fileInstance ? null : 'Failed to load client certificate PEM file!';
    } else if (targetField === 'registryCas') {
      this.registryCaError = fileInstance ? null : 'Failed to load registry certificate PEM file!';
    } else if (targetField === 'tlsServerCert') {
      this.tlsServerError = fileInstance ? null : 'Failed to load server certificate PEM file!';
    } else if (targetField === 'tlsServerKey') {
      this.tlsServerError = fileInstance ? null : 'Failed to load server private key PEM file!';
    }
    fr.onload = fileReaderOnLoadFactory(fileInstance.name);
    fr.readAsText(fileInstance);
  }

  /**
   * Clear the file reader error messages. This method is called when clr-tab's
   * clrTabsCurrentTabContentChanged event is fired
   */
  clearFileReaderError() {
    this.tlsCaError = this.registryCaError = this.tlsServerError = null;
  }
}