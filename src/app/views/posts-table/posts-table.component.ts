import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const query = gql `
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

  constructor(private http: HttpClient, private apollo: Apollo) {}

  ngOnInit(): void {
    // this.getPosts().subscribe({
    //   next: data => { console.log("NEXT", data); },
    //   error: error => { console.log("ERR" + error); },
    // });

    this.apollo.watchQuery({
      query: query
    }).valueChanges.subscribe((data: any) => {
      console.log("DATA", data.data);
      console.log("ERR", data.error);
      console.log("Loading", data.loading);
    });
  }

  getPosts(): Observable<any> {
    const body = {
      query: query
    };
    return this.http.post<any>(environment.apiUrl, body);
  }

}
