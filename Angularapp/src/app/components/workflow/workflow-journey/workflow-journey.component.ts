import { Component, Input, OnInit } from '@angular/core';
import { WorkflowApiService } from 'src/app/services/workflow-api.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as $ from 'jquery';

@Component({
  selector: 'app-workflow-journey',
  templateUrl: './workflow-journey.component.html',
  styleUrls: ['./workflow-journey.component.scss'],
})
export class WorkflowJourneyComponent implements OnInit {
  @Input() visible: any;
  @Input() TokenId: any;
  // @Input() DealNo:any;
  @Input() WF_ID: any;

  links: any;
  nodes: any;
  svg: any;
  thresh: any;
  svgExport: any;
  customSvg: any;
  fromHTML: any;
  position: any = [];
  simulation: any;
  dragForce: any;
  linklabels: any;
  nodes1: any;
  nodesList: any;
  linksnew: any[] = [];
  NodesNewList: any[] = [];
  TimelineClickFlag: boolean = false;
  ConfigWorkflowGraphBtnMstrJoinYN: string = 'NO' || 'N';

  Queue_Name: string;
  Proccessed_By: string;
  TimeStamp: string;

  GetWFTitleSubscription: Subscription;
  GetWFNodesSubscription: Subscription;
  GetWFLinksSubscription: Subscription;
  GetWFQueueMovementsSubscription: Subscription;

  WorkflowTitle: any;
  HdnLinks: any[];
  LinksInput: any;
  QMovement1: any[];
  Qmovements: any[];
  NodeData: any[];
  queueName: any;
  time1: any;
  time2: any;
  line: string;
  TimelineDataArr: any[];
  TimelineDataArrLength: number;
  NodeDataArr: any[];

  constructor(public Workflow_api: WorkflowApiService) {
    this.thresh = 100;
  }

  ngOnInit(): void {
    if (this.nodes) {
      this.nodes.remove();
      this.links.remove();
      this.linklabels.remove();
    }
    this.thresh = 100;
    this.getWFTitle();
    // this.TokenId='2809933'
    console.log('token id::', this.TokenId);
  }

  getWFTitle() {
    this.GetWFTitleSubscription = this.Workflow_api.GetWorkflowTitle(
      this.WF_ID
    ).subscribe((data) => {
      try {
        if (data) {
          this.WorkflowTitle = data.GetWorkflowTitleResult;
        }
      } catch (err) {}
    });
    this.getworkflownode();
  }

