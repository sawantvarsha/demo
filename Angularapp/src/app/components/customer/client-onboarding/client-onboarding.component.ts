import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CustomerApiService } from '../../../services/customer-api.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


// import { exists } from 'fs';
// import { ThemeService } from '../theme/theme.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-client-onboarding',
  templateUrl: './client-onboarding.component.html',
  styleUrls: ['./client-onboarding.component.scss'],
})
export class ClientOnboardingComponent implements OnInit, OnDestroy {
  // -------------------Client Onboarding Pie Chart Data Start ------------------- //
  isProd = environment.production;
  ClientOnboardingChartTitle = '';
  ClientOnboardingChartType = 'PieChart';
  ClientOnboardingChartData = [];
  ClientOnboardingChartColumnNames = ['Queues', 'Yesterday Count'];
  ClientOnboardingChartOptionslight = {
    axisFontSize: 0,
    backgroundColor: { fill: 'transparent' },
    colors: [
      '#D4AB8B',
      '#C4A994',
      '#CCB6A6',
      '#AB9F93',
      '#887F76',
      '#D4AB8B',
      '#C4A994',
      '#CCB6A6',
      '#AB9F93',
      '#887F76',
    ],
    chartArea: { left: '85px', top: '25px', width: '100%', height: '85%' },
    tooltip: {
      isHTML: true,
    },
    pieSliceTextStyle: {
      color: 'black',
    },
    legend: {textStyle: { color: '#fff', fontSize : 14} },
  };
  ClientOnboardingChartOptionssilver = {
    axisFontSize: 0,
    backgroundColor: { fill: 'transparent' },
    colors: ['#1261A0', '#6CC4EE', '#0C3E66', '#9BD4F5', '#529FD2'],
    chartArea: { left: '85px', top: '25px', width: '100%', height: '85%' },
    tooltip: {
      isHTML: true,
    },
    legend: {textStyle: { color: '#fff', fontSize : 14} },
  };
  // ClientOnboardingChartWidth = 800;
  // ClientOnboardingChartHeight = 350;

  // -------------------Client Onboarding Pie Chart Data End ------------------- //

  // -------------------Supporting Documents Pie Chart Data Start ------------------- //

  SupportingDocumentsChartTitle = '';
  SupportingDocumentsChartType = 'PieChart';
  SupportingDocumentsChartData = [];
  SupportingDocumentsChartColumnNames = ['Queues', 'Yesterday Count'];
  SupportingDocumentsChartOptionslight = {
    axisFontSize: 0,
    backgroundColor: { fill: 'transparent' },
    colors: [
      '#D4AB8B',
      '#C4A994',
      '#CCB6A6',
      '#AB9F93',
      '#887F76',
      '#CCB6A6',
      '#AB9F93',
      '#887F76',
    ],
    chartArea: { left: '85px', top: '25px', width: '100%', height: '85%' },
  };
  SupportingDocumentsChartOptionssilver = {
    axisFontSize: 0,
    backgroundColor: { fill: 'transparent' },
    colors: ['#1261A0', '#6CC4EE', '#0C3E66', '#9BD4F5', '#529FD2'],
    chartArea: { left: '85px', top: '25px', width: '100%', height: '85%' },
  };
  // SupportingDocumentsChartWidth = 800;
  // SupportingDocumentsChartHeight = 350;

  // -------------------Supporting Documents Pie Chart Data End ------------------- //

  clientOnboardingId: string = '';
  supportingDocumentsId: string = '';
  clientOnboardingCount: number;
  supportingDocumentCount: number;

  workflows = [];
  clientOnboardingQueues = [];
  supportingDocumentsQueues = [];
  tokens = [];
  tokenColumnNames = [];
  tokenIds = [];
  tokenIdKey = '';
  buttons = [];
  webAppURL = '';

  day = 'yesterday';
  entityId: number;
  userName: string;
  processTokenMessage: string;
  loader = false;
  includeClosure: string;
  searchKey: string;
  serverTimeStamp: number;

