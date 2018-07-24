/*global localStorage*/
/*global $*/
/*global CanvasJS*/
/*exported load_check_login*/
var secure_key = localStorage.getItem("secure_key");
var uname  = localStorage.getItem("username");
var latestReading = "";
var previousReading = "";
var table = null;
var table1 = null;
var last24hrReading = {"status":"ok","result":[]};
var flag = 0;
var currKey = "R3903";
var currLen = 10;
var flagx = 0;
var flagt = 0;
var currLenbyDate = 10;
var dps = [];
var tps = [];
var dpsByDate = [];
var tpsByDate = [];
var chart = null;
var chart1 = null;
var databyd = [];
var lreadings = [];
var downloadTimer = null;

var descdict = {
    "R3913" : "Current average" ,
    "R3929" : "Current, phase 1" ,
    "R3943" : "Current, phase 2" ,
    "R3957" : "Current, phase 3" ,
    "R3909" : "Line to line average voltage" ,
    "R3911" : "Line to neutral voltage" ,
    "R3925" : "Voltage phase 1 to phase 2" ,
    "R3939" : "Voltage phase 2 to phase 3" ,
    "R3953" : "Voltage phase 3 to phase 1" ,
    "R3927" : "Voltage phase 1 to neutral" ,
    "R3941" : "Voltage phase 2 to neutral" ,
    "R3955" : "phase 3 to neutral" ,
    "R3903" : "Active power, total" ,
    "R3919" : "Active power, phase 1" ,
    "R3933" : "Active power, phase 2" ,
    "R3947" : "Active power, phase 3" ,
    "R3905" : "Reactive power, total" ,
    "R3921" : "Reactive power, phase 1" ,
    "R3935" : "Reactive power, phase 2" ,
    "R3949" : "Reactive power, phase 3" ,
    "R3901" : "Apparent power, total" ,
    "R3917" : "Apparent power, phase 1" ,
    "R3931" : "Apparent power, phase 2" ,
    "R3945" : "Apparent power, phase 3" ,
    "R3907" : "Power factor average" ,
    "R3923" : "Power factor, phase 1" ,
    "R3937" : "Power factor, phase 2" ,
    "R3951" : "Power factor, phase 3" ,
    "R3915" : "Frequency, Hz" ,
    "R3861" : "Voltage THD, phase 1" ,
    "R3863" : "Voltage THD, phase 2" ,
    "R3865" : "Voltage THD, phase 3" ,
    "R3867" : "Current THD, phase 1" ,
    "R3869" : "Current THD, phase 2" ,
    "R3871" : "Current THD, phase 3" ,
    "R3959" : "Forward apparent energy" ,
    "R3961" : "Forward active energy" ,
    "R3963" : "Forward reactive inductive energy" ,
    "R3965" : "Forward reactive capacitive energy" ,
    "R3967" : "Reverse apparent energy" ,
    "R3969" : "Reverse active energy" ,
    "R3971" : "Reverse reactive inductive Energy" ,
    "R3973" : "Reverse reactive capacitive Energy" ,
    "R3975" : "Demand Present demand" ,
    "R3977" : "Demand Rising demand" ,
    "R3979" : "Maximum demand" ,
    "R3881" : "Average load percentage" ,
    "R3883" : "Percentage of phase 1 load" ,
    "R3885" : "Percentage of phase 2 load" ,
    "R3887" : "Percentage of phase 3 load" ,
    "R3889" : "Load Unbalanced load" ,
    "R3891" : "voltage Unbalanced voltage" ,
    "R3993" : "hrs On hours" ,
    "R3995" : "secs Forward run seconds" ,
    "R3997" : "secs Reverse run seconds" ,
    "R3999" : "Number of power interruptions" ,
    "R3981" : "Maximum demand occurrence time"
};

$(document).ready(function() {
    $('#logout_btn').on('click', function(e){
        e.preventDefault();
        checkLogout_ajax();
    });
});
       
var g = "";
var i = 0;

function checkLogout_ajax(){
    var logoutCheckParameters = {
        "username": uname,
        "key":secure_key
    };

    $.ajax({
        type: 'post',
        url: 'route.php',
        data: {'url':'pireadingslogger/checkLogout/',
        'payload':JSON.stringify(logoutCheckParameters)
        },
        cache:false,
        async:false,
        success: function(response) {
            var response_msg = JSON.parse(response);
            if(response_msg["status"]!= "ok"){
                alert("Invalid session id");
            }
            localStorage.removeItem("username");
            localStorage.removeItem("login_success");
            localStorage.removeItem("secure_key");
            window.location.replace("index.html");
        },
        error: function(){
            alert("Error in Internet Connection");
        }
    });;
}

