import { Component, OnInit } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pitchbook',
  templateUrl: './pitchbook.component.html',
  styleUrls: ['./pitchbook.component.scss'],
})
export class PitchbookComponent implements OnInit {
  config: any;
  selectedBook: any;
  header: string | undefined;
  showBookIndex: boolean | undefined;

  userBooks: any = [];
  bookDetails: any = [];
  mode: string = 'read';
  userId: string = '1055';
  bookId: string = '';
  radioTitle: string = '';
  radioItems: Array<string> = [];
  model = { option: 'Single Page' };
  isSinglePage: boolean;
  videoUrl: any =
    window.location.protocol +
    '//' +
    environment.sslURL +
    '/FinIQWebApp/Pitchbook/uploads/';
  constructor(
    private utilitiesApi: UtilitiesService,
    public commonApi: CommonApiService
  ) {
    this.config = {
      itemsPerPage: 1,
      currentPage: 1,
    };

    this.radioItems = ['Single Page', 'Multi Page'];
    this.isSinglePage = true;
  }

  async ngOnInit() {
    this.selectedBook = '';
    this.header = 'FinIQ PitchBook';
    this.showBookIndex = true;
    this.userId = await this.utilitiesApi.PitchBookGetUserId();
    console.log(this.userId);
    this.fetchUserBookList(this.userId, this.mode);

    // this.fetchBookDetails(this.bookId)
  }

  fetchUserBookList(userId: any, mode: any) {
    let response = this.utilitiesApi.PitchBookGetUserBooksView(userId, mode);
    response
      ? response.subscribe((res: any) => {
          this.userBooks = res.GetUserBooksViewResult;
          this.bookSelection(
            this.userBooks[0].Book_Summary,
            this.userBooks[0].PitchBook_Id
          );
        })
      : '';
  }

  fetchBookDetails(bookId: any) {
    let response = this.utilitiesApi.PitchBookGetBookDetails(bookId);
    response
      ? response.subscribe((res: any) => {
          console.log('res=', res.GetBookDetailsResult);
          this.bookDetails = res.GetBookDetailsResult;
          this.config = {
            itemsPerPage: 1,
            currentPage: 1,
          };
        })
      : '';
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  bookSelection(string: any, PitchBook_Id: any) {
    this.selectedBook = string;
    this.fetchBookDetails(PitchBook_Id);
  }
  showHideBookIndex() {
    this.showBookIndex = !this.showBookIndex;
  }
  generateVideoUrl(s: string) {
    console.log('path', this.videoUrl + s.trim().replace(' ', '%20'));
    return this.videoUrl + s.trim().replace(' ', '%20');
  }
  toggleSinglePage() {
    this.isSinglePage = !this.isSinglePage;
  }
}