  workflowsSubscription: Subscription;
  queuesSubscription: Subscription;
  tokensSubscription: Subscription;
  buttonsSubscription: Subscription;
  processButtonSubscription: Subscription;
  webAppURLSubscription: Subscription;

  selectedChart = '';
  selectedQueue = '';
  selectedQueueName = '';
  selectedEntityName = '';
  ShowSupportingDocuments = '';
  entities = {};

  // entities = {
  //   7: 'Bahrain',
  //   8: 'Kuwait',
  //   9: 'UAE',
  //   10: 'Egypt',
  //   11: 'UK'
  // };
  // entities = {
  //   47: 'Bahrain',
  //   45: 'Kuwait',
  //   48: 'UAE',
  //   46: 'Egypt',
  //   36: 'UK',
  // };
  flagtheme: boolean;
  toggleFlag: string;
  showhideChartFlag = false;
  plusMinusBtn = '+';

  constructor(
    public afs: CustomerApiService,
    public cfs: CommonApiService,
    private ref: ChangeDetectorRef,
    private router: Router, // private themeService: ThemeService
    private authApi: AuthService
  ) {
    try {
      this.showhideChartFlag = true;
      this.plusMinusBtn = '-';
      // this.socketservice.initSocket();
    } catch (error) {
      //console.error(error);
    }
    this.flagtheme = true;
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    if (this.processButtonSubscription) this.processButtonSubscription.unsubscribe();
    if (this.buttonsSubscription) this.buttonsSubscription.unsubscribe();
    if (this.queuesSubscription) this.queuesSubscription.unsubscribe();
  }

  ngOnInit() {
    this.afs.TokensOnBoardingObserver.next([]);
    this.includeClosure = 'No';
    this.searchKey = '';
    this.afs.fnGet_Workflow_Type_Master_Id('Client Onboarding Workflow').subscribe(res => {
      if (res !== '') {
        this.clientOnboardingId = res.Get_WTM_IdResult;
        this.OnLoadEvents();
      }
    });
    this.afs.fnGet_Workflow_Type_Master_Id('Supporting Documents Workflow').subscribe(res => {
      if (res !== null) {
        this.supportingDocumentsId = res.Get_WTM_IdResult;
      }
    });

    this.ClearProcessTokenMessage();
    // console.log(this.themeService.themeSubscribeObs.subscribe(
    //   res => {
    //     console.log(res);
    //     this.toggleFlag = res === '' ? this.toggleFlag = 'silver' : res;
    //   }));
    try {
      // if (this.afs.getEntityConfig('ShowSupportingDocuments')){
      //   this.ShowSupportingDocuments =  this.afs.getEntityConfig('ShowSupportingDocuments');

      // }else {
      //   this.ShowSupportingDocuments = 'No';
      // }
      const entitiesConfig = this.afs.entityConfig;
      Object.keys(entitiesConfig).map(
        (e: string) => (this.entities[entitiesConfig[e].Id] = e)
      );

      // console.log('loaded');
      // this.OnLoadEvents();
    } catch (error) {
      //console.error(error);
    }
  }

