import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-app';
  color = 'green';

  changecolor1(data: string) {
    this.color = data;
  }

  changecolor2(data: string) {
    this.color = data;
  }
}
