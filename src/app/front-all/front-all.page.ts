import { Component, OnInit, HostListener, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-front-all',
  templateUrl: 'front-all.page.html',
  styleUrls: ['front-all.page.scss'],
})
export class FrontAllPage implements OnInit {
  private lastPosition = 0;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (currentPosition > this.lastPosition) {
      this.renderer.addClass(this.el.nativeElement, 'scroll-vanish');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'scroll-vanish');
    }

    this.lastPosition = currentPosition;
  }
}