  graphReady(graph: string) {
    const chartXMl = document.getElementById(graph);
    const nodes = chartXMl.getElementsByTagName('text');

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      let queues = [];
      if (graph.toLowerCase().includes('client')) {
        queues = this.clientOnboardingQueues.filter((d) => {
          const count = d.TokenCount;
          if (count > 0) {
            return true;
          }
        });
        // const that = this;
        queues.forEach((v: any) => {
          if (node.innerHTML.includes(v.QM_Name)) {
          }
        });
      } else {
        queues = this.supportingDocumentsQueues.filter((d) => {
          const count = d.TokenCount;
          if (count > 0) {
            return true;
          }
        });
        // const that = this;
        queues.forEach((v: any) => {
          if (node.innerHTML.includes(v.QM_Name)) {
          }
        });
      }
    }
  }

  OnLoadEvents(clearMessage = true) {
    try {
      const that = this;

      // this.entityId = 4;
      this.entityId = Number(this.authApi.EntityID);

      // this.selectedEntityName = this.entities[entity];

      this.userName = this.authApi.UserName;
      this.selectedQueueName = '';
      this.searchKey = '';

      if (clearMessage) {
        this.ClearProcessTokenMessage();
      }

      this.workflows.length = 0;
      this.clientOnboardingQueues.length = 0;
      this.supportingDocumentsQueues.length = 0;
      this.tokens.length = 0;
      this.tokenColumnNames.length = 0;
      this.tokenIds.length = 0;
      this.buttons.length = 0;

      this.day = 'today';

      // this.workflowsSubscription = this.afs.workflows.subscribe((wfs: []) => {
      //   if (wfs.length > 0) {
      //     that.workflows = wfs.filter((w: any) => w.Value.length > 0);
      // this.clientOnboardingId = '2060';
      // this.clientOnboardingId = '2';
      // this.supportingDocumentsId = '2061';
      // this.supportingDocumentsId = '0';
      // console.log(that.clientOnboardingId, that.supportingDocumentsId);

      // console.log(that.includeClosure);
      // if (that.clientOnboardingId) {
      this.afs.loadFilteredQueues(
        this.clientOnboardingId,
        this.entityId,
        'ClientOnboarding'
      );
      // }
      // if (that.supportingDocumentsId) {
      // this.afs.loadQueuesOnBoarding(
      //   this.supportingDocumentsId,
      //   this.entityId,
      //   this.GetTime(),
      //   'SupportingDocuments',
      //   this.includeClosure,
      //   this.searchKey
      // );
      // }
      //   }
      // });

      this.queuesSubscription = this.afs.filteredqueues.subscribe((qs: any) => {
        try {
          if (qs !== undefined && qs !== null && qs !== '') {
            switch (qs.WorkFlowName) {
              case 'ClientOnboarding':
                that.clientOnboardingQueues = qs.queues.filter(
                  (queue: any) => queue.QM_Name !== ''
                );
                that.setPieChartData('ClientOnboarding', 'today');
                break;
              case 'SupportingDocuments':
                that.supportingDocumentsQueues = qs.queues;
                that.setPieChartData('SupportingDocuments', 'today');
                break;
            }

            this.ref.detectChanges(); // Used for assuring pie chart is drawn.
            this.clientOnboardingQueues.forEach((element) => {
              if (element.QM_Name.trim() === 'Verified Profile') {
                this.afs.loadButtonsOnBoarding(element.QM_ID, this.userName);
                this.afs.loadTokensOnBoarding(
                  element.QM_ID,
                  this.entityId,
                  this.GetTime(),
                  1,
                  60,
                  this.searchKey
                );
                const count =
                  this.day === 'yesterday'
                    ? element.TokenCount
                    : element.TokenCount;
                this.selectedQueueName =
                  'Client Onboarding - ' + element.QM_Name + ' (' + count + ')';
              }
            });
          }
        } catch (ex) {
          console.log('Error in queuesonBoarding subscribe: ', ex);
        }

      });

      this.tokensSubscription = this.afs.tokensOnBoarding.subscribe((ts: []) => {
        if (ts.length) {
          that.tokenColumnNames.length = 0;
          that.tokens.length = 0;
          that.tokenIds.length = 0;
          //console.log(ts);
          that.tokens = ts;

          const ServerTime = that.afs.getServerTimeStamp();
          that.serverTimeStamp = parseInt(
            ServerTime.split('(')[1].split(')')[0],
            10
          );

          const columnNames = Object.keys(that.tokens[0]);
          columnNames.splice(columnNames.indexOf('Remarks'), 1);
          for (const key of columnNames) {
            if (key) {
              that.tokenColumnNames.push(
                that.cfs.convertTagNames(key, 'header') || key
              );
            }
            if (key.includes('Ref') && key.includes('No')) {
              this.tokenIdKey = key;
            }
          }
          this.tokens.forEach((t) => {
            this.tokenIds.push(t[this.tokenIdKey]);
          });
          that.loader = false;
          // console.log(this.tokenIds);
        } else {
          //console.log("no data");
        }
      });

      this.buttonsSubscription = this.afs.buttonsOnBoarding.subscribe((btns: []) => {
        if (btns.length) {
          that.buttons = btns.filter((btn: any) => {
            return btn.PrimaryExecutionType === 'SP';
          });
        }
      });

      this.processButtonSubscription = this.afs.processTokenOnBoarding.subscribe(
        (msg: any) => {
          if (msg.processTokenonButtonClickResult) {
            // console.log(msg.processTokenonButtonClickResult);
            that.processTokenMessage = msg.processTokenonButtonClickResult;
            that.afs.loadFilteredQueues(
              that.clientOnboardingId,
              that.entityId,
              'ClientOnboarding'
            );
            that.afs.loadQueuesOnBoarding(
              that.supportingDocumentsId,
              that.entityId,
              that.GetTime(),
              'SupportingDocuments',
              that.includeClosure,
              that.searchKey
            );

            // that.SelectPieChartSlice([{ row: that.selectedQueue }], that.selectedChart);

            that.tokenColumnNames.length = 0;
            that.tokens.length = 0;
            that.tokenIds.length = 0;
          }
        }
      );

      this.webAppURLSubscription = this.afs.webAppURL.subscribe(
        (popupData: any) => {
          if (popupData.url) {
            const url =
              popupData.baseURL +
              ((popupData.url + '').startsWith('..')
                ? (popupData.url + '').substr(2, popupData.url.length)
                : popupData.url);
            window.open(
              url,
              'popup',
              'width=' + popupData.width + ', height=' + popupData.height
            );
          }
        }
      );

      this.afs.loadWorkflow(this.userName);
    } catch (error) {
      //console.error(error);
    }
  }

  changeDayFilter(dayFilter) {
    try {
      this.setPieChartData('ClientOnboarding', dayFilter);
      this.ref.detectChanges();
      this.tokenColumnNames.length = 0;
      this.tokens.length = 0;

      this.selectedQueueName = '';
      this.ClearProcessTokenMessage();
    } catch (error) {
      //console.error(error);
    }
  }

  includeClosureCheck(e) {
    try {
      // console.log(e);
      this.includeClosure = e.target.checked ? 'Yes' : 'No';
      this.afs.loadFilteredQueues(
        this.clientOnboardingId,
        this.entityId,
        'ClientOnboarding'
      );
      this.afs.loadQueuesOnBoarding(
        this.supportingDocumentsId,
        this.entityId,
        this.GetTime(),
        'SupportingDocuments',
        this.includeClosure,
        this.searchKey
      );
      this.ClearProcessTokenMessage();
    } catch (error) {
      //console.error(error);
    }
  }

  searchCriteriaChanged() {
    try {
      this.clientOnboardingQueues.length = 0;
      this.supportingDocumentsQueues.length = 0;
      this.tokens.length = 0;
      this.ClearProcessTokenMessage();
      this.afs.loadFilteredQueues(
        this.clientOnboardingId,
        this.entityId,
        'ClientOnboarding'
      );
      this.afs.loadQueuesOnBoarding(
        this.supportingDocumentsId,
        this.entityId,
        this.GetTime(),
        'SupportingDocuments',
        this.includeClosure,
        this.searchKey
      );
    } catch (error) {
      //console.error(error);
    }
  }

  clearSearchKey() {
    try {
      this.searchKey = '';
      this.searchCriteriaChanged();
      this.ClearProcessTokenMessage();
    } catch (error) {
      //console.error(error);
    }
  }

  setPieChartData(workflow: string, dayFilter: string) {
    try {
      const values = [];
      switch (workflow) {
        case 'ClientOnboarding':
          if (this.clientOnboardingQueues.length) {
            this.clientOnboardingCount = 0;
            this.clientOnboardingQueues.forEach((queue) => {
              const count =
                dayFilter === 'yesterday' ? queue.TokenCount : queue.TokenCount;
              values.push([queue.QM_Name, count]);
              this.clientOnboardingCount += count;
            });
            if (values.length) {
              this.ClientOnboardingChartData = values;
            }

            this.ref.detectChanges();
          }
          break;
        case 'SupportingDocuments':
          if (this.supportingDocumentsQueues.length) {
            this.supportingDocumentCount = 0;
            this.supportingDocumentsQueues.forEach((queue) => {
              const count =
                dayFilter === 'yesterday' ? queue.TokenCount : queue.TokenCount;
              values.push([queue.QM_Name + ' (' + count + ')', count]);
              this.supportingDocumentCount += count;
            });
            if (values.length) {
              this.SupportingDocumentsChartData = values;
            }
            this.ref.detectChanges();
          }
          break;
      }
    } catch (error) {
      //console.error(error);
    }
  }

  SelectPieChartSlice(event, chartData, chartName) {
    try {
      this.loader = true;
      this.tokenColumnNames.length = 0;
      this.tokens.length = 0;
      //console.log(event, chartData);
      // if (event.length) {
      let selectedQueue;
      selectedQueue = chartData.data[event.selection[0].row][0].split('(')[0];

      this.selectedQueue = selectedQueue;
      this.selectedChart = chartName;

      switch (chartName) {
        case 'ClientOnboarding':
          this.clientOnboardingQueues.forEach((element) => {
            if (element.QM_Name.trim() === selectedQueue.trim()) {
              this.afs.loadButtonsOnBoarding(element.QM_ID, this.userName);
              this.afs.loadTokensOnBoarding(
                element.QM_ID,
                this.entityId,
                this.GetTime(),
                1,
                chartData.data[event.selection[0].row][1],
                this.searchKey
              );
              const count =
                this.day === 'yesterday'
                  ? element.TokenCount
                  : element.TokenCount;
              this.selectedQueueName =
                'Client Onboarding - ' + element.QM_Name + ' (' + count + ')';
            }
          });
          // if (this.clientOnboardingQueues[selectedQueue]) {
          // console.log(this.clientOnboardingQueues[selectedQueue]);
          // }
          break;
        case 'SupportingDocuments':
          this.supportingDocumentsQueues.forEach((element) => {
            if (element.QM_Name.trim() === selectedQueue.trim()) {
              this.afs.loadButtonsOnBoarding(element.QM_ID, this.userName);
              this.afs.loadTokensOnBoarding(
                element.QM_ID,
                this.entityId,
                this.GetTime(),
                1,
                7,
                this.searchKey
              );
              const count =
                this.day === 'yesterday'
                  ? element.TokenCount
                  : element.TokenCount;
              this.selectedQueueName =
                'Supporting Documents - ' +
                element.QM_Name +
                ' (' +
                count +
                ')';
            }
          });
          break;
      }
      // }
    } catch (error) {
      //console.error(error);
    }
  }

  ClearProcessTokenMessage() {
    this.processTokenMessage = '';
  }

  processDynamicControlEvent(target: any) {
    try {
      if (target.control === 'button' && target.event === 'click') {
        const that = this;
        const tokenLastModifiedTime = parseInt(
          this.afs
            .getLastModifiedTime(target.tokenId)
            .split('(')[1]
            .split(')')[0],
          10
        );
        if (this.serverTimeStamp > tokenLastModifiedTime) {
          const dealNo = this.tokens.filter((t) => {
            return t.TI_ID === target.tokenId;
          })[0].FinIQ_x0020_Ref_x0020_No;
          this.afs.processButtonActionOnBoarding(
            target.tokenId,
            dealNo,
            target.buttonId,
            that.userName
          );
        } else {
          //console.log("Token already modified.");
          this.processTokenMessage = 'Token already modified';
          setTimeout(() => {
            that.ClearProcessTokenMessage();
          }, 2000);
          this.afs.clearObservers();
          this.OnLoadEvents(false);
        }
      }
    } catch (error) {
      //console.error(error);
    }
  }

  GetTime(): number {
    try {
      const date = new Date();
      // const date = new Date(2019, 5, 24);
      if (this.day === 'yesterday') {
        date.setDate(date.getDate() - 1);
      }
      date.setHours(10);
      date.setMinutes(35);
      return date.getTime();
    } catch (error) {
      //console.error(error);
    }
  }

  openFinIQWebApp(token: any) {
    try {
      let workflowId = '';
      // let queueId = '';
      switch (this.selectedChart) {
        case 'ClientOnboarding':
          workflowId = this.clientOnboardingId;
          // queueId = this.clientOnboardingQueues[this.selectedQueue].QM_ID;
          break;
        case 'SupportingDocuments':
          workflowId = this.supportingDocumentsId;
          // queueId = this.supportingDocumentsQueues[this.selectedQueue].QM_ID;
          break;
      }
      this.afs.getWebAppRedirectDetails(
        workflowId,
        token.TI_ID,
        this.userName,
        this.entityId,
        0
      );
    } catch (error) {
      //console.error(error);
    }
  }

  gotoProcessTokenQueue() {
    try {
      const message = this.processTokenMessage;
      const that = this;
      if (message.includes('to')) {
        const queueName = message
          .split('to ')[1]
          .trim()
          .split(' queue')[0]
          .trim();
        // console.log(queueName, this.selectedQueue, this.selectedQueueName, this.selectedQueueName.split('-')[0].trim());
        let queue: any;
        let count = 0;
        switch (this.selectedQueueName.split('-')[0].trim()) {
          case 'Client Onboarding':
            queue = this.clientOnboardingQueues.filter((q) => {
              return q.QM_Name === queueName;
            })[0];
            this.afs.loadButtonsOnBoarding(queue.QM_ID, this.userName);
            this.afs.loadTokensOnBoarding(
              queue.QM_ID,
              this.entityId,
              this.GetTime(),
              1,
              7,
              this.searchKey
            );
            count =
              this.day === 'yesterday' ? queue.TokenCount : queue.TokenCount;
            this.selectedQueueName =
              'Client Onboarding - ' + queue.QM_Name + ' (' + count + ')';
            break;
          case 'Supporting Documents':
            queue = this.supportingDocumentsQueues.filter((q) => {
              return q.QM_Name === queueName;
            })[0];
            this.afs.loadButtonsOnBoarding(queue.QM_ID, this.userName);
            this.afs.loadTokensOnBoarding(
              queue.QM_ID,
              this.entityId,
              this.GetTime(),
              1,
              7,
              this.searchKey
            );
            count =
              this.day === 'yesterday'
                ? queue.Count_YesterDay
                : queue.Count_Today;
            this.selectedQueueName =
              'Supporting Documents - ' + queue.QM_Name + ' (' + count + ')';
            break;
        }
        that.ClearProcessTokenMessage();
      }
      return;
    } catch (error) {
      //console.error(error);
    }
  }

  gotoNewRecordPage() {
    this.router.navigate(['New', this.entityId]);
  }
  processEvent(dealno, tokenid, login, action, buttonID) {
    console.log(action);
    // this.router.navigate(['/validateUser/2']);

    this.cfs.sendDataforVerification(dealno, tokenid, login, action, buttonID);
    this.router.navigate(['/customersetupview']);
    // this.afs.setValidateUserPageMode(2);
    sessionStorage.setItem('ClientName', dealno);
    // sessionStorage.setItem("ClientOnBoardingUsername", login);
  }
  chartDisplay() {
    if (this.showhideChartFlag === false) {
      this.showhideChartFlag = true;
      this.plusMinusBtn = '-';
    } else {
      this.showhideChartFlag = false;
      this.plusMinusBtn = '+';
    }
  }
}
