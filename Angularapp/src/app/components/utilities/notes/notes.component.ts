import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { HomeApiService } from 'src/app/services/home-api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ApifunctionsService } from '../../dashboard-new/services/apifunctions.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {


  List_Of_Notes = [{ Name: "Note1", date: "17-Jan-2022" }, { Name: "Note2", date: "17-Jan-2022" }];
  showNewNote = false;
  total_notes = 0;

  currDate: any;
  today = new Date();
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  // date =
  //   this.today.getDate() +
  //   '-' +
  //   this.months[this.today.getMonth()] +
  //   '-' +
  //   this.today.getFullYear();
  date = this.datePipe.transform(this.today, 'dd-MMM-YYYY h:mm a');

  description = '';
  note_title = '';
  NotesArray: any;
  note_mode = "I";
  editFlag: any = [];
  editTitle = false;
  saveBtn : boolean = true;  //Added by AdilP || FIN1EURINT-512

  //Added by Apurva K
  noteUpdateFlag: boolean = false;
  noteIDonClick: any;

  constructor(
    public datePipe: DatePipe,
    public utilitiesApi: UtilitiesService,
    public homeApi: HomeApiService,
    public custApi: CustomerApiService,
    public authApi: AuthService,
    public commonApi: CommonApiService,
    private apifunction: ApifunctionsService
  ) {
    this.NotesArray = [];
  }


  async ngOnInit() {

    this.currDate = this.datePipe.transform(this.date, 'dd-MMM-YYYY');

    this.homeApi.RMID = await this.custApi.GetRMIDFromUsername(
      this.authApi.UserName
    );
    console.log("username", this.authApi.UserName, this.homeApi.RMID);

    for (let i = 0; i < 3; i++) {
      this.editFlag[i] = false;
    }

    // this.homeApi.RMID = "12";
    // this.homeApi.RMName = "RM3";
    this.getNotesDetails();

  }

//changed by AdilP || FIN1EURINT-512
  addNewNotes() {
    try {
      // if (this.NotesArray.length > 0) {
        this.showNewNote = !this.showNewNote;
        this.saveBtn = false;
        this.description = '' ;
        this.note_title = '' ;
        for (let i = 0; i < this.NotesArray.length; i++) {
          this.editFlag[i] = false;
        }
      // }
    } catch (EX) {
      console.log("Error occured in notes.ts-->", EX);
    }



  }

  async addNotes(noteID : any ='') {
    try {
      this.closeAllPopup();
      if (this.noteUpdateFlag) {
        this.getNoteID(noteID);
        await this.updateNote(this.noteIDonClick);
      } else {
        await this.insertNotesDetails();
      }
      
      this.editTitle = false;
      this.saveBtn = true;
      // this.showNewNote=false
    } catch (error) {

    }
  }

  // appendNewNote(name : any){
  //   this.List_Of_Notes.push({
  //     Name : name.target.value,
  //     date : "17-Jan-2022"
  //   });
  //   this.total_notes = this.List_Of_Notes.length;
  // }


  closeAllPopup() {
     

    // this.showNewNote = false;
    for (let i = 0; i < this.NotesArray.length; i++) {
      this.editFlag[i] = false;
    }
  }

  async insertNotesDetails() {
    try {
      if (this.description !== '' && this.note_title !== '') {
        let res = await this.apifunction.InsertNoteDetails("Y", this.date, this.description, this.date, this.note_title, "I", "Y", "N", '');
        if(res){
          await this.getNotesDetails();
        }
        this.description = '' ;
        this.note_title = '' ;
        this.showNewNote= false;
      }else{
        this.updateNote(this.noteIDonClick)
      }

    } catch (error) {

    }

  }

  // insertNotesDetails(notemode, updateID) {

  //   this.showNewNote = false;
  //   this.editTitle = false;
  //   this.note_mode = notemode;

  //   console.log("insert notes", this.homeApi.RMID, this.homeApi.RMName)
  //   this.utilitiesApi
  //     .Insert_RM_ReminderNotesDetails(
  //       "Y",
  //       this.currDate,
  //       this.authApi.UserName,
  //       this.description,
  //       updateID,
  //       this.authApi.UserName,
  //       this.currDate,
  //       this.authApi.UserName,
  //       this.homeApi.RMID,
  //       this.note_title,
  //       this.note_mode
  //     )
  //     .subscribe((res: any) => {
  //       console.log(res);
  //       if (res) {

  //         // console.log("NOTES", res);

  //         this.getNotesDetails();
  //       }
  //     });
  // }


  updateRow(index, title, description) {

    console.log("tile..", title, description);

    this.note_title = title;
    this.description = description;
    this.showNewNote = false;

    for (let i = 0; i < this.NotesArray.length; i++) {
      this.editFlag[i] = false;
      if (i === index) {
        this.editFlag[i] = true;
      }
    }

    // console.log("Edit flags", this.editFlag);
  }

  // updateNotesDetails(){

  //   console.log("insert notes", this.homeApi.RMID, this.homeApi.RMName)
  //   this.utilitiesApi
  //   .Insert_RM_ReminderNotesDetails(
  //     "Y",
  //     this.currDate,
  //     this.authApi.UserName,
  //     this.description,
  //     this.homeApi.RMID,
  //     this.authApi.UserName,
  //     this.currDate,
  //     this.authApi.UserName,
  //     this.homeApi.RMID,
  //     this.note_title,
  //     "U"
  //     )
  //   .subscribe((res: any) => {
  //     console.log(res);
  //     if (res) {

  //       console.log("NOTES", res);

  //       this.getNotesDetails();
  //     }
  //   });
  // }



  async getNotesDetails() {
    //debugger;
    console.log("Get note para..",
      this.authApi.UserName,
      this.homeApi.RMID);

     let res = await this.utilitiesApi.Get_RM_ReminderNotesDetails(this.homeApi.RMID)
     if (res) {

            console.log("GET NOTES", res);
            this.NotesArray = res;
            this.total_notes = this.NotesArray.length;
            for (let i = 0; i < this.NotesArray.length; i++) {
              this.editFlag[i] = false;
            }
  
    }

    // this.utilitiesApi
    //   .Get_RM_ReminderNotesDetails(
    //     this.homeApi.RMID
    //   )
    //   .subscribe((res: any) => {
    //     console.log(res);
    //     if (res) {

    //       console.log("GET NOTES", res);
    //       this.NotesArray = res;
    //       this.total_notes = this.NotesArray.length;
    //       for (let i = 0; i < this.NotesArray.length; i++) {
    //         this.editFlag[i] = false;
    //       }

    //     }
    //   });
  }

  //Changed by MohanP | 2FEB22
  CloseAllPopup(_e: any) {
    try {
      this.showNewNote = false;
      for (let i = 0; i < this.NotesArray.length; i++) {
        this.editFlag[i] = false;
      }
      this.editTitle = false;
    }
    catch (ex) {
      console.log('Error occured while closing the pop up: ', ex);
    }
  }

  getNoteID(noteid: any) {
    try {
      this.noteIDonClick = noteid;
    } catch(error) {

    }
  }

  //Adde by Apurva K|| 08-May-2023
  async deleteNotes(id: any) {
    try {
      console.log(id,"id");
      let RMR_ID: any = '';
      RMR_ID = id;
      let deleteResponse = await this.apifunction.DeleteNoteToDO(RMR_ID);
      console.log(deleteResponse,"deltereponse");
      if (deleteResponse) {
        this.getNotesDetails();
      }
       
    } catch (error) {

    }
  }

  async updateNote(noteID: any) {
    try {
      this.noteUpdateFlag = true;
      let updateNoteRes = await this.apifunction.InsertNoteDetails("Y", this.date, this.description, this.date, this.note_title, "U", "Y", "N", noteID);
        if (updateNoteRes) {
          await this.getNotesDetails();
        }  
      this.noteUpdateFlag = false;
    } catch (error) {

    }
  }

}
