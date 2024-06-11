var createdProductTile = "";

// Set tiles Counter To Deafult / 19 Oct 2021

var counterFXTRF = 1;
var counterFXAQ = 1;
var counterFXDQ = 1;
var counterFXPivot = 1;
var counterFXStrategies = 1;  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
var counterFXOptions = 1; //LGTGTWINT-1880  || Chaitanya M  || 04 Jul 2023

var _addtileflag= false;
//LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
var Public_YNflag ="N";  
var _templatetype=""; 
//End

// Function for Mail All functionality for FXD payoffs | LGTGTWINT-1462
var ResponseFXAQ=[]; 
var ResponseFXPivot=[];
var ResponseFXTRF=[];
var ResponseFXDQ=[];
var ResponseFXStrategies=[];  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
var ResponseFXOptions=[];  //LGTGTWINT-1880  || Chaitanya M || 22 Jun 2023

//End

var _setpublicYN =""; // LGTGTWINT-1779 Public checkbox to be default checked for Public portfolios | Chaitanya M | 28 March 2023

//LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 04 April 2023
//START
var _UpdateFlagFXAQ = false; 
var _UpdateFlagFXDQ = false;
var _UpdateFlagFXTRF = false;
var _UpdateFlagFXPivot = false;
var _UpdateFlagFXO = false; // LGTGTWINT-1880 |Chaitanya M | 17-June -2023
var _UpdateFlagFXStrategies = false; // LGTGTWINT-1880 |Chaitanya M | 17-June -2023

var _notionalccychangedFXAQ = false;  
var _notionalccychangedFXDQ = false;
var _notionalccychangedFXTRF = false;
var _notionalccychangedFXPIVOT = false;
var _notionalccychangedFXO = false;// LGTGTWINT-1880 |Chaitanya M | 17-June -2023
var _notionalccychangedFXStrategies= false;// LGTGTWINT-1880 |Chaitanya M | 17-June -2023
//END

var mailedcount = 0; //LGTCLI-380 | Chaitanya M | 19 April 2023

var mailedprodcts=[]; // LGTCLI-399 || Chaitanya M | 15 May 2023

var cloneTileFXD=false; // LGTGTWINT-2186 | Chaitanya M | 07 Jul 2023  
//END

localStorage.setItem("css", "Black");

var zoomFlag = false;
var idUniv = "";
$("#DivOverlay").hide();

function startLoader() {
  try{

    $("#commonoverlay").show();
    $("#commonoverlay").addClass("commonloader");

  }catch(er){
    console.log(er.message);
  }
}

function endLoader() {
  try{

    $("#commonoverlay").removeClass("commonloader");
    $("#commonoverlay").hide();

  }catch(er){
    console.log(er.message);
  }

}

function SettingPanel(that, event) {
  try {
    $("#SettingPanel").slideToggle();
    $("#DivOverlay").toggle();
    if ($("#bgImagesDiv")[0].style.display == "block") {
      $("#bgImagesDiv").hide();
    }
  } catch (error) {
    console.log(error.message);
  }
}

function tenorinputvalidator(e) {
  try {
    var k;
    document.all ? (k = e.keyCode) : (k = e.which);
    return (
      k == 77 || k == 89 || k == 8 || k == 109 || k == 121 || (k > 47 && k < 58)
    );
  } catch (er) {
    console.log(er.message);
  }
}

//<Shekhar 29-Aug-2019>

var imageArr = [];

function getAllImages() {
  try {
    var imageFolder = "assets/Instant-Pricer/App_Resorces/Backgrounds";
    imageArr = [];
    $.ajax({
      url: imageFolder,
      async: false,
      success: function (imageData) {
        $(imageData)
          .find("a")
          .attr("href", function (i, val) {
            if (val.match(/\.(jpe?g|png)$/)) {
              var temp = val.split("/");
              imageArr.push(temp[temp.length - 1]);
            }
          });
      },
    });
  } catch (error) {
    console.log(error.message);
  }
}

$("#SettingPanel li").click(function (i) {
  CSSPath = $(i.currentTarget).attr("title");
  $("#CADB_MainCSS").attr("href", CSSPath);
  SetIMGPath(this.innerText);

  if ($(i.currentTarget).attr("title") == "App_Themes/CADB_Monochrome.css") {
    $("#bgImagesDiv").empty();
    getAllImages();
    for (i = 0; i < imageArr.length; i++) {
      $("#bgImagesDiv").append(
        "<div onclick='changeBackground(this)' class='bgImagesSel'> </div>"
      );
      var len = $("#bgImagesDiv").find(".bgImagesSel").length;
      $("#bgImagesDiv").find(".bgImagesSel")[len - 1].style.backgroundImage =
        "url(http://finiqmbappnsk2683.cloudapp.net/FinIQ-Maple-API.com/App_Resorces/Backgrounds/" +
        imageArr[i] +
        ")";
    }
    $("#bgImagesDiv").show(2000);
  }
});

function changeBackground(that) {
  try {
    if (typeof that == "object") {
      $(".navIcon, td.sorting, .sidenav, .ui-widget.ui-widget-content").css(
        "background-image",
        that.style.backgroundImage
      );
      $("#hdnBackgroundSelected").val(that.style.backgroundImage);
    } else {
      $("td.sorting").css(
        "background-image",
        $("#hdnBackgroundSelected").val()
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

function SetIMGPath(theme) {
  try {
    localStorage.setItem("css", theme);
    if (
      theme == "Black" ||
      theme == "White" ||
      theme == "Theme1" ||
      theme == "Theme2" ||
      theme == "Silver" ||
      theme == "WhiteBlue" ||
      theme == "RedTheme"
    ) {
      $(".loader").attr("src", "assets/Instant-Pricer/App_Resorces/loader.gif");
      $(".navIcon, td.sorting, .sidenav, .ui-widget.ui-widget-content").css(
        "background-image",
        ""
      );
    } else if (theme == "Moon") {
      $(".ui-widget.ui-widget-content").css("background-image", "");
      $(".loader").attr("src", "assets/Instant-Pricer/App_Resorces/loader_Night.gif");
    } else if (theme == "White" || theme == "Blue" || theme == "Green") {
      $(".ui-widget.ui-widget-content").css("background-image", "");
      $(".loader").attr("src", "assets/Instant-Pricer/App_Resorces/loader_Day.gif");
    }

    if (
      theme == "Black" ||
      theme == "WhiteBlue" ||
      theme == "RedTheme" ||
      theme == "Default Theme"
    ) {
      imgFolder = "Blue";
      $("img").each(function (i, j) {
        $(j).prop("src", $(j).prop("src").replace("Night", "Blue"));
        $(j).prop("src", $(j).prop("src").replace("Silver", "Blue"));
        $(j).prop("src", $(j).prop("src").replace("yellow", "Blue"));
      });
      if (theme == "Black") {
        $(".ui-widget.ui-widget-content").css({
          "background-color": "#232323",
        });
      }
      if (theme == "White") {
        $(".ui-widget.ui-widget-content").css({
          "background-color": "#ffffff",
        });
      }
    } else if (
      theme == "Silver" ||
      theme == "Green" ||
      theme == "Theme1" ||
      theme == "Theme2" ||
      theme == "Monochrome" ||
      theme == "Blue"
    ) {
      imgFolder = "Night";
      $("img").each(function (i, j) {
        $(j).prop("src", $(j).prop("src").replace("Blue", "Night"));
        $(j).prop("src", $(j).prop("src").replace("Silver", "Night"));
        $(j).prop("src", $(j).prop("src").replace("yellow", "Night"));
      });

      if (theme == "Theme1" || theme == "Theme2" || theme == "Silver") {
        imgFolder = "Blue";
        $(".btnTD img").each(function (i, j) {
          $(j).prop("src", $(j).prop("src").replace("Night", "Blue"));
        });
      }

      if (theme == "Theme2") {
        imgFolder = "Blue";
        $(".btnTD img, .navIcon img").each(function (i, j) {
          $(j).prop("src", $(j).prop("src").replace("Night", "Blue"));
        });
        $(".ui-button").css({
          "BACKGROUND-COLOR": "#f8f9fa",
        });
        $(".ui-widget.ui-widget-content").css({
          "background-color": "#f8f9fa",
        });
      }
      if (theme == "Green") {
        $(".ui-widget.ui-widget-content").css({
          "background-color": "#263319",
        });
      }
      if (theme == "Blue") {
        $(".ui-widget.ui-widget-content").css({
          "background-color": " #0a2c38",
        });
      }
      if (theme == "Moon" || theme == "theme1") {
        $(".ui-widget.ui-widget-content").css({
          "background-color": "#f8f9fa",
        });
      }
      if (theme == "Silver") {
        $(".reportsimg").each(function (i, j) {
          $(j).prop("src", $(j).prop("src").replace("Night", "Blue"));
        });
      }
    }
    //ADDED SILVER FOLDER ICON TO WHITE THEME ( Tushar Patil  3/3/2020)
    else if (theme == "White" || theme == "Glass") {
      imgFolder = "Silver";
      $("img").each(function (i, j) {
        $(j).prop("src", $(j).prop("src").replace("Blue", "Silver"));
        $(j).prop("src", $(j).prop("src").replace("Night", "Silver"));
        $(j).prop("src", $(j).prop("src").replace("yellow", "Silver"));
      });
      if (theme == "White") {
        $(".ui-widget.ui-widget-content").css({
          "background-color": "#ffffff",
        });
      }
    } else if (theme == "Yellow") {
      imgFolder = "yellow";
      $("img").each(function (i, j) {
        $(j).prop("src", $(j).prop("src").replace("Blue", "yellow"));
        $(j).prop("src", $(j).prop("src").replace("Night", "yellow"));
        $(j).prop("src", $(j).prop("src").replace("Silver", "yellow"));
      });
      if (theme == "Yellow") {
        $(".ui-widget.ui-widget-content").css({
          "background-color": "#000",
        });
      }
    }
  } catch (er) {
    console.log(er.message);
  }
}

function closePopup() {
  try {
    if (zoomFlag == true) {
      zoomIn(idUniv);
    }
    $("#bodyDiv").hide();
    if (!zoomFlag) {
      $("#DivOverlay").hide();
    }
    // $("body")[0].style.overflow = "scroll"; //Bhavya 05-09-2019 LGTGTWINT-687
    $("#SettingPanel").hide();
  } catch (error) {
    console.log(error.message);
  }
}

function zoomIn(that, event, id) {
  try {
    that = that.id == undefined ? $("#zoom" + that)[0] : that;
    TileId = that.id.match(/\d+$/)[0];
    id = TileId;
    var url =
      $("#zoom" + id)[0].baseURI + "assets/Instant-Pricer/App_Resorces/Blue/zoomIn.png";
    pinCount = 1;
    if (
      $("#zoom" + id)[0].src.split("/")[
        $("#zoom" + id)[0].src.split("/").length - 1
      ] == "zoomIn.png"
    ) {
      if (idUniv == "") {
        $("#tbod").find("#td" + id).addClass("zoom");
        $("#tbod").find("#td" + id).after("<td class='sorting' id='tdNew'></td>");
        $(".sorting").not("#td" + id).fadeTo(500, "0.4");
        $(".sorting").not("#td" + id).addClass("filter");
        $("#td" + id).fadeTo(200, "1");
        $("#td" + id).removeClass("zoomOut");
        $("#td" + id).addClass("zoomIn");
        $("#zoom" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/zoomOut.png";
        $("#pin" + id)[0].style.display = "none";
        $("#addTile" + id)[0].style.display = "none";
        $("#removeTile" + id)[0].style.display = "none";
        $("#zoom" + id)[0].style.marginTop = "30px"; //LGTGTWINT-1282 Instant Pricing : Not able to minimize template once expanded

        zoomFlag = true;
        idUniv = id;
        $("#DivOverlay").show();
        $("body")[0].style.overflow = "hidden"; //Bhavya 05-09-2019
      } else {
        $("#tbod").find("#td" + idUniv).removeClass("zoom");
        $("#tbod").find("#tdNew").remove();
        $("#td" + idUniv).removeClass("zoomIn");
        $("#td" + idUniv).addClass("zoomOut");
        $("#td" + idUniv).removeAttr("style");
        $("#zoom" + idUniv)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/zoomIn.png";
        $("#zoom" + idUniv)[0].style.marginTop = "0px"; //LGTGTWINT-1282 Instant Pricing : Not able to minimize template once expanded

        $(".sorting").find(".pinBtn").each(function (i) {
          this.src = "assets/Instant-Pricer/App_Resorces/Blue/pin.png";
        });
        $("#DivOverlay").show();
        $("body")[0].style.overflow = "hidden"; //Bhavya 05-09-2019
        setTimeout(function () {
          $("#tbod").find("#td" + id).addClass("zoom");
          $("#tbod").find("#td" + id).after("<td class='sorting' id='tdNew'></td>");
          $(".sorting").not("#td" + id).fadeTo(500, "0.4");
          $(".sorting").not("#td" + id).addClass("filter");
          $("#td" + id).fadeTo(200, "1");
          $("#td" + id).removeClass("zoomOut");
          $("#td" + id).addClass("zoomIn");
          $("#zoom" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/zoomOut.png";
          $("#zoom" + id)[0].style.marginTop = "30px"; //LGTGTWINT-1282 Instant Pricing : Not able to minimize template once expanded

          zoomFlag = true;
          idUniv = id;
        }, 300);
        $("#pin" + id)[0].style.display = "none";
        $("#addTile" + id)[0].style.display = "none";
        $("#removeTile" + id)[0].style.display = "none";
      
      }
      SetIMGPath(localStorage.getItem("css"));
    } else {
      $("#tbod").find("#td" + id).removeClass("zoom");
      $("#tbod").find("#tdNew").remove();
      $(".sorting").not("#td" + id).removeClass("filter");
      $("#td" + id).removeClass("zoomIn");
      $("#td" + id).addClass("zoomOut");
      $("#td" + id).removeAttr("style");
      $("#zoom" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/zoomIn.png";
      $("#zoom" + id)[0].style.marginTop = "0px"; //LGTGTWINT-1282 Instant Pricing : Not able to minimize template once expanded

      $(".sorting").find(".pinBtn").each(function (i) {
        this.src = "assets/Instant-Pricer/App_Resorces/Blue/pin.png";
      });
      $("#pin" + id)[0].style.display = "inline-block";
      $("#addTile" + id)[0].style.display = "inline-block";
      $("#removeTile" + id)[0].style.display = "inline-block";
      unpinAll();
      zoomFlag = false;
      idUniv = "";
      $("#DivOverlay").hide();
      $("#OverlayBody").hide(); // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
      SetIMGPath(localStorage.getItem("css"));
      changeBackground("");
      // $("body")[0].style.overflow = "scroll"; //Bhavya 05-09-2019 LGTGTWINT-687
      //To hide pop-up when we click on zoom-out || Tina K || 22-Nov-2019
      if ($("#bodyDiv")[0].style.display == "block") {
        $(".popup").each(function () {
          this.style.display = "none";
        });
      } //End
    }
  } catch (error) {
    console.log(error.message);
  }
}

function mainCB1(that, event, id) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    id = TileId;

    var front = "front" + id;
    var back = "back" + id;
    var cb = "cb" + id;
    var card = "card" + id;
    if (!$("#" + cb)[0].checked) {
      $("#graph" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/hand.png";
      $("#graph" + id)[0].title = "Pricer";
      $("#" + card).css({transform: "rotateX(180deg)",});
      $("#" + back).css({display: "block",});
      $("#" + front).css({display: "none",});
      $("#" + cb)[0].checked = true;
    } else {
      $("#graph" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/graph.png";
      $("#graph" + id)[0].title = "Historical Data";
      $("#" + card).css({transform: "rotateX(0deg)",});
      $("#" + back).css({display: "none",});
      $("#" + front).css({display: "block",});
      $("#" + cb)[0].checked = false;
    }
    SetIMGPath(localStorage.getItem("css"));
  } catch (error) {
    console.log(error.message);
  }
}

var orderArray = [];
var elements = document.getElementsByClassName("Divshadow");

function sortTbody() {
  try {
    $(function () {
      $("#tbod")
        .sortable({
          items: ".sorting",
          update: function () {
            var arrayOrderStr = $("#tbod").sortable("toArray").toString();
            var arrayOrder = arrayOrderStr.split(",");
            orderArray = [];
            for (i = 0; i < arrayOrder.length; i++) {
              orderArray[i] = arrayOrder[i].substring(2, arrayOrder[i].length);
            }
          },
          stop: function () {},
        })
        .disableSelection();
    });
  } catch (error) {
    console.log(error.message);
  }
}

$(document).ready(function () { //LGTGTWINT-1252 Instant pricer Not Responding message


  $("#overlayer").fadeOut("fast");
  $(".spinner").fadeOut("fast");

  setTimeout(function () {
    document.getElementsByClassName("navIcon")[0].style.display = "block";
    $("#mainContent").addClass("marginTBL");
    // $("body")[0].style.overflow = "scroll"; //LGTGTWINT - 687 
  }, 0);

  EntityID = sessionStorage.getItem("HomeEntityID");

  userName = sessionStorage.getItem("Username");

  password = sessionStorage.getItem("FXD_Password");

  _sessiontoken =  sessionStorage.getItem('SessionToken'); // LGTGTWINT-2146 || RizwanS || 22 Jun 2023

  getMAPLEAccessControl(); //LGTGTWINT-1252 Instant pricer Not Responding message

  loadUserTemplates();

  if (document.getElementById("templateList").firstChild != undefined) {
    loadTemplate(
      "",
      document.getElementById("templateList").firstChild.children[1].innerText  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
    );
  }
  $("#SpanProfileName").append(userName.toUpperCase());
  $("#SpanProfileName_Title_Name").empty().append(userName.toUpperCase());


  $(".cbVisibility").change(function () {
    $(".cbVisibility:checked").length ==
    $("#MAPLEACTBL").find("input.cbVisibility").length
      ? $("#cbSelectAll").prop("checked", true)
      : $("#cbSelectAll").prop("checked", false);
  });

  $("#chk_NEW").change(function () {
    if (this.checked) {
      $(".cbVisibility").each(function () {
        this.checked = false;
      });
      $("#cbSelectAll").prop("checked", false);

      $("#TemplateName").val("").focus().select();
    } else {
      checkandUncheck();
    }
  });

  
  $("#DivOverlay").on("click", function () {
    $("#dialogSelect").hide();  // LGTGTWINT-945 Edit template not working properly for maple instant pricer
    $("#dialog-confirm").hide(); // LGTGTWINT-945 Edit template not working properly for maple instant pricer
    $(".removable").removeClass("filter");
    $("#DivOverlay")[0].style.opacity = "0.5"; //Bhavya 05-09-2019
    // $("body")[0].style.overflow = "scroll"; //Bhavya 05-09-2019 //LGTGTWINT - 687
    $(".popup").hide();
    $("#booktradecashx").hide(); // Info Message Template Dialog Box Changes - Runal 
    if (idUniv != "") {
      zoomIn(idUniv);
    }
  });
  

  $(".btnCB").each(function () {
    $(this).hover(function () {
      $(this).show();
    });
  });
  sortTbody();
});

$("#depositClear").on("click", function () {
  $("#depositOrderDetails table tr:not(:first-child)").empty();
});

$("#ClosePopup").on("click", function () {
  // Info Message Template Dialog Box Changes - Runal 
  $("#booktradecashx").hide();
  $(".removable").removeClass("filter");
  $("#DivOverlay").hide();
  
  $("#OverlayBody").hide(); // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
});

var checkedFlag = false;
var toggle = false;

function unpinAll() {
  try {
    if (pinCount == 0) {
      return false;
    }
    pinCount = 0;
    $(".sorting").fadeTo(800, "1");
    $(".pinBtn").each(function () {
      $(this)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/pin.png";
    });
  } catch (error) {
    console.log(error.message);
  }
}

function openNav(id) {
  try {
    if (!zoomFlag || id == idUniv) {
      $("#graph" + id).toggle(500);
      $("#pin" + id).toggle(500);
      $("#zoom" + id).toggle(500);
    }
  } catch (error) {
    console.log(error.message);
  }
}

//LGTGTWINT-1472 | Chaitanya M | 5 May 2023
function setDef(that) {
  try { 

    _addtileflag = false; // Added for disabling clone tile flag. LGTGTWINT-2186 | Chaitanya M | 21 July 2023
    loadTemplate("", $('#Span30').text().trim());
    // location.reload(true);
  } catch (error) {
    console.log(error.message);
  }
}

//End
var pinCount = 0;

function pin(that, event, id) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    id = TileId;

    var url = $("#pin" + id)[0].baseURI + "assets/Instant-Pricer/App_Resorces/Blue/pin.png";
    if (!zoomFlag) {
      if (
        $("#pin" + id)[0].src.split("/")[
          $("#pin" + id)[0].src.split("/").length - 1
        ] == "pin.png"
      ) {
        if (pinCount == 0) {
          $(".sorting").not("#td" + id).fadeTo(800, "0.4");
          $("#td" + id).fadeTo(400, "1");
          $("#pin" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/unpin.png";
          pinCount += 1;
        } else {
          $("#td" + id).fadeTo(400, "1");
          $("#pin" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/unpin.png";
          pinCount += 1;
        }
      } else {
        pinCount -= 1;
        if (pinCount > 0) {
          $("#pin" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/pin.png";
          $("#td" + id).fadeTo(800, "0.4");
        } else {
          $(".sorting").fadeTo(800, "1");
          $("#pin" + id)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/pin.png";
        }
      }
    }
    SetIMGPath(localStorage.getItem("css"));
  } catch (error) {
    console.log(error.message);
  }
}

function modeChange(img) {
  try {
    if (img.alt == "Night") {
      img.alt = "Day";
      img.src = "assets/Instant-Pricer/App_Resorces/Blue/sun.png";
      $('link[href="App_Themes/CADB_WhiteTheme.css"]').attr(
        "href",
        "App_Themes/CADB_Night_Mode.css"
      );
      document.getElementById("mainContent").style.marginTop = "50px";
    } else {
      img.alt = "Night";
      img.src = "assets/Instant-Pricer/App_Resorces/Blue/moon.png";
      document.getElementById("mainContent").style.marginTop = "50px";
      $('link[href="App_Themes/CADB_Night_Mode.css"]').attr(
        "href",
        "App_Themes/CADB_WhiteTheme.css"
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

var glowFlag = true;

function blink() {
  try {
    if (glowFlag) {
      var elems = document.querySelectorAll(".GlowPrice_Red");
      [].forEach.call(elems, function (el) {
        el.classList.remove("GlowPrice_Red");
        el.classList.add("noGlow");
      });
      glowFlag = false;

      // $("#blink")[0].src = "assets/Instant-Pricer/App_Resorces/Blue/blinkOff.png";
    } else {
      var elems = document.querySelectorAll(".noGlow");
      [].forEach.call(elems, function (el) {
        el.classList.remove("noGlow");
        el.classList.add("GlowPrice_Red");
      });
      glowFlag = true;
      // $("#blink")[0].src = "assets/Instant-Pricer/App_Resorces/Blue/blinkOn.png";
    }
  } catch (error) {
    console.log(error.message);
  }
}

var isFxdTemplate = false;

function flipAll() {
  try {
    if (!checkedFlag) {
      for (id = 0; id < orderArray.length; id++) {
        setTimeout(
          function (id) {
            var front = "front" + orderArray[id];
            var back = "back" + orderArray[id];
            var cb = "cb" + orderArray[id];
            var card = "card" + orderArray[id];
            $("#" + card).css({
              transform: "rotateX(180deg)",
            });
            $("#" + back).css({
              display: "block",
            });
            $("#" + front).css({
              display: "none",
            });
          },
          500 * id,
          id
        );
      }
      checkedFlag = true;
      $(".graphBtn").each(function () {
        $(this)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/hand.png";
        $(this)[0].title = "Pricer Tile";
      });
      $(".cb").each(function () {
        $(this)[0].checked = true;
      });
    } else {
      for (id = 0; id < orderArray.length; id++) {
        setTimeout(
          function (id) {
            var front = "front" + orderArray[id];
            var back = "back" + orderArray[id];
            var cb = "cb" + orderArray[id];
            var card = "card" + orderArray[id];
            $("#" + card).css({
              transform: "rotateX(0deg)",
            });
            $("#" + back).css({
              display: "none",
            });
            $("#" + front).css({
              display: "block",
            });
          },
          500 * id,
          id
        );
      }
      checkedFlag = false;
      $(".graphBtn").each(function () {
        $(this)[0].src = "assets/Instant-Pricer/App_Resorces/Blue/graph.png";
        $(this)[0].title = "Historical Data";
      });
      $(".cb").each(function () {
        $(this)[0].checked = false;
      });
    }
    SetIMGPath(localStorage.getItem("css"));
  } catch (error) {
    console.log(error.message);
  }
}

var boxWidth = $(".errorbox").width();

function slideNotification(color, message, thisTile) {
  try {
    $(thisTile).find('[id^="notify"]').css("display", "block"); //Added by SoumyaP
    $(".errorbox").animate({
      width: "313px",
      opacity: 1,
    });

    document.getElementById("inside").style.borderRadius = "10px 0px 0px 10px"; //inside
    document.getElementById("inside").style.border = "1px solid" + color;
    document.getElementById("inside").style.borderLeft = "10px solid" + color;
    $(thisTile).find('[id^="msg"]').html(message); //Added by SoumyaP
  } catch (error) {
    console.log(error.message);
  }
}

$(".openNav")
  .unbind("click")
  .click(function (e) {
    $("#bodyDiv").hide();
    if (zoomFlag == true) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    if (this.classList.value.includes("change")) {
      closeSideNav();
      return;
    }
    document.getElementById("mySidenav").style.width = "305px";
    document.getElementById("mySidenav").style.paddingLeft = "10px";
    $(".openNav").addClass("change");
    setTimeout(function () {
      document.getElementById("inputList").style.display = "block";
      document.getElementById("sideNavContent").style.display = "block";
    }, 400);
  });

function closeSideNav() {
  try {
    document.getElementById("sideNavContent").style.display = "none";
    document.getElementById("inputList").style.display = "none";
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").style.paddingLeft = "0px";
    $(".openNav").removeClass("change");
  } catch (error) {
    console.log(error.message);
  }
}
var xTime;

function priceAllProducts() {
  try {
    xTime = 0;
    var i;

    var products = [];
    var FXDProducts = FXD_TABLE; //RizwanS || LGTGTWINT-2217 Instant Pricer Gateway RFQ throttling implementation || 23 Aug 2023

    $("tr.removable>td.newlyCreated td.productName").each(function (
      index,
      element
    ) {
      products.push(element.id);
    });
    console.log(products);

    for (var t = 0; t < products.length; t++) {
      for (var t_ = 0; t_ < FXDProducts.length; t_++) {
        if (FXDProducts[t_] == products[t]) {
          isFxdTemplate = true;
        } else {
          isFxdTemplate = false;
        }
      }
    }

    if (isFxdTemplate)
      xTime = xTime + clientConfigdata.CommonMethods.priceAllRequestDelayFXD;
    else xTime = xTime + clientConfigdata.CommonMethods.priceAllRequestDelay;

    // To click all existing Price button on screen with ID:btnBestPrice
    for (i = 31; i < $("button[id^=btnBestPrice]").length; i++) {
      doSetTimeout(i);
    }

    function doSetTimeout(i) {
      if (isFxdTemplate)
        xTime = xTime + clientConfigdata.CommonMethods.priceAllRequestDelayFXD;
      else xTime = xTime + clientConfigdata.CommonMethods.priceAllRequestDelay;

      if (i == 31) {
        $("button[id^=btnBestPrice]")[i].click();
      }

      setTimeout(function () {
        if ($("button[id^=btnBestPrice]")[i + 1] != undefined)
          $("button[id^=btnBestPrice]")[i + 1].click();
        //console.log('clicked in settimeout',i+1)
      }, xTime);

      return false;
    }
  } catch (error) {
    console.log(error.message);
  }
}

function bookOrderAllProducts() {
  try {
    xTime = 0;
    var i;
    // To click all existing Price button on screen with ID:btnBestPrice
    for (i = 31; i < $(".bookReq").length; i++) {
      doSetTimeoutBookOrder(i);
      console.log(i);
    }

    function doSetTimeoutBookOrder(i) {
      xTime = xTime + 3000;
      setTimeout(function () {
        console.log(
          "Book Product Name: " +
            $($(".bookReq")[i]).parents(".sorting").find(".productName")[0]
              .innerText
        );

        // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnPrices]')[0].value != "") {
        //     $('.bookReq')[i].click();
        // }

        switch (
          $($(".bookReq")[i]).parents(".sorting").find(".productName")[0].innerText.replace(/\n/gi, "")
        ) {
          case "FI Bond":
          case "ELI":
          case "Insurance":
          case "Mutual Funds":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnQuoteID]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "ELN":
          case "FCN":
          case "AQDQ":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnfinalToken]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "Cash Equities":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=AskPrice]')[0].value != "" || $($('.bookReq')[i]).parents('.sorting').find('[id^=BidPrice]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "Deposit":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=interestRateValue]')[0].innerText != "-") {
            $(".bookReq")[i].click();
            // }
            break;
          case "Cash FX":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnUSERID]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "Strategies":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnUSERID]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "FXDCI":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnUSERID]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "BEN":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnfinalToken]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "DRA":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnfinalToken]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "Phoenix":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnfinalToken]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          case "Options":
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnfinalToken]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
          default:
            // if ($($('.bookReq')[i]).parents('.sorting').find('[id^=hdnPrices]')[0].value != "") {
            $(".bookReq")[i].click();
            // }
            break;
        }
      }, xTime);
    }
  } catch (error) {
    console.log(error.message);
  }
}

var idUnivCount = clientConfigdata.PAYOFFCOUNT.TILECOUNTER; // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
var idReplace = 1;
var productName = "CASHFX";
sortingTdClick();

function sortingTdClick() {
  try {
    $(".sorting").click(function () {
      idReplace = this.id.substring(2, this.id.length);
      productName = $(this).find(".productName")[0].id;

      switch (productName) {
        case "FIBOND":
          idFIBOND = idReplace;
          break;
        case "FXOPTION":
          idFXOPTION = idReplace;
          break;
        case "FXDCI":
          idDCI = idReplace;
          break;
        case "CASHEQUITIES":
          idCASHEQUITIES = idReplace;
          break;
        case "INSURANCE":
          idINSURANCE = idReplace;
          break;
        case "ELI":
          idELI = idReplace;
          break;
        case "DEPOSIT":
          idDEPOSIT = idReplace;
          break;
        case "MUTUALFUND":
          idMUTUALFUND = idReplace;
          break;
        case "CASHFX":
          idCASHFX = idReplace;
          break;
        case "ELN":
          idELN = idReplace;
          break;
        case "FCN":
          idFCN = idReplace;
          break;
        case "AQDQ":
          idAQDQ = idReplace;
          break;
        case "FXAQ":
          idFXAQ = idReplace;
          break;
        case "FXDQ":
          idFXDQ = idReplace;
          break;
        case "FXTRF":
          idFXTRF = idReplace;
          break;
        case "FXPIVOT":
          idFXPivot = idReplace;
          break;
        case "BEN":
          idBEN = idReplace;
          break;
        case "Phoenix":
          idPhoenix = idReplace;
          break;
        case "DRA":
          idDRA = idReplace;
          break;
        case "Options":
          idOptions = idReplace;
          break;
        case "Strategies":
          idStrategies = idReplace;
          break;
        case "RA":
          idRA = idReplace;
          break;
        case "Snowball":
          idSnowball = idReplace;
          break;
        case "WoBAutocall":
          idWoBAutocall = idReplace;
          break;
        case "AvgAutocall":
          idAvgAutocall = idReplace;
          break;
        case "ELCI":
          idELCI = idReplace;
          break;
        case "RELCI":
          idRELCI = idReplace;
          break;
        case "TwinWin":
          idTwinWin = idReplace;
          break;
        case "BEI":
          idBEI = idReplace;
          break;
        case "SPS":
          idSPS = idReplace;
          break;
        case "FCI":
          idFCI = idReplace;
          break;
        case "FXDigital":
          idFXDigital = idReplace;
          break;
        // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023  
        case "DCN":
          idDCN = idReplace;
          break;
        // END  
        case "Booster":
          idBooster = idReplace;
          break;
        case "Sharkfin":
             idSharkfin = idReplace;
             break;
        default:
          console.log("Default choice selected!");
      }
    });

    // $(".Divshadow").mousewheel(function (e, delta) {
    //   this.scrollLeft -= delta * 40;
    //   e.preventDefault();
    // }); // Commented by RizwanS as it is not used|| 24 Feb 2023

    $("#mainContent").click(function () {
      if (document.getElementById("inputList").style.display == "block") {
        closeSideNav();
      }
    });

    $("div.card").each(function (tdIndex, TD) {
      $(TD).on(
        "click change select",
        'input[type="text"], input[type="search"], radio,div.switch, select',
        function (event) {
          clearPrices(TD);
        }
      );
    });

    /******Function to ZoomOut on TabIndex change*******/
    $("[id^=Book],[id^=btnBook]").keydown(function () {
      if (event.keyCode == 9) {
        closePopup();
      }
    });

    $(".pairsPopup").click(function () {
      callPopUpFunction(this, this.id, "PAIRS");
    });

    $(".sharesPopup").click(function () {
      callPopUpFunction(this, this.id, "SHARES");
    });

    $(".tenorPopup").click(function () {
      callPopUpFunction(this, this.id, "TENORS");
    });

    $(".amtPopup").each(function () {
      $(this).click(function () {
        callPopUpFunction(this, this.id, "AMOUNTS");
      });
    });

    $(window).scroll(function () {
      var req = document.getElementById("required");
      req.style.display = "none";
    });

    $(".cb").change(function () {
      event.preventDefault();
      return false;
    });
  } catch (error) {
    console.log(error.message);
  }
}

var EntityID = "";
var userName = "";
var maxProductcount = 8;
var countCASHFX = [];
var countELI = [];
var countFXOPTION = [];
var countFIBOND = [];
var countELN = [];
var countFCN = [];
var countAQ = [];
var countFXDCI = [];
var countINSURANCE = [];
var countCASHEQUITIES = [];
var countMUTUALFUND = [];
var countDEPOSIT = [];
var countFXAQ = [];
var countFXDQ = [];
var countFXTRF = [];
var countFXPivot = [];
var countBEN = [];
var Phoenix = [];
var DRA = [];
var Options = [];
var Strategies = [];
var RA = [];
var Snowball = [];
var WoBAutocall = [];
var AvgAutocall = [];
var ELCI = [];
var RELCI = [];
var TwinWin = [];
var BEI = [];
var SPS = [];
var FCI = [];
var countFXDigital = [];
var countDCN = []; // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
var countBooster = [];
var countSharkfin = [];

var isNewTile = false;

// Added For JIRA ID -NT1FIN47-447 // 05 April 2022

$(document).mouseup(function (e) {
  if (!$(".EQCOpt").is(e.target) && $(".EQCOpt").has(e.target).length === 0) {
    $(".EQCOpt").hide();
  }

  // LGTCLI-447 Chaitanya M | 02 Aug 2023
  if (!$(".FXDOpt").is(e.target) && $(".FXDOpt").has(e.target).length === 0) {
    $(".FXDOpt").hide();
  }
  //End
  
});

function btnEQCOptions(that, event, id) {
  try {
    // let ddlKOKItype="";
    // let SolveFor="";

    TileId = that.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);
    imgthat = that;
    //Changed the order for sync with Flexi pricer. | LGTCLI-37| Chaitanya M | 15 Feb 2023
    popuplist = `<li onclick="addTile(imgthat, event, id,this)">Clone</li>
        <li onclick="addTile(imgthat, event, id,this)">+1 % Strike</li>
        <li onclick="addTile(imgthat, event, id,this)">-1 % Strike</li>
        <li onclick="addTile(imgthat, event, id,this)">+1 % Upfront</li>
        <li onclick="addTile(imgthat, event, id,this)">-1 % Upfront</li>
        <li onclick="addTile(imgthat, event, id,this)">+1 Tenor</li>
        <li onclick="addTile(imgthat, event, id,this)">-1 Tenor</li>
        <li onclick="addTile(imgthat, event, id,this)">+0.25 % IB Price</li>
        <li onclick="addTile(imgthat, event, id,this)">-0.25 % IB Price</li>
        <li onclick="addTile(imgthat, event, id,this)">+1 % Coupon</li>
        <li onclick="addTile(imgthat, event, id,this)">-1 % Coupon</li>
        <li onclick="addTile(imgthat, event, id,this)">+1 % Client Yield</li>  
        <li onclick="addTile(imgthat, event, id,this)">-1 % Client Yield</li>
        <li onclick="addTile(imgthat, event, id,this)">+1 % KO</li>
        <li onclick="addTile(imgthat, event, id,this)">-1 % KO</li>        
        <li onclick="addTile(imgthat, event, id,this)">+5 % KI</li>
        <li onclick="addTile(imgthat, event, id,this)">-5 % KI</li>     
        `;
        
    // added on 29/04/2022
    $(thisTile).find("[id^='EQCOpt']").empty();
    $(thisTile).find("[id^='EQCOpt']").append(popuplist);
    $(thisTile).find("[id^='EQCOpt']").toggle();

    let optionparts = $(thisTile).find("[id^='EQCOpt']").html();

    let tempop = $.parseHTML(optionparts);

    if ($("#td" + TileId).find(".productName")[0].id == "FCN") {
      // added on 29/04/2022
      SolveFor = $(thisTile).find('[id^="ddlSolveForFCN"]').val().split(" ")[0];
      ddlKOKItype = $(thisTile).find('[id^="ddlKOKIType"]').val();

      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("Upfront") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
          if (
            (ddlKOKItype.includes("NOKI") && $(this).text().includes("KI")) ||
            (ddlKOKItype.includes("NOKO") && $(this).text().includes("KO"))
          ) {
            $(this).remove();
          }
        });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "DRA") {
      // added on 29/04/2022
      SolveFor =
        $(thisTile).find('[id^="ddlSolveFor"]').val().split(" ")[0] ==
        "Conversion_Strike"
          ? $(thisTile).find('[id^="ddlSolveFor"]').val().split("_")[1]
          : $(thisTile).find('[id^="ddlSolveFor"]').val().split(" ")[0];
      ddlKOKItype = $(thisTile).find('[id^="ddlDRAType"]').val();
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("Upfront") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
          if (ddlKOKItype.includes("NOKI") && $(this).text().includes("KI")) {
            $(this).remove();
          }
        });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "Phoenix") {
      // added on 29/04/2022
        SolveFor = $(thisTile).find('[id^="ddlSolveForPhoenix"]').val().split(" ")[0];
        ddlKOKItype = $(thisTile).find('[id^="ddlKOKIType"]').val();
  
        $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
            if (
              $(this).text().includes("Upfront") ||
              $(this).text().includes("Client Yield") ||
              $(this).text().includes(SolveFor)
            ) {
              $(this).remove();
            }
            if (
              (ddlKOKItype.includes("NOKI") && $(this).text().includes("KI")) ||
              (ddlKOKItype.includes("NOKO") && $(this).text().includes("KO"))
            ) {
              $(this).remove();
            }
        });

    }
    if ($("#td" + TileId).find(".productName")[0].id == "ELN") {
      // added on 29/04/2022

   
      SolveFor = $(thisTile).find('[id^="solveForELN"]').val().split(" ")[0];
      ddlKOKItype = $(thisTile).find('[id^="ddlELNCFreq"]').val();
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if ( $("#td" + TileId).find('[id^="solveForELN"]').val().includes("IB")) {

            if (
              $(this).text().includes("Client Yield") ||
              $(this).text().includes(SolveFor)
            ) {
              $(this).remove();
            }
          }
          // Added By RizwanS || LGTGTWINT-458 || 01 Dec 2022
          else{
            if($(this).text().includes("IB Price") ||  $(this).text().includes(SolveFor)){
              $(this).remove();
            }
          }

          if ( $(this).text().includes("Coupon") || $(this).text().includes("KI") || $(this).text().includes("Upfront") || $(this).text().includes(SolveFor)) {
            $(this).remove();
          }

          if (ddlKOKItype.includes("Simple") && $(this).text().includes("KO")) {
            $(this).remove();
          }
        });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "AQDQ") {
      // added on 29/04/2022
      SolveFor = $(thisTile).find('[id^="solveForAQDQ"]').val().split(" ")[0];
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("IB") ||
            $(this).text().includes("Coupon") ||
            $(this).text().includes("KI") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
        });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "ELI") {
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("IB") ||
            $(this).text().includes("Upfront") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
        });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "BEN") {
      // added on 29/04/2022
      SolveFor =
        $(thisTile).find('[id^="ddlSolveFor"]').val().split(" ")[0] ==
        "Conversion_Strike"
          ? $(thisTile).find('[id^="ddlSolveFor"]').val().split("_")[1]
          : $(thisTile).find('[id^="ddlSolveFor"]').val().split(" ")[0];
      ddlKOKItype = $(thisTile).find('[id^="ddlBENType"]').val();
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("Upfront") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
          if (
            ddlKOKItype.includes("Vanilla") &&
            $(this).text().includes("KO")
          ) {
            $(this).remove();
          }

          if (
            ddlKOKItype.includes("Vanilla") &&
             $(this).text().includes("KI")
          ) {
            $(this).remove();
          }

          if (
            ddlKOKItype.includes("European") &&
            $(this).text().includes("KO")
          ) {
            $(this).remove();
          }

      });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "Options") {
      // added on 29/04/2022
      SolveFor = $(thisTile).find('[id^="solveForOptions"]').val().split(" ")[0];
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("IB") ||
            $(this).text().includes("Coupon") ||
            $(this).text().includes("KI") ||
            $(this).text().includes("KO") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
        });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "TwinWin") {
      // added on 29/04/2022
      SolveFor = $(thisTile).find('[id^="ddlSolveForTwinWin"]').val().split(" ")[0];
      ddlKOKItype = $(thisTile).find('[id^="ddlKOKIType"]').val();

      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("Upfront") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
          if (
            (ddlKOKItype.includes("NOKI") && $(this).text().includes("KI")) ||
            (ddlKOKItype.includes("NOKO") && $(this).text().includes("KO"))
          ) {
            $(this).remove();
          }
        });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "DCN") {
      // added on 29/04/2022
      SolveFor =
        $(thisTile).find('[id^="ddlSolveFor"]').val().split(" ")[0] ==
        "Conversion_Strike"
          ? $(thisTile).find('[id^="ddlSolveFor"]').val().split("_")[1]
          : $(thisTile).find('[id^="ddlSolveFor"]').val().split(" ")[0];
      ddlKOKItype = $(thisTile).find('[id^="ddlDCNType"]').val();
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("Upfront") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
          if (
            ddlKOKItype.includes("NOKI") &&
            $(this).text().includes("KO")
          ) {
            $(this).remove();
          }

          if (
            ddlKOKItype.includes("NOKI") &&
             $(this).text().includes("KI")
          ) {
            $(this).remove();
          }

          if (
            ddlKOKItype.includes("European") &&
            $(this).text().includes("KO")
          ) {
            $(this).remove();
          }

      });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "Booster") {
      // added on 29/04/2022
      SolveFor =
        $(thisTile).find('[id^="ddlSolveFor"]').val().split(" ")[0] ==
        "Conversion_Strike"
          ? $(thisTile).find('[id^="ddlSolveFor"]').val().split("_")[1]
          : $(thisTile).find('[id^="ddlSolveFor"]').val().split(" ")[0];
      ddlKOKItype = $(thisTile).find('[id^="ddlBoosterType"]').val();
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("Upfront") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
          if (ddlKOKItype.includes("NOKI") && $(this).text().includes("KI")) {
            $(this).remove();
          }
        });
    }
    if ($("#td" + TileId).find(".productName")[0].id == "Sharkfin") {
      SolveFor = $(thisTile).find('[id^="ddlSolveForSharkfin"]').val().split(" ")[0];
      ddlKOKItype = $(thisTile).find('[id^="ddlKOKIType"]').val();
      $(thisTile).find("[id^='EQCOpt'] li").each(function (tempop) {
          if (
            $(this).text().includes("Upfront") ||
            $(this).text().includes("Client Yield") ||
            $(this).text().includes(SolveFor)
          ) {
            $(this).remove();
          }
          if (
            (ddlKOKItype.includes("NOKI") && $(this).text().includes("KI")) ||
            (ddlKOKItype.includes("NOKO") && $(this).text().includes("KO"))
          ) {
            $(this).remove();
          }
        });
    }
    

  } catch (error) {
    console.log(error.message);
  }
}