  getworkflownode() {
    if (this.nodes || this.links) {
      this.nodes.remove();
      this.links.remove();
    }
    if (this.linklabels) {
      this.linklabels.remove();
    }

    this.GetWFNodesSubscription = this.Workflow_api.GetWorkflowNodes(
      this.WF_ID,
      true
    ).subscribe((data) => {
      try {
        if (data) {
          this.linksnew = [];
          this.NodesNewList = [];
          this.nodes1 = data.GetWorkflowNodesResult;
          this.nodesList = JSON.parse(
            data.GetWorkflowNodesResult.replace(/\n/g, '')
          );
          // console.log(this.nodesList, this.nodesList.length);
          for (let i = 0; i < this.nodesList.length; i++) {
            this.nodes1 = this.nodesList[i];
            //console.log(this.nodes1)
            if (
              this.ConfigWorkflowGraphBtnMstrJoinYN.toUpperCase() === 'N' ||
              this.ConfigWorkflowGraphBtnMstrJoinYN.toUpperCase() === 'NO'
            ) {
              for (let j = 0; j < this.nodesList.length; j++) {
                if (i != j) {
                  let tempNodes = this.nodesList[j];
                  if (
                    this.nodes1.QM_Success_Queue === tempNodes.QM_ID &&
                    this.nodes1.QM_Success_Queue != 0 &&
                    this.nodes1.QM_Success_Queue != null
                  ) {
                    //  this.LinksInput.push({source: nodes1.QM_ID, target: tempNodes.QM_ID, type: "links_movement", name: "", SrNo: "",
                    this.linksnew.push({
                      source: this.nodes1.QM_ID,
                      target: tempNodes.QM_ID,
                      type: 'links_movement',
                      name: '',
                      SrNo: '',
                    });
                    // console.log("Success links ::", this.linksnew)
                  }
                  if (
                    this.nodes1.Qm_Fail_Queue === tempNodes.QM_ID &&
                    this.nodes1.Qm_Fail_Queue != 0 &&
                    this.nodes1.Qm_Fail_Queue != null
                  ) {
                    this.linksnew.push({
                      source: this.nodes1.QM_ID,
                      target: tempNodes.QM_ID,
                      type: 'links_movement',
                      name: '',
                      SrNo: '',
                    });
                    //  console.log("Fail links ::", this.linksnew)
                  }
                }
              } // end middle for
            } // end if
            //For Garabage values
            if (this.nodes1.QM_Success_Queue === null) {
              this.nodes1.QM_Success_Queue = 0;
            }
            if (this.nodes1.Qm_Fail_Queue === null) {
              this.nodes1.Qm_Fail_Queue = 0;
            }
            // Put nodes data in required format
            this.NodesNewList.push({
              id: this.nodes1.QM_ID,
              name: this.nodes1.QM_Name,
              success_queue: this.nodes1.QM_Success_Queue,
              fail_queue: this.nodes1.Qm_Fail_Queue,
              status: this.nodes1.QM_Queue_Status,
              x: this.nodes1.QM_PosX,
              y: this.nodes1.QM_PosY,
              userQ: this.nodes1.Qm_AutoProcessYN,
              QMovementType: this.nodes1.QM_Exceptional_Queue_Type,
            });
          } // end for
          if (
            this.ConfigWorkflowGraphBtnMstrJoinYN.toUpperCase() === 'Y' ||
            this.ConfigWorkflowGraphBtnMstrJoinYN.toUpperCase() === 'YES'
          ) {
            this.getWorkflowlink();
          }
          // console.log("this.TokenId",this.TokenId)
          if (this.TokenId != null) {
            this.getQmovements();
          }
        }
      } catch (error) {}
    });
  }

  getWorkflowlink() {
    this.GetWFLinksSubscription = this.Workflow_api.GetWorkflowLinks(
      this.WF_ID,
      true
    ).subscribe((data) => {
      if (data) {
        this.HdnLinks = [];

        this.HdnLinks = data.GetWorkflowLinksResult;
        this.LinksInput = JSON.parse(
          data.GetWorkflowLinksResult.replace(/\n/g, '')
        );
        // console.log("links:",this.LinksInput)
        for (let i = 0; i < this.LinksInput.length; i++) {
          let source = 0;
          let target = 0;
          let LinksInput1 = this.LinksInput[i];
          for (let j = 0; j < this.nodesList.length; j++) {
            let tempLinksInput = this.nodesList[j];
            if (
              LinksInput1.QM_Success_Queue === tempLinksInput.QM_ID &&
              LinksInput1.QM_Success_Queue != 0 &&
              LinksInput1.QM_Success_Queue != null
            ) {
              target = tempLinksInput.QM_ID;
            }
            if (
              LinksInput1.Qm_Fail_Queue === tempLinksInput.QM_ID &&
              LinksInput1.Qm_Fail_Queue != 0 &&
              LinksInput1.Qm_Fail_Queue != null
            ) {
              target: tempLinksInput.QM_ID;
            }
            if (LinksInput1.QM_ID === tempLinksInput.QM_ID) {
              source = tempLinksInput.QM_ID;
            }
          }

          if (source != target) {
            this.linksnew.push({
              source: source,
              target: target,
              type: 'links_movement',
              name: '',
              SrNo: '',
            });
          }
        }
        this.SpliceLinks();
      }
    });
  }

