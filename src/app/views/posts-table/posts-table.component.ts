import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

const query = `
  query MyQuery {
    allPosts {
      id
      title
      views
    }
  }
`

@Component({
  selector: 'app-posts-table',
  standalone: false,
  templateUrl: './posts-table.component.html',
  styleUrl: './posts-table.component.scss'
})
export class PostsTableComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPosts().subscribe({
      next: data => { console.log("NEXT", data); },
      error: error => { console.log("ERR" + error); },
    })
  }

  getPosts(): Observable<any> {
    const body = {
      query: query
    };
    return this.http.post<any>(environment.apiUrl, body);
  }

}
