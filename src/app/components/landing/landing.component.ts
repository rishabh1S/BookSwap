import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('canvas3d')
  canvas!: ElementRef<HTMLCanvasElement>;
  showAuthenticationModal: boolean = false;

  ngAfterViewInit() {
    const app = new Application(this.canvas.nativeElement);
    app.load('https://prod.spline.design/zaRMDUVW9z05k2cX/scene.splinecode');
  }
}
