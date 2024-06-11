import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkflowUCPService } from 'src/app/services/workflow-ucp.service';

@Component({
  selector: 'app-more-filters',
  templateUrl: './more-filters.component.html',
  styleUrls: ['./more-filters.component.scss']
})
export class MoreFiltersComponent implements OnInit {

  @Output() closemf = new EventEmitter<any>();
  @Output() filterdata = new EventEmitter<any>();
  @Input() moreFiltersTbl:any;
  Msg:string;
  comparatorList = ["", "=", "LIKE", "!=", "IN"];

  constructor(private wfs:WorkflowUCPService) { }

  ngOnInit(): void {
    console.log("moreFiltersTbl--",this.moreFiltersTbl)
  }

  closepopup() {
    // console.log("close")
    this.Msg = ''
    this.closemf.emit();
   }

    applyFilters () {
    //dispatch(setIsFilterActive(true));
    this.Msg = "Filter(s) Applied Successfully"
   

    let filterQuery = this.wfs.customFilter;
    this.moreFiltersTbl.forEach((filterRow) => {
      if (filterRow["checked"]) {
        let prevClause = "";
        let newClause =
          filterRow["dbColumn"] +
          this.constructWhereClause(
            filterRow["comparator"],
            filterRow["value"],
            filterRow["dataType"]
          ) +
          " ";
        if (filterQuery.includes(filterRow["dbColumn"])) {
          if (
            filterQuery
              .substring(
                filterQuery.indexOf(filterRow["dbColumn"]),
                filterQuery.length
              )
              .includes("AND")
          ) {
            prevClause = filterQuery.substring(
              filterQuery.indexOf(filterRow["dbColumn"]),
              filterQuery.indexOf("AND")
            );
          } else {
            prevClause = filterQuery.substring(
              filterQuery.indexOf(filterRow["dbColumn"]),
              filterQuery.length
            );
          }

          filterQuery = filterQuery.replaceAll(prevClause, newClause);
        } else {
          if (filterQuery.length) {
            filterQuery +=
              " AND " +
              " " +
              filterRow["dbColumn"] +
              this.constructWhereClause(
                filterRow["comparator"],
                filterRow["value"],
                filterRow["dataType"]
              );
          } else {
            filterQuery =
              filterRow["dbColumn"] +
              this.constructWhereClause(
                filterRow["comparator"],
                filterRow["value"],
                filterRow["dataType"]
              );
          }
        }
      }
    });

    this.wfs.customFilter = filterQuery

    console.log("filterQuery---",filterQuery)

    this.filterdata.emit();
   
    // dispatch(
    //   getDataFromUCPCustomerFilterAPICall(
    //     selectedWorkflow,
    //     from_Date,
    //     to_Date,
    //     datefilterName,
    //     selectedQueue.QM_ID,
    //     pageNo,
    //     rowsPerPage,
    //     filterQuery
    //   )
    // );
  };

 constructWhereClause  (comparator, value, dataType) {
    let whereClause = "";
    switch (comparator) {
      case "!=":
        whereClause += whereClause + " <> " + "'" + value + "'";
        break;
      case "LIKE":
        whereClause += whereClause + " LIKE " + "'%" + value + "%'";
        break;
      case "IN":
        let inClause = "(";
        let includeList = value.split(",");

        includeList.forEach((val) => {
          inClause += "'" + val + "',";
        });
        inClause = inClause.substring(0, inClause.length - 1);
        inClause += ")";

        whereClause += whereClause + " IN " + inClause;
        break;
      default:
        if (dataType === "DATETIME") {
          whereClause +=
            whereClause +
            " " +
            comparator +
            " " +
            "CONVERT(DATE,'" +
            value +
            "')";
        } else {
          whereClause +=
            whereClause + " " + comparator + " " + "'" + value + "'";
        }
        break;
    }
    return whereClause;
  };

  handleNotionalSuffix (value)  {
    let amtPortion = parseInt(value.toString().substr(0, value.length - 1));
    let suffix = value.toString().charAt(value.length - 1);
    suffix = suffix.toUpperCase();
    switch (suffix) {
      case "K":
        return amtPortion * 1000;
        break;
      case "M":
        return amtPortion * 1000000;
        break;
      case "B":
        return amtPortion * 1000000000;
        break;
      case "T":
        return amtPortion * 1000;
        break;
      case "L":
        return amtPortion * 100000;
        break;
      case "P":
        return amtPortion / 100;
        break;
      default:
        return value;
        break;
    }
  };

  setValue(event, index)  {
    this.moreFiltersTbl[index].checked = true;
    if (this.moreFiltersTbl[index]["dataType"].includes("NUMERIC")) {
      this.moreFiltersTbl[index].value = this.handleNotionalSuffix( this.moreFiltersTbl[index].value);
      event.target.value = this.handleNotionalSuffix( this.moreFiltersTbl[index].value);
    }
  };

  clearFilters()
  {
    this.Msg = 'Filter(s) cleared successfully'
    this.wfs.customFilter = ''
    this.moreFiltersTbl.forEach((element) => {
      element.checked = false;
      element.comparator = "";
      element.value = "";
    });
    this.filterdata.emit();
  }


}
