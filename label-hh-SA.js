
const _ = require('lodash');
var fs = require('fs');


// declare the four quarters days range
var q1=90;
var q2=180;
var q3=270;
var q4=365;


//read the JSON file for all the Patients
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

for( j = 0; j < patientdata.length; j++)
{
    patientdata[j]['NewDate']=new Date (patientdata[j]['documentDate']);
}

//sort the patientdata by the new date object 
patientDataSorted=_.sortBy(patientdata, ['NewDate']);


// Group the data using patientId
var patientGroups = _(patientDataSorted)
            .groupBy(x => x.patientId)
            .map((value, key ) => ({patientId: key, data: value}))
            .value();


for (i= 0; i< patientGroups.length; i++)
{
    for (j=1; j<patientGroups[i].data.length; j++)
    {
        // first document for eachs patient is the starting date (Y1 and Q1)
        patientGroups[i].data[0]['Year']= 1; 
        patientGroups[i].data[0]['Quarter']= 1;

        //substract each document date from the start date to align all the documents date for each patient according to the starting point
        var diff = Math.abs((patientGroups[i].data[0]['NewDate']- patientGroups[i].data[j]['NewDate'])/86400000);
        if (diff == 0) // When differenr documents for that same patients  have the same date
        {
            patientGroups[i].data[j].Year= 1
            patientGroups[i].data[j].Quarter= 1
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

            if (docQuarter <= q1)
            {
                patientGroups[i].data[j]['Quarter']= 1;
            }
            else if (docQuarter > q1 && docQuarter<= q2)
            {
                patientGroups[i].data[j]['Quarter']= 2;
            }
        
            else if (docQuarter > q2 && docQuarter<= q3)
            {
                patientGroups[i].data[j]['Quarter']= 3;
            }
            else 
            {
                patientGroups[i].data[j]['Quarter']= 4;
            }
        }
    }
}
//Calculate total number of years in the cohort
var totalDaysDiff= Math.abs((patientDataSorted[0]['NewDate']- patientDataSorted[patientDataSorted.length-1]['NewDate'])/86400000);
var totalNumYear= Math.ceil(totalDaysDiff/365);

CountsPerYearAndQuarter=[]
 

// to aggregate  all documents for each patient, 
//  calculate the counts for each semnatic group (Finding, Procedure, Drug, Disorder, Lab, Others) 
//in each quarter/year 
fields = ['FindingCount','DrugCount','ProcedureCount','LabCount','OtherCount','DisorderCount'];
totals=[]

    for(i=0; i<patientGroups.length; i++) //loop through the patients (47 patients)
    {
      for(j=0;j<patientGroups[i].data.length; j++)// loop through the documents for each patients
        {
            quarter = patientGroups[i].data[j]['Quarter']
            //console.log(quarter)
            year = patientGroups[i].data[j]['Year']
            patient= patientGroups[i].patientId
            //console.log('Year:',year)
            //patient='patient' + i
            if (!(year in totals)) 
            {
            totals[year]={};
            } 
            if (!(quarter in totals[year])) 
            {
            totals[year][quarter]={};
            }
            if (!(patient in totals[year][quarter])) 
            {
            totals[year][quarter][patient]={};
            }
            
            if (!(year in CountsPerYearAndQuarter)) 
            {
                CountsPerYearAndQuarter[year] = {};
            }
            if (!(quarter in CountsPerYearAndQuarter[year]))
            {
                CountsPerYearAndQuarter[year][quarter]={};
            }
           // patientGroups[i].totals= totals
           // console.log(patientGroups[i].totals.length)
           
            for (f=0; f < fields.length; f++) 
            {
                field = fields[f];
                if (!(field  in totals[year][quarter])) 
                {
                    totals[year][quarter][field] = 0;
                }
                
                totals[year][quarter][field] = totals[year][quarter][field] +
                                                patientGroups[i].data[j]['labelCounts'][field]
                 if (!(field  in CountsPerYearAndQuarter[year][quarter])) 
                {
                    CountsPerYearAndQuarter[year][quarter][field]={};
		            CountsPerYearAndQuarter[year][quarter][field]['counts']=0;
   		            CountsPerYearAndQuarter[year][quarter][field]['patients']=[];
                }
                CountsPerYearAndQuarter[year][quarter][field]['counts'] = CountsPerYearAndQuarter[year][quarter][field]['counts']+ 
                                                                            patientGroups[i].data[j]['labelCounts'][field]
		        CountsPerYearAndQuarter[year][quarter][field]['patients'].push(patient);
            }

        }
    }

    //To remove any null or undefined values
CountsPerYearAndQuarter = CountsPerYearAndQuarter.filter(function(x) { return x !== null || x !== undefined }); 
totals=totals.filter(function(x) { return x !== null || x !== undefined });
    
//new structure to store the data into the form for the heat map
transformed =[];
patientList=[];
newEntry = {};
//patientCount=0;

//iterate through the year 
for (var key in CountsPerYearAndQuarter ) 
{
    //console.log(key)
    //Year is a char and start from zero, so Here I change the year to int and add one to each year
    year =parseInt(key) + 1
    //console.log(year)
    newEntry['year']=year; // Add Year
    //iterate through the quarter in each year
    for (var key1 in CountsPerYearAndQuarter[key]) 
    {
        //console.log(key1)
        newEntry['quarter']=key1; //Add the quarter 

       //iterate through the Labels 
        for (var key2 in CountsPerYearAndQuarter[key][key1])
        {  
            newEntry['field']=key2; //Add Labels
          // console.log( key2)
        //
            var key3 = CountsPerYearAndQuarter[key][key1][key2].counts
            newEntry['value']=key3; //Add Label counts 
            
            //console.log(key,year, key1,key2,key3) 

           //console.log(newEntry)   
            
                
            //var key4=CountsPerYearAndQuarter[key][key1][key2].patients
            //patientList.push(key4)
            //console.log(key4)
                   // for (j=0; i<key4.length; j++ )
                  //  { 

                    //    p=key4[j]
                    //    if(patientList.indexOf(p) == -1)
                     //   {
                    //    patientList.push({'Id': key4[j]})
                      //  }
                   // }
                   transformed.push(newEntry);
        }
        
        
            
    }      
            
    
}

//console.log(transformed)
    
patientListExample=[];
    //Example how to add the patient-name just once to the list for each label count 
for (j=0; j<CountsPerYearAndQuarter[1][1]['FindingCount']['patients'].length; j++)
    {
        //console.log(CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j])
        //CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j]['patientCount']=0;
        //console.log(CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j]['patientCount'])
        if(patientListExample.indexOf(CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j]) == -1)
            {    
            //CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j]['patientCount']=1;
            patientListExample.push(CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j])
            //console.log(CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j]['patientCount'])
            }
        //else

        //CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j]['patientCount']= CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j]['patientCount'] +1 ;
        //console.log(CountsPerYearAndQuarter[1][1]['FindingCount']['patients'][j]['patientCount'])
    }
    
   // console.log(patientListExample)
           

var obj=JSON.stringify(transformed)
fs.writeFile("LabelCounts.json", obj, function(err, result) {
if(err) console.log('error', err);
});