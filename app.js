(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const year = 2026;
  const dateFromDay = n => new Date(Date.UTC(year,0,n));
  const isoDate = n => dateFromDay(n).toISOString().slice(0,10);
  const dayNumber = date => Math.round((Date.parse(date+'T00:00:00Z')-Date.UTC(year,0,1))/86400000)+1;
  const now = new Date();
  const startDay = now.getFullYear()===year ? Math.floor((Date.UTC(year,now.getMonth(),now.getDate())-Date.UTC(year,0,1))/86400000)+1 : 1;
  let selectedDay = startDay;
  let selectedMonth = dateFromDay(selectedDay).getUTCMonth();
  let requestSequence = 0;
  const loadedDays = new Map();
  window.__familyDevotionReady = entries => {
    for (const item of entries) loadedDays.set(item.day, item);
  };
  const months = Array.from({length:12},(_,m)=>new Date(Date.UTC(year,m,1)).toLocaleString('en-GB',{month:'long',timeZone:'UTC'}));
  function node(tag, content, className) { const el=document.createElement(tag);if(content!==undefined&&content!==null)el.textContent=String(content);if(className)el.className=className;return el; }
  function line(parent,label,content,className=''){if(!content)return;const area=node('section',null,'readPart '+className);area.append(node('h3',label),node('p',content));parent.append(area);}
  function list(parent,label,entries){const vals=entries.filter(Boolean);if(!vals.length)return;const area=node('section',null,'readPart');const ul=node('ul');vals.forEach(x=>ul.append(node('li',x)));area.append(node('h3',label),ul);parent.append(area);}
  function render(item) {
    const panel=$('devotionPanel');panel.replaceChildren();
    if(!item){panel.append(node('p','This devotion could not be loaded. Please choose another day.','note'));return;}
    const heading=node('div',null,'readHeading');heading.append(node('span',`DAY ${item.day} · ${item.date}`,'eyebrow'),node('h2',item.title),node('p',item.bible_reading,'scripture'));panel.append(heading);
    const grid=node('div',null,'readingGrid');
    line(grid,'Family reflection',item.devotional_reflection,'reflection');
    line(grid,'Today’s focus point',item.focus_point,'focus');
    line(grid,'Family prayer',item.family_prayer);
    list(grid,'Prayer points',[item.prayer_point_1,item.prayer_point_2,item.prayer_point_3]);
    line(grid,'Memory verse',item.memory_verse_reference);
    line(grid,'Learn the memory verse',item.memory_verse_activity);
    line(grid,'Suggested hymn',item.suggested_hymn_title ? `${item.suggested_hymn_title}${item.suggested_hymn_author?' — '+item.suggested_hymn_author:''}` : '');
    line(grid,'Hymn activity',item.hymn_activity);
    list(grid,'Talk together',[item.question_for_children&&`Children: ${item.question_for_children}`,item.question_for_teenagers&&`Teens: ${item.question_for_teenagers}`,item.question_for_adults&&`Adults: ${item.question_for_adults}`]);
    line(grid,'Our family action',item.family_action);
    if(item.quiz_question){
      const quiz=node('section',null,'readPart');quiz.append(node('h3','Bible knowledge check'),node('p',item.quiz_question));
      const reveal=node('button','Show answer','reveal');reveal.type='button';
      reveal.addEventListener('click',()=>{reveal.replaceWith(node('p',item.quiz_answer,'quizAnswer'));});
      quiz.append(reveal);grid.append(quiz);
    }
    panel.append(grid,node('p','Read the listed passage in your Bible. Hymn titles are suggestions; hymn lyrics and copyrighted Bible text are not reproduced here.','note'));
  }
  function refreshSelection(){
    $('dayPicker').value=isoDate(selectedDay);
    $('dayCounter').textContent=`Day ${selectedDay} of 365`;
    $('previousDay').disabled=selectedDay===1;
    $('nextDay').disabled=selectedDay===365;
    const m=dateFromDay(selectedDay).getUTCMonth();
    if(m!==selectedMonth)showMonth(m);
    document.querySelectorAll('#calendarDays .day').forEach(btn=>{const active=Number(btn.dataset.day)===selectedDay;btn.classList.toggle('selected',active);btn.setAttribute('aria-current',active?'date':'false');});
  }
  function loadDay(day){
    day=Math.max(1,Math.min(365,Math.round(Number(day))||1));
    selectedDay=day;
    refreshSelection();
    $('devotionPanel').replaceChildren(node('p','Opening your devotional reading…','note'));
    const req=++requestSequence;
    if (loadedDays.has(day)) { render(loadedDays.get(day)); return; }
    const month = dateFromDay(day).getUTCMonth() + 1;
    const script = document.createElement('script');
    script.src = `readings/month-${String(month).padStart(2,'0')}.js`;
    script.async = true;
    script.onerror = () => {
      if (req === requestSequence) $('devotionPanel').replaceChildren(node('p','The monthly readings could not be opened. Make sure the complete “readings” folder was uploaded to your website.','note'));
      script.remove();
    };
    script.onload = () => {
      if (req === requestSequence) render(loadedDays.get(selectedDay));
      script.remove();
    };
    document.head.append(script);
  }
  function showMonth(m){
    selectedMonth=m;
    document.querySelectorAll('#months .month').forEach((btn,i)=>btn.classList.toggle('selected',i===m));
    const calendar=$('calendarDays');calendar.replaceChildren();
    const count=new Date(Date.UTC(year,m+1,0)).getUTCDate();
    for(let date=1;date<=count;date++){
      const d=dayNumber(`${year}-${String(m+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`);
      const btn=node('button',String(date),'day');btn.type='button';btn.dataset.day=String(d);btn.setAttribute('aria-label',`Read ${months[m]} ${date}, ${year}`);
      btn.addEventListener('click',()=>{loadDay(d);location.hash='devotion';});calendar.append(btn);
    }
    document.querySelectorAll('#calendarDays .day').forEach(btn=>{const active=Number(btn.dataset.day)===selectedDay;btn.classList.toggle('selected',active);btn.setAttribute('aria-current',active?'date':'false');});
  }
  months.forEach((month,i)=>{const btn=node('button',month,'month');btn.type='button';btn.addEventListener('click',()=>showMonth(i));$('months').append(btn);});
  showMonth(selectedMonth);
  $('readDay').addEventListener('click',()=>{if($('dayPicker').value)loadDay(dayNumber($('dayPicker').value));});
  $('dayPicker').addEventListener('change',()=>{if($('dayPicker').value)loadDay(dayNumber($('dayPicker').value));});
  $('previousDay').addEventListener('click',()=>loadDay(selectedDay-1));
  $('nextDay').addEventListener('click',()=>loadDay(selectedDay+1));
  loadDay(startDay);
})();
