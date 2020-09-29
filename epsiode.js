const _ = require('lodash');
var fs = require('fs');
let rawdata = require("./data.json");
let data= JSON.parse(JSON.stringify(rawdata));
item = data[0]
key = Object.keys(item)[0]
patientdata= item[Object.keys(item)[0]]
//console.log(patientdata[1])
let output = {};
output.nodes= [{"node": 0, "name": "Pre-diagnostic"},
            {"node": 1, "name": "Diagnostic"},
            {"node": 2, "name": "Medical Decision-making"},
            {"node": 3, "name": "Treatment"},
            {"node": 4, "name": "Follow-up"},
            {"node": 5, "name": "unknown"}]
output.link= []

         //console.log(output.nodes)
for( j = 0; j < patientdata.length; j++){
    patientdata[j]['NewDate']=new Date (patientdata[j]['documentDate']);}

    patientDataSorted=_.sortBy(patientdata, ['NewDate']);

    var patientGroups = _(patientDataSorted)
            .groupBy(x => x.patientId)
            .map((value, key ) => ({patientId: key, data: value}))
            .value();

   
    //console.log(patientDataSorted[1].patientId, patientDataSorted[1].NewDate, patientDataSorted[1].documentEpisode)
    count=0; count1=0; count2=0; count3=0; count4=0; count5=0;
    for (i=0; i< patientGroups.length; i++)
    {
        for (j=0; j<patientGroups[i].data.length; j++)
        {
            if (patientGroups[i].data[j].documentEpisode == 'unknown' )
            {
                count= count+ 1
                patientGroups[i].data[j].node= 5;}
        if (patientGroups[i].data[j].documentEpisode == 'Pre-diagnostic' )
            {
                count1= count1+ 1
                patientGroups[i].data[j].node= 0}
        if (patientGroups[i].data[j].documentEpisode == 'Diagnostic' )
            {
                count2= count2+ 1
                patientGroups[i].data[j].node= 1}
        if (patientGroups[i].data[j].documentEpisode == 'Follow-up' )
                {
                    count3= count3+ 1
                    patientGroups[i].data[j].node= 4}
        if (patientGroups[i].data[j].documentEpisode == 'Medical Decision-making' )
                {
                count4= count4+ 1
                patientGroups[i].data[j].node= 2}
        if (patientGroups[i].data[j].documentEpisode == 'Treatment' )
                {
                count5= count5+ 1
                patientGroups[i].data[j].node= 3}

            //console.log( patientGroups[i].patientId, patientGroups[i].data[j].NewDate, patientGroups[i].data[j].documentEpisode,
              //  patientGroups[i].data[j+1].NewDate, patientGroups[i].data[j+1].documentEpisode )
    // console.log(patientGroups[i].data[j].documentEpisode," " , patientGroups[i].data[j].node)
    }
} 

//console.log("unkown", count, " ", "Pre-diagnostic:", count1, " ", "Diagnostic: ", count2, " ", "Follow-up:", count3," ",
            //" Medical Decision-making:" , count4, " ", "Treatment:", count5)
            for (i=0; i< patientGroups.length; i++)
            {
                for (j=1; j<patientGroups[i].data.length; j++)
                {
                    patientGroups[i].data[j-1].source= patientGroups[i].data[j-1].node
                    patientGroups[i].data[j].target=patientGroups[i].data[j].node
                    //console.log(patientGroups[i].patientId," ", patientGroups[i].data[j].documentEpisode, patientGroups[i].data[j-1].source, " ", 
                    //patientGroups[i].data[j].documentEpisode, patientGroups[i].data[j].target)
                    link = {"source": patientGroups[i].data[j-1].source, "target": patientGroups[i].data[j].target }
                    output.link.push(link)
                }

            
            }
           //console.log(output.link)
           //console.log(Object.keys(output.link))
           //console.log(output.link[0].source)
        
  var count ={}          
for (i=40; i<patientGroups.length; i++)
{
                for (j=1; j<patientGroups[i].data.length; j++)
                {
                    console.log(patientGroups[i].patientId, "source", 
                    patientGroups[i].data[j-1].source, " ", 
                    "target",patientGroups[i].data[j].target )}
                }
    
    
    
 //output.link.forEach(function(i) { count[i] = (count[i]||0) + 1;});
    //console.log(count)