// Start- LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
function btnFXDOptions(that, event, id){
  try{

    TileId = that.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);
    imgthat = that;

    //Changed the order for sync with Flexi pricer. | LGTCLI-37| Chaitanya M | 15 Feb 2023
    // <img src="../../../assets/Instant-Pricer/App_Resorces/Blue/plus.png"
    // onclick="addTile(imgthat, event, id,this);" title="Add Tile"
    // class=" button-five themebtn" />
    popuplist = `<li onclick="addTile(imgthat, event, id,this)">Clone</li>
      <li onclick="addTile(imgthat, event, id,this)">New</li>   
    `;
        
    $(thisTile).find("[id^='FXDOpt']").empty();
    $(thisTile).find("[id^='FXDOpt']").append(popuplist);
    $(thisTile).find("[id^='FXDOpt']").toggle();

    let optionparts = $(thisTile).find("[id^='FXDOpt']").html();

    let tempop = $.parseHTML(optionparts);

  } catch (error) {
    console.log(error.message);
  }

}
//End

// EQC Payoff's input variations valdations Start 
function EQCVValidations(SolveforValue, thisTile, lithis) {
  try {

    let validator = true;
    if (Number($(thisTile).find('[id^="koinputbox"]').val()) <= 1 && lithis.innerHTML.split(" ")[0][0] == "-" && SolveforValue == "KO") {
      validator = false;
    } else if (
      Number($(thisTile).find('[id^="strikeipbox"]').val()) <= 1 &&
      lithis.innerHTML.split(" ")[0][0] == "-" &&
      SolveforValue == "Strike"
    ) {
      validator = false;
    } else if (
      Number($(thisTile).find('[id^="IBPriceipbox"]').val()) <= 0.25 &&
      lithis.innerHTML.split(" ")[0][0] == "-" &&
      SolveforValue == "IB"
    ) {
      validator = false;
    } else if (
      Number($(thisTile).find('[id^="couponipbox"]').val()) <= 1 &&
      lithis.innerHTML.split(" ")[0][0] == "-" &&
      SolveforValue == "Coupon"
    ) {
      validator = false;
    } else if (
      Number($(thisTile).find('[id^="kiinputbox"]').val()) <= 1 &&
      lithis.innerHTML.split(" ")[0][0] == "-" &&
      SolveforValue == "KI"
    ) {
      validator = false;
    } else if (
      Number($(thisTile).find('[id^="kiinputbox"]').val()) <= 4.99 &&
      lithis.innerHTML.split(" ")[0][0] == "-" &&
      SolveforValue == "KI"
    ) {
      validator = false;
    } //LGTGTWINT-1631 - Instant Pricing : Tiles copied with negative values
    else if ((Number($(thisTile).find('[id^="tenor"]').val()) <= 0 ) && lithis.innerHTML.split(" ")[0][0] == "-" && lithis.innerHTML.includes("Tenor")) {
      validator = false;
    } //LGTGTWINT-1277 Instant Pricing : Able to duplicate templates with negative values for tenor
    else if ((Number($(thisTile).find('[id^="clientYELN"]').val()) <= 0.99) && lithis.innerHTML.split(" ")[0][0] == "-" && lithis.innerHTML.includes("Yield")) {
      validator = false;
    } //LGTGTWINT-1631 - Instant Pricing : Tiles copied with negative values

   


    switch ($("#td" + TileId).find(".productName")[0].id) {
      case "FCN":
        if (SolveforValue == "KO" || SolveforValue == "KI") {
          if (
            $(thisTile).find('[id^="ddlKOKIType"]').val().includes("NOKI") &&
            SolveforValue.includes("KI")
          ) {
            validator = false;
          } else if (
            $(thisTile).find('[id^="ddlKOKIType"]').val().includes("NOKO") &&
            SolveforValue.includes("KO")
          ) {
            validator = false;
          }
        } else {
          if (
            $(thisTile).find('[id^="ddlSolveForFCN"]').val().includes("IB") &&
            SolveforValue.includes("IB")
          ) {
            validator = false;
          } else if (
            $(thisTile)
              .find('[id^="ddlSolveForFCN"]')
              .val()
              .includes("Strike") &&
            SolveforValue.includes("Strike")
          ) {
            validator = false;
          } else if (
            $(thisTile)
              .find('[id^="ddlSolveForFCN"]')
              .val()
              .includes("Coupon") &&
            SolveforValue.includes("Coupon")
          ) {
            validator = false;
          }
        }
        return validator;

      case "ELN":
        if (SolveforValue == "KO" || SolveforValue == "KI") {
          if ($(thisTile).find('[id^="ddlELNC"]').val().includes("Simple") && SolveforValue.includes("KO")) {
            validator = false;
          }
        } else {if ($(thisTile).find('[id^="solveForELN"]').val().includes("IB") && SolveforValue.includes("IB")) {
            validator = false;
        } else if ($(thisTile).find('[id^="solveForELN"]').val().includes("Strike") && SolveforValue.includes("Strike")) {
            validator = false;
        } else if (Number($(thisTile).find('[id^="priceELN"]').val()) <= 1 && SolveforValue.includes("IB") && lithis.innerHTML.split(" ")[0][0] == "-") {
            validator = false;
          }
        }
        return validator;

      case "DRA":
        if (SolveforValue == "KO" || SolveforValue == "KI") {
          if (
            $(thisTile).find('[id^="ddlDRAType"]').val().includes("NOKI") &&
            SolveforValue.includes("KI")
          ) {
            validator = false;
          } else if (
            $(thisTile).find('[id^="ddlDRAType"]').val().includes("NOKO") &&
            SolveforValue.includes("KO")
          ) {
            validator = false;
          }
        } else {
          if (
            $(thisTile)
              .find('[id^="ddlSolveForDRA"]')
              .val()
              .includes("Price") &&
            SolveforValue.includes("IB")
          ) {
            validator = false;
          } else if (
            $(thisTile)
              .find('[id^="ddlSolveForDRA"]')
              .val()
              .includes("Strike") &&
            SolveforValue.includes("Strike")
          ) {
            validator = false;
          } else if (
            $(thisTile)
              .find('[id^="ddlSolveForDRA"]')
              .val()
              .includes("Coupon") &&
            SolveforValue.includes("Coupon")
          ) {
            validator = false;
          }
        }
        return validator;

      case "AQDQ":
        if (
          Number($(thisTile).find('[id^="KoGauranteeipBoxAQDQ"]').val()) <= 1 &&
          lithis.innerHTML.split(" ")[0][0] == "-" &&
          SolveforValue == "KO"
        ) {
          validator = false;
        } else if (
          $(thisTile).find('[id^="solveForAQDQ"]').val().includes("Price") &&
          SolveforValue.includes("IB")
        ) {
          validator = false;
        } else if (
          $(thisTile).find('[id^="solveForAQDQ"]').val().includes("Strike") &&
          SolveforValue.includes("Strike")
        ) {
          validator = false;
        } else if (
          $(thisTile).find('[id^="solveForAQDQ"]').val().includes("Coupon") &&
          SolveforValue.includes("Coupon")
        ) {
          validator = false;
        } else if (
          Number($(thisTile).find('[id^="txtUpfrontAQDQ"]').val()) <= 1 && lithis.innerHTML.split(" ")[0][0] == "-" && SolveforValue.includes("Upfront")) { //LGTGTWINT-1290 Instant Pricing : Upfront not updated accordingly when IB price changed with add template functionality
           validator = false;
        }

        return validator;
      
      case "BEN":
        if (SolveforValue == "KO" || SolveforValue == "KI") {
          if (
            $(thisTile).find('[id^="ddlBENType"]').val().includes("Vanilla") &&
            SolveforValue.includes("KI")
          ) {
            validator = false;
          }
        }
        if (
          $(thisTile).find('[id^="ddlSolveFor"]').val().includes("Price") &&
          SolveforValue.includes("IB")
        ) {
          validator = false;
        } else if (
          $(thisTile).find('[id^="ddlSolveFor"]').val().includes("Strike") &&
          SolveforValue.includes("Strike")
        ) {
          validator = false;
        } else if (
          $(thisTile).find('[id^="ddlSolveFor"]').val().includes("Coupon") &&
          SolveforValue.includes("Coupon")
        ) {
          validator = false;
        } else if (
          Number($(thisTile).find('[id^="IBPriceinputbox"]').val()) <= 1 &&
          lithis.innerHTML.split(" ")[0][0] == "-" &&
          SolveforValue == "IB"
        ) {
          validator = false;
        }
        return validator;

      case "Options":
        if (
          $(thisTile)
            .find('[id^="solveForOptions"]')
            .val()
            .includes("Strike") &&
          SolveforValue.includes("Strike")
        ) {
          validator = false;
        } else if (
          Number($(thisTile).find('[id^="upfrontOptions"]').val()) <= 1 &&
          lithis.innerHTML.split(" ")[0][0] == "-" &&
          SolveforValue == "Upfront"
        ) {
          validator = false;
        }

        return validator;
     
      case "ELI":
        if (
          Number($(thisTile).find('[id^="KOipboxELI"]').val()) <= 1 &&
          lithis.innerHTML.split(" ")[0][0] == "-" &&
          SolveforValue == "KO"
        ) {
          validator = false;
        } else if (
          Number($(thisTile).find('[id^="KIipboxELI"]').val()) <= 1 &&
          lithis.innerHTML.split(" ")[0][0] == "-" &&
          SolveforValue == "KI"
        ) {
          validator = false;
        } else if (
          Number($(thisTile).find('[id^="Couponipbox"]').val()) <= 1 &&
          lithis.innerHTML.split(" ")[0][0] == "-" &&
          SolveforValue == "Coupon"
        ) {
          validator = false;
        }

        return validator;
        
      case "Phoenix":
          if (SolveforValue == "KO" || SolveforValue == "KI") {
            if (
              $(thisTile).find('[id^="ddlKOKIType"]').val().includes("NOKI") &&
              SolveforValue.includes("KI")
            ) {
              validator = false;
            } else if (
              $(thisTile).find('[id^="ddlKOKIType"]').val().includes("NOKO") &&
              SolveforValue.includes("KO")
            ) {
              validator = false;
            }
          } else {
            if (
              $(thisTile).find('[id^="ddlSolveForPhoenix"]').val().includes("IB") &&
              SolveforValue.includes("IB")
            ) {
              validator = false;
            } else if (
              $(thisTile)
                .find('[id^="ddlSolveForPhoenix"]')
                .val()
                .includes("Strike") &&
              SolveforValue.includes("Strike")
            ) {
              validator = false;
            } else if (
              $(thisTile)
                .find('[id^="ddlSolveForPhoenix"]')
                .val()
                .includes("Coupon") &&
              SolveforValue.includes("Coupon")
            ) {
              validator = false;
            }
          }
          return validator;     

      case "DCN":
            if (SolveforValue == "KO" || SolveforValue == "KI") {
              if (
                $(thisTile).find('[id^="ddlDCNType"]').val().includes("Vanilla") &&
                SolveforValue.includes("KI")
              ) {
                validator = false;
              }
            }
            if (
              $(thisTile).find('[id^="ddlSolveFor"]').val().includes("Price") &&
              SolveforValue.includes("IB")
            ) {
              validator = false;
            } else if (
              $(thisTile).find('[id^="ddlSolveFor"]').val().includes("Strike") &&
              SolveforValue.includes("Strike")
            ) {
              validator = false;
            } else if (
              $(thisTile).find('[id^="ddlSolveFor"]').val().includes("Coupon") &&
              SolveforValue.includes("Coupon")
            ) {
              validator = false;
            } else if (
              Number($(thisTile).find('[id^="IBPriceinputbox"]').val()) <= 1 &&
              lithis.innerHTML.split(" ")[0][0] == "-" &&
              SolveforValue == "IB"
            ) {
              validator = false;
            }
            return validator;          
       
      case "TwinWin":
              if (SolveforValue == "KO" || SolveforValue == "KI") {
                if (
                  $(thisTile).find('[id^="ddlKOKIType"]').val().includes("NOKI") &&
                  SolveforValue.includes("KI")
                ) {
                  validator = false;
                } else if (
                  $(thisTile).find('[id^="ddlKOKIType"]').val().includes("NOKO") &&
                  SolveforValue.includes("KO")
                ) {
                  validator = false;
                }
              } else {
                if (
                  $(thisTile).find('[id^="ddlSolveForTwinWin"]').val().includes("IB") &&
                  SolveforValue.includes("IB")
                ) {
                  validator = false;
                } else if (
                  $(thisTile)
                    .find('[id^="ddlSolveForTwinWin"]')
                    .val()
                    .includes("Strike") &&
                  SolveforValue.includes("Strike")
                ) {
                  validator = false;
                } else if (
                  $(thisTile)
                    .find('[id^="ddlSolveForTwinWin"]')
                    .val()
                    .includes("Coupon") &&
                  SolveforValue.includes("Coupon")
                ) {
                  validator = false;
                }
              }
              return validator;         

      case "Booster":
                if (SolveforValue == "KO" || SolveforValue == "KI") {
                  if (
                    $(thisTile).find('[id^="ddlBoosterType"]').val().includes("NOKI") &&
                    SolveforValue.includes("KI")
                  ) {
                    validator = false;
                  } else if (
                    $(thisTile).find('[id^="ddlBoosterType"]').val().includes("NOKO") &&
                    SolveforValue.includes("KO")
                  ) {
                    validator = false;
                  }
                } else {
                  if (
                    $(thisTile)
                      .find('[id^="ddlSolveForBooster"]')
                      .val()
                      .includes("Price") &&
                    SolveforValue.includes("IB")
                  ) {
                    validator = false;
                  } else if (
                    $(thisTile)
                      .find('[id^="ddlSolveForBooster"]')
                      .val()
                      .includes("Strike") &&
                    SolveforValue.includes("Strike")
                  ) {
                    validator = false;
                  } else if (
                    $(thisTile)
                      .find('[id^="ddlSolveForBooster"]')
                      .val()
                      .includes("Coupon") &&
                    SolveforValue.includes("Coupon")
                  ) {
                    validator = false;
                  }
                }
                return validator;

      case "Sharkfin":

        if (SolveforValue == "KO" || SolveforValue == "KI") {
                    if (
                      $(thisTile).find('[id^="ddlKOKIType"]').val().includes("NOKI") &&
                      SolveforValue.includes("KI")
                    ) {
                      validator = false;
                    } else if (
                      $(thisTile).find('[id^="ddlKOKIType"]').val().includes("NOKO") &&
                      SolveforValue.includes("KO")
                    ) {
                      validator = false;
                    }
                  } else {
                    if (
                      $(thisTile).find('[id^="ddlSolveForSharkfin"]').val().includes("IB") &&
                      SolveforValue.includes("IB")
                    ) {
                      validator = false;
                    } else if (
                      $(thisTile)
                        .find('[id^="ddlSolveForSharkfin"]')
                        .val()
                        .includes("Strike") &&
                      SolveforValue.includes("Strike")
                    ) {
                      validator = false;
                    } else if (
                      $(thisTile)
                        .find('[id^="ddlSolveForSharkfin"]')
                        .val()
                        .includes("Coupon") &&
                      SolveforValue.includes("Coupon")
                    ) {
                      validator = false;
                    }
                  }
          return validator;          

    }
  } catch (error) {
    console.log(error.message);
  }
}//END