  SpliceLinks() {
    let count = this.linksnew.length;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (
          this.linksnew[i].source === this.linksnew[j].source &&
          this.linksnew[i].target === this.linksnew[j].target
        ) {
          this.linksnew.splice(j--, 1);
          count--;
        }
      }
    }
  }

  getQmovements() {
    this.TokenId = this.TokenId[0];
    this.GetWFQueueMovementsSubscription =
      this.Workflow_api.GetWorkflowNodes_QMovement(
        this.TokenId,
        true
      ).subscribe((data) => {
        if (data) {
          this.QMovement1 = [];
          this.Qmovements = [];
          this.NodeData = [];
          this.QMovement1 = data.GetWorkflowNodes_QMovementResult;
          this.Qmovements = JSON.parse(
            data.GetWorkflowNodes_QMovementResult.replace(/\n/g, '')
          );
          // console.log("Qmovements::", this.Qmovements)
          let successLinks = [];
          if (this.Qmovements.length == 1) {
            successLinks.push({
              source: this.Qmovements[0],
              target: this.Qmovements[0],
            });
          }
          for (let k = 0; k < this.Qmovements.length - 1; k++) {
            successLinks.push({
              source: this.Qmovements[k],
              target: this.Qmovements[k + 1],
            });
            let x = 0,
              y = 0;
            let source1 = this.Qmovements[k];
            let target1 = this.Qmovements[k + 1];

            // Condition added for removing loops on Q movement || Asked by milind Sir and nitish Sir
            if (source1.queue_no != target1.queue_no) {
              for (let i = 0; i < this.nodesList.length; i++) {
                this.nodes1 = this.nodesList[i];
                if (this.nodes1.QM_ID === source1.queue_no) {
                  x = this.nodes1.QM_ID;
                }
                if (this.nodes1.QM_ID === target1.queue_no) {
                  y = this.nodes1.QM_ID;
                }
              }

              // Start || Added on 5/7/2017 for inserting sr.no,user,date on links || Asked by milind Sir and nitish Sir
              let srNo = k + 1;
              let name = this.Qmovements[k + 1].strTS_Processed_ByAt
                .split('~')
                .join(':');
              let flag = false;
              for (let j = 0; j < this.linksnew.length; j++) {
                if (this.linksnew[j].type == 'links_Qmovement') {
                  if (
                    this.linksnew[j].source == x &&
                    this.linksnew[j].target == y
                  ) {
                    if (this.linksnew[j].name.indexOf('+') > -1) {
                      this.linksnew[j].name =
                        this.linksnew[j].name + ' , ' + this.linksnew[j].srNo;
                    } else {
                      this.linksnew[j].name =
                        this.linksnew[j].name + ' + ' + this.linksnew[j].srNo;
                    }

                    this.linksnew[j].srNo = k + 1;
                    flag = true;
                    break;
                  }
                }
              }
              if (flag == false) {
                // End || Added for inserting sr.no,user,date on links || Asked by milind Sir and nitish Sir

                let c = [];
                let i = 0;

                for (let j = 0; j < this.linksnew.length; j++) {
                  // console.log("linksnew::", this.linksnew)
                  if (
                    this.linksnew[j].source.id === x &&
                    this.linksnew[j].target.id === y
                  ) {
                    this.linksnew.slice(j, 0);
                  } else {
                    c[i] = this.linksnew[j];
                    i++;
                  }
                }

                this.linksnew = [];
                this.linksnew = c;
                this.linksnew.push({
                  source: x,
                  target: y,
                  type: 'links_Qmovement',
                  name: name,
                  SrNo: srNo,
                });
                // console.log("Qmovement links", this.linksnew)
              }
            }
          }
          // 10 oct
          let regExp = /\(([^)]+)\)/;
          if (this.TokenId != null) {
            for (let j = 0; j < successLinks.length; j++) {
              for (let i = 0; i < this.nodesList.length; i++) {
                let nodes1 = this.nodesList[i];
                if (nodes1.QM_ID === successLinks[j].source.queue_no) {
                  this.queueName = nodes1.QM_Name;
                  //console.log("Queue name:::", this.queueName);
                  this.time1 = regExp.exec(
                    successLinks[j].source.TS_Processed_At
                  )[1];
                  this.time2 = regExp.exec(
                    successLinks[j].target.TS_Processed_At
                  )[1];

                  if ((this.time2 - this.time1) / (1000 * 60 * 60 * 24) >= 1) {
                    this.line = 'dotted';
                  } else {
                    this.line = 'solid';
                  }
                  this.NodeData.push({
                    user: successLinks[j].source.TS_Processed_by,
                    timestamp: this.getTimelineDateTime(
                      regExp.exec(successLinks[j].source.TS_Processed_At)[1]
                    ),
                    value: this.queueName,
                    line: this.line,
                    status: nodes1.QM_Queue_Status,
                  });
                  // console.log("nodedata::", this.NodeData);
                  break;
                }
              }

              if (j === successLinks.length - 1) {
                for (let i = 0; i < this.nodesList.length; i++) {
                  let nodes1 = this.nodesList[i];
                  if (nodes1.QM_ID === successLinks[j].target.queue_no) {
                    this.queueName = nodes1.QM_Name;
                    this.NodeData.push({
                      user: successLinks[j].target.TS_Processed_by,
                      timestamp: this.getTimelineDateTime(
                        regExp.exec(successLinks[j].target.TS_Processed_At)[1]
                      ),
                      value: this.queueName,
                      line: this.line,
                      status: nodes1.QM_Queue_Status,
                    });
                    // console.log("nodedata::", this.NodesNewList);
                    break;
                  }
                }
              }
            }
          }
          if (this.TokenId != null) {
            if (this.Qmovements.length == 1) {
              this.NodeData = [this.NodeData[1]];
            }
          }
        }
        this.getSVGElement();
      });
  }

  getSVGElement() {
    // console.log("Insode getSVGElement")
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    this.svg = d3
      .select('#Journeysvg')
      .select('svg')
      .attr('width', '1700px') //1900
      .attr('height', '1500px') //1000
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
      .attr('id', 'svgclass')
      .attr('align', 'center')
      .attr('viewBox', '0 0 50 50"');

    this.svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    this.updateNodes();
    this.updateLinks();
    this.restartSimulation();
  }

  updateNodes() {
    // console.log("inside updateNodes")
    const that = this;
    this.nodes = this.svg
      .selectAll('.node')
      .data(this.NodesNewList)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('fill', (d: any) => {
        // console.log(d);
        if (d.status === 'Initial Queue') {
          return 'yellow';
        } else if (
          d.status === 'Intermediate Queue' &&
          d.userQ === 'Y' &&
          d.QMovementType != 'Externally'
        ) {
          return 'none';
        } else if (d.status === 'Terminal Queue') {
          return '#D3694D';
        } else if (
          (d.status != 'Terminal Queue' && d.userQ === 'N') ||
          d.userQ === ''
        ) {
          return '#0079fb'; //return "#2d9cff"
        } else if (
          d.status === 'Intermediate Queue' &&
          d.userQ === 'Y' &&
          d.QMovementType === 'Externally'
        ) {
          return 'green';
        }
      })
      .attr('stroke', (d: any) => {
        if (
          d.status === 'Intermediate Queue' &&
          d.userQ === 'Y' &&
          d.QMovementType != 'Externally'
        ) {
          return 'gray';
        } else {
          return 'none';
        }
      });
    // .style('filter', 'url(#f1)')
    this.nodes.append('circle').attr('r', 6);
    this.nodes.append('title').text((d: any) => d.id);
    this.nodes
      .append('text')
      .attr('x', 10)
      .attr('y', '.31em')
      // .attr('fill','white')
      .attr('fill', 'var(--headers)')
      .attr('font-size', '12px')
      .text((d: any) => d.name);

    this.nodes.call(
      d3
        .drag()
        .on('start', (sim: any, d: any) => {
          if (!d.active) {
            console.log('restart', sim);
            that.simulation.alphaTarget(0.3).restart();
          }
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (sim: any, d: any) => {
          // console.log(d);
          d.fx = sim.x;
          d.fy = sim.y;
          that.ticked();
        })
    );
  }

  ticked() {
    this.links.attr('d', (d: any) => {
      var dx = d.target.x - d.source.x,
        dy = d.target.y + this.thresh - (d.source.y + this.thresh),
        dr = 0,
        theta = Math.atan2(dy, dx),
        d90 = Math.PI / 2,
        dtxs = d.target.x - 6 * Math.cos(theta),
        dtys = d.target.y + this.thresh - 6 * Math.sin(theta);
      return (
        'M' +
        d.source.x +
        ',' +
        (d.source.y + this.thresh) +
        'A' +
        dr +
        ',' +
        dr +
        ' 0 0 1,' +
        d.target.x +
        ',' +
        (d.target.y + this.thresh) +
        'A' +
        dr +
        ',' +
        dr +
        ' 0 0 0,' +
        d.source.x +
        ',' +
        (d.source.y + this.thresh) +
        'M' +
        dtxs +
        ',' +
        dtys +
        'l' +
        (3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) +
        ',' +
        (-3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) +
        'L' +
        (dtxs - 3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) +
        ',' +
        (dtys + 3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) +
        'z'
      );
    });

    this.nodes.attr('transform', (d: any) => {
      return 'translate(' + d.x + ',' + (d.y + this.thresh) + ')';
    });

    this.linklabels.attr('transform', (d: any) => {
      var dx = (d.source.x + d.target.x) / 2,
        dy = (d.source.y + this.thresh + (d.target.y + this.thresh)) / 2;
      // console.log("dx", dx, "dy", dy)
      return 'translate(' + dx + ',' + dy + ')';
    });
  }

  updateLinks() {
    // console.log("links in Updatedlinks", this.linksnew)
    this.links = this.svg
      .selectAll('.link')
      .data(this.linksnew)
      .enter()
      .append('path')
      // .attr("id", (d: any, i: any) => { return "pathId_" + i; })
      // .attr("class", (d: any) => { return "link " + d.type; })
      .attr('stroke-width', 0.67)
      // .attr('marker-end', 'url(#arrowhead)')
      .attr('stroke', (data: any) => {
        //  console.log(data);
        if (data.type === 'links_movement') {
          return 'var(--linkMovement)';
        } else if (data.type === 'links_Qmovement') {
          return 'var(--linkQMovement)';
        }
      });
    // this.links.append('title')
    //   .text((data: any) => data.type)

    this.linklabels = this.svg
      .selectAll('.link-label')
      .data(this.linksnew)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('dx', '-30')
      .attr('dy', '-10')
      .attr('fill', 'var(--headers)')
      .attr('font-size', '12px')
      .text((data: any) => {
        return data.SrNo + ' ' + data.name;
      });
    // .text((data: any) => data.name);

    //   this.links.append('text')
    // this.links.remove()
  }
  restartSimulation() {
    // console.log("in restartsimulation",this.NodesNewList,this.linksnew)
    this.simulation = d3
      .forceSimulation(this.NodesNewList)
      .force(
        'link',
        d3
          .forceLink()
          .links(this.linksnew)
          .id((d: any) => d.id)
          .distance(100)
          .strength(0)
      )
      .on('tick', () => this.ticked());
  }

  getTimelineDateTime(date) {
    let datetime = new Date(Number(date));
    let months = [
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
    return (
      datetime.getUTCDate() +
      '-' +
      months[datetime.getUTCMonth()] +
      '-' +
      datetime.getUTCFullYear() +
      ' ' +
      datetime.getUTCHours() +
      ':' +
      datetime.getUTCMinutes() +
      ':' +
      datetime.getSeconds() +
      ':' +
      datetime.getUTCMilliseconds()
    );
  }

  dragstarted(sim: any, d: any) {
    //console.log(d, sim, d3);
    if (!d.active) {
      console.log('restart', sim);
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(sim: any, d: any) {
    d.fx = sim.x;
    d.fy = sim.y;
  }

  dragended(sim: any, d: any) {
    if (!d.active) {
      console.log('restart', sim);
      this.simulation.alphaTarget(0);
    }
    d.fx = undefined;
    d.fy = undefined;
  }

  reloadData() {
    this.thresh = 100;
    console.log('in refresh');
    if (this.nodes) {
      this.nodes.remove();
      this.links.remove();
    }
    if (this.linklabels) {
      this.linklabels.remove();
    }
    this.getWFTitle();
  }

  Update_Coordinates() {}

  CloseJourney() {
    this.visible = false;
    this.Workflow_api.JorneyGraphVisibility.next(this.visible);
  }

  viewTimeline() {
    this.TimelineClickFlag = true;
    this.TimelineDataArr = [];
    //console.log("In DrawTimeline ::", this.NodeData);
    this.TimelineDataArrLength = this.NodeData.length;
    for (let i = 0; i < this.NodeData.length; i++) {
      this.TimelineDataArr.push({
        Queue_Name: this.NodeData[i].value,
        Proccessed_By: this.NodeData[i].user,
        TimeStamp: this.NodeData[i].timestamp,
        Status: this.NodeData[i].status,
      });
    }
  }
  CloseTimeline() {
    this.TimelineClickFlag = false;
  }
}
