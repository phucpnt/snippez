import { Component, Input, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';

interface WebViewElectron extends HTMLElement {
  openDevTools: Function;
}

@Component({
  selector: 'snippet-run-result', // <my-app></my-app>
  templateUrl: './snippet-edit-run-result.component.html',
})
export class SnippetRunResult implements AfterViewInit, AfterViewChecked {
  private oldUrl = '';

  @Input('resultUrl') resultUrl = '';
  @Input('onClose') onClose: Function;
  @ViewChild('snippetRunResult') resultView: ElementRef;

  ngAfterViewInit() {
    if (this.resultUrl && this.oldUrl !== this.resultUrl) {
      this.showResult(this.resultView.nativeElement);
    }
  }

  ngAfterViewChecked() {
    if (this.resultUrl && this.oldUrl !== this.resultUrl) {
      this.showResult(this.resultView.nativeElement);
    }
  }

  showResult(container: HTMLElement = this.resultView.nativeElement) {
    this.oldUrl = this.resultUrl;
    const webview = <WebViewElectron> document.createElement('webview');
    // const webview = document.createElement('iframe');
    webview.setAttribute('src', [this.resultUrl, 'result'].join('/'));
    webview.className = 'webview';
    webview.setAttribute('nodeintegration', 'true');
    webview.setAttribute('disablewebsecurity', 'true');
    webview.addEventListener('dom-ready', () => {
      webview.openDevTools();
    })
    container.removeChild(container.firstChild);
    container.appendChild(webview);
  }

  showSpec(container: HTMLElement = this.resultView.nativeElement) {
    const webview = <WebViewElectron> document.createElement('webview');
    // const webview = document.createElement('iframe');
    webview.setAttribute('src', [this.resultUrl, 'spec'].join('/'));
    webview.className = 'webview';
    webview.setAttribute('nodeintegration', 'true');
    webview.setAttribute('disablewebsecurity', 'true');
    webview.addEventListener('dom-ready', () => {
      webview.openDevTools();
    })
    container.removeChild(container.firstChild);
    container.appendChild(webview);
  }

}
