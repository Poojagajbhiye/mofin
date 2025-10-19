import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, Subscription } from 'rxjs';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { DELETE_POST, GET_POST, GET_POSTS } from '../../graphql/posts.queries';
import { GetPosts, GetPostsVariables, GetPostVariables } from '../../graphql/posts.types';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { ToastService } from '../../core/services/toast.service';
import { PostsService } from '../../core/services/posts.service';

@Component({
  selector: 'app-posts-table',
  standalone: false,
  templateUrl: './posts-table.component.html',
  styleUrl: './posts-table.component.scss'
})
export class PostsTableComponent implements OnInit, OnDestroy {
  posts: {id: string, title: string, views: number}[] = [];
  loading: boolean = false;
  postsQuery!: QueryRef<GetPosts, GetPostsVariables>;
  postsTotalCount: number = 0;
  private sub!: Subscription;

  @ViewChild('postsTable') postsTable!: Table;

  constructor(private http: HttpClient, private apollo: Apollo, private toastService: ToastService, private postService: PostsService) {}

  ngOnInit(): void {
    // this.getPosts().subscribe({
    //   next: data => { console.log("NEXT", data); },
    //   error: error => { console.log("ERR" + error); },
    // });
    this.postsQuery = this.apollo.watchQuery({
      query: GET_POSTS,
      variables: {
        perPage: 2,
        page: 0
      }
    });
    this.sub = this.postsQuery.valueChanges.subscribe((data: any) => {
      console.log(data);
      this.posts = [...(data.data?.allPosts ?? [])];
      if (data.data) {
        this.postsTotalCount = data.data._allPostsMeta.count;
      }
      this.loading = data.loading;
    });
  }

  getPosts(): Observable<any> {
    const body = {
      query: GET_POSTS
    };
    return this.http.post<any>(environment.apiUrl, body);
  }

  refresh() {
    this.postsQuery.refetch();
  }

  getPost(id: string): void {
    this.postService.getPost(id).subscribe({
      next: (data) => {
        console.log(data);
      },
      // error: (error) => {
      //   console.log('error', error);
      //   this.toastService.showError('Error occurred please try again later.');
      // }
    });
  }

  loadPosts(event: TableLazyLoadEvent) {
    const page = event.first! / event.rows!;
    const size = event.rows as number;

    this.postsQuery.fetchMore({
      variables: {
        perPage: size,
        page: page
      }
    })
  }

  deletePost(id: string) {
    this.apollo.mutate({
      mutation: DELETE_POST,
      variables: {
        id: id
      },
      // refetchQueries: [
      //   {
      //     query: GET_POSTS,
      //     variables: {
      //       perPage... page...
      //     }
      //   }
      // ]
    }).subscribe(({data})=>{
      this.refresh();
    });
  }

  editPost(id: string) {
    this.postService.postId$.next(id);  
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
