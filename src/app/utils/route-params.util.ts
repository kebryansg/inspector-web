import {inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {startWith} from "rxjs";

export const injectQueryParams = () => {
  const route = inject(ActivatedRoute);
  return toSignal(
    route.queryParams.pipe(
      startWith(route.snapshot.queryParams || {})
    ),
    {requireSync: true}
  )
}

export const injectParams = () => {
  const route = inject(ActivatedRoute);
  return toSignal(
    route.params.pipe(
      startWith(route.snapshot.params || {})
    ),
    {requireSync: true}
  )
}
