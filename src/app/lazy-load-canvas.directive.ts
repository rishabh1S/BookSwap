import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appLazyLoadCanvas]',
})
export class LazyLoadCanvasDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      this.renderer.appendChild(this.el.nativeElement, canvas);
    }, 5000);
  }
}
