const _ = require('lodash');
var fs = require('fs');
// declare the four quarters days range
var q1=90;
var q2=180;
var q3=270;
var q4=365;

totalFindingQ1= 0;
totalDisorderQ1=0;
totalDrugQ1=0;
totalLabQ1=0;
totalProcdureQ1=0;
totalOthersQ1=0;

totalFindingQ2= 0;
totalDisorderQ2=0;
totalDrugQ2=0;
totalLabQ2=0;
totalProcdureQ2=0;
totalOthersQ2=0;

totalFindingQ3= 0;
totalDisorderQ3=0;
totalDrugQ3=0;
totalLabQ3=0;
totalProcdureQ3=0;
totalOthersQ3=0;

totalFindingQ4= 0;
totalDisorderQ4=0;
totalDrugQ4=0;
totalLabQ4=0;
totalProcdureQ4=0;
totalOthersQ4=0;

//read the JSON file for aal the Patients
let rawdata = require("./data.json");
let data= JSON.parse(JSON.stringify(rawdata));

//console.log(data)
item = data[0]
key = Object.keys(item)[0]
//Store patients data into an array called patientdata
patientdata= item[Object.keys(item)[0]]
//console.log(patientdata[1])


//documentDate is a string. Convert documnetDate which is a string to a date object
// I added an element to the array called  NewDate to store the date object for each document
for( j = 0; j < patientdata.length; j++){
    patientdata[j]['NewDate']=new Date (patientdata[j]['documentDate']);
    
    
    //To view all the NewDate for all the documents for each patient in the cohort 
    //console.log(patientdata[j]['patientId'],' ', patientdata[j]['documentDate'], ' ', patientdata[j]['NewDate'])
}

//sort the patientdata by the new date object 

patientDataSorted=_.sortBy(patientdata, ['NewDate']);
//console.log(patientDataSorted[1])
// This  to check if the patientDataSorted has the documents sorted by the NewDate 
//for( j = 0; j < patientDataSorted.length; j++){
  //  console.log(patientDataSorted[j]['patientId'],' ', patientdata[j]['NewDate'], ' ', patientDataSorted[j]['NewDate']);
//} 

// Group the data using patientId
var patientGroups = _(patientDataSorted)
            .groupBy(x => x.patientId)
            .map((value, key ) => ({patientId: key, data: value}))
            .value();
            
   //console.log(patientGroups)

// console.log(patientGroups[0].patientId,'Start Date:', patientGroups[0].data[0].NewDate,'End Date:', patientGroups[0].data[data.length-1].NewDate)
// console.log(patientGroups[1].patientId,'Start Date:',patientGroups[1].data[0].NewDate,'End Date:', patientGroups[1].data[data.length-1].NewDate)
// console.log(patientGroups[2].patientId,'Start Date:',patientGroups[2].data[0].NewDate,'End Date:', patientGroups[2].data[data.length-1].NewDate)
// console.log(patientGroups[3].patientId,'Start Date:',patientGroups[3].data[0].NewDate,'End Date:', patientGroups[3].data[data.length-1].NewDate)


// To detemine the Year and Quarter for each document for each patient in the cohort

// var diff2= Math.abs((patientGroups[1].data[0]['NewDate']- patientGroups[1].data[5]['NewDate'])/86400000);
// var diff12= Math.floor(diff2);
// var docYear= Math.ceil(diff12/365);
// console.log(diff12, diff2, docYear)
// for (j=1; j<patientGroups[1].data.length; j++)
// { var diff = Math.abs((patientGroups[1].data[0]['NewDate']- patientGroups[1].data[j]['NewDate'])/86400000);
// var diff1= Math.floor(diff);
// var docYear= Math.ceil(diff1/365); //to calculate the number of years where the documents distributed for each patient
// //console.log('Start Date', patientGroups[1].data[0].NewDate, 'Next Date',  patientGroups[1].data[j].NewDate, 'Difference', diff)

// docQuarter= Math.abs((docYear-1) * 365 -diff1);
// //console.log('docQuarter', docQuarter, 'difference in days', diff1, 'Year', docYear)
// if (docQuarter <= q1){
//     patientGroups[1].data[j]['Quarter']= 'Q1';
    
// }
// else if (docQuarter > q1 && docQuarter<= q2)
// {
//     patientGroups[1].data[j]['Quarter']= 'Q2';
// }

// else if (docQuarter > q2 && docQuarter<= q3)
// {
//     patientGroups[1].data[j]['Quarter']= 'Q3';
// }
// else 
// {
//     patientGroups[1].data[j]['Quarter']= 'Q4';}

// console.log('docQuarter', docQuarter, 'difference in days', diff1, 'Year', docYear, 'Quarter', patientGroups[1].data[j]['Quarter'])

// }
//Math.abs((docYear-1) * 365 -diff1);