function getLatestReading_ajax() {
    var getLatestReadingparameters = {
        "key": secure_key
    };

    $.ajax({
        type: 'post',
        url: 'route.php',
        data: {
            'url':'pireadingslogger/getLatestReading/',
            'payload':JSON.stringify(getLatestReadingparameters)
        },
        beforesend : function(){
        	document.getElementById("latestReadingInfoBox").className = "alert alert-info";
            document.getElementById("latestReadingInfoBox").innerHTML="<strong>Info!</strong> Values are being updated. Make sure internet is available throughout fetching process.<Br>Fetching data...";
        },
        cache:false,
        async:true,
        success: function(response){
            var timeleft = 60;
            if(downloadTimer != null){
                clearInterval(downloadTimer);
                downloadTimer = null;
            }
            downloadTimer = setInterval(function(){
                document.getElementById("latestReadingInfoBox").innerHTML="<strong>Success!</strong> All values are up-to-date.<br>Next update to be fetched in "+--timeleft+" sec";
                if(timeleft <= 0){
                    clearInterval(downloadTimer);
                    downloadTimer = null;
                }
            },1000);
            document.getElementById("latestReadingInfoBox").className = "alert alert-success";
            latestReading = JSON.parse(response);
            if(latestReading["status"] != "ok"){
                checkLogout_ajax();
            }
            else{
                if(flag==0)
                {
                    displayLatestReading(currKey,0);
                    previousReading = latestReading;
                }
                else
                {
                    if(latestReading["result"]["date"]!=previousReading["result"]["date"] || latestReading["result"]["time"]!=previousReading["result"]["time"])
                    {
                        displayLatestReading(currKey,1);
                        previousReading = latestReading;
                    }
                }
            }
        },
        error: function(){
            document.getElementById("latestReadingInfoBox").className = "alert alert-danger";
            var timeleft1 = 60;
            if(downloadTimer != null){
                clearInterval(downloadTimer);
                downloadTimer = null;
            }
            downloadTimer = setInterval(function(){
                document.getElementById("latestReadingInfoBox").innerHTML="<strong>Error!</strong> Latest data could not be fetched.<br> Retrying in "+--timeleft1+" sec";
                if(timeleft1 <= 0){
                    clearInterval(downloadTimer);
                    downloadTimer = null;
                }
            },1000);
        }
    });
}


function displayLatestReading(ckey,ch){
    if (latestReading!={})
    {
        document.getElementById('latestvalue').innerHTML = latestReading["result"]["readings"][ckey];
        document.getElementById('received_date').innerHTML = latestReading["result"]["date"];
        document.getElementById('received_time').innerHTML = latestReading["result"]["time"];
        if (descdict[ckey].length<20){
            var temp = descdict[ckey];
            for(var j = temp.length;j<=20;j++)
                temp=temp+" ";
            document.getElementById('disp_reg').innerHTML = temp+"<span class='caret'></span>";
        }
        else
            document.getElementById('disp_reg').innerHTML = descdict[ckey].substring(0,17)+"... <span class='caret'></span>";

    }
    currKey = ckey;
    update24HrData(ch);
    flag=1;
}

function change_R(ckey){
    document.getElementById('maincontent').style.display="none";
    document.getElementById('loadingsection').style.display="inline";
    document.getElementById('loadingsectiontext').innerHTML="<h5><strong>Setting up SDLS web interface for "+ descdict[currKey] +". Hang tight..</strong></h5>";
    displayLatestReading(ckey,0);
    displayDataByDate();
}		
setInterval(getLatestReading_ajax, 60*1000);


function get24HrData_ajax(){
    var getLatestReadingparameters = {
        "key": secure_key
    };

    $.ajax({
        type: 'post',
        url: 'route.php',
        data: {
            'url':'pireadingslogger/get24hrReadings/',
            'payload':JSON.stringify(getLatestReadingparameters)
        },
        cache:false,
        async:true,
        success: function(response) {
            last24hrReading = JSON.parse(response);
            if(last24hrReading["status"] != "ok"){
                checkLogout_ajax();
            }
            else{
                for (var i =0;i<last24hrReading["result"].length;i++)
                {
                    var p = last24hrReading["result"][i];
                    lreadings.push(p);
                }
                lreadings.sort(sortFunction);
                getLatestReading_ajax();
            }
            
        },
        error: function(){
            console.log("error in fetching data");
            alert("Errorn in Internet Connection");
            window.location.replace("welcome.html");
        }
    });
}
		