function clonetile(oldtile, newCard) {
  try {
    $(newCard).find('[id^="ddlSolveForFCN"]').val($(oldtile).find('[id^="ddlSolveForFCN"]').val());
    $(newCard).find('[id^="ddlKOKIType"]').val($(oldtile).find('[id^="ddlKOKIType"]').val());
    checkSolveForFCN($(newCard).find('[id^="ddlSolveForFCN"]').val(), newCard);

    $(newCard).find('[id^="ContractAmt"]').val($(oldtile).find('[id^="ContractAmt"]').val());
    $(newCard).find('[id^="strikeipbox"]').val($(oldtile).find('[id^="strikeipbox"]').val());
    $(newCard).find('[id^="couponipbox"]').val($(oldtile).find('[id^="couponipbox"]').val());
    $(newCard).find('[id^="noncallinputbox"]').val($(oldtile).find('[id^="noncallinputbox"]').val());

    $(newCard).find('[id^="shareDivFCN"]').val($(oldtile).find('[id^="shareDivFCN"]').val());
    $(newCard).find('[id^="ddlFCNCcy"]').val($(oldtile).find('[id^="ddlFCNCcy"]').val());

    $(newCard)
      .find('[id^="tenor_FCN"]')
      .val($(oldtile).find('[id^="tenor_FCN"]').val());
    $(newCard)
      .find('[id^="IBPriceipbox"]')
      .val($(oldtile).find('[id^="IBPriceipbox"]').val());
    $(newCard)
      .find('[id^="ddlCouponFrequency"]')
      .val($(oldtile).find('[id^="ddlCouponFrequency"]').val());
    $(newCard)
      .find('[id^="koinputbox"]')
      .val($(oldtile).find('[id^="koinputbox"]').val());
    $(newCard)
      .find('[id^="kiinputbox"]')
      .val($(oldtile).find('[id^="kiinputbox"]').val());

    // calculateTenor(newCard[0].id.match(/\d+$/)[0]); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
    
  } catch (error) {
    console.log(error.message);
  }
}

function cloneforall(oldtile, newtile) {
  try {
    returnstring = getProductFilters(oldtile, newtile[0]);
    setProductFilters(newtile[0], returnstring);
    // LGTGTWINT-1638 | Added for Date issue. | Chaitanya M | 31 July 2023
    // if (newtile.find(".productName")[0].id == "ELN") {
    //  loadELNTenorValues(newtile[0]);
    //}
    //End
   // }
    // if (newtile.find(".productName")[0].id == "Phoenix") {
    //   onLoadPhoenix(newtile[0]);
    // }
  } catch (error) {
    console.log();
  }
}

// END