for (i= 0; i< patientGroups.length; i++)
{
    for (j=1; j<patientGroups[i].data.length; j++)
    {

        patientGroups[i].data[0]['Year']= 1; // first document for eachs patient is the starting date (Y1 and Q1)
        patientGroups[i].data[0]['Quarter']= 'Q1';
        //substract each document date from the start date to align all the documents date for each patient according to the starting point
        var diff = Math.abs((patientGroups[i].data[0]['NewDate']- patientGroups[i].data[j]['NewDate'])/86400000);
        if (diff == 0) // When differenr documents for that same patients  have the same date
        {
            patientGroups[i].data[j].Year= 1
            patientGroups[i].data[j].Quarter= 'Q1'
        }
        else
        {
        var diff1= Math.floor(diff);
        
        var docYear= Math.ceil(diff1/365); //to calculate the number of years where the documents distributed for each patient
        
        patientGroups[i].data[j]['Year']= docYear
        
        //to calculate the quarter 
        // example : if the document is located in Year 2 and the difference between the first date and the current date is 488 days
        // Then to assign the quarter, I will use the following formula
        // docQuarter = Abs[(2-1)*365 - 488] = 123 (Quarter 2)
        docQuarter= Math.abs((docYear-1) * 365 -diff1);

        if (docQuarter <= q1){
            patientGroups[i].data[j]['Quarter']= 'Q1';
        }
        else if (docQuarter > q1 && docQuarter<= q2)
        {
            patientGroups[i].data[j]['Quarter']= 'Q2';
        }
        
        else if (docQuarter > q2 && docQuarter<= q3)
        {
            patientGroups[i].data[j]['Quarter']= 'Q3';
        }
        else 
        {
            patientGroups[i].data[j]['Quarter']= 'Q4';}
        }
}
}
//Calculate total number of years in the cohort
var totalDaysDiff= Math.abs((patientDataSorted[0]['NewDate']- patientDataSorted[patientDataSorted.length-1]['NewDate'])/86400000);
var totalNumYear= Math.ceil(totalDaysDiff/365);
// console.log('first Date in the cohort:', patientDataSorted[0]['NewDate'])
// console.log('Last Date in the cohort:', patientDataSorted[patientDataSorted.length-1]['NewDate'])
// console.log ('number of Days:', totalDaysDiff);
// console.log('number of years:', totalNumYear);
// console.log(patientGroups[30].data.length)
// console.log('***********************************')
// console.log(patientGroups[1].data[1].labelCounts.FindingCount)


 
CountsPerYearAndQuarter=[]
 
// Here where I need your help 
// to aggregate  all documents for each patient, 
// the goal here is to calculate the counts for each semnatic group (Finding, Procedure, Drug, Disorder, Lab, Others) in each quarter/year 
fields = ['FindingCount','DrugCount','ProcedureCount','LabCount','OtherCount','DisorderCount'];
totals=[]
//for(y=1; y<totalNumYear; y++) // Loop through the number of years in the cohort (15 years)
//{
    for(i=0; i<patientGroups.length; i++) //loop through the patients (47 patients)
    {
      for(j=0;j<patientGroups[i].data.length; j++)// loop through the documents for each patients
        {
            quarter = patientGroups[i].data[j]['Quarter']
            //console.log(quarter)
            year = patientGroups[i].data[j]['Year']
            //console.log('Year:',year)
            if (!(year in totals)) 
            {
            totals[year]={};
            } 
            if (!(quarter in totals[year])) 
            {
            totals[year][quarter]={};
            }
            if (!(year in CountsPerYearAndQuarter)) 
            {
                CountsPerYearAndQuarter[year] = {};
            }
            if (!(quarter in CountsPerYearAndQuarter[year]))
            {
                CountsPerYearAndQuarter[year][quarter]={};
            }
            patientGroups[i].totals= totals
           // console.log(patientGroups[i].totals.length)
            for (f=0; f < fields.length; f++) 
            {
                field = fields[f];
                if (!(field  in totals[year][quarter])) 
                {
                totals[year][quarter][field] = 0;
                }
                totals[year][quarter][field] = totals[year][quarter][field]+patientGroups[i].data[j]['labelCounts'][field]
                if (!(field  in CountsPerYearAndQuarter[year][quarter])) 
                {
                    CountsPerYearAndQuarter[year][quarter][field] = 0;
                }
                CountsPerYearAndQuarter[year][quarter][field] = CountsPerYearAndQuarter[year][quarter][field]+ patientGroups[i].data[j]['labelCounts'][field]
            }
        }
       
        
        //console.log(CountsPerYearAndQuarter)
            // done going through all documents for the patient. 
           //patientGroups[1].totals = totals;
    }

YearsArr=[]
QuarterArr=[]
//console.log(CountsPerYearAndQuarter[1])
for(const [key, value] of Object.entries(CountsPerYearAndQuarter)) {
    YearsArr=[key]
    QuarterArr=[value]
//console.log(key, value);
  //  console.log(YearsArr)
    //console.log(QuarterArr)

  }
  

  //Object.keys(CountsPerYearAndQuarter).forEach(key => { console.log(key, CountsPerYearAndQuarter[key]) })
  //Object.keys(CountsPerYearAndQuarter).forEach(key => { console.log(key)})
  //Object.keys(CountsPerYearAndQuarter).forEach(key => { console.log(CountsPerYearAndQuarter[key].Q1.FindingCount)})





CountsPerYearAndQuarter = CountsPerYearAndQuarter.filter(function(x) { return x !== null || x !== undefined }); 

var obj=JSON.stringify(CountsPerYearAndQuarter)
var keyYear= Object.keys(CountsPerYearAndQuarter)
//console.log(CountsPerYearAndQuarter.length);
console.log(Object.keys(CountsPerYearAndQuarter[1]))
year= Object.keys(CountsPerYearAndQuarter)
console.log(year)

//console.log( CountsPerYearAndQuarter);
//Object.keys(CountsPerYearAndQuarter).forEach(k => (!CountsPerYearAndQuarter[k] && CountsPerYearAndQuarter[k] !== undefined) && delete CountsPerYearAndQuarter[k]);
//console.log(obj)

//Object.keys(CountsPerYearAndQuarter).forEach(key => { console.log(CountsPerYearAndQuarter[key].Q2.OtherCount)})
fs.writeFile("TotalCounts12.json", obj, function(err, result) {
    if(err) console.log('error', err);
});


//console.log(patientGroups[0].data[0].NewDate)
//console.log(patientGroups[46].data[22].NewDate)

    