function sortFunction(a, b) {
    var p = a["date"].split('-');
    var p2 = a["time"].split(':');
    var p1 = b["date"].split('-');
    var p3 = b["time"].split(':');
    var a1 =new Date(p[2],p[1]-1,p[0],p2[0],p2[1],p2[2]);
    var b1 = new Date(p1[2],p1[1]-1,p1[0],p3[0],p3[1],p3[2]);
    if (a1 === b1) {
        return 0;
    }
    else {
        return (a1 < b1) ? 1 : -1;
    }
}

function update24HrData(ch)
{
    if(ch==1){
        lreadings.unshift(latestReading["result"]);
        lreadings.splice(lreadings.length-1,1);        
    }
    dps = [];
    tps = [];
    var page_no=0;
    var page_len = 10;
    var start_p = page_no * page_len;
    var end_p = start_p + page_len;
    
    if(flagt==1){
        var info = table.page.info();
        page_no = info["page"];
        page_len = info["length"];
        start_p = info["start"];
        end_p = info["end"];
        flagt = 0;
    }
    
    if(table!=null){
        table.clear();
    }
    else{
        table = $('#latest24hrdata').DataTable(
            {
                "order":[],
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "scrollY": "57vh",
                "scrollCollapse":true,
                "pagingType": "simple_numbers",
                "columns": [
                            { "title": "Date (dd-mm-yyyy)"},
                            { "title": "Time (hh:mm:ss)"},
                            { "title": "Readings (In standard unit)"}
                         ]
                
            }
        );
        $('#latest24hrdata').on( 'length.dt', function ( e, settings, len ) {
            len = (len==-1)?lreadings.length:len;
            len = (len<=lreadings.length)?len:lreadings.length;
            dps = [];
            currLen=len;
            for(var h=0;h<len;h++)
            {
                var p1 = lreadings[h];
                dps.unshift({label:p1["time"].substring(0,5),y:p1["readings"][currKey]});
            }
            if(chart!=null){
                chart.destroy();
                chart = null;
            }
            chart = new CanvasJS.Chart("chartContainer",{
                axisX: {						
                    title: "Time",
                    titleFontSize:20,
                    titleFontFamily:"calibri",
                    labelFontSize:12,
                    labelFontWeight:"bold",
                    labelAutoFit:true,
                    includeZero: false
                },
                axisY: {						
                    title:descdict[currKey],
                    titleFontSize:20,
                    titleFontFamily:"calibri",
                    labelFontSize:12,
                    labelFontWeight:"bold",
                    includeZero: false
                },
                data: [{
                    type: "line",
                    dataPoints : dps
                }]
            });
            chart.render();
        });
        
        $('#latest24hrdata').on( 'page.dt', function (){
                var info = table.page.info();
                var start_p = info["start"];
                var end_p = info["end"];
                dps = [];
                for(var h=start_p;h<end_p;h++)
                {
                    var p1 = lreadings[h];
                    dps.unshift({label:p1["time"].substring(0,5),y:p1["readings"][currKey]});
                }
                if(chart!=null){
                    chart.destroy();
                    chart = null;
                }
                chart = new CanvasJS.Chart("chartContainer",{
                    axisX: {						
                        title: "Time",
                        titleFontSize:20,
                        titleFontFamily:"calibri",
                        labelFontSize:12,
                        labelFontWeight:"bold",
                        labelAutoFit:true,
                        includeZero: false
                    },
                    axisY: {						
                        title:descdict[currKey],
                        titleFontSize:20,
                        titleFontFamily:"calibri",
                        labelFontSize:12,
                        labelFontWeight:"bold",
                        includeZero: false
                    },
                    data: [{
                        type: "line",
                        dataPoints : dps
                    }]
                });
            chart.render();
        });
    }
    
    for (var i =0;i<lreadings.length;i++)
    {
        var p = lreadings[i];
        table.row.add([p["date"],p["time"],Math.round(100*p["readings"][currKey])/100]);
        if(i >=start_p && i < end_p){
            dps.unshift({label:p["time"].substring(0,5),y:p["readings"][currKey]});
        }
    }
    
    flagt=1;
    if(chart!=null){
        chart.destroy();
        chart = null;
    }
    chart = new CanvasJS.Chart("chartContainer",{
        axisX: {						
            title: "Time",
            titleFontSize:20,
            titleFontFamily:"calibri",
            labelFontSize:12,
            labelFontWeight:"bold",
            labelWrap :true,
            includeZero: false
        },
        axisY: {						
            title: descdict[currKey],
            titleFontSize:20,
            titleFontFamily:"calibri",
            labelFontSize:12,
            labelFontWeight:"bold",
            includeZero: false
        },
        data: [{
            type: "line",
            dataPoints : dps
        }]
    });
    chart.render();
    document.getElementById('loadingsection').style.display="none";
    document.getElementById('maincontent').style.display="inline";
    table.page.len(page_len).draw();
    table.page(page_no).draw( 'page' );
}


        
window.onclick = function(event) {
    
    var dropdowns = document.getElementById("register_list");
    if (event.target.id=="disp_reg") {
        if (dropdowns.style.display=='block'){
            dropdowns.style.display="none";
        }
        else{
            dropdowns.style.display="block";
        }
    }
    else
    {
        if (dropdowns.style.display=='block'){
            dropdowns.style.display="none";
        }
    }
};
		
