import {Directive, ElementRef, inject, Output} from '@angular/core';
import {distinctUntilChanged, fromEvent} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Directive({
  selector: 'button[appDebounceClick]',
  standalone: true
})
export class DebounceClickDirective {

  private readonly elementRef: ElementRef = inject(ElementRef);
  @Output() debounceClick = fromEvent(this.elementRef.nativeElement, 'click')
    .pipe(
      debounceTime(500),
      distinctUntilChanged()
    );
}