function addTile(that, event, id, lithis) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    cloneTileFXD = false;// LGTGTWINT-2186 | Chaitanya M | 07 Jul 2023

    // $(".EQCOpt").hide(); //LGTGTWINT-1273 Instant pricing : On copying template from instant pricer, copy dropdown does not disappear, LGTGTWINT-2143 || RizwanS || 22 Jun 2023

    // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
    if (document.getElementById(that.id).getAttribute("onclick").includes("btnFXDOptions")) {
      $(".FXDOpt").hide(); // LGTCLI-447 Chaitanya M | 02 Aug 2023
    }

    _addtileflag = true;

    thisTile = document.getElementById("td" + TileId);
    // added by rutika on 26/04/2022
    //Start
    //Conditiond for validations check for eqc products
    if (
      document.getElementById(that.id).getAttribute("onclick").includes("btnEQCOptions")
    ) {
      SolveforValue =
        lithis.innerHTML.split(" ")[2] == undefined
          ? lithis.innerHTML.split(" ")[0]
          : lithis.innerHTML.split(" ")[2]; //To get value of selected LI

      checkForValidation = EQCVValidations(SolveforValue, thisTile, lithis);
      if (checkForValidation == false) {
        slideNotification("#b34b3b", "Tile Cannot be Copied", thisTile); //Added by SoumyaP
        return;
      }
    }
    
    // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
    if (document.getElementById(that.id).getAttribute("onclick").includes("btnFXDOptions")) {
      SolveforValue =
        lithis.innerHTML.split(" ")[2] == undefined
          ? lithis.innerHTML.split(" ")[0]
          : lithis.innerHTML.split(" ")[2]; 
      
      if (SolveforValue.toUpperCase() === "CLONE") {
        cloneTileFXD = true;
      }
    }
    //End

    //END
    isNewTile = true;
    validation_clear();
    document.getElementById("required").style.display = "none";
    TileId = that.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);

    // Added For JIRA ID -NT1FIN47-447 // 05 April 2022
    oldtile = thisTile;
    let oldko = $(thisTile).find("[id^='koinputbox']").val();
    let oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
    //END

    productName = $($(that).parents(".sorting").find(".productName")).attr("id");
    idReplace = TileId;
    id = TileId;
    parentCard = $(that).parents(".sorting");

    //Added Check For Each Payoff MaxTile Allowed / 19 Oct 2021

    switch (productName) {
      case "FXTRF":
        if (counterFXTRF > clientConfigdata.FXTRF.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
              " " +
              " : : Maximum" +
              " " +
              clientConfigdata.FXTRF.Maxtilecount +
              " " +
              "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;
      case "FXAQ":
        if (counterFXAQ > clientConfigdata.FXAQ.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
              " " +
              " : : Maximum" +
              " " +
              clientConfigdata.FXAQ.Maxtilecount +
              " " +
              "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;
      case "FXDQ":
        if (counterFXDQ > clientConfigdata.FXDQ.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
              " " +
              " : : Maximum" +
              " " +
              clientConfigdata.FXDQ.Maxtilecount +
              " " +
              "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;
      case "FXPivot":
        if (counterFXPivot > clientConfigdata.FXPivot.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
              " " +
              " : : Maximum" +
              " " +
              clientConfigdata.FXPivot.Maxtilecount +
              " " +
              "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;  
      case "Strategies":  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
        if (counterFXStrategies > clientConfigdata.FXStrategies.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
            " " +
            " : : Maximum" +
            " " +
            clientConfigdata.FXStrategies.Maxtilecount +
            " " +
            "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;
      case "FXOPTION":  //LGTGTWINT-1880  || Chaitanya M  || 04 Jul 2023
        if (counterFXOptions > clientConfigdata.FXO.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
            " " +
            " : : Maximum" +
            " " +
            clientConfigdata.FXO.Maxtilecount +
            " " +
            "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;        
      default:
    }

    //END

    var i = TileId;
    do {
      i++;
    } while (
      $(that).parents(".removable").find("#td" + i).length
    );

    var newCard = $(parentCard).clone().attr("id", "td" + Number(i));

    $(newCard).find("[id^='EQCOpt']").empty();
    $(newCard).find("[id^='EQCOpt']").hide(); // Added For JIRA ID -NT1FIN47-447 // 05 April 2022

    // LGTGTWINT-2186 | Chaitanya M | 07 Jul 2023
    $(newCard).find("[id^='FXDOpt']").empty(); 
    $(newCard).find("[id^='FXDOpt']").hide();
    //End

    $(newCard)
      .find(
        "input, img, button, td, div, span, canvas, tr, label, a, table, select, datalist, section, option"
      )
      .each(function (a, b) {
        if (b.id.match(/\d+$/) != null && b.id.match(/\d+$/)[0] == TileId) {
          $(b).attr("id", replaceAll($(b).attr("id"), TileId, i));
        }
        if (b.classList.contains("switch-label")) {
          $(b)[0].htmlFor = replaceAll($(b)[0].htmlFor, TileId, i);
        }
        if (b.classList.contains("switch-input")) {
          $(b)[0].name = replaceAll($(b)[0].name, TileId, i);
        }
        if (b.classList.contains("tablabel")) {
          $(b)[0].attributes.name.value = replaceAll(
            $(b)[0].attributes.name.value,
            TileId,
            i
          );
        }
      });

    id = TileId = i;
    //Added by Soumya P
    $(newCard).find('[id^="msg"]').html("");
    $(newCard).find('[id^="notify"]').css("display", "none");

    //$(thisTile).parent().append(newCard);
    $(thisTile).after(newCard); // Add Tile to each payoff immediately to exsting tile. / JIRA-INT1FIN47-421 / 07 March 2022
    // by Chaitanya -Start
    $(newCard).addClass("NewTileBorder");

    setTimeout(function () {
      newCard.removeClass("NewTileBorder");
    }, 500);

    // END
    orderArray.push(i);
    idReplace = i;

    productName = $("#td" + TileId).find(".productName")[0].id;

    switch (productName) {
      case "CASHFX": // Added by Aniruddha to avoid copying of id into cloned tile.
        $("#td" + TileId).find(".banksNameRow td").each(function (index, element) {
            $(element).attr("id", "");
            $(element).empty().html("-");
          });
        $("#td" + TileId).find(".pricesRow td").each(function (index, element) {
            $(element).attr("id", "");
            $(element).empty().removeClass("GlowPrice_Red").html("-");
          });

        $("#td" + TileId).find("[id^='FXCASH_CustAmt']").val("");
        onLoadCashFX(idReplace);
        break;
      case "ELI":
        onLoadELI(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);
        calculateTenor(idReplace);

        //tenorChange(idReplace);
        //cloneforall(oldtile,newCard); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
        break;
      //Added by rutika for tenor changes on 26/04/2022
      //star
      case "FXOPTION":
        // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
        // Start
        optionsOnLoad(idReplace);  
        
        if(cloneTileFXD === true){
          cloneforall(oldtile, newCard);
          cloneTileFXD = false;
          checkbarriertype(newCard[0],true); 

        }else{
          getCurrencyFXORate(idReplace);
          if (!$("#td" + TileId).find('[id^="rbRowFXO"]')[0].checked) {
            $("#td" + TileId).find('[id^="rbRowFXO"]')[0].checked = true;
          }
          
          $("#td" + TileId).find('[id^="CcySelectionFXO"]').val($("#td" + TileId).find('[id^="FXO_CCYPairDemo"]').val().split("-")[0].trim());
          checkbarriertype(newCard[0]); 
          
        }     
                   
        counterFXOptions++; //LGTGTWINT-1880  || Chaitanya M  || 04 Jul 2023
        //End
        break;
      case "FIBOND":
        bondOnLoad(idReplace);

        break;
      case "ELN":
        onLoadELN(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);      
        loadELNTenorValues(newCard[0]); // LGTGTWINT-1638 | Added for Date issue. | Chaitanya M | 21 July 2023      
        //tenorChange(idReplace); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

        break;
      case "FCN":
        onLoadFCN(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);

        //tenorChange(idReplace);
        // Added For JIRA ID -NT1FIN47-447 // 05 April 2022
        // clonetile(oldtile,newCard);
        // END  // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

        break;
      case "AQDQ":
        onLoadAQDQ(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);
        calculateAccrualDays(newCard[0]); //LGTGTWINT-2248 | Chaitanya M | 10 Aug 2023

        // calculateTenor(idReplace);        
        // tenorChange(idReplace); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

        break;
      case "FXDCI":
        loadDCI(idReplace);
        getCurrencyFXDCIRate(idReplace);
        break;
      case "INSURANCE":
        insuranceOnLoad(idReplace);
        break;
      case "CASHEQUITIES":
        cashEqOnLoad(idReplace);
        getShareInfo(
          $("#Cash_Eq_sharesList" + idReplace)
            .val()
            .substring(0, 3),
          idReplace
        );
        break;
      case "MUTUALFUND":
        getfundonload(idReplace);

        break;
      case "DEPOSIT":
        depositOnLoad(idReplace);

        break;
      case "FXAQ":
        // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
        // Start
        onLoadFXAQ(idReplace);
        if(cloneTileFXD === true){
          cloneforall(oldtile, newCard);
          cloneTileFXD = false;
        }else{
          getCurrencyFXAQRate(idReplace);
        }        
      
        counterFXAQ++; // Added to increment tile counter value / 19 Oct 2021
        //END
        break;
      case "FXDQ":
       // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
       //Start
        onLoadFXDQ(idReplace);
        if(cloneTileFXD === true){
          cloneforall(oldtile, newCard);
          cloneTileFXD = false;
        }else{
          getCurrencyFXDQRate(idReplace);
        }
        // Added to increment tile counter value / 19 Oct 2021
        counterFXDQ++;
        //END
        break;
      case "FXTRF":
      // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
      //Start
        onLoadFXTRF(idReplace);
        if(cloneTileFXD === true){
          cloneforall(oldtile, newCard);
          cloneTileFXD = false;
        }else{
          $("#td" + TileId).find('[id^="KIinpboxFXTRF"]').val(""); 
          getCurrencyFXTRFRate(idReplace);
          if(!$("#td" + TileId).find('[id^="rbRowKIToggleTRF"]')[0].checked){     
            $("#td" + TileId).find('[id^="rbRowKIToggleTRF"]')[0].checked = true;                    
          } 
        }
        //End

        // Added to increment tile counter value / 19 Oct 2021
        counterFXTRF++;
        //END
        break;
      case "FXPIVOT":
      // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
      //Start
        onLoadFXPivot(idReplace);
        if(cloneTileFXD === true){
          cloneforall(oldtile, newCard);
          cloneTileFXD = false;
        }else{        
          $("#td" + TileId).find('[id^="txtLowerKIFXPivot"]').val("").prop("disabled", true);        
          $("#td" + TileId).find('[id^="txtUpperKIFXPivot"]').val("").prop("disabled", true); 
          getCurrencyFXPivotRate(idReplace);
          if(!$("#td" + TileId).find('[id^="rbRowKITogglePivot"]')[0].checked){     
            $("#td" + TileId).find('[id^="rbRowKITogglePivot"]')[0].checked = true;  
          } 
        } 
        // $("#td" + TileId).find('[id^="lstrikeinpboxFXPivot"]').val("");
        // $("#td" + TileId).find('[id^="UpperinpboxFXPivot"]').val("");
        //End
        
        counterFXPivot++;// Added to increment tile counter value / 19 Oct 2021
        //END
        break;
      case "BEN":
        onLoadBEN(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);
        //calculateTenor(idReplace);
        //tenorChange(idReplace); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

        break;
      case "Phoenix":
        onLoadPhoenix(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);
        // calculateTenor(idReplace);
        //tenorChange(idReplace); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

        break;
      case "DRA":
        onLoadDRA(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);
        // calculateTenor(idReplace);
        // tenorChange(idReplace); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

        break;
      case "Options":
        onLoadOptions(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);
        // loadEQOTenorValues(idReplace);
        loadEQOTenorValues(newCard[0]); //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
     
        break;
      case "Strategies":
        onLoadFXStrategies(idReplace);
        
        // Start - F5SAAINT-687 | Chaitanya M | 04 Dec 2023
        if(cloneTileFXD === true){

          cloneforall(oldtile, newCard);
          cloneTileFXD = false;
          checkSolveForStrategies(newCard[0]);
          
        }else{

          getCurrencyFXStrategiesRate(idReplace);
          
         // $("#CcySelectionFXStrategies" + idFXStrategies).val($("#FXStrategies_CCYPairDemo" + idFXStrategies).val().split("-")[0].trim());
         
          $("#td" + TileId).find('[id^="CcySelectionFXStrategies"]').val($("#td" + TileId).find('[id^="FXStrategies_CCYPairDemo"]').val().split("-")[0].trim());
          checkSolveForStrategies(newCard[0]); // Check Solve for || RijwanS || LGTGTWINT-1880  || 20 Jun 2023

          if ($("#td" + TileId).find('[id^="SolveforFXStrategies"]').val() == "Option Spread"){
            if (!(($("#td" + TileId).find('[id^="rbColCallPutToggle"]')[0]).checked)) {
              ($("#td" + TileId).find('[id^="rbColCallPutToggle"]')[0]).checked = true;
            }
          }
        
        } 
        // End - F5SAAINT-687 | Chaitanya M | 04 Dec 2023
        counterFXStrategies++;

        break;
      case "RA":
        onLoadRA(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "Snowball":
        onLoadSnowball(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "WoBAutocall":
        onLoadWoBAutocall(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "AvgAutocall":
        onLoadAvgAutocall(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "ELCI":
        onLoadELCI(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "RELCI":
        onLoadRELCI(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "TwinWin":
        onLoadTwinWin(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);
        break;
      case "BEI":
        onLoadBEI(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "SPS":
        onLoadSPS(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "FCI":
        onLoadFCI(idReplace, true);
        calculateTenor(idReplace);
        tenorChange(idReplace);
        break;
      case "FXDigital":
        loadDigital(idReplace);
        getCurrencyFXDigitalRate(idReplace);
        break;
      // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
      case "DCN": 
         onLoadDCN(idReplace, true);
         cloneforall(oldtile, newCard);
         newvariation(lithis, oldtile, newCard);
         //calculateTenor(idReplace);
         //tenorChange(idReplace); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
          break;
      // END  
      case "Booster":
        onLoadBooster(idReplace, true);
        cloneforall(oldtile, newCard);
        newvariation(lithis, oldtile, newCard);
        break;
      case "Sharkfin":
          onLoadSharkfin(idReplace, true);
          cloneforall(oldtile, newCard);
          newvariation(lithis, oldtile, newCard);  
          break;  
      default:
        console.log("Default choice selected!");
    }
    var idClear = i;
    if ($("#td" + idClear).find(".productName")[0].id != "CASHFX") {
      $("#td" + idClear)
        .find(".banksNameRow td")
        .empty()
        .html("-");
    } else {
    }
    $("#td" + idClear)
      .find(".pricesRow td")
      .empty()
      .removeClass("GlowPrice_Red")
      .html("-");

    // a=["FCN","ELN","DRA","Phoenix","AQDQ","Options","ELI","BEN"]
    // if(a.includes(productName))
    // {newvariation(lithis,oldtile,newCard);}

    sortingTdClick();
  } catch (error) {
    console.log(error.message);
  }
}

function newvariation(lithis, oldtile, newCard) {
  try {
    //a=["FCN","ELN","DRA","Phoenix"]//,"AQ","Options","ELI","BEN"]
    ProN = $("#td" + oldtile.id.replace(/\D/g, "")).find(".productName")[0].id;

    if (ProN == "FCN") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile)
          .find("[id^='tenor_FCN']")
          .val()
          .match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_FCN']").val().match(/\d+/g);

        $(newCard)
          .find("[id^='tenor_FCN']")
          .val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='koinputbox']").val();
        $(newCard)
          .find("[id^='koinputbox']")
          .val(
            (Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard)
          .find("[id^='strikeipbox']")
          .val(
            (
              Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='couponipbox']").val();
        $(newCard)
          .find("[id^='couponipbox']")
          .val(
            (
              Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='IBPriceipbox']").val();
        $(newCard).find("[id^='IBPriceipbox']").val((Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
        $(newCard).find("[id^='txtupfront']").val((parseFloat(100 -  Number($(newCard).find('[id^="IBPriceipbox"]').val())).toFixed(2))); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='kiinputbox']").val();
        $(newCard)
          .find("[id^='kiinputbox']")
          .val(
            (Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      }
    }
    if (ProN == "ELN") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() === "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile)
          .find("[id^='tenor_ELN']")
          .val()
          .match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_ELN']").val().match(/\d+/g);

        $(newCard)
          .find("[id^='tenor_ELN']")
          .val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "CLIENT") {
        //added by rutika on 29/04/2022
        oldko = $(thisTileELN).find('input[id^="clientYELN"]').val();
        $(newCard)
          .find("[id^='clientYELN']")
          .val(
            (Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='koinputbox']").val();
        $(newCard)
          .find("[id^='koinputbox']")
          .val(
            (Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard)
          .find("[id^='strikeipbox']")
          .val(
            (
              Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='priceELN']").val();
        $(newCard)
          .find("[id^='priceELN']")
          .val(
            (Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
        flagIB = true; //by gargi
      }
    }

    if (ProN == "AQDQ") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() === "TENOR") {
        currentTenor = $(thisTile)
          .find("[id^='tenor_AQDQ']")
          .val()
          .match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_AQDQ']").val().match(/\d+/g);

        $(newCard)
          .find("[id^='tenor_AQDQ']")
          .val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "UPFRONT") {
        //added by rutika on 29/04/2022
        oldko = $(thisTile).find("[id^='txtUpfrontAQDQ']").val();
        $(newCard).find("[id^='txtUpfrontAQDQ']").val((Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='KoGauranteeipBoxAQDQ']").val();
        $(newCard).find("[id^='KoGauranteeipBoxAQDQ']").val((Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipboxAQDQ']").val();
        $(newCard)
          .find("[id^='strikeipboxAQDQ']")
          .val(
            (
              Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      }
    }

    if (ProN == "BEN") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile)
          .find("[id^='tenor_BEN']")
          .val()
          .match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_BEN']").val().match(/\d+/g);
        $(newCard).find("[id^='tenor_BEN']").val(Number(oldtenor) +Number(lithis.innerHTML.split(" ")[0]) +currentTenor);

        $(newCard)
          .find("[id^='tenor_BEN']")
          .val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard)
          .find("[id^='strikeipbox']")
          .val(
            (
              Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='IBPriceinputbox']").val();
        $(newCard)
          .find("[id^='IBPriceinputbox']")
          .val(
            (Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );

        $(newCard).find("[id^='txtupfront']").val((parseFloat(100 -  Number($(newCard).find('[id^="IBPriceinputbox"]').val())).toFixed(2))); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA


      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='couponipbox']").val();
        $(newCard)
          .find("[id^='couponipbox']")
          .val(
            (
              Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='kiinputbox']").val();
        $(newCard)
          .find("[id^='kiinputbox']")
          .val(
            (Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      }
    }

    if (ProN == "ELI") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile)
          .find("[id^='tenorELI']")
          .val()
          .match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenorELI']").val().match(/\d+/g);

        $(newCard)
          .find("[id^='tenorELI']")
          .val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='KOipboxELI']").val();
        $(newCard)
          .find("[id^='KOipboxELI']")
          .val(
            (Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipboxELI']").val();
        $(newCard)
          .find("[id^='strikeipboxELI']")
          .val(
            (
              Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='CouponipboxELI']").val();
        $(newCard).find("[id^='CouponipboxELI']").val((
          Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='KIipboxELI']").val();
        $(newCard).find("[id^='KIipboxELI']").val((
          Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      }
    }

    if (ProN == "DRA") {
      
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile).find("[id^='tenor_DRA']").val().match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_DRA']").val().match(/\d+/g);

        $(newCard).find("[id^='tenor_DRA']").val(
          Number(oldtenor) + Number(lithis.innerHTML.split(" ")[0]) + currentTenor
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='koinputbox']").val();
        $(newCard).find("[id^='koinputbox']").val((
          Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard).find("[id^='strikeipbox']").val((
          Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='couponipbox']").val();
        $(newCard).find("[id^='couponipbox']").val((
          Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='IBPriceipbox']").val();
        $(newCard).find("[id^='IBPriceipbox']").val((
          Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );

        $(newCard).find("[id^='txtupfront']").val((parseFloat(100 -  Number($(newCard).find('[id^="IBPriceipbox"]').val())).toFixed(2))); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA

      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='kiinputbox']").val();
        $(newCard).find("[id^='kiinputbox']").val((
          Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      }
    }

    if (ProN == "Options") {
      //oldstrike= $(thisTile).find("[id^='strikeipboxOptions']").val();
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile).find("[id^='tenor_Options']").val().match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_Options']").val().match(/\d+/g);

        $(newCard).find("[id^='tenor_Options']").val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipboxOptions']").val();
        $(newCard).find("[id^='strikeipboxOptions']").val((
          Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "UPFRONT") {
        //added by rutika on 29/04/2022
        oldko = $(thisTile).find("[id^='upfrontOptions']").val();
        $(newCard).find("[id^='upfrontOptions']").val(
          (Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      }
    }

    if (ProN == "Phoenix") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile)
          .find("[id^='tenor_Phoenix']")
          .val()
          .match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_Phoenix']").val().match(/\d+/g);

        $(newCard)
          .find("[id^='tenor_Phoenix']")
          .val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='koinputbox']").val();
        $(newCard)
          .find("[id^='koinputbox']")
          .val(
            (Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard)
          .find("[id^='strikeipbox']")
          .val(
            (
              Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='couponipbox']").val();
        $(newCard)
          .find("[id^='couponipbox']")
          .val(
            (
              Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='IBPriceipbox']").val();
        $(newCard).find("[id^='IBPriceipbox']").val((Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
        $(newCard).find("[id^='txtupfront']").val((parseFloat(100 -  Number($(newCard).find('[id^="IBPriceipbox"]').val())).toFixed(2))); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Phoenix
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='kiinputbox']").val();
        $(newCard)
          .find("[id^='kiinputbox']")
          .val(
            (Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      }
    }

    if (ProN == "TwinWin") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile)
          .find("[id^='tenor_TwinWin']")
          .val()
          .match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_TwinWin']").val().match(/\d+/g);

        $(newCard)
          .find("[id^='tenor_TwinWin']")
          .val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='koinputbox']").val();
        $(newCard)
          .find("[id^='koinputbox']")
          .val(
            (Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard)
          .find("[id^='strikeipbox']")
          .val(
            (
              Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='couponipbox']").val();
        $(newCard)
          .find("[id^='couponipbox']")
          .val(
            (
              Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='IBPriceipbox']").val();
        $(newCard).find("[id^='IBPriceipbox']").val((Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
        $(newCard).find("[id^='txtupfront']").val((parseFloat(100 -  Number($(newCard).find('[id^="IBPriceipbox"]').val())).toFixed(2))); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for Phoenix
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='kiinputbox']").val();
        $(newCard)
          .find("[id^='kiinputbox']")
          .val(
            (Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      }
    }

    if (ProN == "DCN") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile).find("[id^='tenor_DCN']").val().match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_DCN']").val().match(/\d+/g);
        $(newCard).find("[id^='tenor_DCN']").val(Number(oldtenor) +Number(lithis.innerHTML.split(" ")[0]) +currentTenor);
        $(newCard).find("[id^='tenor_DCN']").val(Number(oldtenor) + Number(lithis.innerHTML.split(" ")[0]) + currentTenor);

      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {

        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard).find("[id^='strikeipbox']").val((Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));

      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='IBPriceinputbox']").val();
        $(newCard).find("[id^='IBPriceinputbox']").val((Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
        $(newCard).find("[id^='txtupfront']").val((parseFloat(100 -  Number($(newCard).find('[id^="IBPriceinputbox"]').val())).toFixed(2))); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA

      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='couponipbox']").val();
        $(newCard).find("[id^='couponipbox']").val((Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='kiinputbox']").val();
        $(newCard).find("[id^='kiinputbox']").val((Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
      }
    }

    if (ProN == "Booster") {
      
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile).find("[id^='tenor_Booster']").val().match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_Booster']").val().match(/\d+/g);

        $(newCard).find("[id^='tenor_Booster']").val(
          Number(oldtenor) + Number(lithis.innerHTML.split(" ")[0]) + currentTenor
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='koinputbox']").val();
        $(newCard).find("[id^='koinputbox']").val((
          Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard).find("[id^='strikeipbox']").val((
          Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='couponipbox']").val();
        $(newCard).find("[id^='couponipbox']").val((
          Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='IBPriceipbox']").val();
        $(newCard).find("[id^='IBPriceipbox']").val((
          Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );

        $(newCard).find("[id^='txtupfront']").val((parseFloat(100 -  Number($(newCard).find('[id^="IBPriceipbox"]').val())).toFixed(2))); //LGTGTWINT-1095 Instant Pricing: Client Price(%) is blank on Pricing screen and order popup for FCN and DRA

      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='kiinputbox']").val();
        $(newCard).find("[id^='kiinputbox']").val((
          Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
        );
      }
    }

    if (ProN == "Sharkfin") {
      if(lithis.innerHTML.toUpperCase() == "CLONE"){ //LGTGTWINT-2143 || RizwanS || 22 Jun 2023
      }else if (lithis.innerHTML.split(" ")[1].toUpperCase() == "TENOR") {
        //added by rutika for tenor change
        currentTenor = $(thisTile)
          .find("[id^='tenor_Sharkfin']")
          .val()
          .match(/[a-zA-Z]+/g);
        oldtenor = $(thisTile).find("[id^='tenor_Sharkfin']").val().match(/\d+/g);

        $(newCard)
          .find("[id^='tenor_Sharkfin']")
          .val(
            Number(oldtenor) +
              Number(lithis.innerHTML.split(" ")[0]) +
              currentTenor
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KO") {
        oldko = $(thisTile).find("[id^='koinputbox']").val();
        $(newCard)
          .find("[id^='koinputbox']")
          .val(
            (Number(oldko) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "STRIKE") {
        oldstrike = $(thisTile).find("[id^='strikeipbox']").val();
        $(newCard)
          .find("[id^='strikeipbox']")
          .val(
            (
              Number(oldstrike) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "COUPON") {
        oldcoupon = $(thisTile).find("[id^='couponipbox']").val();
        $(newCard)
          .find("[id^='couponipbox']")
          .val(
            (
              Number(oldcoupon) + Number(lithis.innerHTML.split(" ")[0])
            ).toFixed(2)
          );
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "IB") {
        oldib = $(thisTile).find("[id^='IBPriceipbox']").val();
        $(newCard).find("[id^='IBPriceipbox']").val((Number(oldib) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
        $(newCard).find("[id^='txtupfront']").val((parseFloat(100 -  Number($(newCard).find('[id^="IBPriceipbox"]').val())).toFixed(2))); 
      } else if (lithis.innerHTML.split(" ")[2].toUpperCase() == "KI") {
        oldki = $(thisTile).find("[id^='kiinputbox']").val();
        $(newCard).find("[id^='kiinputbox']").val((Number(oldki) + Number(lithis.innerHTML.split(" ")[0])).toFixed(2));
      }
    }

  } catch (error) {
    console.log(error.message);
  }
}

function removeCurrentTile(countArr, TileId) {
  try {
    $(".removable").find("#td" + TileId).remove();
    if (countArr.indexOf(id.toString()) > -1) {
      countArr.splice(countArr.indexOf(id.toString()), 1);
    }
    idUnivCount -= 1;
  } catch (error) {
    console.log(error.message);
  }
}

var minProductTileCount = 0;

function removeTile(that, event, TileId) {
  try {
    TileId = that.id.match(/\d+$/)[0];
    thisTile = document.getElementById("td" + TileId);

    if($('tr.removable>td.newlyCreated td.productName').length === 1){
      $("#OrderPlacedAll").html("Need atleast 1 payoff on screen!");
      $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
      $(".removable").addClass("filter");
      return true;
    }
    clearInterval($(thisTile).find('[id^="hdnintervalID"]').val());
    $(thisTile).remove();

    productName = $($(that).parents(".sorting").find(".productName")).attr(
      "id"
    );

    //Added to decrement tile counter value / 19 Oct 2021

    switch (productName) {
      case "FXTRF":
        counterFXTRF--;
        break;
      case "FXAQ":
        counterFXAQ--;
        break;
      case "FXDQ":
        counterFXDQ--;
        break;
      case "FXPivot":
        counterFXPivot--;
        break;
      case "Strategies":  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
        counterFXStrategies--;
        break; 
      case "FXOPTION":    
        counterFXOptions--; //LGTGTWINT-1880  || Chaitanya M  || 04 Jul 2023
        break;
      default:
    }

    //END
  } catch (error) {
    console.log(error.message);
  }
}

function replaceAll(str, find, replace) {
  try {
    return str.replace(new RegExp(find, "g"), replace);
  } catch (error) {
    console.log(error.message);
  }
}

function createNewTile(TileId) {
  try {
    createdProductTile = "";
    newTile = document.getElementById("td" + TileId);

    var i = TileId;
    do {
      i++;
    } while (
      $(newTile).parents(".removable").find("#td" + i).length
    );

    var newCard = $(newTile).clone().attr("id", "td" + Number(i));
    $(newCard)
      .find(
        "input, img, button, td, div, span, canvas, tr, label, a, table, select, datalist, section, option"
      )
      .each(function (a, b) {
        if (b.id.match(/\d+$/) != null && b.id.match(/\d+$/)[0] == TileId) {
          $(b).attr("id", replaceAll($(b).attr("id"), TileId, i));
        }
        if (b.classList.contains("switch-label")) {
          $(b)[0].htmlFor = replaceAll($(b)[0].htmlFor, TileId, i);
        }
        if (b.classList.contains("switch-input")) {
          $(b)[0].name = replaceAll($(b)[0].name, TileId, i);
        }
        if (b.classList.contains("tablabel")) {
          $(b)[0].attributes.name.value = replaceAll(
            $(b)[0].attributes.name.value,
            TileId,
            i
          );
        }
      });

    id = TileId = i;
    newTilePosition = idUnivCount - 1;

    $(".removable").find("#td" + newTilePosition).after(newCard);
    $("#td" + idUnivCount)[0].style.display = "inline-block";
    createdProductTile = "td" + idUnivCount;
  } catch (error) {
    console.log(error.message);
  }
}

function createTiles(productName) {
  try {
    //Added Check For Each Payoff MaxTile Allowed / 19 Oct 2021

    switch (productName) {
      case "FXTRF":
        if (counterFXTRF > clientConfigdata.FXTRF.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
              " " +
              " : : Maximum" +
              " " +
              clientConfigdata.FXTRF.Maxtilecount +
              " " +
              "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;
      case "FXAQ":
        if (counterFXAQ > clientConfigdata.FXAQ.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
              " " +
              " : : Maximum" +
              " " +
              clientConfigdata.FXAQ.Maxtilecount +
              " " +
              "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;
      case "FXDQ":
        if (counterFXDQ > clientConfigdata.FXDQ.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
              " " +
              " : : Maximum" +
              " " +
              clientConfigdata.FXDQ.Maxtilecount +
              " " +
              "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
      case "FXPivot":
        if (counterFXPivot > clientConfigdata.FXPivot.Maxtilecount) {
          $("#OrderPlacedAll").html(
            productName +
              " " +
              " : : Maximum" +
              " " +
              clientConfigdata.FXPivot.Maxtilecount +
              " " +
              "Tiles Allowed."
          );
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
        break;
      
      case "Strategies":  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
          if (counterFXStrategies > clientConfigdata.FXStrategies.Maxtilecount) {
            $("#OrderPlacedAll").html(
              productName +
                " " +
                " : : Maximum" +
                " " +
                clientConfigdata.FXStrategies.Maxtilecount +
                " " +
                "Tiles Allowed."
            );
            $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
            $(".removable").addClass("filter");
            return false;
        }
        break;
      case "FXOPTION":  //LGTGTWINT-1880  || Chaitanya M  || 04 Jul 2023
          if (counterFXOptions > clientConfigdata.FXO.Maxtilecount) {
            $("#OrderPlacedAll").html(productName +" " +" : : Maximum" +" " +
                clientConfigdata.FXO.Maxtilecount +" " +"Tiles Allowed."
            );
            $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
            $(".removable").addClass("filter");
            return false;
        }
        break;
        
      default:
    }

    //END

    switch (productName) {
      case "CASHFX":
        createNewTile(1);
        idCASHFX = idUnivCount;
        onLoadCashFX(idCASHFX);
        countCASHFX.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        break;
      case "ELI":
        createNewTile(2);
        idELI = idUnivCount;
        countELI.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadELI(idELI);
        calculateTenor(idELI);
        //tenorChange(idELI);
        break;
      case "FXOPTION":
        createNewTile(3);
        idFXOPTION = idUnivCount;
        countFXOPTION.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        optionsOnLoad(idFXOPTION);
        counterFXOptions++; //LGTGTWINT-1880  || Chaitanya M  || 04 Jul 2023
        break;
      case "FIBOND":
        createNewTile(4);
        idFIBOND = idUnivCount;
        countFIBOND.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        bondOnLoad(idFIBOND);
        break;
      case "ELN":
        createNewTile(5);
        idELN = idUnivCount;
        countELN.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadELN(idELN);
        // calculateTenor(idELN);
        // tenorChange(idELN); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
     
        break;
      case "FCN":
        createNewTile(6);
        idFCN = idUnivCount;
        countFCN.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadFCN(idFCN);

        //calculateTenor(idFCN);
        // tenorChange(idFCN); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
      
        break;
      case "AQDQ":
        createNewTile(7);
        idAQDQ = idUnivCount;
        countAQ.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadAQDQ(idAQDQ);

       // calculateTenor(idAQDQ);
        //tenorChange(idAQDQ); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
       
        break;
      case "FXDCI":
        createNewTile(8);
        idDCI = idUnivCount;
        countFXDCI.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        loadDCI(idDCI);
        break;
      case "INSURANCE":
        createNewTile(9);
        idINSURANCE = idUnivCount;
        countINSURANCE.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        insuranceOnLoad(idINSURANCE);
        break;
      case "CASHEQUITIES":
        createNewTile(10);
        idCASHEQUITIES = idUnivCount;
        countCASHEQUITIES.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        cashEqOnLoad(idCASHEQUITIES);
        break;
      case "MUTUALFUND":
        createNewTile(11);
        idMUTUALFUND = idUnivCount;
        countMUTUALFUND.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        getfundonload(idMUTUALFUND);
        break;
      case "DEPOSIT":
        createNewTile(12);
        idDEPOSIT = idUnivCount;
        countDEPOSIT.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        depositOnLoad(idDEPOSIT);
        break;
      case "FXAQ":
        createNewTile(13);
        idFXAQ = idUnivCount;
        countFXAQ.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadFXAQ(idFXAQ);
        // Added to increment tile counter value / 19 Oct 2021
        counterFXAQ++;
        //END
        break;
      case "FXDQ":
        createNewTile(14);
        idFXDQ = idUnivCount;
        countFXDQ.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadFXDQ(idFXDQ);
        // Added to increment tile counter value / 19 Oct 2021
        counterFXDQ++;
        //END
        break;
      case "FXTRF":
        createNewTile(15);
        idFXTRF = idUnivCount;
        countFXTRF.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadFXTRF(idFXTRF);
        // Added to increment tile counter value / 19 Oct 2021
        counterFXTRF++;
        //END
        break;
      case "FXPIVOT":
        createNewTile(16);
        idFXPivot = idUnivCount;
        countFXPivot.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadFXPivot(idFXPivot);
        // Added to increment tile counter value / 19 Oct 2021
        counterFXPivot++;
        //END
        break;
      case "BEN":
        createNewTile(17);
        idBEN = idUnivCount;
        countBEN.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadBEN(idBEN);

        //calculateTenor(idBEN);
        //tenorChange(idBEN); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
      
        break;
      case "Phoenix":
        createNewTile(18);
        idPhoenix = idUnivCount;
        countPhoenix.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadPhoenix(idPhoenix);

        //calculateTenor(idPhoenix);
        // tenorChange(idPhoenix); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
       
        break;
      case "DRA":
        createNewTile(19);
        idDRA = idUnivCount;
        countDRA.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadDRA(idDRA);
        
        break;
      case "Options":
        createNewTile(20);
        idOptions = idUnivCount;
        countOptions.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadOptions(idOptions);

        //   calculateTenor(idOptions);
        //   tenorChange(idOptions); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
       
        break;
      case "Strategies":
        createNewTile(21);
        idFXStrategies = idUnivCount;
        countStrategies.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadFXStrategies(idFXStrategies);
        counterFXStrategies++;  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
        break;
      case "RA":
        createNewTile(22);
        idRA = idUnivCount;
        countRA.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadRA(idRA);
        calculateTenor(idRA);
        tenorChange(idRA);
        break;
      case "Snowball":
        createNewTile(23);
        idSnowball = idUnivCount;
        countSnowball.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadSnowball(idSnowball);
        calculateTenor(idSnowball);
        tenorChange(idSnowball);
        break;
      case "WoBAutocall":
        createNewTile(24);
        idWoBAutocall = idUnivCount;
        countWoBAutocall.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadWoBAutocall(idWoBAutocall);
        calculateTenor(idWoBAutocall);
        tenorChange(idWoBAutocall);
        break;
      case "AvgAutocall":
        createNewTile(25);
        idAvgAutocall = idUnivCount;
        countAvgAutocall.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadAvgAutocall(idAvgAutocall);
        calculateTenor(idAvgAutocall);
        tenorChange(idAvgAutocall);
        break;
      case "ELCI":
        createNewTile(26);
        idELCI = idUnivCount;
        countELCI.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadELCI(idELCI);
        calculateTenor(idELCI);
        tenorChange(idELCI);
        break;
      case "RELCI":
        createNewTile(27);
        idRELCI = idUnivCount;
        countRELCI.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadRELCI(idRELCI);
        calculateTenor(idRELCI);
        tenorChange(idRELCI);
        break;
      case "TwinWin":
        createNewTile(28);
        idTwinWin = idUnivCount;
        countTwinWin .push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadTwinWin(idTwinWin);
        break;
     case "Sharkfin":
          createNewTile(29);
          idSharkfin = idUnivCount;
          countSharkfin.push(idUnivCount.toString());
          orderArray.push(idUnivCount);
          idUnivCount += 1;
          onLoadSharkfin(idSharkfin);
          break;
      // case "BEI":
      //   createNewTile(29);
      //   idBEI = idUnivCount;
      //   countBEI.push(idUnivCount.toString());
      //   orderArray.push(idUnivCount);
      //   idUnivCount += 1;
      //   onLoadBEI(idBEI);
      //   calculateTenor(idBEI);
      //   tenorChange(idBEI);
      //   break;
      // case "SPS":
      //   createNewTile(30);
      //   idSPS = idUnivCount;
      //   countSPS.push(idUnivCount.toString());
      //   orderArray.push(idUnivCount);
      //   idUnivCount += 1;
      //   onLoadSPS(idSPS);
      //   calculateTenor(idSPS);
      //   tenorChange(idSPS);
      //   break;
      case "Booster":
        createNewTile(30);
        idBooster = idUnivCount;
        countBooster.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        onLoadBooster(idBooster);
        
        break;
      // case "FCI":
      //   createNewTile(31);
      //   idFCI = idUnivCount;
      //   countFCI.push(idUnivCount.toString());
      //   orderArray.push(idUnivCount);
      //   idUnivCount += 1;
      //   onLoadFCI(idFCI);
      //   calculateTenor(idFCI);
      //   tenorChange(idFCI);
      //   break;
      // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
         case "DCN":
          createNewTile(31);
          idDCN = idUnivCount;
          countDCN.push(idUnivCount.toString());
          orderArray.push(idUnivCount);
          idUnivCount += 1;
          onLoadDCN(idDCN);
		  break;
      // END    
      case "FXDigital":
        createNewTile(32);
        idDigital = idUnivCount;
        countFXDigital.push(idUnivCount.toString());
        orderArray.push(idUnivCount);
        idUnivCount += 1;
        loadDigital(idDigital);
        break;  
      default:
        console.log("Default choice selected!");
    }
    var idClear = idUnivCount - 1;
    if ($("#td" + idClear).find(".productName")[0].id != "CASHFX") {
      $("#td" + idClear).find(".banksNameRow td").empty().html("-");
    } else {
    }
    $("#td" + idClear).find(".pricesRow td").empty().removeClass("GlowPrice_Red").html("-");
    sortingTdClick();
  } catch (error) {
    console.log(error.message);
  }
}

// User Configuration functions Start 19-08-2019------------------------------------------------

var url = clientConfigdata.CommonMethods.NodeServer;

var IsEditModeOn = true;

function loadTemplate(obj, loadTempName) {
  try {

    dictFXD = {}; //LGTGTWINT-2075 || RizwanS || 09 Jun 2023

    //set default value for tile count -added by Tushar patil.
    payCounter = clientConfigdata.PAYOFFCOUNT.TILECOUNTER;
    $(".loaderDivMain").show();
    clearPendingIntervals();
    $(obj).prependTo("div#templateList");

    $("#dialogSelect").hide(); //LGTGTWINT-1775 | Chaitanya M | 05 April 2023
    $(".removable").removeClass("filter"); //LGTGTWINT-1775 | Chaitanya M | 05 April 2023
    

    // Set tiles Counter To Deafult / 19 Oct 2021

    counterFXTRF = 1;
    counterFXAQ = 1;
    counterFXDQ = 1;
    counterFXPivot = 1;
    counterFXStrategies = 1;  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
    counterFXOptions = 1; //LGTGTWINT-1880  || Chaitanya M  || 04 Jul 2023

    //END

    countCASHFX = [];
    countELI = [];
    countFXOPTION = [];
    countFIBOND = [];
    countELN = [];
    countFCN = [];
    countAQ = [];
    countFXDCI = [];
    countINSURANCE = [];
    countCASHEQUITIES = [];
    countMUTUALFUND = [];
    countDEPOSIT = [];
    countFXAQ = [];
    countFXDQ = [];
    countFXTRF = [];
    countFXPivot = [];
    countBEN = [];
    countPhoenix = [];
    countDRA = [];
    countOptions = [];
    countStrategies = [];
    countRA = [];
    countSnowball = [];
    countWoBAutocall = [];
    countAvgAutocall = [];
    countELCI = [];
    countRELCI = [];
    countTwinWin = [];
    countBEI = [];
    countSPS = [];
    countFCI = [];
    countFXDigital = [];
    countDCN = []; // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
    countBooster = [];
    countSharkfin = [];

    var elems = $(".removable").find(".sorting");

    for (i = clientConfigdata.PAYOFFCOUNT.TILECOUNTER; i < elems.length; i++) { // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
      $(".removable").find("#td" + i).remove();
    }

    $(obj).find("i").remove();

    $(obj).siblings().css("background-color", "#f3f3f3 !important;").find("i").remove();

    var loadTemplateName = "";
    idUnivCount = clientConfigdata.PAYOFFCOUNT.TILECOUNTER; // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023

    if (loadTempName != undefined) {
      loadTemplateName = loadTempName;

      $("#templateList>div:first-child").find("i").remove();
      $("#templateList>div:first-child").append("<i class='arrow right'></i>");
    } else {
      loadTemplateName = document.getElementById("templateList").firstChild.children[1].innerText;  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
      $(obj).css("background-color", "#fff !important;").append("<i class='arrow right'></i>");   //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
  
    }
  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
    //$(obj)
     // .css("background-color", "#fff !important;")
    //  .append("<i class='arrow right'></i>");
    //end

    clearPrices();
    $("#CurrentTemplate").removeClass(".templateName-active");  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 

    $("#btnEdit").attr("disabled", false);
    $("#btnDelete").attr("disabled", false);
    $("#CurrentTemplate").val(loadTemplateName);
    $("#hiddenCurrentTemplate").html(loadTemplateName);
    $("#Span30").html(loadTemplateName);
    $("#CurrentTemplate").addClass(".templateName-active");  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 

    $(".removable>td.newlyCreated").each(function (i, oldData) {
      $(oldData).remove();
    });

    let Username =""
    if(document.getElementById("templateList").firstChild.children[2].innerText === ""){
      Username = userName;
    }else{
      Username = document.getElementById("templateList").firstChild.children[2].innerText;
    }
    request_getDataFromAPI(
      {
        templateName: loadTemplateName,
        EntityID: EntityID,
        userName: Username, //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
      },
      clientConfigdata.CommonMethods.NodeServer +"cadb/GetPortfoliobyName").then((data) => {

      $(data.dataFromAjax).each(function (i, product) { // RizwanS || HSBCFXEINT-6 || 07 Nov 2023

        // LGTGTWINT-1779 Added for the Pubilic or Private Portfolio check. | Chaitanya M | 28 March 2023
        if(product.Public_YN == "Y"){ // LGTGTWINT-1779  Added for the Pubilic or Private Portfolio check. | Chaitanya M | 28 March 2023
          _setpublicYN = "Y";
        }else{
          _setpublicYN= "N";
        }
        //End
        for (productValue of MAPLE_TABLE) {

          if (productValue.toUpperCase() === product.ProductName.toUpperCase()) {
            createTiles(productValue);

            if (
              productValue.Product_BG != undefined &&
              productValue.Product_BG != ""
            ) {
              $("#" + createdProductTile).addClass(productValue.Product_BG); // Added By Aniruddha for personalise theme
            }
            setProductFilters(
              document.getElementById(createdProductTile),
              $(product)[0].Filters
            );
          }
        }
      });

      $(".loaderDivMain").hide();
      closeSideNav();
      ClearAllGraphs();
    });
  } catch (er) {}
}

function saveCADBLayout(tempName) {
  try {
    
    var sequenceNo = 0;
    var newTemplate = true;
    var ProductName = "";
    var templateName = "";
    templateName = $("#TemplateName").val().trim();
    clearPrices();

    // Set tiles Counter To Deafult / 19 Oct 2021

    counterFXTRF = 1; 
    counterFXAQ = 1;
    counterFXDQ = 1;
    counterFXPivot = 1;
    counterFXStrategies = 1;  //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
    counterFXOptions =1; //LGTGTWINT-1880  || Chaitanya M  || 04 Jul 2023
    //END

    //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
    //START
    if (tempName == "NEW" || tempName == "SAVEAS") {
      if (templateName == "") {
        openValidationpopup('',"Please enter template name");
        return false;
      }

      // Start - Instant pricer changes | Chaitanya M | HSBCFXEINT-2 | 10 Nov 2023
      let savePortfolio = getSyncResponse({
          sequenceNo: "",
          templateName: templateName,
          ProductName: "",
          EntityID: EntityID,
          userName: userName,
      },clientConfigdata.CommonMethods.NodeServer +"cadb/CheckPortfolioExists");
      // ENd - Instant pricer changes | Chaitanya M | HSBCFXEINT-2 | 10 Nov 2023

      if (savePortfolio == false) { // Instant pricer changes | Chaitanya M | HSBCFXEINT-2 | 10 Nov 2023
        let returnType; // Instant pricer changes | Chaitanya M | HSBCFXEINT-2 | 10 Nov 2023

        if(tempName == "NEW"){
           returnType = insertNewProductsInDB(templateName, newTemplate);
        }else{
           returnType = insertNewProductsInDB(templateName, newTemplate,true);
            //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023    
            _UpdateFlagFXAQ = true; 
            _UpdateFlagFXDQ = true;
            _UpdateFlagFXTRF = true;
            _UpdateFlagFXPivot = true;
            _UpdateFlagFXO = true;// LGTGTWINT-1880 |Chaitanya M | 17-June -2023
            _UpdateFlagFXStrategies = true;// LGTGTWINT-1880 |Chaitanya M | 17-June -2023
            //End
        }

        if (returnType) {
          //LGTGTWINT-1775 On updating existing template,Updated changes are not reflected unless template is reloaded | Chaitanya M | 28 March 2023
         loadUserTemplates("",templateName);
          
          if (document.getElementById("templateList").firstChild != undefined) {
             loadTemplate("",templateName);          
           } 
           loadUserTemplates("",templateName);

          // Create template popup stickiness issue resolved.
          setTimeout(function () {
            $("#OrderPlacedAll").html("Portfolio Created Successfully!");
            $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
            $(".removable").addClass("filter");
          }, 1000);

          //till here

          return true;
        } else {
          $("#OrderPlacedAll").html("Failed to Create the Portfolio!"); // Info Message Template Dialog Box Changes - Runal 
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
          return false;
        }
      } else {
        $("#OrderPlacedAll").html("Portfolio Name Already Exists!");
        $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
        $(".removable").addClass("filter");
      //  return false;
      }
    } else {
      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023 
      // For default cannot be modified.
      if(templateName.toUpperCase() == "DEFAULT"){
        $("#dialogSelect").hide();
        $("#templateLoader").hide();
        $("#OrderPlacedAll").html("Cannot update 'DEFAULT' portfolio");  
        $("#booktradecashx").show(); 
        $(".removable").addClass("filter"); 
        return false;
      }

      // For checkiing already existing templates while updation.
      if($("#Span30").html().toUpperCase() != templateName.toUpperCase()){     
        if ( getSyncResponse(
            {
              sequenceNo: "",
              templateName: templateName,
              ProductName: "",
              EntityID: EntityID,
              userName: userName,
            },
            clientConfigdata.CommonMethods.NodeServer +"cadb/CheckPortfolioExists").checkTemplateExistsResult == false) {
        
          $("#dialogSelect").hide();
          $("#templateLoader").hide();
          $("#OrderPlacedAll").html("Portfolio Name Already Exists!");
          $("#booktradecashx").show(); 
          $(".removable").addClass("filter"); 
          return false;
        }
     }
      //End
      deleteAjaxCall();
      let returnType = insertNewProductsInDB(templateName);
      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023    
      _UpdateFlagFXAQ = true; 
      _UpdateFlagFXDQ = true;
      _UpdateFlagFXTRF = true;
      _UpdateFlagFXPivot = true;
      _addtileflag = false; // Added for disabling clone tile flag. LGTGTWINT-2186 | Chaitanya M | 21 July 2023
      _UpdateFlagFXO = true;// LGTGTWINT-1880 |Chaitanya M | 17-June -2023
      _UpdateFlagFXStrategies = true;// LGTGTWINT-1880 |Chaitanya M | 17-June -2023
      //End

      if (returnType) {

      //LGTGTWINT-1775 On updating existing template,Updated changes are not reflected unless template is reloaded | Chaitanya M | 28 March 2023
        loadUserTemplates("",templateName);
        
        if (document.getElementById("templateList").firstChild != undefined) {

          loadTemplate("",templateName);           
        
        }

        loadUserTemplates("",templateName); //LGTGTWINT-1812 Tiles are not displayed when name of existing portfolio is changed and saved as new portfolio | Chaitanya M | 1 April 2023
 
        //End
        $("#templateLoader").hide();

        //Saved template popup stickiness issue resolved.
        setTimeout(function () {
          $("#OrderPlacedAll").html("Portfolio Saved Successfully!");  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
          $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
          $(".removable").addClass("filter");
        }, 1000);

        // till here

      // 
      } else {
        $("#templateLoader").hide();
        $("#OrderPlacedAll").html("Failed to Save the Portfolio!"); // Info Message Template Dialog Box Changes - Runal   //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
        $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal
        $(".removable").addClass("filter"); 
        return false;
      }
    }

    $("#dialogSelect").hide(); //LGTGTWINT-945 Edit template not working properly for maple instant pricer
    return true;

    // loadUserTemplates();
    // if (document.getElementById("templateList").firstChild != undefined) {
    //   loadTemplate(
    //     "",
    //     document.getElementById("templateList").firstChild.innerText
    //   );
    // }


  } catch (er) {
    console.log(er.message);
    $("#OrderPlacedAll").html("Save Portfolio Failed! :: " + er.message); //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 

    $("#booktradecashx").show(); // Info Message Template Dialog Box Changes - Runal 
    $(".removable").addClass("filter");
  } finally {
  }
}
 //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
 //Start
 // Start - LGTCLI-392 | ChaitanyaM | 17 May 2023
function insertNewProductsInDB(templateName_NEW, newTemplate, isSAveAS,isNew) {
  try {
    var ProductName_NEW = "";
    var sequenceNo_NEW = 0;
    // Start - LGTCLI-392 | ChaitanyaM | 17 May 2023
    let sequenceid=[];
    var m = 0;     
    let isselectall = false;
    var  isELNflag, isAQDQflag, isBENflag, isDRAflag, isFCNflag, isOptionsflag,isFXAQflag, isFXTRFflag, isFXPivotflag, isFXoptionflag, isFXStrategiesflag, isFXDCIflag,isEQDCNflag,isPHOENIXflag,isTWINWINflag,isFIBondflag,isBoosterflag, isSharkfinflag;   // LGTGTWINT-1880 || Rizwan S || 14 Jun 2023  
    var _FXAQCount , _FXTRFCount , _FXPivotCount , _DRACount , _BENCount, _OptionsCount , _FCNCount , _AQDQCount , _ELNCount, _FXOptionCount, _FXStrategiesCount, _FXDCICount, _DCNCount, _PHOENIXCount,_TWINWINCount,_FIBONDCount,_BoosterCount,_SharkfinCount = "";  // LGTGTWINT-1880 || Rizwan S || 14 Jun 2023  
    var displaypayoff=[];
    //End

    if ($(".cbVisibility:checked").length == 0) {
      openValidationpopup('',"Select At Least Single Product");
      return false;
    }
    if(document.getElementById("cboPublicYN").checked){
      Public_YNflag = "Y";
    }else{
      Public_YNflag = "N";
    }

    // Start - LGTCLI-392 | ChaitanyaM | 17 May 2023

    if(isNew == true){
      $(".cbVisibility:checked").each(function (i, j) {
        if(j.id == "cbSelectAll"){
          
        }
        seq = i + "|" + j.id;
        sequenceid.push(seq);
        
      });
    }else{
      for(var x= 0; x<$('tr.removable>td.newlyCreated td.productName').length; x++){
        seq = x + "|" + $('tr.removable>td.newlyCreated td.productName')[x].id;
        sequenceid.push(seq);        
      }   

      $(".cbVisibility:checked").each(function (i, j) {

        switch(j.id){        
          case "FXAQ":
            isFXAQflag = "FXAQ";
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isFXAQflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isFXAQflag; 
              sequenceid.push(seq);    
        
            }else{
              _FXAQCount = $('tr.removable>td.newlyCreated td.productName[id="' + isFXAQflag +'"]').length ;
            }
            break;

          case "FXTRF":
            isFXTRFflag = "FXTRF"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isFXTRFflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isFXTRFflag; 
              sequenceid.push(seq); 
            }else{
              _FXTRFCount = $('tr.removable>td.newlyCreated td.productName[id="' + isFXTRFflag +'"]').length ;
            }
            break;

          case "FXPIVOT":      
            isFXPivotflag = "FXPIVOT"     
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isFXPivotflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isFXPivotflag; 
              sequenceid.push(seq); 
            }else{
              _FXPivotCount = $('tr.removable>td.newlyCreated td.productName[id="' + isFXPivotflag +'"]').length ;
            }
            break;

          case "BEN": 
            isBENflag = "BEN"     
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isBENflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isBENflag; 
              sequenceid.push(seq); 
            }else{
              _BENCount = $('tr.removable>td.newlyCreated td.productName[id="' + isBENflag +'"]').length ;
            }
            break;

          case "ELN":
            isELNflag = "ELN"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isELNflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isELNflag; 
              sequenceid.push(seq); 
            }else{
              _ELNCount = $('tr.removable>td.newlyCreated td.productName[id="' + isELNflag +'"]').length ;
            }
            break;

          case "AQDQ":
            isAQDQflag = "AQDQ"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isAQDQflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isAQDQflag; 
              sequenceid.push(seq); 
            }else{
              _AQDQCount = $('tr.removable>td.newlyCreated td.productName[id="' + isAQDQflag +'"]').length ;
            }
            break;

          case "DRA":
            isDRAflag = "DRA"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isDRAflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isDRAflag; 
              sequenceid.push(seq); 
            }else{
              _DRACount = $('tr.removable>td.newlyCreated td.productName[id="' + isDRAflag +'"]').length ;
            }
            break;

          case "FCN":
            isFCNflag = "FCN"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isFCNflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isFCNflag; 
              sequenceid.push(seq); 
            }else{
              _FCNCount = $('tr.removable>td.newlyCreated td.productName[id="' + isFCNflag +'"]').length ;
            }
            break;

          case "Options":
            isOptionsflag = "Options"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isOptionsflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isOptionsflag; 
              sequenceid.push(seq); 
            }else{
              _OptionsCount = $('tr.removable>td.newlyCreated td.productName[id="' + isOptionsflag +'"]').length ;
            }
            break;

          // LGTGTWINT-1880 || Rizwan S || 14 Jun 2023  

          case "FXOPTION":
            isFXoptionflag = "FXOPTION";
              if ($('tr.removable>td.newlyCreated td.productName[id="' + isFXoptionflag +'"]').length == 0) {
                seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
                // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
                seq = seqNo_NEW + "|" + isFXoptionflag; 
                sequenceid.push(seq);    
          
              }else{
                _FXOptionCount = $('tr.removable>td.newlyCreated td.productName[id="' + isFXoptionflag +'"]').length ;
              }
          break;  
          
          case "Strategies":
            isFXStrategiesflag = "Strategies";
              if ($('tr.removable>td.newlyCreated td.productName[id="' + isFXStrategiesflag +'"]').length == 0) {
                seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
                // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
                seq = seqNo_NEW + "|" + isFXStrategiesflag; 
                sequenceid.push(seq);    
          
              }else{
                _FXStrategiesCount = $('tr.removable>td.newlyCreated td.productName[id="' + isFXStrategiesflag +'"]').length ;
              }
              break;
          
          case "FXDCI":
                isFXDCIflag = "FXDCI";
                  if ($('tr.removable>td.newlyCreated td.productName[id="' + isFXDCIflag +'"]').length == 0) {
                    seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
                    // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
                    seq = seqNo_NEW + "|" + isFXDCIflag; 
                    sequenceid.push(seq);    
              
                  }else{
                    _FXDCICount = $('tr.removable>td.newlyCreated td.productName[id="' + isFXDCIflag +'"]').length ;
                  }
            break;     

          case "DCN":
            isEQDCNflag = "DCN"
              if ($('tr.removable>td.newlyCreated td.productName[id="' + isEQDCNflag +'"]').length == 0) {
                seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
                // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
                seq = seqNo_NEW + "|" + isEQDCNflag; 
                sequenceid.push(seq); 
              }else{
                _DCNCount = $('tr.removable>td.newlyCreated td.productName[id="' + isEQDCNflag +'"]').length ;
              }
            break;
          
          case "Phoenix":
            isPHOENIXflag = "Phoenix"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isPHOENIXflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isPHOENIXflag; 
              sequenceid.push(seq); 
            }else{
              _PHOENIXCount = $('tr.removable>td.newlyCreated td.productName[id="' + isPHOENIXflag +'"]').length ;
            }
            break;

          case "TwinWin":
            isTWINWINflag = "TwinWin"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isTWINWINflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
              seq = seqNo_NEW + "|" + isTWINWINflag; 
              sequenceid.push(seq); 
            }else{
              _TWINWINCount = $('tr.removable>td.newlyCreated td.productName[id="' + isTWINWINflag +'"]').length ;
            }
            break; 

          case "Booster":
              isBoosterflag = "Booster"
              if ($('tr.removable>td.newlyCreated td.productName[id="' + isBoosterflag +'"]').length == 0) {
                seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
                // loadnewtiles(isFXAQflag,templateName_NEW,seqNo_NEW);
                seq = seqNo_NEW + "|" + isBoosterflag; 
                sequenceid.push(seq); 
              }else{
                _BoosterCount = $('tr.removable>td.newlyCreated td.productName[id="' + isBoosterflag +'"]').length ;
              }
          break;  

          case "Sharkfin":
            isSharkfinflag = "Sharkfin"
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isSharkfinflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              seq = seqNo_NEW + "|" + isSharkfinflag; 
              sequenceid.push(seq); 
            }else{
              _SharkfinCount = $('tr.removable>td.newlyCreated td.productName[id="' + isSharkfinflag +'"]').length ;
            }
            break;

          case "FIBOND": 
            isFIBondflag = "FIBOND"
            console.log($('tr.removable>td.newlyCreated td.productName[id="' + isFIBondflag +'"]'))
            if ($('tr.removable>td.newlyCreated td.productName[id="' + isFIBondflag +'"]').length == 0) {
              seqNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1;
              seq = seqNo_NEW + "|" + isFIBondflag;
              sequenceid.push(seq);
            }else{
              _FIBONDCount = $('tr.removable>td.newlyCreated td.productName[id="' + isFIBondflag +'"]').length ;
            }
            break;

          case "cbSelectAll":
            isselectall = true;
            break;
        }

      });
    }
    
    $(".cbVisibility").each(function (i, j) {
    
      if($(".cbVisibility")[i].checked == false){
        if( j.id == "cbSelectAll"){

        }else{

          for(var t = 0; t < sequenceid.length; t++){

            if(sequenceid[t] == null || sequenceid[t] == null){

            }else{

              if( j.id == sequenceid[t].split("|")[1] ){
    
                delete sequenceid[t];      
    
              } 
            }
          }
        }          
      }
    });

    //End

    if (templateName_NEW == "") {
      openValidationpopup('',"Please enter Portfolio name"); //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
      return false;
    }
    var getMyProduct = "";

    if (newTemplate == undefined) {      
        
      // Start - LGTCLI-392 ChaitanyaM | 17 May 2023
      for(m = 0; m < sequenceid.length; m++) {     

        if(sequenceid[m] == null || sequenceid[m] == null){

        }else{

          if(sequenceid[m].split("|")[1] == isFXAQflag){
            ProductName_NEW = isFXAQflag;
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
                                        
          }else if(sequenceid[m].split("|")[1] == isFXTRFflag){
            ProductName_NEW = isFXTRFflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
              
          }else if(sequenceid[m].split("|")[1] == isFXPivotflag){ 
            ProductName_NEW = isFXPivotflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isBENflag){ 
            ProductName_NEW = isBENflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isELNflag){ 
            ProductName_NEW = isELNflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isAQDQflag){ 
            ProductName_NEW = isAQDQflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isDRAflag){ 
            ProductName_NEW = isDRAflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isFCNflag){ 
            ProductName_NEW = isFCNflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isOptionsflag){ // LGTGTWINT-1880 || Rizwan S || 14 Jun 2023
            ProductName_NEW = isOptionsflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;      

          } else if(sequenceid[m].split("|")[1] == isFXoptionflag){ 
            ProductName_NEW = isFXoptionflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  

          } else if(sequenceid[m].split("|")[1] == isFXStrategiesflag){ 
            ProductName_NEW = isFXStrategiesflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;   

          } else if(sequenceid[m].split("|")[1] == isFXDCIflag){ 
            ProductName_NEW = isFXDCIflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  

          } else if(sequenceid[m].split("|")[1] == isEQDCNflag){ 
            ProductName_NEW = isEQDCNflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;   

          } else if(sequenceid[m].split("|")[1] == isPHOENIXflag){ 
            ProductName_NEW = isPHOENIXflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  

          }  else if(sequenceid[m].split("|")[1] == isTWINWINflag){ 
            ProductName_NEW = isTWINWINflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  

          } else if(sequenceid[m].split("|")[1] == isFIBondflag){  // ShaheenL AND VinayakG for Bonds
            ProductName_NEW = isFIBondflag;
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;

          } else if(sequenceid[m].split("|")[1] == isBoosterflag){ 
            ProductName_NEW = isBoosterflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isSharkfinflag){ 
            ProductName_NEW = isSharkfinflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
          }                                                  
      
          if($('tr.removable>td.newlyCreated td.productName')[m] !=undefined ){
            getMyProduct = $($('tr.removable>td.newlyCreated td.productName')[m]).parents("td.sorting")[0];
            TileId= getMyProduct.id.match(/\d+$/)[0];
            console.log(getMyProduct + " and its tileid is : "+ TileId);

            let data = getSyncResponse(
            {
              sequenceNo: sequenceNo_NEW.toString(),
              templateName: templateName_NEW,
              ProductName: ProductName_NEW,
              EntityID: EntityID,
              userName: userName,
              filters: getProductFilters(getMyProduct),
              UserGroup:  sessionStorage.getItem("FinIQGroupID").toString(),
              Public_YN: Public_YNflag,
              sTileID: "0"
            },
            clientConfigdata.CommonMethods.NodeServer +"cadb/SavePorfolio"
            );
            console.log("Saved Data " + sequenceNo_NEW, data);
  
          }else{ 

            getMyProduct = $('tr.removable>td.CADBBasicPrototype td.productName[id="' +ProductName_NEW +'"]').parents("td.sorting")[0];

            sequenceNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1 + 1;
            TileId= getMyProduct.id.match(/\d+$/)[0];
            console.log(getMyProduct + " and its tileid is : "+ TileId);

            let data = getSyncResponse(
            {
              sequenceNo: sequenceNo_NEW.toString(),
              templateName: templateName_NEW,
              ProductName: ProductName_NEW,
              EntityID: EntityID,
              userName: userName,
              filters: getProductFilters(getMyProduct),
              UserGroup:  sessionStorage.getItem("FinIQGroupID").toString(),
              Public_YN: Public_YNflag,
              sTileID: "0"
            },
            clientConfigdata.CommonMethods.NodeServer +"cadb/SavePorfolio"
            );
            console.log("Saved Data " + sequenceNo_NEW, data);
          }            
        }
      } 
      //End                      
            
    }else {

      if(isSAveAS){       

        // Start - LGTCLI-392 | ChaitanyaM | 17 May 2023
         for(m = 0; m < sequenceid.length; m++) {     

        if(sequenceid[m] == null || sequenceid[m] == null){

        }else{

          if(sequenceid[m].split("|")[1] == isFXAQflag){
            ProductName_NEW = isFXAQflag;
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
                                        
          }else if(sequenceid[m].split("|")[1] == isFXTRFflag){
            ProductName_NEW = isFXTRFflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
              
          }else if(sequenceid[m].split("|")[1] == isFXPivotflag){ 
            ProductName_NEW = isFXPivotflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isBENflag){ 
            ProductName_NEW = isBENflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isELNflag){ 
            ProductName_NEW = isELNflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isAQDQflag){ 
            ProductName_NEW = isAQDQflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isDRAflag){ 
            ProductName_NEW = isDRAflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isFCNflag){ 
            ProductName_NEW = isFCNflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }else if(sequenceid[m].split("|")[1] == isOptionsflag){  // LGTGTWINT-1880 || Rizwan S || 14 Jun 2023
            ProductName_NEW = isOptionsflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;                  
          } else if(sequenceid[m].split("|")[1] == isFXoptionflag){ 
            ProductName_NEW = isFXoptionflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;                  
          } else if(sequenceid[m].split("|")[1] == isFXStrategiesflag){ 
            ProductName_NEW = isFXStrategiesflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;                  
          } else if(sequenceid[m].split("|")[1] == isFXDCIflag){ 
            ProductName_NEW = isFXDCIflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;                  
          } else if(sequenceid[m].split("|")[1] == isEQDCNflag){ 
            ProductName_NEW = isEQDCNflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;                  
          } else if(sequenceid[m].split("|")[1] == isPHOENIXflag){ 
            ProductName_NEW = isPHOENIXflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;                  
          }  else if(sequenceid[m].split("|")[1] == isTWINWINflag){ 
            ProductName_NEW = isTWINWINflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;                  
          } else if(sequenceid[m].split("|")[1] == isFIBondflag){  // ShaheenL AND VinayakG for Bonds
            ProductName_NEW = isFIBondflag;
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;
          } else if(sequenceid[m].split("|")[1] == isBoosterflag){ 
            ProductName_NEW = isBoosterflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
          } else if(sequenceid[m].split("|")[1] == isSharkfinflag){ 
            ProductName_NEW = isSharkfinflag; 
            sequenceNo_NEW = Number(sequenceid[m].split("|")[0]) + 1;  
            
          }                                                    
      
          if($('tr.removable>td.newlyCreated td.productName')[m] !=undefined ){
            getMyProduct = $($('tr.removable>td.newlyCreated td.productName')[m]).parents("td.sorting")[0];
            TileId= getMyProduct.id.match(/\d+$/)[0];
            console.log(getMyProduct + " and its tileid is : "+ TileId);

            let data = getSyncResponse(
            {
              sequenceNo: sequenceNo_NEW.toString(),
              templateName: templateName_NEW,
              ProductName: ProductName_NEW,
              EntityID: EntityID,
              userName: userName,
              filters: getProductFilters(getMyProduct),
              UserGroup:  sessionStorage.getItem("FinIQGroupID").toString(),
              Public_YN: Public_YNflag,
              sTileID: "0"
            },
            clientConfigdata.CommonMethods.NodeServer +"cadb/SavePorfolio"
            );
            console.log("Saved Data " + sequenceNo_NEW, data);
            //End
  
          }else{ 

            getMyProduct = $('tr.removable>td.CADBBasicPrototype td.productName[id="' +ProductName_NEW +'"]').parents("td.sorting")[0];

            sequenceNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1 + 1;
            TileId= getMyProduct.id.match(/\d+$/)[0];
            console.log(getMyProduct + " and its tileid is : "+ TileId);

            let data = getSyncResponse(
            {
              sequenceNo: sequenceNo_NEW.toString(),
              templateName: templateName_NEW,
              ProductName: ProductName_NEW,
              EntityID: EntityID,
              userName: userName,
              filters: getProductFilters(getMyProduct),
              UserGroup:  sessionStorage.getItem("FinIQGroupID").toString(),
              Public_YN: Public_YNflag,
              sTileID: "0"
            },
            clientConfigdata.CommonMethods.NodeServer +"cadb/SavePorfolio"
            );
            console.log("Saved Data " + sequenceNo_NEW, data);

          }
            
        } 
      }
      
      }else{ 
        // Start - LGTCLI-392 | ChaitanyaM | 17 May 2023
        for(m = 0; m < sequenceid.length; m++) {  

          ProductName_NEW = sequenceid[m].split("|")[1];
          getMyProduct = $('tr.removable>td.CADBBasicPrototype td.productName[id="' +ProductName_NEW +'"]').parents("td.sorting")[0];
          sequenceNo_NEW = Number(sequenceid[sequenceid.length -1].split("|")[0]) + 1 + 1;

          let data = getSyncResponse(
            {
              sequenceNo: sequenceNo_NEW.toString(),
              templateName: templateName_NEW,
              ProductName: ProductName_NEW,
              EntityID: EntityID,
              userName: userName,
              filters: getProductFilters(getMyProduct),
              UserGroup:  sessionStorage.getItem("FinIQGroupID").toString(),
              Public_YN: Public_YNflag,
              sTileID: "0"
            },
            clientConfigdata.CommonMethods.NodeServer +"cadb/SavePorfolio"
          );
          console.log("Saved Data " + sequenceNo_NEW, data);
        }
        //End
      }
      //End
      
    }        
   
    $("#dialogSelect").hide(); //LGTGTWINT-945 Edit template not working properly for maple instant pricer
    $(".removable").removeClass("filter");
    $("#DivOverlay").hide();
    $("#OverlayBody").hide(); // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
    // $("body")[0].style.overflow = "scroll"; //Bhavya 05-09-2019 LGTGTWINT - 687
    return true;
  } catch (error) {

    console.log(error.message);
  } finally {
  }
}
//ENd

function loadUserTemplates(that,_templateName) {
  try {
    $("#btnEdit").attr("disabled", true);
    $("#btnDelete").attr("disabled", true);

    $("#CurrentTemplate").val("");

    $(".cbVisibility").each(function () {
      this.checked = false;
    });
     //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
     //start

    $("#btntmpltetypeSelf").removeClass("btn-group-active");
    $("#btntmpltetypeGroup").removeClass("btn-group-active");
    $("#btntmpltetypeAll").removeClass("btn-group-active");

    if($(that).attr("id") == "btntmpltetypeSelf" ){
      _templatetype = "Self";
      $(that).addClass("btn-group-active");
    }else if($(that).attr("id") == "btntmpltetypeGroup" ){
      _templatetype = "Group";
      $(that).addClass("btn-group-active");
    }else if($(that).attr("id") == "btntmpltetypeAll" ){
      _templatetype = "All";
      $(that).addClass("btn-group-active");
    }else{
      _templatetype = "Self";
      $("#btntmpltetypeSelf").addClass("btn-group-active");
    }
    //End

    let templateNames = getSyncResponse(
      {
        EntityID: EntityID,
        UserName: userName,
        UserGroup: sessionStorage.getItem("FinIQGroupID").toString(), //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
        TemplateType: _templatetype, //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
      },
      clientConfigdata.CommonMethods.NodeServer +"cadb/GetPortfolioByCode"
    );

    $("#templateList").empty();

    $(templateNames).each(function () {
     //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
       var arrowstr ="";
       var str2
      if(this.TemplateName ==  $("#Span30").html() ){
      arrowstr = "<i class='arrow right'></i>"
      str2 = "<span style='color: #ffffff !important;'>" + this.TemplateName + "</span> | <span style ='color: #ffffff !important;'><small>" + this.UserName + "</small></span>" + arrowstr;
      }else{
        str2 = "<span style='color: #ffffff !important;'>" + this.TemplateName + "</span> | <span style ='color: #ffffff !important;'><small>" + userName + "</small></span>" ;
      }

      if(this.Public_YN == "Y"){

        var str =
        "<div class='templateName' contenteditable='false' onclick='loadTemplate(this)'> " + 
        // "<img style = ' width: 25px; height: 25px;' src = '" + imgsrc + "'/> &nbsp;" +
        "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='20' viewBox='0 0 68.595 58.313'>" +
        "<g id='group-user' data-name='Group 4694'>"
          + "<path id='Path_38781' data-name='Path 38781' d='M0,195.456a10.443,10.443,0,0,1,3.269-5.922A9.72,9.72,0,0,1,9.4,187.013c1.736-.079,3.479-.01,5.219-.033.566-.008.637.21.472.693a13.439,13.439,0,0,0-.628,4.413q.014,9.67.007,19.34a5.515,5.515,0,0,0,.172,1.856c.174.5-.049.643-.506.641-1.227-.006-2.454.014-3.681,0-1.649-.023-3.3.056-4.948-.073a6,6,0,0,1-5.238-4.053c-.077-.232-.176-.456-.265-.684V195.456' transform='translate(0 -155.627)' fill='#ffffff'/>"
          + "<path id='Path_38782' data-name='Path 38782' d='M124.593,188.184q-6.491,0-12.982,0a8.74,8.74,0,0,1-1.2-.08,1.942,1.942,0,0,1-1.732-1.76,7.82,7.82,0,0,1-.075-1.066c0-6.134.006-12.269-.007-18.4a10.436,10.436,0,0,1,3.3-8.17,10.277,10.277,0,0,1,7.172-2.633c3.725-.017,7.45-.034,11.175,0a9.984,9.984,0,0,1,9.5,5.788,10.723,10.723,0,0,1,.968,4.877q.021,9.335,0,18.671a6.683,6.683,0,0,1-.082,1,1.944,1.944,0,0,1-1.724,1.694,8.741,8.741,0,0,1-1.2.08q-6.558.008-13.116,0' transform='translate(-90.391 -129.887)' fill='#ffffff'/>"
          + "<path id='Path_38783' data-name='Path 38783' d='M145.031,0A11.964,11.964,0,1,1,133.1,11.964,11.936,11.936,0,0,1,145.031,0' transform='translate(-110.783 0)' fill='#ffffff'/>"
          + "<path id='Path_38784' data-name='Path 38784' d='M318.995,201.424q0-4.918,0-9.835a12.683,12.683,0,0,0-.634-4.009c-.109-.332-.168-.638.345-.625a59.636,59.636,0,0,1,6.347.127,9.928,9.928,0,0,1,8.447,9.536q.039,5.62,0,11.24a5.9,5.9,0,0,1-5.61,5.946c-2.851.194-5.706.039-8.559.083-.456.007-.682-.139-.509-.638a5.793,5.793,0,0,0,.173-1.922q.01-4.951,0-9.9Z' transform='translate(-264.925 -155.591)' fill='#ffffff'/>"
          + "<path id='Path_38785' data-name='Path 38785' d='M35.19,83.929a8.977,8.977,0,1,1,9.013-9,9.009,9.009,0,0,1-9.013,9' transform='translate(-21.836 -54.914)' fill='#ffffff'/>"
          + "<path id='Path_38786' data-name='Path 38786' d='M284.38,83.935a9.054,9.054,0,0,1-8.921-9.076,8.981,8.981,0,0,1,17.962.128,9.038,9.038,0,0,1-9.042,8.948' transform='translate(-229.275 -54.919)' fill='#ffffff'/>"
        + "</g></svg> &nbsp;" + str2 + "</div>";

      }else{

            var str =
            "<div class='templateName' contenteditable='false' onclick='loadTemplate(this)'> " + 
            // "<img style = ' width: 25px; height: 25px;' src = '" + imgsrc + "'/> &nbsp;" +
            "<svg xmlns='http://www.w3.org/2000/svg' width='21' height='17' viewBox='0 0 48.752 58.313'> <g id='single-user' data-name='Group 4693' transform='translate(0 0)'>"
            +"<path id='Path_38779' data-name='Path 38779' d='M8.726,227.506A12.175,12.175,0,0,1,4.9,226.292a8.929,8.929,0,0,1-4.726-6.91,28.566,28.566,0,0,1,.257-7.928,25.173,25.173,0,0,1,1.588-6.148A12.606,12.606,0,0,1,7.3,198.743a11.288,11.288,0,0,1,5.5-1.423,2.858,2.858,0,0,1,1.356.375c1.013.524,1.937,1.192,2.9,1.8a13.386,13.386,0,0,0,7.908,2.255,13.552,13.552,0,0,0,6.526-2.116,22.713,22.713,0,0,0,1.954-1.271,5.319,5.319,0,0,1,4.469-.883,11.007,11.007,0,0,1,8.027,6.093,24.7,24.7,0,0,1,2.428,8.068,32.572,32.572,0,0,1,.327,6.913A9.271,9.271,0,0,1,41.08,227.3c-.351.075-.7.137-1.056.2Z' transform='translate(0 -169.194)' fill='#ffffff'/>"
            +"<path id='Path_38780' data-name='Path 38780' d='M83.576,0a14.09,14.09,0,1,1,.014,28.18,14.233,14.233,0,0,1-14.105-14.13C69.485,6.409,76.009-.181,83.576,0' transform='translate(-59.58 -0.001)' fill='#ffffff'/>"
            + "</g></svg> &nbsp;" + str2 + "</div>";

          }    

      $("#templateList").append(str);
    });

    //if no template for user
    if (templateNames == "" || templateNames == null || templateNames == undefined) { //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 

      // Start - LGTCLI-392 | ChaitanyaM | 17 May 2023
      //$("#cbSelectAll").click();

      $(".cbVisibility").each(function (e,i) {
        $(".cbVisibility")[e].checked = true;
      });
       
      if(_templatetype == "Self"){
      insertNewProductsInDB("DEFAULT", true,"",true);
      //End
      
      loadUserTemplates();
      
      }   

      // Info Message Template Dialog Box Changes - Runal 
      // $("#dialog-confirm").hide();
      // $(".loaderDivMain").hide();
      // if(sessionStorage.getItem("noTemplateFlag") == "true" || sessionStorage.getItem("noTemplateFlag") == null){
      // $("#OrderPlacedAll").html(
      //     "No template found for logged-in user, please create a template."
      // );
      //   // $("#booktradecashx").show();
 
      // }
      // sessionStorage.setItem("noTemplateFlag", true);
      // return false;
    }
    // sessionStorage.setItem("noTemplateFlag", false);
  } catch (error) {
    console.log(error.message);
  }
}

function deleteTemplate() {
  try {

    if($("#hiddenCurrentTemplate").html().trim().toUpperCase() == "DEFAULT"){

      // alert("Can not delete default template");
      $("#dialog-confirm").hide();
      $(".removable").removeClass("filter");
      $("#DivOverlay")[0].style.opacity = "0.25"; // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
      $("#OrderPlacedAll").html("Can not delete default Portfolio!");
      $("#booktradecashx").show();
      $(".removable").addClass("filter");
        return false;

    // LGTGTWINT-1773 | Template deleted successfully message reflected when tried to delete public portfolio from other login.| Chaitanya M | 28 March 2023 
    }else if(document.getElementById("templateList").firstChild.children[2].innerText != sessionStorage.getItem("Username")){
      
      $("#dialog-confirm").hide();
      $(".removable").removeClass("filter");
      $("#DivOverlay")[0].style.opacity = "0.25"; // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
      $("#OrderPlacedAll").html("Cannot delete this Portfolio!");
      $("#booktradecashx").show();
      $(".removable").addClass("filter");
      return false;
    }
    // End

    clearPendingIntervals(); // Added to stop pooling EQC payoff's // 16 Mar 2022
    deleteAjaxCall();
    $(".removable>td.newlyCreated").each(function () {
      $(this).remove();
    });
    loadUserTemplates();
    if (document.getElementById("templateList").firstChild != undefined) {
      loadTemplate(
        "",
        document.getElementById("templateList").firstChild.children[1].innerText  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
      );
    }
    else{
      $("#hiddenCurrentTemplate").html(""); // Info Message Template Dialog Box Changes - Runal 
    }

    setTimeout(function () {

      $("#OrderPlacedAll").html("Portfolio Deleted Successfully!");  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
      $("#booktradecashx").show();
      $(".removable").addClass("filter");

    }, 1000);

    $("#dialog-confirm").hide(); //LGTGTWINT-945 Edit template not working properly for maple instant pricer
    $(".removable").removeClass("filter"); // LGTGTWINT-945 Edit template not working properly for maple instant pricer
  } catch (error) {
    console.log(error.message);
    $("#OrderPlacedAll").html("Failed to Delete the Portfolio :: " + error.message);  //LGTGTWINT-1710 Sharing of Instant Pricer Portfolios across users | Chaitanya M | 16 March 2023 
    $("#booktradecashx").show();// Info Message Template Dialog Box Changes - Runal 
    $(".removable").addClass("filter");
  } finally {
    // Delete template popup stickiness issue resolved.
    setTimeout(function () {
    // Info Message Template Dialog Box Changes - Runal 
      // if(sessionStorage.getItem("noTemplateFlag") == "true"){
      //   $("#OrderPlacedAll").html("Template Deleted Successfully!<br><br>No Other Templates Found");
      // }
      // else{
      // $("#OrderPlacedAll").html("Template Deleted Successfully!");
      // }
      // $("#booktradecashx").show();

      // if($("#hiddenCurrentTemplate").html().trim().toUpperCase() != "DEFAULT"){
      // }else{

      // }

    }, 1000);
  }
  //till here
}

function deleteAjaxCall() {
  try {
    
    // Start - Instant pricer changes | Chaitanya M | HSBCFXEINT-2 | 10 Nov 2023
    requestObj = {
      EntityID: EntityID,
      TemplateType: $("#hiddenCurrentTemplate").html().trim(),        
      userName: userName,
      UserGroup : sessionStorage.getItem("FinIQGroupID").toString(),
    }

    hash =  gethash(requestObj,clientConfigdata.CommonMethods.NodeServer +"cadb/DeletePortfolio","POST");

    $.ajax({
      type: "POST",
      url: clientConfigdata.CommonMethods.NodeServer +"cadb/DeletePortfolio",
      contentType: "application/json",
      dataType: "json",
      headers:{
        'Authorization':"Bearer " + sessionStorage.getItem("nested_"),
        'hash': hash,
      },
      data: JSON.stringify(requestObj),
      crossDomain: true,
      async: false,
      success: function (data) {},
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
      },
    });

    // End - Instant pricer changes | Chaitanya M | HSBCFXEINT-2 | 10 Nov 2023

  } catch (error) {
    console.log(error.message);
  }
}

function checkandUncheck() {
  try {
    $(".cbVisibility").each(function () {
      this.checked = false;
    });

    $("#TemplateName").val($("#CurrentTemplate").val()).focus().select();
    $(".removable>td.newlyCreated").each(function (i, pro) {
      var selectedProduct = $(pro).find(".productName")[0].id;

      $(".cbVisibility").each(function () {
        if (this.id == selectedProduct) {
          this.checked = true;
        }
      });
    });

    $(".cbVisibility:checked").length ==
    $("#MAPLEACTBL").find("input.cbVisibility").length
      ? $("#cbSelectAll").prop("checked", true)
      : $("#cbSelectAll").prop("checked", false);
  } catch (error) {}
}

function CreateNewLayout() {
  try {
    //clearPrices();              // Commented to avoid clear all price grid data // 16 March 2022
    $("#chk_NEW").prop("checked", false);
    //$("#TemplateName").val($("#CurrentTemplate").val()).focus().select();
    // $("#TemplateName").val($("#Span30").html()); //LGTGTWINT-1780 Portfolio name not auto populated on edit/create portfolio pop up  | Chaitanya M | 28 March 2023
    checkandUncheck();
    $("#TemplateName").val($("#Span30").html()); //LGTGTWINT-1780 Portfolio name not auto populated on edit/create portfolio pop up  | Chaitanya M | 28 March 2023

    // LGTGTWINT-1779 Added for the Pubilic or Private Portfolio check. | Chaitanya M | 28 March 2023

     // Added for the Pubilic or Private Portfolio check. | Chaitanya M | 28 March 2023
    //  if(document.getElementById("templateList").firstChild.childNodes[1].childNodes[0].firstChild == null){  
        
    //   $("#cboPublicYN").prop("checked", false);
     
    // }else{

    //   $("#cboPublicYN").prop("checked", true);
      
    // }
    //End
     // // LGTGTWINT-1779  Added for the Pubilic or Private Portfolio check. | Chaitanya M | 28 March 2023
    if(_setpublicYN != "Y"){  
        
      $("#cboPublicYN").prop("checked", false);
     
    }else{

      $("#cboPublicYN").prop("checked", true);
      
    }
    //End
    //End
    
    // $("#dialogSelect").dialog();
    $("#dialogSelect").show(); //LGTGTWINT-945 Edit template not working properly for maple instant pricer

    $(".removable").addClass("filter");
    // $("#DivOverlay").show();
    $("#OverlayBody").css({ display: "block", height: "300%", opacity: "0.025"}); // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
    $("body")[0].style.overflow = "hidden"; //Bhavya 05-09-2019

    if($("#hiddenCurrentTemplate").html().trim().toUpperCase() == "DEFAULT"){

      $("#updateTemplate").attr("disabled", true);

    // Added the condition for LGTGTWINT-1746 'Create New template' to be replaced with 'Save as New template' with the option to save the changes made to any previous template
    }else if( document.getElementById("templateList").firstChild.children[2].innerText != userName){  

      $("#updateTemplate").attr("disabled", true);
    
    //End
    }else{

      $("#updateTemplate").attr("disabled", false);
      
    }


  } catch (er) {
    console.log(er.message);
  }
}

var payCounter = clientConfigdata.PAYOFFCOUNT.TILECOUNTER;

function getProductFilters(card, newtile) {
  //Added By AniruddhaJ for Basket Save || 24Sep2021 || CFINT - 1107
  try {
    var returnString = "";
    var strVal = "";

    $(card).find(".MainTable").each(function (tdIndex, tdControl) {
        $(tdControl)
          .find(
            "input[type='text'], input[type='search'], select, span.notionalCcy,div.ddlShares, input.FX_CCYNotional" //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
          )
          .each(function (i, inp) {
            var payfiledID = "";
            parseInt($(inp).attr("id").replace(/\D/g, "")) <
            clientConfigdata.PAYOFFCOUNT.TILECOUNTER
              ? (payfiledID = $(inp).attr("id"))
              : (payfiledID =
                  $(inp).attr("id").replace(/\d+/g, "") + payCounter);

            // Added For JIRA ID -NT1FIN47-447 // 05 April 2022
            if (
              newtile != undefined &&
              parseInt($(inp).attr("id").replace(/\D/g, "")) >=
                clientConfigdata.PAYOFFCOUNT.TILECOUNTER
            ) {
              payfiledID =
                $(inp).attr("id").replace(/\d+/g, "") +
                newtile.id.replace(/\D/g, "");
            }

            if ($(inp).prop("tagName") === "DIV") {
              strVal = "";
              $(inp).find("span").each(function (i, item) {
                  if (i === $(inp).find("span").length - 1) {
                    strVal = strVal + $(item).text().trim().slice(0, -1); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
                  } else {
                    strVal = strVal + $(item).text().trim().slice(0, -1); //LGTGTWINT-1723 || Added by Rizwan || 14 Mar 2023
                  }
                });

              if (
                i == $(tdControl).find(
                  "input[type='text'], input[type='search'], select, span.notionalCcy, div.ddlShares, input.FX_CCYNotional"//LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
                ).length - 1
              ) {
                returnString = returnString + payfiledID + "|" + strVal;
              } else {
                returnString = returnString + payfiledID + "|" + strVal + ":";
              }
            } else {
              if ($(inp).prop("tagName") == "SPAN") {
                strVal = $(inp).text();
              } else {
                strVal = $(inp).val();
              }

              if (
                i ==
                $(tdControl).find(
                  "input[type='text'], input[type='search'], select, span.notionalCcy, span, input.FX_CCYNotional"//LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
                ).length -
                  1
              ) {
                returnString = returnString + payfiledID + "|" + strVal;
              } else {
                returnString = returnString + payfiledID + "|" + strVal + ":";
              }
            }
          });
        ClearAllGraphs();
      });

    console.log(returnString);
    if (newtile == undefined) {
      payCounter++;
    }
    return returnString;
  } catch (error) {
    console.log(error.message);
  }
}

function setProductFilters(card, strFilter) {
  try {
    $(card).removeClass("CADBBasicPrototype");
    $(card).addClass("newlyCreated");

    var CCY_Notional=""; //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
    if (strFilter != "" && strFilter != undefined) {
      $(card).find(".MainTable").each(function (tdIndex, tdControl) {
          $(tdControl).find(
              "input[type='text'], input[type='search'], select, span.notionalCcy, div.ddlShares, input.FX_CCYNotional" //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
            ).each(function (i, inp) {
         if (i <strFilter.split(":").length){ //LGTCLI-394: Instant Pricer TARF & Pivot Tiles Not Loaded with Spot Price
        
            if ($(inp).attr("id") == strFilter.split(":")[i].split("|")[0]) {
                //Added By AniruddhaJ for Basket Save || 24Sep2021 || CFINT - 1107
                if ($(inp).attr("id").includes("shareDiv")) {
                  // this is basket now check for basket div
                  $(card).find("#" + $(inp).attr("id")).find("span").each(function (i, spanItem) {
                      $(spanItem).remove();
                    }); // to removed existing share span  items

                  for (let _ShareName of strFilter.split(":")[i].split("|")[1].split(" ")) {
                    // split share names and send to basket
                  // LGTGTWINT-1605 Instant Pricer : Text colour of Underlying names to be based on Advisory flag (Green for Yes, Red for No) | 03 March 2023

                    data = EQCShareNameObj.filter(function (item) {
                      return item["Code"] ==  _ShareName.trim();
                    });

                  if (_ShareName.trim() != "") {
                    createElementInBasket(card,$(inp).attr("id"),_ShareName.trim(),"",data[0].AdvisoryFlag);
                  }
                }
              } else {
                if ($(inp).prop("tagName") == "SPAN")
                  $(inp).html(strFilter.split(":")[i].split("|")[1]);
                else $(inp).val(strFilter.split(":")[i].split("|")[1]);
              }
              if (
                $(card).find(".productName")[0].id == "CASHFX" &&
                $(inp).attr("id").replace(/\d/g, "") == "FXO_Direction"
              ) {
                ddl_FXO_Direction(card);
              }
              if (
                $(card).find(".productName")[0].id == "ELN" &&
                $(inp).attr("id").replace(/\d/g, "") == "solveForELN"
              ) {
                checkSolveForELN(
                  $(card).find('[id^="solveForELN"]').val(),
                  card,
                  true
                );
              } 
              // LGTGTWINT-1638 | Chaitanya M | 06 Jul 2023
                if (
                  $(card).find(".productName")[0].id == "Options" &&
                  $(inp).attr("id").replace(/\d/g, "") == "solveForOptions"
                ) {
                  checkSolveForOptions(
                    $(card).find('[id^="solveForOptions"]').val(),
                    card,
                    true
                  );
                } 
                //End
                
              //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023-StART
              if($(inp).attr("id").includes("CcySelectionFX")){
                CCY_Notional = strFilter.split(":")[i].split("|")[1];
              }
                //End
            }
          } //LGTCLI-394: Instant Pricer TARF & Pivot Tiles Not Loaded with Spot Price       

        });
      });
    }

    if ($(card).find(".productName")[0].id == "MUTUALFUND") {
      if ($("#MF_FundList" + idMUTUALFUND)[0].value != "") {
        arr = jQuery.grep(sharesnameMF, function (n, i) {
          return n.Name == $.trim($("#MF_FundList" + idMUTUALFUND)[0].value);
        });
        if (arr.length != 0) {
          $("#fundsRating" + idMUTUALFUND)[0].innerHTML = arr[0].Rating;
          $("#FundCode" + idMUTUALFUND)[0].innerHTML = arr[0].Code;
          $("#fundsCurrency" + idMUTUALFUND)[0].innerHTML = arr[0].Ccy;
          $("#FundSector" + idMUTUALFUND)[0].innerHTML = arr[0].Sector;
          $("#annualFees" + idMUTUALFUND)[0].innerHTML = arr[0].AnnualFees;
          $("#trailerFees" + idMUTUALFUND)[0].innerHTML = arr[0].TrailerFees;
          $("#fundsNav" + idMUTUALFUND)[0].innerHTML = arr[0].BidNAV;
          $("#fundsFactsheet" + idMUTUALFUND).addClass("inactiveLink");
          $("#annualReportMF" + idMUTUALFUND).addClass("inactiveLink");
          if (arr[0].Factsheet != "" && arr[0].Prospectus != "") {
            $("#fundsFactsheet" + idMUTUALFUND).removeClass("inactiveLink");
            $("#annualReportMF" + idMUTUALFUND).removeClass("inactiveLink");
            $("#fundsFactsheet" + idMUTUALFUND)[0].href = arr[0].Factsheet;
            $("#annualReportMF" + idMUTUALFUND)[0].href = arr[0].Prospectus;
            $("a.external").attr("target", "_blank");
          }

          var navDefault = $("#fundsNav" + idMUTUALFUND)[0].textContent;
          var notional = $("#funds_ContractAmt" + idMUTUALFUND)[0].value;
          var unit = parseInt(notional.replace(/,/g, "")) / parseFloat(navDefault);
          $("#navDefault" + idMUTUALFUND)[0].innerHTML = navDefault;
          // isNaN condition is added to check whether NaV is present or not then only units will get calculated || Tina K || 6-Dec-2019
          if (
            navDefault == 0 ||
            navDefault == "FAIL" ||
            navDefault == undefined ||
            navDefault == NaN ||
            isNaN($(thisTileMutualFunds).find('[id^="Funds_PriceRow"]')[0].innerText)
          ) {
            //$(thisTileMutualFunds).find('[id^="MF_units"]').html("-");
            $("#MF_units" + idMUTUALFUND)[0].innerHTML = "-";
          } else {
            $("#MF_units" + idMUTUALFUND)[0].innerHTML = unit.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          }
        }
      }
    } else if ($(card).find(".productName")[0].id == "FXOPTION") {

      // LGTGTWINT-1880 |Chaitanya M | 17-June -2023
      if(cloneTileFXD){
        getCurrencyFXORate(idReplace,true);  // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
      }else{
        getCurrencyFXORate(idFXOPTION);  // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
      }           

      if ($("#FXO_Type" + idFXOPTION)[0].value.toString() != "Vanilla") {

        $("#hdnFXOType" + idFXOPTION).val("FXBarrier");
        $("#FXBarrier_Type" + idFXOPTION).prop("disabled", false);
        // Added for hiding and showing fields as per payoff | Chaitanya M | 27 July 2023 
        $("#FXBarrier_Type" + idFXOPTION).removeClass("SHowSOlveFor");
        $("#isVanilla" + idFXOPTION).removeClass("SHowSOlveFor"); 
        $("#lblBarrierType" + idFXOPTION).removeClass("SHowSOlveFor"); 
        //ENd
        $("#FXOHedgepanel" + idFXOPTION).addClass("showHedgePanel"); 

        checkbarriertype(card); // LGTGTWINT-2330 | Chaitanya M | 11 Jan 2024
        
      } else {

        $("#hdnFXOType" + idFXOPTION).val("FXOption");
        // Added for hiding and showing fields as per payoff | Chaitanya M | 27 July 2023 
        $("#FXBarrier_Type" + idFXOPTION).addClass("SHowSOlveFor");
        $("#isVanilla" + idFXOPTION).addClass("SHowSOlveFor"); 
        $("#lblBarrierType" + idFXOPTION).addClass("SHowSOlveFor"); 
        //ENd

        // Start : Reading HedgePanelYN Config | ChaitanyaM| 06-Feb-2024
        if (clientConfigdata.CommonMethods.HEDGEPANELYN !== "N") {
          
          $("#FXOHedgepanel" + idFXOPTION).removeClass("showHedgePanel");

          if($("#FXOHedgeType" + idFXOPTION)[0].value.toString() === "NONE") {

            $("#FXOHedgeTypelbl" + idFXOPTION).addClass("showhideCustomspot");
            $("#FXOCustomeSpot" + idFXOPTION).addClass("showhideCustomspot");

          }else{

            $("#FXOHedgeTypelbl" + idFXOPTION).removeClass("showhideCustomspot");
            $("#FXOCustomeSpot" + idFXOPTION).removeClass("showhideCustomspot");

            if($("#FXOHedgeYN" + idFXOPTION)[0].value.toString() === "YES"){
              $("#FXOCustomeSpot" + idFXOPTION).prop("disabled", false);
            }else{
              $("#FXOCustomeSpot" + idFXOPTION).prop("disabled", true);
            }

          }
        }
        // End : Reading HedgePanelYN Config | ChaitanyaM| 06-Feb-2024
      }
      
      if ( $(card).find('[id^="FXObuySell"]').val().trim() == "Buy") {

        $(card).find('[id^="FXObuySell"]').removeClass("SellDropdown");
        $(card).find('[id^="FXObuySell"]').addClass("BuyDropdown");

      }else{

        $(card).find('[id^="FXObuySell"]').removeClass("BuyDropdown");
        $(card).find('[id^="FXObuySell"]').addClass("SellDropdown");
      }

      if($(card).find('[id^="ddlSolveForFX"]').val().toUpperCase().trim() === "PREMIUM"){

        $(card).find('[id^="FXO_Strike"]').prop("disabled", false);
        $(card).find('[id^="FXO_Premium"]').prop("disabled", true);
  
      }else{
  
        $(card).find('[id^="FXO_Strike"]').prop("disabled", true);
        $(card).find('[id^="FXO_Premium"]').prop("disabled", false);
  
      }

      //End
    } else if ($(card).find(".productName")[0].id == "FXAQ") {
    
      // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
      if(cloneTileFXD){
        getCurrencyFXAQRate(idReplace,true);  
      }else{
        getCurrencyFXAQRate(idFXAQ); 
      }   
      //End
            
      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 05 April 2023-StART
     
      if(CCY_Notional == $("#FXAQ_CCYPairDemo" + idFXAQ).val().split("-")[0].trim() ||
        CCY_Notional == $("#FXAQ_CCYPairDemo" + idFXAQ).val().split("-")[1].trim() ){   
        $("#CcySelectionFXAQ" + idFXAQ).val(CCY_Notional);
        $(card).find('[id^="maxlevCcyFXAQ"]').html("(" +CCY_Notional+ ")");
      }else{
        $("#CcySelectionFXAQ" + idFXAQ).val($("#FXAQ_CCYPairDemo" + idFXAQ).val().split("-")[0].trim());
        $(card).find('[id^="maxlevCcyFXAQ"]').html("(" +$(card).find('[id^="FXAQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")");
      } 
     
      //End
      // LGTCLI-417 || RizwanS || 04 May 2023

      if ( $(card).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") {

        $(card).find('[id^="payTypeSelectionFXAQDQ"]').removeClass("SellDropdown");
        $(card).find('[id^="payTypeSelectionFXAQDQ"]').addClass("BuyDropdown");

      }else{

        $(card).find('[id^="payTypeSelectionFXAQDQ"]').removeClass("BuyDropdown");
        $(card).find('[id^="payTypeSelectionFXAQDQ"]').addClass("SellDropdown");
      }
      
      //END
      
      $("#BuySellDirectionFXAQ" + idFXAQ).html(
        $("#FXAQ_CCYPairDemo" + idFXAQ).val().split("-")[0].trim()
      );

      
      // $("#primaryCcyAQ" + idFXAQ).html(
      //   $("#FXAQ_CCYPairDemo" + idFXAQ)
      //     .val()
      //     .split("-")[0]
      //     .trim()
      // );
      // $("#SecondaryCcyAQ" + idFXAQ).html(
      //   $("#FXAQ_CCYPairDemo" + idFXAQ)
      //     .val()
      //     .split("-")[1]
      //     .trim()
      // );
      // $("#CcySelectionFXAQ" + idFXAQ)[0].selectedIndex = 0;
    } else if ($(card).find(".productName")[0].id == "FXDQ") {
      // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
      if(cloneTileFXD){
        getCurrencyFXDQRate(idReplace,true);  
      }else{
        getCurrencyFXDQRate(idFXDQ); 
      }   
      //End
      
      // Added for updated ccy options | LGTGTWINT-1417 | Chaitanya M | 14 Feb 2023
      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023-StART
      
      if(CCY_Notional == $("#FXDQ_CCYPairDemo" + idFXDQ).val().split("-")[0].trim() || 
        CCY_Notional == $("#FXDQ_CCYPairDemo" + idFXDQ).val().split("-")[1].trim()){   //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023-StART
        $("#CcySelectionFXDQ" + idFXDQ).val(CCY_Notional);
        $(card).find('[id^="maxlevCcyFXDQ"]').html("(" +CCY_Notional+ ")");
      }else{
        $("#CcySelectionFXDQ" + idFXDQ).val($("#FXDQ_CCYPairDemo" + idFXDQ).val().split("-")[0].trim());
        $(card).find('[id^="maxlevCcyFXDQ"]').html("(" +$(card).find('[id^="FXDQ_CCYPairDemo"]').val().split("-")[0].trim()+ ")");
      }
    
      //End
      $("#BuySellDirectionFXDQ" + idFXDQ).html(
        $("#FXDQ_CCYPairDemo" + idFXDQ)
          .val()
          .split("-")[0]
          .trim()
      );
      // $("#primaryCcyDQ" + idFXDQ).html(
      //   $("#FXDQ_CCYPairDemo" + idFXDQ)
      //     .val()
      //     .split("-")[0]
      //     .trim()
      // );
      // $("#SecondaryCcyDQ" + idFXDQ).html(
      //   $("#FXDQ_CCYPairDemo" + idFXDQ)
      //     .val()
      //     .split("-")[1]
      //     .trim()
      // );
      // $("#CcySelectionFXDQ" + idFXDQ)[0].selectedIndex = 0;
    } else if ($(card).find(".productName")[0].id == "FXTRF") {
      // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
      if(cloneTileFXD){
        getCurrencyFXTRFRate(idReplace,"",true);
      }else{
        getCurrencyFXTRFRate(idFXTRF);
        if($(card).find('[id^="KIinpboxFXTRF"]').val() !=""){
          $(card).find('[id^="rbRowKIToggleTRF"]')[0].checked = !$(card).find('[id^="rbRowKIToggleTRF"]')[0].checked ;
        }
        
      }
      //End

      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023-StART
    
      if(CCY_Notional == $("#FXTRF_CCYPairDemo" + idFXTRF).val().split("-")[0].trim() || 
      CCY_Notional == $("#FXTRF_CCYPairDemo" + idFXTRF).val().split("-")[1].trim()){   //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023-StART
        $("#CcySelectionFXTRF" + idFXTRF).val(CCY_Notional);
        $(card).find('[id^="maxlevCcyTRF"]').html("(" +CCY_Notional+ ")");
                   
      }else{
       
        $("#CcySelectionFXTRF" + idFXTRF).val($("#FXTRF_CCYPairDemo" + idFXTRF).val().split("-")[0].trim());
        $(card).find('[id^="maxlevCcyTRF"]').html("(" +$(card).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")");

      }

      $(card).find('[id^="ccymaxclientprftFX"]').html("(" +$(card).find('[id^="FXTRF_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // LGTCLI-437 | Chaitanya M | 11 July 2023
      //End
     
      //End
      // $("#primaryCcyTRF" + idFXTRF).html(
      //   $("#FXTRF_CCYPairDemo" + idFXTRF)
      //     .val()
      //     .split("-")[0]
      //     .trim()
      // );
      // $("#SecondaryCcyTRF" + idFXTRF).html(
      //   $("#FXTRF_CCYPairDemo" + idFXTRF)
      //     .val()
      //     .split("-")[1]
      //     .trim()
      // );
      // $("#CcySelectionFXTRF" + idFXTRF)[0].selectedIndex = 0;
      $("#BuyCcyFXTRF" + idFXTRF).html("Buy" ); // LGTGTWINT-1524 | Chaitanya M | 24 Feb 2023 
      $("#SellCcyFXTRF" + idFXTRF).html("Sell" ); // LGTGTWINT-1524 | Chaitanya M | 24 Feb 2023 

      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
      if ( $(card).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {
        // LGTCLI-417 || RizwanS || 04 May 2023
        $(card).find('[id^="CcyBuSellSelectionFXTRF"]').removeClass("SellDropdown");
        $(card).find('[id^="CcyBuSellSelectionFXTRF"]').addClass("BuyDropdown");

      }else{

        $(card).find('[id^="CcyBuSellSelectionFXTRF"]').removeClass("BuyDropdown");
        $(card).find('[id^="CcyBuSellSelectionFXTRF"]').addClass("SellDropdown");
      }

     

    } else if ($(card).find(".productName")[0].id == "FXPIVOT") {
      // LGTGTWINT-2186 | Chaitanya M | 06 Jul 2023
      if(cloneTileFXD){
        getCurrencyFXPivotRate(idReplace,true); 
      }else{
        getCurrencyFXPivotRate(idFXPivot); 
      }
      //End

      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
      if(CCY_Notional == $("#FXPivot_CCYPairDemo" + idFXPivot).val().split("-")[0].trim() ||
        CCY_Notional == $("#FXPivot_CCYPairDemo" + idFXPivot).val().split("-")[1].trim()){   //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023-StART
        $("#CcySelectionFXPivot" + idFXPivot).val(CCY_Notional);
        $(card).find('[id^="maxlevCCYPivot"]').html("(" +CCY_Notional+ ")");

      }else{

        $("#CcySelectionFXPivot" + idFXPivot).val($("#FXPivot_CCYPairDemo" + idFXPivot).val().split("-")[0].trim());
        $(card).find('[id^="maxlevCCYPivot"]').html("(" +$(card).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim()+ ")");

      }
      //End

        $(card).find('[id^="ccymaxclientprftFX"]').html("(" +$(card).find('[id^="FXPivot_CCYPairDemo"]').val().split("-")[0].trim()+ ")"); // LGTCLI-437 | Chaitanya M | 11 July 2023

      
      //End
      // Added for updated ccy options | LGTGTWINT-1417 | Chaitanya M | 14 Feb 2023
     
      //End 

      //LGTCLI-367 Instant Pricing Update Tile Function- Start | Chaitanya M | 03 April 2023
      if($(card).find('[id^="txtUpperKIFXPivot"]').val() !=""){
        $(card).find('[id^="rbRowKITogglePivot"]')[0].checked = !$(card).find('[id^="rbRowKITogglePivot"]')[0].checked ;
        $(thisTileFXPivot).find('[id^="txtLowerKIFXPivot"]').prop("disabled", false);  
        $(thisTileFXPivot).find('[id^="txtUpperKIFXPivot"]').prop("disabled", false);
      }
      //ENd


    } else if ($(card).find(".productName")[0].id == "Strategies") {
      //Get saved ccy notional pair
      if(cloneTileFXD){
        getCurrencyFXStrategiesRate(idReplace, true);
      }else{
        getCurrencyFXStrategiesRate(idFXStrategies);
      }

      // Start - F5SAAINT-687 | Chaitanya M | 04 Dec 2023
      if(CCY_Notional == $("#FXStrategies_CCYPairDemo" + idFXStrategies).val().split("-")[0].trim() ||        
      CCY_Notional == $("#FXStrategies_CCYPairDemo" + idFXStrategies).val().split("-")[1].trim()){ 

        $("#CcySelectionFXStrategies" + idFXStrategies).val(CCY_Notional);

      }else{

      $("#CcySelectionFXStrategies" + idFXStrategies).val($("#FXStrategies_CCYPairDemo" + idFXStrategies).val().split("-")[0].trim());

      }
      // End - F5SAAINT-687 | Chaitanya M | 04 Dec 2023

      checkSolveForStrategies(card); // Check Solve for || RijwanS || LGTGTWINT-1880  || 20 Jun 2023

      // LGTCLI-417 || RizwanS || 04 May 2023

      if ($(card).find('[id^="strategiesBuySell"]').val().trim() == "Buy") {

        $(card).find('[id^="strategiesBuySell"]').removeClass("SellDropdown");
        $(card).find('[id^="strategiesBuySell"]').addClass("BuyDropdown");

      }else{

        $(card).find('[id^="strategiesBuySell"]').removeClass("BuyDropdown");
        $(card).find('[id^="strategiesBuySell"]').addClass("SellDropdown");
      }
      
      //END

 
    } else if ($(card).find(".productName")[0].id == "FXDCI") {
      // Start DCI
      getCurrencyFXDCIRate(idDCI);
      if ($("#ddlDCIOptions" + idDCI)[0].value == "Vanilla Call") {
        $("#FXDCI_BuyVSCall" + idDCI)[0].innerText = $(
          "#FXDCI_CCYPairDemo" + idDCI
        )
          .val()
          .split("-")[0]
          .trim();
      } else {
        $("#FXDCI_BuyVSCall" + idDCI)[0].innerText = $(
          "#FXDCI_CCYPairDemo" + idDCI
        )
          .val()
          .split("-")[1]
          .trim();
      }
      //END
    } else if ($(card).find(".productName")[0].id == "CASHEQUITIES") {
      // Added code for default values of CASHEQUITIES - share name & code changes after saving new templates - by Onkar E. 26/11/2019 //
      var req = $("#Cash_Eq_sharesList" + idCASHEQUITIES)
        .val()
        .substring(0, 3);
      getShareInfo(req, idCASHEQUITIES);
    } else if ($(card).find(".productName")[0].id == "FIBOND") {
      getNotemasterID($("#FIC_BondsList" + idFIBOND).val(), idFIBOND);
    } else if ($(card).find(".productName")[0].id == "INSURANCE") {
      insuranceData($("#insuranceList" + idINSURANCE).val(), idINSURANCE);
    } else if ($(card).find(".productName")[0].id == "AQDQ") {

      // LGTGTWINT-1605 Instant Pricer : Text colour of Underlying names to be based on Advisory flag (Green for Yes, Red for No) | 03 March 2023

    
      let data = EQCShareNameObj.filter(function (item) {
        return (
          item["Code"] == $(card).find('[id*="SharesDemo"]').val().trim()
        );
      });

      if(data[0]["AdvisoryFlag"] == "N"){

        $(card).find('[id*="SharesDemo"]').removeClass("advYes");
        $(card).find('[id*="SharesDemo"]').addClass("advNo");
  
      }else{
  
        $(card).find('[id*="SharesDemo"]').removeClass("advNo");
        $(card).find('[id*="SharesDemo"]').addClass("advYes");
  
      }

      if ($(card).find("select.ddlEQNoteCcy") != undefined) {
        $(card).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
      }

      // calculateTenor(card.id.match(/\d+$/)[0]); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

        //LGTGTWINT-2248 | Chaitanya M | 10 Aug 2023
        if(!_addtileflag){
          calculateAccrualDays(card);
        }
        //End
        
      checkSolveForAQDQ(
        card,
        $(card).find('[id^="solveForAQDQ"]').val().split("(")[0].trim(),
        true
      );
    } else if ($(card).find(".productName")[0].id == "FCN") {
      checkSolveForFCN(
        $(card).find('[id^="ddlSolveForFCN"]').val(),
        card,
        true
      );

      // calculateTenor(card.id.match(/\d+$/)[0]); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
   
    } else if ($(card).find(".productName")[0].id == "ELN") {

      // LGTGTWINT-1605 Instant Pricer : Text colour of Underlying names to be based on Advisory flag (Green for Yes, Red for No) | 03 March 2023

      let data = EQCShareNameObj.filter(function (item) {
        return (
          item["Code"] == $(card).find('[id*="SharesDemo"]').val().trim()
        );
      });

      if(data[0]["AdvisoryFlag"] == "N"){

        $(card).find('[id*="SharesDemo"]').removeClass("advYes");
        $(card).find('[id*="SharesDemo"]').addClass("advNo");
  
      }else{
  
        $(card).find('[id*="SharesDemo"]').removeClass("advNo");
        $(card).find('[id*="SharesDemo"]').addClass("advYes");
  
      }

      // LGTGTWINT-1638 | Start - Added as the below function should not execute when cloning the tile. | Chaitanya M | 21 July 2023
      if(!_addtileflag){
        loadELNTenorValues(card);
      }
      //End
      
    } else if ($(card).find(".productName")[0].id == "ELI") {
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "DEPOSIT") {
      getMatdate(card);
    } else if ($(card).find(".productName")[0].id == "BEN") {
      // Check For KO/KI Type
      if ($("#ddlBENType" + idBEN)[0].value == "Vanilla") {
        $("#kiinputbox" + idBEN).val("").prop("disabled", true);
      } else if ($("#ddlBENType" + idBEN)[0].value == "European") {
        $("#kiinputbox" + idBEN).prop("disabled", false);
      }

      //END

      // Check Solve for case
      checkSolveForBEN($(card).find('[id^="ddlSolveFor"]').val(),card,true); // Added for Clone tile issue | Chaitanya M | 14 Feb 2023 

      // calculateTenor(card.id.match(/\d+$/)[0]); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023

      //END
    } else if ($(card).find(".productName")[0].id == "DRA") {   
        
      checkSolveForDRA($(card).find('[id^="ddlSolveForDRA"]').val(),card,true) // Added for Clone tile issue | Chaitanya M | 14 Feb 2023 
 
      // calculateTenor(card.id.match(/\d+$/)[0]); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
      // END
    } else if ($(card).find(".productName")[0].id == "Options") {
      if (
        $(card).find('[id^="ddlSettlement"]').val().trim().toUpperCase() ==
        "CASH"
      ) {
        $(card).find("select.ddlEQNoteCcy").prop("disabled", true);
        // LGTGTWINT-1605 Instant Pricer : Text colour of Underlying names to be based on Advisory flag (Green for Yes, Red for No) | 03 March 2023
        
        let data = EQCShareNameObj.filter(function (item) {
          return (
            item["Code"] ==
            $(card).find('[id*="SharesDemo"]').val().trim()
          );
        });

        if(data[0]["AdvisoryFlag"] == "N"){

          $(card).find('[id*="SharesDemo"]').removeClass("advYes");
          $(card).find('[id*="SharesDemo"]').addClass("advNo");
    
        }else{
    
          $(card).find('[id*="SharesDemo"]').removeClass("advNo");
          $(card).find('[id*="SharesDemo"]').addClass("advYes");
    
        }

        if ($(card).find("select.ddlEQNoteCcy") != undefined) {
          $(card).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
        }

      } else {
        let data = EQCShareNameObj.filter(function (item) {
          return (
            item["Code"] ==
            $(card).find('[id^="OptionsSharesDemo"]').val().trim()
          );
        });

        if ($(card).find("select.ddlEQNoteCcy") != undefined) {
          $(card).find("select.ddlEQNoteCcy").val(data[0]["Ccy"]);
          $(card).find("select.ddlEQNoteCcy").prop("disabled", true);
        }

        // EQProductsFillCcy(card, "ddlCurrencySettlement");
        // calculateTenor(card.id.match(/\d+$/)[0]); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
      }

      // Start - LGTGTWINT-1638 | Added as the below function should not execute when cloning the tile. | Chaitanya M | 21 July 2023
      if(!_addtileflag){
        loadEQOTenorValues(card);
      }

      // checkSolveForOptions(
      //   $(card).find('[id^="solveForOptions"]').val(),
      //   card,
      //   true
      // );

      //END

    } else if ($(card).find(".productName")[0].id == "Phoenix") {
      checkSolveForPhoenix(
        $(card).find('[id^="ddlSolveForPhoenix"]').val(),
        card,
        true
      );

      // calculateTenor(card.id.match(/\d+$/)[0]); // LGTGTWINT-487 - Instant Pricing: Configuration settings || 06 Jan 2023
      
    } else if ($(card).find(".productName")[0].id == "RA") {
      checkSolveForRA($(card).find('[id^="ddlSolveForRA"]').val(), card);
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "RA") {
      checkSolveForRA($(card).find('[id^="ddlSolveForRA"]').val(), card);
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "Snowball") {
      checkSolveForSnowball(
        $(card).find('[id^="ddlSolveForSnowball"]').val(),
        card
      );
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "WoBAutocall") {
      checkSolveForWoBAutocall(
        $(card).find('[id^="ddlSolveForWoBAutocall"]').val(),
        card
      );
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "AvgAutocall") {
      checkSolveForAvgAutocall(
        $(card).find('[id^="ddlSolveForAvgAutocall"]').val(),
        card
      );
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "ELCI") {
      checkSolveForELCI($(card).find('[id^="solveForELCI"]').val(), card, true);
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "RELCI") {
      checkSolveForRELCI(
        $(card).find('[id^="solveForRELCI"]').val(),
        card,
        true
      );
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "TwinWin") {
      checkSolveForTwinWin(
        $(card).find('[id^="ddlSolveForTwinWin"]').val(),
        card,
        true
      );
   
    } else if ($(card).find(".productName")[0].id == "BEI") {
      checkSolveForBEI(
        $(card).find('[id^="ddlSolveForBEI"]').val(),
        card,
        true
      );
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "SPS") {
      checkSolveForSPS(
        $(card).find('[id^="ddlSolveForSPS"]').val(),
        card,
        true
      );
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "FCI") {
      checkSolveForFCI(
        $(card).find('[id^="ddlSolveForFCI"]').val(),
        card,
        true
      );
      calculateTenor(card.id.match(/\d+$/)[0]);
    } else if ($(card).find(".productName")[0].id == "FXDigital") {
      getCurrencyFXDigitalRate(idDigital);
      checkForDigitalType(
        $(card).find('[id^="ddlDigitalOptions"]').val(),
        card,
        true
      );
    } else if ($(card).find(".productName")[0].id == "DCN") { // LGTGTWINT-1880 || Rizwan S || 25 Apr 2023
      // Check For KO/KI Type

      if ($("#ddlDCNType" + idDCN)[0].value == "NOKI") {
        $("#kiinputbox" + idDCN).val("").prop("disabled", true);
      } else if ($("#ddlDCNType" + idDCN)[0].value == "European") {
        $("#kiinputbox" + idDCN).prop("disabled", false);
      }

      //END
      // Check Solve for case
      checkSolveForDCN($(card).find('[id^="ddlSolveFor"]').val(),card,true); // Added for Clone tile issue | Chaitanya M | 14 Feb 2023 
    }else if ($(card).find(".productName")[0].id == "Booster") {   
      checkSolveForBooster($(card).find('[id^="ddlSolveForBooster"]').val(),card,true) // Added for Clone tile issue | Chaitanya M | 14 Feb 2023 
    } else if ($(card).find(".productName")[0].id == "Sharkfin") {
      checkSolveForSharkfin($(card).find('[id^="ddlSolveForSharkfin"]').val(), card,true);   
    }
  } catch (error) {
    console.log(error.message);
  }
}

function selectAll(obj) {
  try {
    if (obj.checked == true) {
      $(".cbVisibility").each(function (i, j) {
        j.checked = true;
      });
    } else {
      $(".cbVisibility").each(function (i, j) {
        j.checked = false;
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

// --- Clear All Graphs function START - Added by Onkar E. 28-11-2019 -------- //

function ClearAllGraphs() {
  try {
    // console.log("coming inside ClearAllGraphs function!");
    var canvasId;
    for (var i = 0; i < $("canvas").length; i++) {
      if ($("canvas")[i].id.includes("canvas")) {
        canvasId = "myChart" + $("canvas")[i].id;
        localStorage.removeItem("bankArray" + canvasId);
        localStorage.removeItem("priceArray" + canvasId);
        localStorage.removeItem("dateArray" + canvasId);
        if (window[canvasId] != undefined || window[canvasId] != null) {
          window[canvasId].destroy();
        }
      } else {
        canvasId = $("canvas")[i].id;
        if (window[canvasId] != undefined || window[canvasId] != null) {
          window[canvasId].destroy();
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

// ---------- Clear All Graphs funcstion END ----------------------------//

//---------------------Tabs Switch Function START ----------------------//

function switchTab(that) {
  try {
    var id = "#" + $(that).attr("name");
    var names = $(that).attr("name");
    $(that).siblings().css({"border-color": "#252525","border-bottom": "0px solid #a97958",});
    $(that).css({"border-color": "#a97958","border-bottom": "1px solid #252525",});
    $(id).siblings(":visible").hide();
    $(id).css("display", "none");

    $(id).toggle("slide",{
        direction: "up",
    }, 5);
  } catch (error) {
    console.log(error.message);
  }
}
//---------------------Tabs Switch Function END ----------------------//
var $loading = $("#loaderMain");

//Attach the event handler to any element
$(document)
  .ajaxStart(function () {
    //ajax request went so show the loading image
    $loading.show();
  })
  .ajaxStop(function () {
    //got response so hide the loading image
    $loading.hide();
});

function clearPendingIntervals() {
  try {

    let productsArray = $("tr.removable>td.newlyCreated");

    for (let t of productsArray) {

      validation_clear();
      clearInterval($(t).find('[id^="hdnintervalID"]').val());
      sessionStorage.setItem("quoteResponse_" + t.id.match(/\d+$/)[0], "");  //INT1FIN47-768Gateway Markets Instant Pricing issue
      clearPricerTable(t);
  
    }
  } catch (error) {
    console.log(error.message);
  }
}

//LGTGTWINT-945 Edit template not working properly for maple instant pricer

$("#closedialog").on("click", function () {  
  $("#dialogSelect").hide();
  $(".removable").removeClass("filter");
  $("#DivOverlay")[0].style.opacity = "0"; 
  // $("body")[0].style.overflow = "scroll"; //LGTGTWINT - 687 
  $(".popup").hide();
  $("#OverlayBody").hide(); // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
});

//END

// LGTGTWINT-945 Edit template not working properly for maple instant pricer

$("#btnDelete").on("click", function () {
  // Info Message Template Dialog Box Changes - Runal 

  // LGTGTWINT-1773 | Template deleted successfully message reflected when tried to delete public portfolio from other login.| Chaitanya M | 28 March 2023 
  if(document.getElementById("templateList").firstChild.children[2].innerText != sessionStorage.getItem("Username")){      
    $("#dialog-confirm").hide();
    $(".removable").removeClass("filter");
    $("#DivOverlay")[0].style.opacity = "0"; 
    $("#OrderPlacedAll").html("Cannot delete this Portfolio!");
    $("#booktradecashx").show();
    $(".removable").addClass("filter");
    return false;
 }
 //End

  if($("#hiddenCurrentTemplate").html().trim().length == 0)
  {    
    $("#OrderPlacedAll").html("No Portfolios to Delete !");
    $("#booktradecashx").show();
    $(".removable").addClass("filter");
    return false;
  }
  $("#dialog-confirm").show();
  $(".removable").addClass("filter");
  //$("#DivOverlay").show();
  $("#OverlayBody").css({ display: "block", height: "300%", opacity: "0.025"}); // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
  $("body")[0].style.overflow = "hidden";
});

$("#canceldlttemplate").on("click", function () {
  
  $("#dialog-confirm").hide();
  $(".removable").removeClass("filter");
  $("#DivOverlay")[0].style.opacity = "0"; 
  $("#OverlayBody").hide(); // Start: LGTGTWINT-1826 | Chaitanya M | 07 Aug 2023 
  // $("body")[0].style.overflow = "scroll";  //LGTGTWINT - 687 
});
//END
// Added for LGTGTWINT-1462 'Mail All' functionality | Chaitanya M | 23 Feb 2023
//start
function Mail_All() {
  try {
    xTime = 0;
    var i;
    thisTile="";  

    var tilecount = clientConfigdata.PAYOFFCOUNT.MAILALLCOUNTER; // LGTGTWINT-1880 | Chaitanya M | 22 Jun 2023

    // Start -  Added for Mail All functionality does not work when DQ tile is included. Ref: LGTGTWINT-1717 | Chaitanya M | 14 March 2023
    var name=""
    var __mailRFQBEN=[];
    var __mailRFQAQ=[];
    var __mailRFQDQ=[]; 
    var __mailRFQDRA=[];
    var __mailRFQELN=[];
    var __mailRFQFCN=[];
    var __mailRFQOTIONS=[];
    //End

    // Start -Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023 
    var isELN, isAQ, isBEN, isDQ, isDRA, isFCN, isOptions,isFXAQ, isFXDQ, isFXTRFBUY, isFXTRFSell, isFXPivot, isFXVanilla, isFXBarriers, isFXStraddle, isFXStrangle, isFXRSKREV, isFXOPSPRD ; // LGTCLI-399 || Chaitanya M | 15 May 2023
    var products = [];
    var FXDProducts = ["FXAQ", "FXDQ", "FXTRF", "FXPIVOT","Strategies", "FXOPTION"];    //LGTGTWINT-1880  || RijwanS || 20 Jun 2023
    //End

    // Function for Mail All functionality for FXD payoffs | LGTGTWINT-1462
    var _FXAQNMID=[]; 
    var _FXAQDCDRFQ=[]; 
    var _FXDQDCDRFQ=[];  
    var _FXDQNMID=[]; 
    // LGTCLI-399 || Chaitanya M | 15 May 2023
    var _FXTRFBUYDCDRFQ=[];  
    var _FXTRFBUYNMID=[];
    var _FXTRFSELLDCDRFQ=[]; 
    var _FXTRFSELLNMID=[]; 
    //End
    var _FXPivotDCDRFQ=[]; 
    var _FXPivotNMID=[]; 
    //LGTGTWINT-1880  || Chaitanya M  || 22 Jun 2023
    var _FXOPSPRDDCDRFQ = [];  
    var _FXOPSPRDNMID=[];
    var _FXStraddleNMID=[];
    var _FXStraddleDCDRFQ=[];
    var _FXStrangleNMID=[];
    var _FXStrangleDCDRFQ=[];
    var _FXRSKREVNMID=[];
    var _FXRSKREVDCDRFQ=[];
    var _FXbarriersNMID = [];  
    var _FXBarriersDCDRFQ=[];    
    var _FXVanillaNMID = [];  
    var _FXVanillaDCDRFQ=[];
    //End
    var t =0;
    //End

    // Start -LGTCLI-380 | Chaitanya M | 19 April 2023
    var totalmaillength=[]; 
    mailedcount=0; 
    //End

    // Start - LGTCLI-399 | Chaitanya M | 15 May 2023
    var ProductsTobeMailed =[];
    mailedprodcts=[];
    //End

     // Start LGTCLI-417 || RizwanS || 04 May 2023
     let _prodID = "";
     let _prodCode= "";
     let _prodName = ""; 

    $("tr.removable>td.newlyCreated td.productName").each(function (
      index,
      element
    ) {
      products.push(element.id);
    });
    console.log(products);

    // Function for Mail All functionality for FXD payoffs | LGTGTWINT-1462
    // Start
    for (i = tilecount; i < $("button[id^=btnBestPrice]").length; i++) { 
      for (var t_ = 0; t_ < FXDProducts.length; t_++) {
        if (FXDProducts[t_] == products[t]) {
          isFxdTemplate = true;
      //  } else { 
      //    isFxdTemplate = false;  
        }
      }    
      t++;

      //name =  $($("button[id^=btnEmailQuote]")[m]).parents(".sorting").find(".productName")[0].innerText
      if(!isFxdTemplate){     
        doSetTimeoutemailquoteEQC(i);   
      }else{
        isFxdTemplate = false;
        doSetTimeoutemailquoteFXD(i);          
      } 
    }

    //End
    
      // Function for Mail All functionality for EQC payoffs

      function doSetTimeoutemailquoteEQC(m) {          
        //console.log("Book Product Name: " +$($("button[id^=btnEmailQuote]")[m]).parents(".sorting").find(".productName")[0].innerText); 
        name =  $($("button[id^=btnBestPrice]")[m]).parents(".sorting").find(".productName")[0].id; //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
        thisTile  = $($("button[id^=btnBestPrice]")[m]).parents(".sorting")[0]; 
        _displaymailmsg = false; //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023

        if(name.includes("AQ")){
          if($(thisTile).find('[id^="Type"]')[0].value == "AQ"){
            name = "AQ";
          } else{
            name="DQ";
          }
        }   
      
        if(name =="ELN"){
          
          var RFQIDListELN=[];     
          var Email_PPListELN=[];
          let pricedetailsELN=""; //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
          // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
          if($(thisTile).find('[id^="hdnChartPricesELN"]').val() !=""){
            //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            pricedetailsELN = JSON.parse($(thisTile).find('[id^="hdnChartPricesELN"]').val());
            if(pricedetailsELN[0].ELNOUT === "" || pricedetailsELN[0].ELNOUT ==="-" || pricedetailsELN[0].ELNOUT ===null || pricedetailsELN[0].ELNOUT === undefined  ){
              return false; 
            }
            //End
            isELN = true;
            ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
            totalmaillength.push(name);//LGTCLI-380 | Chaitanya M | 19 April 2023
            RFQIDListELN.push(pricedetailsELN); //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            Email_PPListELN.push(RFQIDListELN[0][0]);
            
            for(let R of RFQIDListELN){
              __mailRFQELN.push(R[0].EP_ER_QuoteRequestId);
            }
          }    
          //End  
          
        }
        if(name =="FCN"){
        
          var RFQIDListFCN=[]; 
          var Email_PPLisFCN=[];
          let pricedetailsFCN =""; //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
          // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
          if($(thisTile).find('[id^="hdnChartPricesFCN"]').val() !=""){
             //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
             pricedetailsFCN = JSON.parse($(thisTile).find('[id^="hdnChartPricesFCN"]').val());
             if(pricedetailsFCN[0].DRAOUT === "" || pricedetailsFCN[0].DRAOUT ==="-" || pricedetailsFCN[0].DRAOUT ===null || pricedetailsFCN[0].DRAOUT === undefined ){
               return false; 
             }
             //End
            isFCN = true;
            ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
            totalmaillength.push(name); //LGTCLI-380 | Chaitanya M | 19 April 2023
            RFQIDListFCN.push(pricedetailsFCN); //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            Email_PPLisFCN.push(RFQIDListFCN[0][0]);

            for(let R of RFQIDListFCN){
              __mailRFQFCN.push(R[0].EP_ER_QuoteRequestId);
            }
            
          }
          //End

        }
        if(name =="AQ"){
          
          var RFQIDListAQ=[];
          var Email_PPListAQ=[];
          let pricedetailsAQ ="";  //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
          // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023        
          if($(thisTile).find('[id^="hdnChartPricesAQDQ"]').val() !=""){
            //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            pricedetailsAQ = JSON.parse($(thisTile).find('[id^="hdnChartPricesAQDQ"]').val());
            if(pricedetailsAQ[0].AccDecOUT === "" || pricedetailsAQ[0].AccDecOUT ==="-" || pricedetailsAQ[0].AccDecOUT ===null || pricedetailsAQ[0].AccDecOUT === undefined  ){
              return false; 
            }
            //End
            isAQ = true;
            ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
            totalmaillength.push(name);//LGTCLI-380 | Chaitanya M | 19 April 2023
           
            RFQIDListAQ.push(pricedetailsAQ) //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            Email_PPListAQ.push(RFQIDListAQ[0][0]);

            for(let R of RFQIDListAQ){
              __mailRFQAQ.push(R[0].EP_ER_QuoteRequestId);
            }
          }    
          //End          
          
        }
        if(name =="DQ"){
          
          var RFQIDListDQ=[];
          var Email_PPListDQ=[];
          let pricedetailsDQ=""; //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
          // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
          if($(thisTile).find('[id^="hdnChartPricesAQDQ "]').val() != ""){
            //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            pricedetailsDQ = JSON.parse($(thisTile).find('[id^="hdnChartPricesAQDQ"]').val());
            if(pricedetailsDQ[0].AccDecOUT === "" || pricedetailsDQ[0].AccDecOUT ==="-" || pricedetailsDQ[0].AccDecOUT ===null || pricedetailsDQ[0].AccDecOUT === undefined  ){
              return false; 
            }
            //End
            isDQ = true;
            ProductsTobeMailed.push(name);// LGTCLI-399 || Chaitanya M | 15 May 2023
            totalmaillength.push(name); //LGTCLI-380 | Chaitanya M | 19 April 2023
            RFQIDListDQ.push(pricedetailsDQ) //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            Email_PPListDQ.push(RFQIDListDQ[0][0]);

            for(let R of RFQIDListDQ){
              __mailRFQDQ.push(R[0].EP_ER_QuoteRequestId);
            }  
          }  
          //End    
        }
        if(name =="DRA"){
        
          var RFQIDListDRA =[];
          var Email_PPListDRA=[];
          let pricedetailsDRA = ""; //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
          // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023    
          if($(thisTile).find('[id^="hdnChartPricesDRA"]').val() !=""){
            //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            pricedetailsDRA = JSON.parse($(thisTile).find('[id^="hdnChartPricesDRA"]').val());
            if(pricedetailsDRA[0].DRAOUT === "" || pricedetailsDRA[0].DRAOUT ==="-" || pricedetailsDRA[0].DRAOUT ===null || pricedetailsDRA[0].DRAOUT === undefined  ){
              return false; 
            }
            //End     
            isDRA = true;
            ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
            totalmaillength.push(name); //LGTCLI-380 | Chaitanya M | 19 April 2023
            RFQIDListDRA.push(pricedetailsDRA); //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            Email_PPListDRA.push(RFQIDListDRA[0][0]);
            
            for(let R of RFQIDListDRA){
              __mailRFQDRA.push(R[0].EP_ER_QuoteRequestId);
            } 
          }
          //End          
        }
        if(name =="Options"){
        
          var RFQIDListOPTIONS=[];
          var Email_PPListOPTIONS=[];          
          let pricedetailsEQO=""; //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
          // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
          if($(thisTile).find('[id^="hdnChartPricesOptions"]').val() !=""){
            //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            pricedetailsEQO = JSON.parse($(thisTile).find('[id^="hdnChartPricesOptions"]').val());
            if(pricedetailsEQO[0].EQOOUT === "" || pricedetailsEQO[0].EQOOUT ==="-" || pricedetailsEQO[0].EQOOUT ===null || pricedetailsEQO[0].EQOOUT === undefined  ){
              return false; 
            }
            //End 
            isOptions = true;
            ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
            totalmaillength.push(name);//LGTCLI-380 | Chaitanya M | 19 April 2023
            RFQIDListOPTIONS.push(pricedetailsEQO); //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            Email_PPListOPTIONS.push(RFQIDListOPTIONS[0][0]);          
          
            for(let R of RFQIDListOPTIONS){
              __mailRFQOTIONS.push(R[0].EP_ER_QuoteRequestId);
            }
          }
          //End
          
        }
        if(name =="BEN"){
        
          var RFQIDListBEN =[]; 
          var Email_PPListBEN=[];
          let pricedetailsBEN = ""; //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
          // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023
          if($(thisTile).find('[id^="hdnChartPricesBEN"]').val() !=""){
            //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            pricedetailsBEN = JSON.parse($(thisTile).find('[id^="hdnChartPricesBEN"]').val());
            if(pricedetailsBEN[0].BENOUT === "" || pricedetailsBEN[0].BENOUT ==="-" || pricedetailsBEN[0].BENOUT ===null || pricedetailsBEN[0].BENOUT === undefined  ){
              return false; 
            }
            //End
            isBEN = true;
            ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
            totalmaillength.push(name);//LGTCLI-380 | Chaitanya M | 19 April 2023
            RFQIDListBEN.push(pricedetailsBEN); //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
            Email_PPListBEN.push(RFQIDListBEN[0][0]); 
            
            for(let R of RFQIDListBEN){
              __mailRFQBEN.push(R[0].EP_ER_QuoteRequestId);
            }
          }
          //End
        }
                
      } 
      
      // Function for Mail All functionality for FXD payoffs

      function doSetTimeoutemailquoteFXD(m) {
        
        name =  $($("button[id^=btnBestPrice]")[m]).parents(".sorting").find(".productName")[0].id; //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
        thisTile  = $($("button[id^=btnBestPrice]")[m]).parents(".sorting")[0];
        _displaymailmsg =false; //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023

        var isNonBestPrice = false;
        if (clientConfigdata.CommonMethods.NonBestPrice == "Y") {
          isNonBestPrice = true;
        } else {
          isNonBestPrice = false;
        }

        if(name == "FXAQ"){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
      
          if ($(thisTile).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") { //LGTCLI-417 || RizwanS || 04 May 2023
                  
            _prodID = productIDFXAQ;
            _prodCode = productCodeAQ;
            _prodName = ProductNameAQ;

            if ($(thisTile).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() == "Buy") { //LGTCLI-417 || RizwanS || 04 May 2023
            var NoteMasterIdFXAQ=[]; 
            var DCDRFQListFXAQ=[]; 
            var jsonHdnPricesFXAQ=[];
            if($(thisTile).find('[id^="hdnPricesFXAQ"]').val() !=""){
              isFXAQ = true;   
              ProductsTobeMailed.push(_prodCode);  // LGTCLI-399 || Chaitanya M | 15 May 2023
              totalmaillength.push(_prodCode);//LGTCLI-380 | Chaitanya M | 19 April 2023
              jsonHdnPricesFXAQ.push(JSON.parse($(thisTile).find('[id^="RFQFXAQ"]').val()));
              console.log(jsonHdnPricesFXAQ);
              for(let R of jsonHdnPricesFXAQ){
                NoteMasterIdFXAQ.push(R[0].NoteMasterID);
                DCDRFQListFXAQ.push(R[0].o_DCDRFQID);
                _FXAQNMID.push(NoteMasterIdFXAQ);
                _FXAQDCDRFQ.push(DCDRFQListFXAQ);
              }
            }    
            //End
          }
                  
          }else{
            _prodID = productIDFXDQ;
            _prodCode = productCodeDQ;
            _prodName = ProductNameDQ;
                           
            if($(thisTile).find('[id^="payTypeSelectionFXAQDQ"]').val().trim() != "Buy"){ //LGTCLI-417 || RizwanS || 04 May 2023
              // if(name == "FXDQ"){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
              var NoteMasterIdFXDQ=[]; 
              var DCDRFQListFXDQ=[]; 
              var jsonHdnPricesFXDQ=[];          
              if($(thisTile).find('[id^="hdnPricesFXAQ"]').val() !=""){ //LGTCLI-417 || RizwanS || 04 May 2023
                isFXDQ = true;       
                ProductsTobeMailed.push(_prodCode); // LGTCLI-399 || Chaitanya M | 15 May 2023
                totalmaillength.push(_prodCode);//LGTCLI-380 | Chaitanya M | 19 April 2023
                jsonHdnPricesFXDQ.push(JSON.parse($(thisTile).find('[id^="RFQFXAQ"]').val())); //LGTCLI-417 || RizwanS || 04 May 2023
                console.log(jsonHdnPricesFXDQ);
                for(let R of jsonHdnPricesFXDQ){
                  NoteMasterIdFXDQ.push(R[0].NoteMasterID);
                  DCDRFQListFXDQ.push(R[0].o_DCDRFQID);
                  _FXDQNMID.push(NoteMasterIdFXDQ);
                  _FXDQDCDRFQ.push(DCDRFQListFXDQ);
                }
              }    
              //End
            }
          }  
        } //END
        if(name == "FXTRF"){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
          // LGTCLI-399 || Chaitanya M | 15 May 2023
          if ($(thisTile).find('[id^="CcyBuSellSelectionFXTRF"]').val() == "Buy") {

            ProductCode_FXTRF = productCodeTRFBuy;
            ProductIDFXTRF = productIDTRFBuy;
            var NoteMasterIdFXTRF=[]; 
            var DCDRFQListFXTRF=[]; 
            var jsonHdnPricesFXTRF=[];
            if($(thisTile).find('[id^="hdnPricesFXTRF"]').val() !=""){
              isFXTRFBUY = true;
              ProductsTobeMailed.push(name + "Buy");  // LGTCLI-399 || Chaitanya M | 01 Jun 2023
              totalmaillength.push(name + "Buy"); // LGTCLI-399 || Chaitanya M | 01 Jun 2023
              jsonHdnPricesFXTRF.push(JSON.parse($(thisTile).find('[id^="RFQFXTRF"]').val()));
              console.log(jsonHdnPricesFXTRF);
              for(let R of jsonHdnPricesFXTRF){
                NoteMasterIdFXTRF.push(R[0].NoteMasterID);
                DCDRFQListFXTRF.push(R[0].o_DCDRFQID);
                _FXTRFBUYNMID.push(NoteMasterIdFXTRF);
                _FXTRFBUYDCDRFQ.push(DCDRFQListFXTRF);
              }
            }  

          }else{
            ProductCode_FXTRF = productCodeTRFSell;
            ProductIDFXTRF = productIDTRFSell;

            var NoteMasterIdFXTRF=[]; 
            var DCDRFQListFXTRF=[]; 
            var jsonHdnPricesFXTRF=[];

            if($(thisTile).find('[id^="hdnPricesFXTRF"]').val() !=""){
              isFXTRFSell = true;
              ProductsTobeMailed.push(name + "Sell");  // LGTCLI-399 || Chaitanya M | 15 May 2023, 01 Jun 2023
              totalmaillength.push(name + "Sell"); // LGTCLI-399 || Chaitanya M | 15 May 2023, 01 Jun 2023
              jsonHdnPricesFXTRF.push(JSON.parse($(thisTile).find('[id^="RFQFXTRF"]').val()));
              console.log(jsonHdnPricesFXTRF);
              for(let R of jsonHdnPricesFXTRF){
                NoteMasterIdFXTRF.push(R[0].NoteMasterID);
                DCDRFQListFXTRF.push(R[0].o_DCDRFQID);
                _FXTRFSELLNMID.push(NoteMasterIdFXTRF);
                _FXTRFSELLDCDRFQ.push(DCDRFQListFXTRF);
              }
            } 
          }
          //End
          //End
        }
        if(name == "FXPIVOT"){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
          var NoteMasterIdFXPIVOT=[]; 
          var DCDRFQListFXPIVOT=[]; 
          var jsonHdnPricesFXPIVOT=[];
          // Added For  Maill all functionality fails if all tiles are not priced on loaded template Ref: LGTGTWINT-1718 | Chaitanya M | 14 March 2023        
          if($(thisTile).find('[id^="hdnPricesFXPivot"]').val() !=""){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
            isFXPivot = true;
            ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
            totalmaillength.push(name); //LGTCLI-380 | Chaitanya M | 19 April 2023
            jsonHdnPricesFXPIVOT.push(JSON.parse($(thisTile).find('[id^="RFQFXPivot"]').val()));
            for(let R of jsonHdnPricesFXPIVOT){
              NoteMasterIdFXPIVOT.push(R[0].NoteMasterID);
              DCDRFQListFXPIVOT.push(R[0].o_DCDRFQID);
              _FXPivotNMID.push(NoteMasterIdFXPIVOT);
              _FXPivotDCDRFQ.push(DCDRFQListFXPIVOT);
            }
          }    
          //End
        }        

        if(name == "FXOPTION"){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023

          if($(thisTile).find('[id^="FXO_Type"]').val().trim() !== "Vanilla") {

            _prodID = productIDFXBarrier;
            _prodCode = productCodeFXBarrier;
            _prodName = ProductNameFXBarrier;

            var NoteMasterIdFXBarrier=[]; 
            var DCDRFQListFXBarrier=[]; 
            var jsonHdnPricesFXBarrier=[];

            if($(thisTile).find('[id^="hdnPricesFXO"]').val() !=""){ 
              isFXOptions = true;
              ProductsTobeMailed.push("Barriers"); // LGTCLI-399 || Chaitanya M | 15 May 2023
              totalmaillength.push("Barriers"); //LGTCLI-380 | Chaitanya M | 19 April 2023
              jsonHdnPricesFXBarrier.push(JSON.parse($(thisTile).find('[id^="RFQFXO"]').val()));

              for(let R of jsonHdnPricesFXBarrier){
                NoteMasterIdFXBarrier.push(R[0].NoteMasterID);
                DCDRFQListFXBarrier.push(R[0].o_DCDRFQID);
                _FXbarriersNMID.push(NoteMasterIdFXBarrier);
                _FXBarriersDCDRFQ.push(DCDRFQListFXBarrier);
              }

            }

          }else{

            _prodID = productIDFXVanilla;
            _prodCode = ProductNameFXVanilla;
            _prodName = productCodeFXVanilla;

            var NoteMasterIdFXVanilla=[]; 
            var DCDRFQListFXVanilla=[]; 
            var jsonHdnPricesFXVanilla=[];
            
            if($(thisTile).find('[id^="hdnPricesFXO"]').val() !=""){ 
              isFXVanilla = true;
              ProductsTobeMailed.push("Vanilla"); // LGTCLI-399 || Chaitanya M | 15 May 2023
              totalmaillength.push("Vanilla"); //LGTCLI-380 | Chaitanya M | 19 April 2023
              jsonHdnPricesFXVanilla.push(JSON.parse($(thisTile).find('[id^="RFQFXO"]').val()));

              for(let R of jsonHdnPricesFXVanilla){
                NoteMasterIdFXVanilla.push(R[0].NoteMasterID);
                DCDRFQListFXVanilla.push(R[0].o_DCDRFQID);
                _FXVanillaNMID.push(NoteMasterIdFXVanilla);
                _FXVanillaDCDRFQ.push(DCDRFQListFXVanilla);
              }

            }
          }
 
        } 

        if(name == "Strategies"){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
          
          if ($(thisTile).find('[id^="SolveforFXStrategies"]').val() =="Straddle") {

            _prodID = productIDStraddle;
            _prodCode = productCodeStraddle;

            var NoteMasterIdFXStraddle=[]; 
            var DCDRFQListFXStraddle=[]; 
            var jsonHdnPricesFXStraddle=[];

            if($(thisTile).find('[id^="hdnPricesFXStrategies"]').val() !=""){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
              
              isFXStraddle = true;
              ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
              totalmaillength.push(name); //LGTCLI-380 | Chaitanya M | 19 April 2023
              jsonHdnPricesFXStraddle.push(JSON.parse($(thisTile).find('[id^="RFQFXStrategies"]').val()));
              for(let R of jsonHdnPricesFXStraddle){
                NoteMasterIdFXStraddle.push(R[0].NoteMasterID);
                DCDRFQListFXStraddle.push(R[0].o_DCDRFQID);
                _FXStraddleNMID.push(NoteMasterIdFXStraddle);
                _FXStraddleDCDRFQ.push(DCDRFQListFXStraddle);
              }

            } 

          } else if ($(thisTile).find('[id^="SolveforFXStrategies"]').val() =="Strangle") {

            _prodID = productIDStrangle;
            _prodCode = productCodeStrangle;

            var NoteMasterIdFXStrangle=[]; 
            var DCDRFQListFXStrangle=[]; 
            var jsonHdnPricesFXStrangle=[];

            if($(thisTile).find('[id^="hdnPricesFXStrategies"]').val() !=""){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
              
              isFXStrangle = true;
              ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
              totalmaillength.push(name); //LGTCLI-380 | Chaitanya M | 19 April 2023
              jsonHdnPricesFXStrangle.push(JSON.parse($(thisTile).find('[id^="RFQFXStrategies"]').val()));
              for(let R of jsonHdnPricesFXStrangle){
                NoteMasterIdFXStrangle.push(R[0].NoteMasterID);
                DCDRFQListFXStrangle.push(R[0].o_DCDRFQID);
                _FXStrangleNMID.push(NoteMasterIdFXStraddle);
                _FXStrangleDCDRFQ.push(DCDRFQListFXStrangle);
              }

            } 

          } else if ($(thisTile).find('[id^="SolveforFXStrategies"]').val() =="Risk Reversal") {
           
            _prodCoID = productIDRSKREV;
            _prodCode = productCodeRSKREV;
           
            var NoteMasterIdFXRSKREV=[]; 
            var DCDRFQListFXRSKREV=[]; 
            var jsonHdnPricesFXRSKREV=[];

            if($(thisTile).find('[id^="hdnPricesFXStrategies"]').val() !=""){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
              
              isFXRSKREV = true;
              ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
              totalmaillength.push(name); //LGTCLI-380 | Chaitanya M | 19 April 2023
              jsonHdnPricesFXRSKREV.push(JSON.parse($(thisTile).find('[id^="RFQFXStrategies"]').val()));
              for(let R of jsonHdnPricesFXRSKREV){
                NoteMasterIdFXRSKREV.push(R[0].NoteMasterID);
                DCDRFQListFXRSKREV.push(R[0].o_DCDRFQID);
                _FXRSKREVNMID.push(NoteMasterIdFXStraddle);
                _FXRSKREVDCDRFQ.push(DCDRFQListFXRSKREV);
              }

            }

          } else if ($(thisTile).find('[id^="SolveforFXStrategies"]').val() =="Option Spread") {
            _prodCoID = productIDOPSPRD;
            _prodCode = productCodeOPSPRD; 
           
            var NoteMasterIdFXOPSPRD=[]; 
            var DCDRFQListFXOPSPRD=[]; 
            var jsonHdnPricesFXOPSPRD=[];

            if($(thisTile).find('[id^="hdnPricesFXStrategies"]').val() !=""){ //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
              
              isFXOPSPRD = true;
              ProductsTobeMailed.push(name); // LGTCLI-399 || Chaitanya M | 15 May 2023
              totalmaillength.push(name); //LGTCLI-380 | Chaitanya M | 19 April 2023
              jsonHdnPricesFXOPSPRD.push(JSON.parse($(thisTile).find('[id^="RFQFXStrategies"]').val()));
              for(let R of jsonHdnPricesFXOPSPRD){
                NoteMasterIdFXOPSPRD.push(R[0].NoteMasterID);
                DCDRFQListFXOPSPRD.push(R[0].o_DCDRFQID);
                _FXOPSPRDNMID.push(NoteMasterIdFXStraddle);
                _FXOPSPRDDCDRFQ.push(DCDRFQListFXOPSPRD);
              }

            }
          }
         
        } 
       
      }

    //End

    // sending Mails for present payoffs of the screen
    // Function for Mail All functionality for FXD payoffs | LGTGTWINT-1462
    //Start

    maillength = totalmaillength.filter((item, i, ar) => ar.indexOf(item) === i); 

    // Function for Mail All functionality for FXD payoffs | LGTGTWINT-1462 
    if(isFXAQ)
      mailAllQuoteFXD(_FXAQNMID, _FXAQDCDRFQ,productCodeAQ,productIDFXAQ,"thisTileFXAQ",maillength.length); //LGTCLI-417 || RizwanS || 04 May 2023

    if(isFXDQ)
      mailAllQuoteFXD(_FXDQNMID,_FXDQDCDRFQ,productCodeDQ,productIDFXDQ,"thisTileFXAQ",maillength.length); //LGTCLI-417 || RizwanS || 04 May 2023

    // LGTCLI-399 || Chaitanya M | 15 May 2023
    if(isFXTRFBUY) 
      mailAllQuoteFXD(_FXTRFBUYNMID,_FXTRFBUYDCDRFQ,productCodeTRFBuy,productIDTRFBuy,"thisTileFXTRF",maillength.length); 

    if(isFXTRFSell)
      mailAllQuoteFXD(_FXTRFSELLNMID,_FXTRFSELLDCDRFQ,productCodeTRFSell,productIDTRFBuy,"thisTileFXTRF",maillength.length); 
    //End
    
    if(isFXPivot)
      mailAllQuoteFXD(_FXPivotNMID,_FXPivotDCDRFQ,productCodePivot,productIDFXPivot,"thisTileFXPivot",maillength.length); 

    if(isFXStraddle)
      mailAllQuoteFXD(_FXStraddleNMID,_FXStraddleDCDRFQ,productCodeStraddle,productIDStraddle,"thisTileFXStrategies",maillength.length); 

    if(isFXStrangle)
      mailAllQuoteFXD(_FXStrangleNMID,_FXStrangleDCDRFQ,productCodeStrangle,productIDStrangle,"thisTileFXStrategies",maillength.length); 

    if(isFXRSKREV)
      mailAllQuoteFXD(_FXRSKREVNMID,_FXRSKREVDCDRFQ,productCodeRSKREV,productIDRSKREV,"thisTileFXStrategies",maillength.length); 

    if(isFXOPSPRD)
      mailAllQuoteFXD(_FXOPSPRDNMID,_FXOPSPRDDCDRFQ,productCodeOPSPRD,productIDOPSPRD,"thisTileFXStrategies",maillength.length); 

    if(isFXVanilla)
      mailAllQuoteFXD(_FXVanillaNMID,_FXVanillaDCDRFQ,productCodeFXVanilla,productIDFXVanilla,"thisTileFXO",maillength.length); 

    if(isFXBarriers)
      mailAllQuoteFXD(_FXbarriersNMID,_FXBarriersDCDRFQ,productCodeFXBarrier,productIDFXBarrier,"thisTileFXO",maillength.length); 

    if(isELN)
      mailAllQuoteEQC(__mailRFQELN,"ELN",maillength.length);   
   
    if(isFCN)
        mailAllQuoteEQC(__mailRFQFCN,"FCN",maillength.length);  

    if(isAQ)
      mailAllQuoteEQC(__mailRFQAQ,"AQ",maillength.length);     
      
    if(isDRA)
      mailAllQuoteEQC(__mailRFQDRA,"DRA",maillength.length);    

    if(isOptions)
      mailAllQuoteEQC(__mailRFQOTIONS,"Options",maillength.length);    

    if(isBEN)
      mailAllQuoteEQC(__mailRFQBEN,"BEN",maillength.length);   

    if(isDQ)
      mailAllQuoteEQC(__mailRFQDQ,"DQ",maillength.length); 


    //END

    //LGTGTWINT-1805 Successful quote mail initiation message displayed without pricing | Chaitanya M | 30 March 2023
    // $("#DivOverlay").show();
    // $("#OrderPlacedAll").html("Emails have been initiatied!");
    // $("#booktradecashx").show();
    // $(".removable").addClass("filter");
    //End

    //LGTGTWINT-1805 Successful quote mail initiation message displayed without pricing | Chaitanya M | 30 March 2023
    //LGTGTWINT-2141 | Chaitanya M | 28 June 2023
    if(isAQ||isBEN||isDQ||isDRA||isELN||isFCN||isFXAQ||isFXDQ||isFXPivot||isFXTRFBUY || isFXTRFSell ||isOptions||isFXOPSPRD||isFXRSKREV || isFXVanilla||isFXStrangle||isFXStraddle||isFXBarriers){ //LGTGTWINT-1805 Successful quote mail initiation message displayed without pricing | Chaitanya M | 30 March 2023
       
      ValidateFieldmail("OrderPlacedAll", "Emails have been initiated for " + ProductsTobeMailed.filter((item, i, ar) => ar.indexOf(item) === i),false,"Y","In Progress");  // LGTCLI-399 || Chaitanya M | 15 May 2023
  
      //End
    }else{

      ValidateFieldmail("OrderPlacedAll", "No price available for mailing!",true ,"N","Error"); //LGTCLI-380 | Chaitanya M | 19 April 2023
    
      //End
    }

    //End
   

  } catch (error) {
    console.log(error.message);
  }
}

 //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
function mailAllQuoteEQC(mailrfqsource,productname,_payoffcount){
  try {
    request_getDataFromAPI({
      userName: sessionStorage.getItem("FinIQUserID").toString(),
      rfqId: mailrfqsource.toString(),
      CurrentTileID: "",
      "EQC_TOKEN": sessionStorage.getItem("EQC_Token").toString(),
      QuoteMailType:"English"

  }, clientConfigdata.CommonMethods.NodeServer + "EmailBestQuote").then((data)=>{
   //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
   //START   
   
    if(data.dataFromAjax.message == "Quote Mail Initiated"){   // RizwanS || HSBCFXEINT-6 || 07 Nov 2023

      mailedprodcts.push(productname); // LGTCLI-399 || Chaitanya M | 15 May 2023
      //  mailedprodcts = mailedprodcts.filter((item, i, ar) => ar.indexOf(item) === i); // LGTCLI-399 || Chaitanya M | 15 May 2023

      if(mailedcount == _payoffcount-1){           

        // str = "Email Quote Sent Successfully for : "+ productname +" and RFQID: " + mailrfqsource.toString();         
        //mailAllresponse.push(str);
        plotmailall(mailedprodcts,true,"Success");

       // ValidateFieldmail("OrderPlacedAll", "Email Quote sent successfully for " + mailedprodcts.filter((item, i, ar) => ar.indexOf(item) === i) ,true,"Y") //  LGTCLI-399 | 15 May 2023  ||| LGTCLI-380 | Chaitanya M | 19 April 2023 // LGTCLI-399 || Chaitanya M | 15 May 2023
        mailedcount = 0;

      }else{
        plotmailall(mailedprodcts,"","In Progress");
        mailedcount++
        return false;

      }

    } else {

      ValidateFieldmail("OrderPlacedAll", "Email Quote failed for " + productname,true,"N","Error",true) //  LGTCLI-399 | 15 May 2023  ||| LGTCLI-380 | Chaitanya M | 19 April 2023

      mailedcount++;

    }       
     
    //END
      
  })
  } catch (error) {
    console.log(error.message);
  }
}

// Function for Mail All functionality for FXD payoffs | LGTGTWINT-1462
function mailAllQuoteFXD(NM_ID,DCDRFQ_ID,productCode,productID,thisTile,_payoffcount){
  try { 

    request_getDataFromAPI(
      {               
        "LoginID" : userName,
        "EntityID": EntityID,   
        "LoginId": userName,     
        "ProductCode": productCode,
        "NoteMasterId":NM_ID.toString().replaceAll("," , ":"),
        "ProductID":productID,
        "RFQID": DCDRFQ_ID.toString(),
        "FXD_TOKEN": sessionStorage.getItem("FXD_Token").toString(),
        "CurrentTileID": "",

      },clientConfigdata.CommonMethods.NodeServer + "SendQuoteEmailFXD","","POST",thisTile) .then((data) => {

        if (data.dataFromAjax.SendQuoteEmailResult.QuoteEmailSentYN == true) { // RizwanS || HSBCFXEINT-6 || 07 Nov 2023
          //LGTCLI-380 Instant Pricer Email All Successful Notification | Chaitanya M | 04 April 2023
          //START  
          if(productCode == productCodeTRFBuy ){
            mailedprodcts.push("FXTRF Buy");
          }else if(  productCode == productCodeTRFSell){
            mailedprodcts.push("FXTRF Sell");
          }else if(productCode == productCodePivot){ // LGTCLI-399 || Chaitanya M | 15 May 2023, 01 Jun 2023
            mailedprodcts.push("FXPivot");            
          }else if(productCode == productCodeStraddle){
            mailedprodcts.push("Strategies");
          }else if(productCode == productCodeStrangle){
            mailedprodcts.push("Strategies");
          }else if(productCode == productCodeRSKREV){
            mailedprodcts.push("Strategies");
          }else if(productCode == productCodeOPSPRD){            
            mailedprodcts.push("Strategies");
          }else if(productCode == productCodeFXVanilla){            
            mailedprodcts.push("Vanilla");
          }else if(productCode == productCodeFXBarrier){            
            mailedprodcts.push("Barriers");
          }else{
            mailedprodcts.push(productCode);
          }

          // LGTCLI-399 || Chaitanya M | 15 May 2023
          //mailedprodcts = mailedprodcts.filter((item, i, ar) => ar.indexOf(item) === i); // LGTCLI-399 || Chaitanya M | 15 May 2023

          if(mailedcount == _payoffcount-1){     

            plotmailall(mailedprodcts,true,"Success"); // LGTCLI-399 || Chaitanya M | 15 May 2023
             mailedcount = 0;      

          }else{

            plotmailall(mailedprodcts,"","In Progress"); // LGTCLI-399 || Chaitanya M | 15 May 2023
            mailedcount++
            return false; 
          }                 

        } else {  

         // mailedprodcts.push(productCode); // LGTCLI-399 || Chaitanya M | 15 May 2023

           if(mailedcount == _payoffcount-1){               

            //str = "Email Quote Failed for product : "+ productCode +" and RFQ: " + data.SendQuoteEmailResult.RFQID;
            // mailAllresponse.push(str);  
            if(productCode == productCodeTRFBuy ){
              mailedprodcts.push("FXTRF Buy");
            }else if(  productCode == productCodeTRFSell){
              mailedprodcts.push("FXTRF Sell");
            }else if(productCode == productCodePivot){ // LGTCLI-399 || Chaitanya M | 15 May 2023, 01 Jun 2023
              mailedprodcts.push("FXPivot");            
            }else if(productCode == productCodeStraddle){
              mailedprodcts.push("Strategies");
            }else if(productCode == productCodeStrangle){
              mailedprodcts.push("Strategies");
            }else if(productCode == productCodeRSKREV){
              mailedprodcts.push("Strategies");
            }else if(productCode == productCodeOPSPRD){            
              mailedprodcts.push("Strategies");
            }else if(productCode == productCodeFXVanilla){            
              mailedprodcts.push("Vanilla");
            }else if(productCode == productCodeFXBarrier){            
              mailedprodcts.push("Barriers");
            }else{
              mailedprodcts.push(productCode);
            }

            ValidateFieldmail("OrderPlacedAll", "Email Quote failed for " + productCode,true,"N","Error",true); //  LGTCLI-399 | 15 May 2023  |||LGTCLI-380 | Chaitanya M | 19 April 2023
            mailedcount = 0;      

          }else{
            ValidateFieldmail("OrderPlacedAll", "Email Quote failed for " + productCode,true,"N","Error",true); // LGTCLI-399 || Chaitanya M | 15 May 2023            
            mailedcount++
            // return false; 
          }     
          
        }
        //END      

      })
      .catch((error) => {
        console.log(error);
      });
    
  } catch (error) {
    console.log(error.message);

  }
}
//End

//LGTCLI-380 | Chaitanya M | 19 April 2023s
// LGTCLI-399 || Chaitanya M | 15 May 2023
function ValidateFieldmail(currentId, message,response,successYN,progress,isError) {
  try {
    
    validation_clear(); 
    var border = $("#" + currentId);
    var position = $("#" + currentId).offset()
    var w = $(window);
    var req = document.getElementById("required")
    req.style.left = (position.left - w.scrollLeft() + $("#" + currentId).outerWidth() + 2) + "px"
    req.style.top = (position.top - w.scrollTop() - 7) + "px"
    req.style.display = "block"
    border.addClass('ValidateFieldCSS');
 
    if (typeof (message) == "undefined") {
      slideNotify("#283c83", "Please fill all fields",response,successYN,progress,isError);
    } else {
      slideNotify("#b34b3b", message,response,successYN,progress,isError);
    }  
  } catch (er) {
      console.log(er.message);
  }
}
//End

//LGTCLI-380 | Chaitanya M | 19 April 2023
// LGTCLI-399 || Chaitanya M | 15 May 2023
function slideNotify(color, message,response,successYN,progress,isError) {
  try {

    if(isError == true){
      document.getElementById("errorsnackbar").style.display = "block"
      document.getElementById("errorSnackbarcontent").innerHTML = "";  
  
      $("#errorsnackbar").animate({
        width: "400px"
      });

      document.getElementById("inside_error").style.borderRadius = "5px 5px 5px 5px";  
      if(successYN=="Y"){
        document.getElementById("inside_error").style.border = "1px solid Green" ;
        document.getElementById("errorsnackbarheader").innerText = progress;
      }else{
        document.getElementById("inside_error").style.border = "1px solid Red" ;
        document.getElementById("errorsnackbarheader").innerText = progress;
      } 

      document.getElementById("errorSnackbarcontent").append(message);
      if(response == false){
        return false;
      }else{
        setTimeout(function () {
          $("#errorsnackbar").animate({
              width: "0px"
          });        
               
        }, 5000);
      
      }

    }else{

      document.getElementById("notificationsnackbar").style.display = "block"
      document.getElementById("Snackbarcontent").innerHTML = "";  
 
      $("#notificationsnackbar").animate({
          width: "400px"
      });

      document.getElementById("inside").style.borderRadius = "5px 5px 5px 5px";   

      if(successYN=="Y"){
        document.getElementById("inside").style.border = "1px solid Green" ;
        document.getElementById("snackbarheader").innerText = progress;
      }else{
        document.getElementById("inside").style.border = "1px solid Red" ;
        document.getElementById("snackbarheader").innerText = progress;
      }
    
      document.getElementById("Snackbarcontent").append(message);
      if(response == false){
        return false;
      }else{
        setTimeout(function () {
          $("#notificationsnackbar").animate({
              width: "0px"
          });       
        }, 5000);
      }

    }

  } catch (error) {
    console.log(error.message);
  }
}

//End

// LGTCLI-399 || Chaitanya M | 15 May 2023
function plotmailall(mailedprodcts,flag,progress) {
  try{ 

    if(flag == true ){
      ValidateFieldmail("OrderPlacedAll", "Email Quote sent successfully for " + mailedprodcts.filter((item, i, ar) => ar.indexOf(item) === i),true,"Y",progress);
  
    }else{
      ValidateFieldmail("OrderPlacedAll", "Email Quote sent successfully for " + mailedprodcts.filter((item, i, ar) => ar.indexOf(item) === i),false,"Y",progress);
    }
     
  }catch (error) {
    console.log(error.message);
  }
}
//End