function OnLoadFn()
{
    i = 0;
    for(i in descdict)
    {
        g = g+"<a onclick=\"change_R('"+i+"');\">"+descdict[i]+"</a>";
        i+=1;
    }
    document.getElementById('register_list').innerHTML=g;
    get24HrData_ajax();
    
    var today = new Date();
	var today_date = today.getDate();
    var last_month_date = today_date;
	var today_month = today.getMonth()+1; //January is 0!
    var last_month = today_month-1;
	var today_year = today.getFullYear();
    var last_month_year = today_year;
    
    if(last_month_date>28){
        last_month_date = 28;
    }
    
    if(last_month <=0){
        last_month = 12;
        last_month_year = last_month_year - 1;
    }
	var today2 = today_date+'-'+today_month+'-'+today_year;
    var today3 = last_month_date+'-'+last_month+'-'+last_month_year;
    document.getElementById('startdate').defaultValue = today3;
    document.getElementById('enddate').defaultValue = today2;
	$(document).ready(function() {
    	start = $("#startdate").datepicker({
            dateFormat: 'dd-mm-yy',
            onSelect: function() {
                var minDate = document.getElementById('startdate').value;
                $("#enddate").datepicker( "option", "minDate", minDate);
            }
        });
        end = $("#enddate").datepicker({
            dateFormat: 'dd-mm-yy'
        });
        $("#enddate").datepicker( "option", "minDate", today3);
    });
    getDatabyDate_ajax();
}



function getDatabyDate_ajax()
{
	var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    if(startdate=="" || enddate == ""){
    	alert("Choose a valid date to filter data");
    }
    else{
        var getLatestReadingparameters = {
            "key": secure_key,
            "start_date":startdate,
            "end_date":enddate
        };

        $.ajax({
            type: 'post',
            url: 'route.php',

            data: {
                'url':'pireadingslogger/getReadingsByDate/',
                'payload':JSON.stringify(getLatestReadingparameters)
            },

            cache:false,
            async:true,
            success: function(response) 
            {
                var dataByDate = JSON.parse(response);
                if(dataByDate["status"]!="ok"){
                    checkLogout_ajax();
                }
                else{
                    databyd = dataByDate["result"];
                    databyd.sort(sortFunctionByDate);
                    displayDataByDate();
                }
            }
        });
    }
    
}

function sortFunctionByDate(a, b) {
    var p = a["date"].split('-');
    var p1 = b["date"].split('-');
    var a1 =new Date(p[2],p[1]-1,p[0]);
    var b1 = new Date(p1[2],p1[1]-1,p1[0]);
    if (a1 === b1) {
        return 0;
    }
    else {
        return (a1 < b1) ? 1 : -1;
    }
}

