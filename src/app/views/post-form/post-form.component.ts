import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { filter, Subscription, switchMap, tap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-post-form',
  standalone: false,
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss'
})
export class PostFormComponent implements OnInit, OnDestroy{
  postId: string | null = null;
  sub!: Subscription;
  postForm!: FormGroup<{
    title: FormControl<string | null>;
    views: FormControl<number | null>;
    comment: FormControl<string | null>;
  }>;

  get controls() {
    return this.postForm.controls;
  }

  constructor(private postService: PostsService) {}
  
  ngOnInit(): void {
    this.postService.postId$.pipe(
      tap(postId => {
        this.postId = postId;
        if (!postId) {
          this.postForm = new FormGroup({
            title: new FormControl(''),
            views: new FormControl<number | null>(null),
            comment: new FormControl('')
          });
        }
      }),
      filter(postId => !!postId),
      switchMap(postId => this.postService.getPost(postId as string)),
    ).subscribe(postData => {
      this.postForm = new FormGroup({
        title: new FormControl(postData.data.Post.title),
        views: new FormControl(postData.data.Post.views),
        comment: new FormControl(postData.data.Post.comment)
      });
    });
  }

  onSubmit() {
    const {title, views, comment} = this.postForm.getRawValue();

    if (this.postId) {
      this.postService.updatePost(this.postId, title as string, views as number, comment as string).subscribe();
      return;
    } 
    this.postService.createPost(title as string, views as number, comment as string).subscribe();
  }

  clearEdit() {
    this.postService.postId$.next(null);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
