
// YouTube video fetching app

import React, { Component } from 'react';
import './App.css';
import {Controls} from './Controls';

  const APIKEY = 'AIzaSyAOYG1Ai4mZy6L-ifZgQ8bzS87vA6v3JdA';
// const channelId = 'UCq-Fj5jknLsUf-MWSy4_brA';                 // T series
  
  // const sonyMusicChId = 'UC56gTxNs4f9xZ7Pa2i5xNzg';
  // const TSeriesChId = 'UCq-Fj5jknLsUf-MWSy4_brA';
  // const fast2FasttechChId='UCE8BWC4Lm-zpycK2zw45p7g';
  
  // var channelId =TSeriesChId;
  var channelId = '';             // initially none
  
  var type = 'video';                // channel,playlist,video

  var orderCriteria = 'date';    // date,rating,title,viewCount,
  var publishedAfter =  '2003-01-20T00:00:00Z' ;           //  1970-01-01T00:00:00Z

  // current Date and Time

  var yy = new Date().getFullYear();
  var mm = new Date().getUTCMonth()+1;                // since month =[0,11]
  var dd = new Date().getUTCDate();
  var hh = new Date().getUTCHours();
  var mins= new Date().getUTCMinutes();
  var ss = new Date().getUTCSeconds();

  var count=0;
  
  console.log('utc=' + yy+'-'+mm+'-'+dd+'T'+hh+'-'+mins+'-'+ss);
  
  //'2019-01-20T00:00:00Z';

    if(mm<=9)
      mm='0'+mm;
      if(dd<=9)
      dd='0'+dd;
  
      if(hh<=9)
        hh='0'+hh;
        if(mins<=9)
        mins='0'+mins;
        if(ss<=9)
        ss='0'+ss;

  var publishedBefore = yy + '-' + mm + '-' + dd + 'T' + hh + ':' + mins + ':' + ss + 'Z';
  var videoDuration = 'any';       // long,short,medium
  var maxResults = 50;                                     // [0,50]
 
   // others filter as welll  , visit below link
  // https://developers.google.com/youtube/v3/docs/search/list

