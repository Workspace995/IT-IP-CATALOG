import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = 'YOUR API URL';
  private headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('AUTHORIZATION CREDENTIALS')
  });

  constructor(private http: HttpClient) {}

  getPatents(size: number = 95, from: number = 0): Observable<any> {
    const body = {
      "size": size,
      "from": from,
      "query": {
        "match_all": {}
      }
    };
    return this.http.post<any>(this.apiUrl, body, { headers: this.headers });
  }


  getCountries(): Observable<any> {
    const body = {
      "_source": [],
      "size": 0,
      "aggs": {
        "countries": {
          "terms": {
            "field": "COUNTRY NAME.keyword",
            "order": { "_count": "desc" },
            "size": 10
          }
        }
      }
    };
    return this.http.post<any>(this.apiUrl, body, { headers: this.headers });
  }

  getStatuses(): Observable<any> {
    const body = {
      "_source": [],
      "size": 0,
      "aggs": {
        "statuses": {
          "terms": {
            "field": "STATUS.keyword",
            "order": { "_count": "desc" },
            "size": 10
          }
        }
      }
    };
    return this.http.post<any>(this.apiUrl, body, { headers: this.headers });
  }

  getMacros(): Observable<any> {
    const body = {
      "_source": [],
      "size": 0,
      "aggs": {
        "macros": {
          "terms": {
            "field": "MACRO.keyword",
            "order": { "_count": "desc" },
            "size": 10
          }
        }
      }
    };
    return this.http.post<any>(this.apiUrl, body, { headers: this.headers });
  }

  getCategories(): Observable<any> {
    const body = {
      "_source": [],
      "size": 0,
      "aggs": {
        "categories": {
          "terms": {
            "field": "CAT 1.keyword",
            "order": { "_count": "desc" },
            "size": 10
          }
        }
      }
    };
    return this.http.post<any>(this.apiUrl, body, { headers: this.headers });
  }

  getSubCategories(): Observable<any> {
    const body = {
      "_source": [],
      "size": 0,
      "aggs": {
        "subcategories": {
          "terms": {
            "field": "CAT2.keyword",
            "order": { "_count": "desc" },
            "size": 10
          }
        }
      }
    };
    return this.http.post<any>(this.apiUrl, body, { headers: this.headers });
  }
}