function displayDataByDate(){
    dpsByDate = [];
    tpsByDate = [];
    
    if(table1!=null){
        table1.clear();
    }
    else{     
        table1 = $('#dataByDateTable').DataTable(
            {
                "order":[],
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "scrollY": "57vh",
                "scrollCollapse":true,
                "pagingType": "simple_numbers",
                columns: [
                            { title: "Date" },
                            { title: "Average Reading" }
                         ]
                
            }
        );
        $('#dataByDateTable').on( 'length.dt', function ( e, settings, len ) {
            dpsByDate = [];
            var len = (len==-1)?databyd.length:len
            len = (len<=databyd.length)?len:databyd.length;
            var currLenbyDate = len;
            for(var h=0;h<len;h++)
            {
                var p2 = databyd[h];
                dpsByDate.unshift({label:p2["date"].substring(0,5),y:p2["readings"][currKey]});
            }
            if(chart1!=null){
                chart1.destroy();
                chart1 = null;
            }
            chart1 = new CanvasJS.Chart("chartContainer1",{
                axisX: {                        
                    title: "Date",
                    titleFontSize:20,
                    titleFontFamily:"calibri",
                    labelFontSize:12,
                    labelFontWeight:"bold",
                    labelAutoFit:true,
                    includeZero: false
                },
                axisY: {                        
                    title:descdict[currKey],
                    titleFontSize:20,
                    titleFontFamily:"calibri",
                    labelFontSize:12,
                    labelFontWeight:"bold",
                    includeZero: false
                },
                data: [{
                    type: "line",
                    dataPoints : dpsByDate
                }]
            });
            chart1.render();
        });
        $('#dataByDateTable').on( 'page.dt', function () {
            dpsByDate = [];
            var info = table1.page.info();
            var start_p = info["start"];
            var end_p = info["end"];
            for(var h=start_p;h<end_p;h++)
            {
                var p2 = databyd[h];
                dpsByDate.unshift({label:p2["date"].substring(0,5),y:p2["readings"][currKey]});
            }
            if(chart1!=null){
                chart1.destroy();
                chart1 = null;
            }
            chart1 = new CanvasJS.Chart("chartContainer1",{
                axisX: {                        
                    title: "Date",
                    titleFontSize:20,
                    titleFontFamily:"calibri",
                    labelFontSize:12,
                    labelFontWeight:"bold",
                    labelAutoFit:true,
                    includeZero: false
                },
                axisY: {                        
                    title:descdict[currKey],
                    titleFontSize:20,
                    titleFontFamily:"calibri",
                    labelFontSize:12,
                    labelFontWeight:"bold",
                    includeZero: false
                },
                data: [{
                    type: "line",
                    dataPoints : dpsByDate
                }]
            });
            chart1.render();
        });
    }
    
    for (var i=0;i<databyd.length;i++)
    {
        var p = databyd[i];
        table1.row.add([p["date"],Math.round(100*p["readings"][currKey])/100]);
        if (i<currLenbyDate)
            dpsByDate.unshift({label:p["date"],y:p["readings"][currKey]});
    }
    flagx = 1;
    if(chart1!=null){
        chart1.destroy();
        chart1 = null;
    }
    chart1 = new CanvasJS.Chart("chartContainer1",{
        axisX: {                        
            title: "Date",
            titleFontSize:20,
            titleFontFamily:"calibri",
            labelFontSize:12,
            labelFontWeight:"bold",
            labelAutoFit:true,
            includeZero: false
        },

        axisY: {                        
            title:descdict[currKey],
            titleFontSize:20,
            titleFontFamily:"calibri",
            labelFontSize:12,
            labelFontWeight:"bold",
            includeZero: false
        },

        data: [{
            type: "line",
            dataPoints : dpsByDate
        }]
    });
    chart1.render();
    table1.page.len(10).draw();
    table1.page(0).draw('page');
}

function showTableGraphs(choice)
{
	if(choice==0)
	{
		document.getElementById("last24hrtdatasection").style.display="inline";
		document.getElementById("databydatesection").style.display="none";
		document.getElementById("24hrbutton").style.borderColor = "#fff #fff #000 #fff";
		document.getElementById("databydatebutton").style.borderColor = "#fff #fff #fff #fff";
		document.getElementById("24hrbutton").innerHTML="<h4><strong>24 Hour Data</strong></h4>";
		document.getElementById("databydatebutton").innerHTML="<h4>Data by Date</h4>";
        if(table!=null){
            table.page('first').draw('page');
        }
    
	}
	else
	{
		document.getElementById("last24hrtdatasection").style.display="none";
		document.getElementById("databydatesection").style.display="inline";
		document.getElementById("24hrbutton").style.borderColor = "#fff #fff #fff #fff";
		document.getElementById("databydatebutton").style.borderColor = "#fff #fff #000 #fff";
		document.getElementById("24hrbutton").innerHTML="<h4>24 Hour Data</h4>";
		document.getElementById("databydatebutton").innerHTML="<h4><strong>Data by Date</strong></h4>";
        if(table1!=null){
            table1.page('first').draw('page');
        }
	}
}