// original
   // var finalURL = `https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&part=snippet,id&type=${type}&order=${orderCriteria}&maxResults=${maxResults}` ;

  class App extends Component {
  
  constructor(props) {
  super(props);

  this.state = {
    resultsYT: [],
    title: [],
    description: [],
    publishedAt: [],
    channelTitle: [],
    kind: []

  };
  this.handleClick = this.handleClick.bind(this);
  this.getTitle = this.getTitle.bind(this);
  this.getDescription = this.getDescription.bind(this);
  this.getTime = this.getTime.bind(this);
  this.checkAfterDate = this.checkAfterDate.bind(this);
  this.getOrderOption = this.getOrderOption.bind(this);
  this.getVideoDurOption = this.getVideoDurOption.bind(this);
  this.getMaxResults = this.getMaxResults.bind(this);
  
  this.getAfterDate = this.getAfterDate.bind(this);
  this.getBeforeDate = this.getBeforeDate.bind(this);
  this.getChannelId = this.getChannelId.bind(this);
  // this.getChecked = this.getChecked.bind(this);
  this.showFilterOPtion = this.showFilterOPtion.bind(this);
  this.showChanneIdlInfo = this.showChanneIdlInfo.bind(this);
  this.hideChanneIdlInfo = this.hideChanneIdlInfo.bind(this);
  }

handleClick() {
  
  // keep final URL here so that filter could be applied
  var finalURL;

   if(channelId==='')         // without channel id
     finalURL = `https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&part=snippet,id&type=${type}&videoDuration=${videoDuration}&order=${orderCriteria}&publishedAfter=${publishedAfter}&publishedBefore=${publishedBefore}&maxResults=${maxResults}` ;

    else
     finalURL = `https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&part=snippet,id&type=${type}&channelId=${channelId}&videoDuration=${videoDuration}&order=${orderCriteria}&publishedAfter=${publishedAfter}&publishedBefore=${publishedBefore}&maxResults=${maxResults}` ;


  fetch(finalURL)
    .then((response) => response.json())
    .then((responseJson) => {

      var resultsYT = responseJson.items.map(obj => "https://www.youtube.com/embed/" + obj.id.videoId);
     
      const title = responseJson.items.map(obj => obj.snippet.title);    // title find
      const description = responseJson.items.map(obj => obj.snippet.description);    // descriptions
      const publishedAt = responseJson.items.map(obj => obj.snippet.publishedAt);    // time
      const channelTitle = responseJson.items.map(obj => obj.snippet.channelTitle); // channel title
      const kind = responseJson.items.map(obj => obj.kind); // channel kind
      
      this.setState({
        resultsYT:resultsYT,
        title:title,
        description:description,
        publishedAt:publishedAt,
        channelTitle:channelTitle,
        kind:kind
      });
    
        document.getElementsByClassName('errorMsg')[0].innerHTML= '';
    })
    .catch((error) => {
      console.error(error);
      // alert(error);
      document.getElementsByClassName('errorMsg')[0].innerHTML= 'oho! something goes Wrong';

      setTimeout(()=> { 
        document.getElementsByClassName('errorMsg')[0].innerHTML= '';
      },1000);

    });
}
getTitle(title1,i) {
  return title1[i];
}

getDescription(desc1,i) {
  return desc1[i];
}
getTime(time1,i) {
  return time1[i];
}
isLeapYear(year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}
checkAfterDate(e) {
  var check = e.target.checked;

   // if true then reset the after date
   if(check) {  
      // publishedBefore =  publishedBefore;
      document.getElementsByClassName('dateAfter')[0].value='';      
  }
}
updateMaxDate(e) {

console.log(e.target);

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
today = yyyy+'-'+mm+'-'+dd;

e.target.setAttribute('max', today);

}

getChannelId(e) {

var chId = e.target.value;

if(chId!=='')
channelId = chId;     // search without channel id
else
  channelId = '';
}

getOrderOption(e) {
  
  var newOrderCriteria = e.target.value;
  orderCriteria = newOrderCriteria;
}
getVideoDurOption(e) {
  videoDuration = e.target.value;
}
getMaxResults(e) {

 var x = e.target.value;
 var msg;
 if(x>=1 && x<=50) {
          maxResults = x;
         document.querySelectorAll('.numberExceededMsg')[0].innerHTML='';
}  
else if(x<0) {
         maxResults=0;

         msg = 'It should  be atleast 1';   
         document.querySelectorAll('.numberExceededMsg')[0].innerHTML =msg;
}
else if(x==='') {
            // maxResults = maxResults;
           document.querySelectorAll('.numberExceededMsg')[0].innerHTML='';
}

else if(x>50) {
         maxResults=50;         
         msg = 'Maximum 50 videos ';
         document.querySelectorAll('.numberExceededMsg')[0].innerHTML =msg;
}
else {
         maxResults=0;         
          msg = 'Invalid Input';
         document.querySelectorAll('.numberExceededMsg')[0].innerHTML =msg;
} 

  
} 
getAfterDate(e) {

  var x,da,dd,mm,yyyy,hh,minutes,ss;

  x=e.target.value;
  da= x.split('-');
  dd = da[2];
  mm = da[1];
  yyyy = da[0];

// ist = utc+5:30
  
  hh = 18;
  minutes= 30;
  ss=0;

  dd--;

// for correct between logic goes here

    if(dd<10)
    dd='0'+dd;

  // var publishedAfter =  '1970-01-20T00:00:00Z' ;           //  1970-01-01T00:00:00Z
  publishedAfter = yyyy + '-' + mm + '-' + dd + 'T'+ hh + ':' + minutes + ':' + ss + '0' + 'Z';
  console.log('pa= ' + publishedAfter);
}

  getBeforeDate(e) {

    if(e.target.value !=='')   // uncheck the checkbox
      document.querySelectorAll('.checkBox')[0].checked=false;
  

     var x,db,dd,mm,yyyy,hh,minutes,ss;

  x=e.target.value;
  db= x.split('-');
  
  dd = db[2];
  mm = db[1];
  yyyy = db[0];

// ist = utc+5:30
  
  hh = 18;
  minutes= 30;
  ss=0;

dd--;
// for correct between logic goes here

 // console.log(dd);
  // var publishedBefore =  '1970-01-20T00:00:00Z' ;           //  1970-01-01T00:00:00Z
  publishedBefore = yyyy+'-'+mm+'-'+ dd + 'T'+hh+':'+minutes+':'+ss+'0'+'Z';
 // console.log('pb= ' + publishedBefore);
}

showFilterOPtion(e) {

count++;
 var x=document.querySelectorAll('.menu')[0];//('menu');

  if(count%2===0)
  { x.style.opacity = 0;    
   count=0;
  }
  else
    x.style.opacity = 1;

 }

showChanneIdlInfo(e) {

document.querySelectorAll('.demoChId')[0].style.opacity=1;
document.querySelectorAll('.demoChId')[1].style.opacity=1;

}

hideChanneIdlInfo(e) {
  document.querySelectorAll('.demoChId')[0].style.opacity=0;
  document.querySelectorAll('.demoChId')[1].style.opacity=0;
}
    
  render() { 
        return ( 
            <div>     
               
                <Controls />
                      <div align='center'>
       
                      <label>
                        <p  className='errorMsg'>     </p>
                      </label>
                      
                        <label>
                       <p className = 'howToGetChId'> How to get channel Id - </p>
                      </label>

                       <img onMouseOver={this.showChanneIdlInfo} onMouseOut={this.hideChanneIdlInfo} className = 'howToGetChIdQM' src={require('./qqq.svg')} alt={'QM'}style={{width: "40px",height: "auto"}} />   
                       <br/><br/>
                       <p className='demoChId'>
                       Go to home page of any Channel and copy
                       id after channel (see example) </p>
                       <p className = 'demoChId' > https://www.youtube.com/channel/<span style={{color:'red'}}> UCq-Fj5jknLsUf-MWSy4_brA </span></p>
                        <label>
                            <input onChange = {this.getChannelId} className='inputArea' placeholder = 'Enter channel Id /search without ch.Id' type="text" name="channelId" />
                        </label>
                     
                         <button className='goButton'onClick = {this.handleClick} > GO </button>
                       </div>
                       <br /> 

<img onClick={this.showFilterOPtion} style={{width:"45px",height:'auto' }} alt='filter' src={require('./filterIcon.png') } />

<div className="menu">
  <ul className = 'menuUl'>
  <li>order 

  <select onChange={this.getOrderOption}>

    <option value="relevance">relevance</option>
    <option value="date">date</option>
    <option value="rating">rating</option>
    <option value="title">title</option>
    <option value="videoCount">video count</option>
    <option value="viewCount">view count</option>
  </select>
  </li>

  <li> VideoDuration  
  <select onChange={this.getVideoDurOption}>
    <option value="any">any</option>
    <option value="long"> >20Min</option>
    <option value="medium"> [4,20] Min</option>
    <option value="short"> >4 Min </option>
  </select>
  </li>
 
 <li> Max Results  
 <input onChange={this.getMaxResults} type= 'number' min = '1' max = '50' />
 <p className='numberExceededMsg'></p>
 </li>

 <li>Between
<label>
<input onChange = {this.getAfterDate}  onMouseOver={this.updateMaxDate} className="dateBefore" type='date' min='2005-04-23' max='2019-01-09'></input>
< /label>
&
<label>
<input onChange = {this.getBeforeDate} onMouseOver={this.updateMaxDate} className="dateAfter" type='date' min='2005-04-23' max='2019-01-15'></input>
 </label>

 <input style={{width:"30px",height:'15px'}} className ='checkBox'  onClick={this.checkAfterDate} type='checkbox' />Now
 </li>

  </ul>
</div>

                       <div>

                  </div> 
          
              {  

            this.state.resultsYT.map((link,i) => {
             
              var title = this.getTitle(this.state.title,i);
              // var desc = this.getDescription(this.state.description,i);
              var time = this.getTime(this.state.publishedAt,i);   
              var channelTitle = this.state.channelTitle[i];    
            
              var utcDate = new Date(time).getUTCDate();
              var utcMonth = new Date(time).getUTCMonth();
              var utcYr = new Date(time).getUTCFullYear();
              var utcHr = new Date(time).getUTCHours();
              var utcMinutes = new Date(time).getUTCMinutes();
              /* alert('hh-mm-ss,day-month-year UTC = '+ utcHr + '-'+utcMinutes+ ','+utcDate + '/' + utcMonth + '/' + utcYr); */
              var istMin = utcMinutes+30;
              var istHr = utcHr+5;
              var istDate = utcDate;
              var istMonth = utcMonth+1;           // utc month = [0,11]
              var istYr = utcYr;
             /* alert('hh-mm-ss,day-month-year IST = '+ istHr + '-'+istMin + istDate + '-' + istMonth + '-' + istYr); */

              if(istMin>=60) {
                istMin = istMin-60;
                istHr++;
              }
              if(istHr>=24) {
                istHr-=24;
                istDate++;
              }
              // check for which month , according to istdate>28/29/30/31
              // for 30 day month
            if(istMonth === 4 || istMonth === 6 || istMonth === 9 || istMonth === 11) {
              if(istDate>30) {
                istDate-=30;
                istMonth++;
              }
            }
            // for Feb
            else if(istMonth === 2) {
              if(this.isLeapYear(istYr)) {       // for leap year
              if(istDate>29) {
                istDate-=29;
                istMonth++;
              }
              }
              else {                     // for NOn leap year
                if(istDate>28) {
                istDate-=28;
                istMonth++;
              }  
            }}
            else {
              if(istDate>31) {
                istDate-=31;
                istMonth++;
            }
            }
              // check for Month

              if(istMonth>12) {
                istMonth-=12;
                istYr++;
              } 
              const finalDate = istHr + ':' + istMin + ', ' + istDate + '/' + istMonth + '/' + istYr;
            
              var frame = <div key = {i} className ='iframeYT'>
                            <p>{channelTitle} </p>
                            <iframe title= {i} src={link} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                            </iframe>                      
                           <br /><p> {title} </p>
                           <p> {finalDate} </p>

                       </div>
                       
                  return (frame);
             }
             )
        }
         
      </div> 
    );
  }
}
export default App;
