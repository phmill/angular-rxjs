import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { throwError, of } from "rxjs";
import {
  tap,
  concatMap,
  mergeMap,
  switchMap,
  shareReplay,
  catchError,
} from "rxjs/operators";

import { Supplier } from "./supplier";

@Injectable({
  providedIn: "root",
})
export class SupplierService {
  suppliersUrl = "api/suppliers";

  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl).pipe(
    tap((data) => console.log("suppliers", JSON.stringify(data))),
    shareReplay(1),
    catchError(this.handleError)
  );

  suppliersWithConcatMap$ = of(1, 5, 8).pipe(
    tap((id) => console.log("Concat Map source Observable ", id)),
    concatMap((id) => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  suppliersWithMergeMap$ = of(1, 5, 8).pipe(
    tap((id) => console.log("Merge Map source Observable ", id)),
    mergeMap((id) => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  suppliersWithSwitchMap$ = of(1, 5, 8).pipe(
    tap((id) => console.log("Switch Map source Observable ", id)),
    switchMap((id) => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  constructor(private http: HttpClient) {
    // this.suppliersWithConcatMap$.subscribe((item) =>
    //   console.log("concatMap Result", item)
    // );
    // this.suppliersWithMergeMap$.subscribe((item) =>
    //   console.log("mergeMap Result", item)
    // );
    // this.suppliersWithSwitchMap$.subscribe((item) =>
    //   console.log("switchMap Result", item)
    // );
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
