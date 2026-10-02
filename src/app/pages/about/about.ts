import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <h1>About</h1>
    <p>Angular + Capacitor app used to practise CI/CD on AWS (CodePipeline, CodeBuild, ECR, ECS).</p>
    <a routerLink="/">Home</a>
  `,
})
export class About {}
