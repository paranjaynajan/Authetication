import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
interface AnyObj {
  [key: string]: any;
}
@Injectable({ providedIn: 'root' })
export class Apiservice implements HttpInterceptor {
  constructor(private http: HttpClient, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    console.log('Intercepting request:', req.url);

    if (req.url.includes('login')) {
      return next.handle(req);
    }

    return next
      .handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.errorHandler(error, req, next)
        )
      );
  }

  errorHandler(
    error: HttpErrorResponse,
    originalRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (error.status === 403) {
      console.log(error, 'sdasdasdsdsds');
      const result = this.newAccessToken();
      return result.pipe(
        switchMap((data: AnyObj) => {
          console.log(data, 'data');
          localStorage.clear();
          localStorage.setItem('token', JSON.stringify(data['token']));
          const retryRequest = originalRequest.clone({
            setHeaders: {
              Authorization: `Bearer ${data['token']}`,
            },
          });

          return next.handle(retryRequest);
        }),
        catchError((error) => {
          if (error.status == 403) {
            this.redirectLogout();
          }
          throw new Error(error.message);
        })
      );
    } else {
      console.log('error')
      return throwError(() => error);
      // throw new Error(error.message);
    }
  }

  makeRequest<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object
  ): Observable<T> {
    const accessToken = localStorage.getItem('token');
    const tokenWithBearer = `Bearer ${accessToken}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenWithBearer,
    });
    return this.http.request<T>(method, url, {
      body: data,
      headers: headers,
      withCredentials: true,
    });
  }

  private newAccessToken(): Observable<AnyObj> {
    console.log('new aceess token lene jaa');
    const accessToken = localStorage.getItem('token');
    const tokenWithBearer = `Bearer ${accessToken}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: tokenWithBearer,
    });
    const response = this.http.get<any>(
      'http://localhost:5000/api/auth/refresh-token',
      { headers: headers, withCredentials: true }
    );

    return response;
  }
  redirectLogout() {
    localStorage.clear();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(
      () => {
        this.router.navigate(['current-opening']);
      },
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}

// intercept(req: HttpRequest<any>, next: HttpHandler): any {
//   console.log('Intercepting request:', req.url);
//   return next
//     .handle(req)
//     .pipe(
//       catchError((error: HttpErrorResponse, req) =>
//         this.errorHandler(error,req, next)
//       )
//     );
// }

// postData(url: string, data: object): Observable<AnyObj> {
//   const accesstoken = localStorage.getItem('token');
//   const tokenWithBrearer = 'Brearer' + ' ' + accesstoken;

//   const httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json',
//       Authorization: tokenWithBrearer,
//     }),
//   };
//   if (accesstoken) {
//     const result = this.http.post(url, data, httpOptions);
//     return result;
//   } else {
//     console.log(url, data);
//     const result = this.http.post(url, data);
//     return result;
//   }
// }

// export class Apiservice implements HttpInterceptor {
//   constructor(private http: HttpClient) {}
//   intercept( req: HttpRequest<any>,next: HttpHandler): any{
//     return next.handle(req).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 301) {
//           return this.newAccessToken(req, next);
//         } else {
//           return throwError(() => new Error(`HTTP error ${error.status}`));
//         }
//       })
//     );
//   }

//   makeRequest<T>(url: string,method: 'GET' | 'POST' | 'PUT' | 'DELETE',data?: object,): Observable<T> {
//     const accesstoken=localStorage.getItem('token')
//     const tokenWithBrearer = 'Brearer' + ' ' + accesstoken;

//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         Authorization: tokenWithBrearer,
//       }),
//     };

//     return this.http.request<T>(method, url, httpOptions)
//   }

//  private async newAccessToken(req:HttpRequest<any>,next:HttpHandler) {
//     const response = await this.http.get(
//       'http://localhost:5000/api/auth/refresh-token',
//       { withCredentials: true }
//     );

//     response.subscribe({
//       next: (data) => {
//         localStorage.setItem('token', JSON.stringify(data));
//         return next.handle(req);
//       },
//       error: (error) => {
//         return error;
//       },
//     });
//   }

//   // getData(url: string, accesstoken?: string): Observable<Object> {
//   //   const tokenWithBrearer = 'Brearer' + ' ' + accesstoken;

//   //   const httpOptions = {
//   //     headers: new HttpHeaders({
//   //       'Content-Type': 'application/json',
//   //       Authorization: tokenWithBrearer,
//   //     }),
//   //   };
//   //   if (accesstoken) {
//   //     const result = this.http.get(url, httpOptions);
//   //     return result;
//   //   } else {
//   //     const result = this.http.get(url);
//   //     return result;
//   //   }
//   // }
// }
