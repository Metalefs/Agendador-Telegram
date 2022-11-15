import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandler {
  PERMISSION_ERROR_CODE = 403;
  constructor(
    private translate: TranslateService,
    public toastService: ToastrService,
  ) {
    this.handle = this.handle.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  async handle(error: any) {
    await this.handleError(error);
    throw error
  }

  async handleError(error: any) {
    let errorMessages: Array<string> = [];

    if (error?.response?.data)
      errorMessages = this.getErrorMessageFromObject(error.response.data);

    this.toastService.error(`${errorMessages.join(' ')}`, '', {
      enableHtml: true,
      easeTime: 250
    });
  }

  getErrorMessageFromObject(data: any):any {
    let errorMessage = [];
    if (typeof data === 'object') {
      for (const key in data) {
        if (typeof data[key] === 'function') continue;
        if (key === 'code') continue;

        if (typeof data[key] === 'object') {
          for(const message of (this.getErrorMessageFromObject(data[key]) as Array<any>))
            errorMessage.push(message);
        } else if (typeof data[key] === 'string') {
          errorMessage.push(data[key]);
        }
      }
    }
    return errorMessage as any;
  }

  private checkIsPermissionError(error: any) {
    if (!error.response?.status) return false;
    return error.response?.status === this.PERMISSION_ERROR_CODE;
  }

  async getErrorMessage(error: any) {
    if (this.checkIsPermissionError(error))
      return this.translate.get('general.permissionError').toPromise();
    if (error?.response?.data?.errors)
      return this.getErrorMessageFromObject(error?.response?.data?.errors);
    else return this.translate.get('general.errorTryAgainLater').toPromise();
  }
}
