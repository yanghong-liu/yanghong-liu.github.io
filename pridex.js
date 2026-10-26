const stages=[
['OBSERVE','Start with the interaction.','Human RGB video supplies motion and contact cues. It is an observation of the human task, not a robot action sequence.','Video reconstruction was shared with teammates.','pridex-pouring-human.jpg','Source RGB footage'],
['ESTIMATE','Keep uncertainty visible.','Reconstruct hand and object motion, then estimate how reliable the recovered information is. Contact and confidence cues guide later stages.','My work includes reconstruction confidence; reconstruction was shared.','pridex-reconstruction.jpg','Estimated human hands and object motion'],
['ADAPT','Build references the robot can use.','Generate and filter grasp candidates. Spatial and temporal alignment and inverse kinematics adapt video motion to robot kinematics.','My work includes grasp candidate generation and filtering.','pridex-grasp-priors.png','Contact-guided robot grasp references'],
['LEARN','Improve the execution.','Confidence-guided residual RL learns robot behavior around adapted references through simulated interaction. The original 3D reconstruction is not re-estimated.','My work includes RL environments, rewards, and PPO training.','pridex-pouring-simulation.jpg','A trained RL teacher rollout'],
['RECORD','Turn qualifying execution into data.','Record robot observations and actions from simulation executions that satisfy the corresponding task criteria. These become demonstrations for downstream learning.','Demonstration generation was primarily led by teammates.','pridex-cleaning-simulation.jpg','Selected simulation execution'],
['DEPLOY','Learn a visual policy and test on the robot.','Use robot demonstrations for downstream visual policy learning and deploy selected manipulation policies on the physical robot.','I worked on deployment; Diffusion Policy training was primarily led by teammates.','pridex-pouring.jpg','Downstream visual policy deployment']
];const flowButtons=[...document.querySelectorAll('[data-flow]')];function showStage(n){const s=stages[n];flowButtons.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===n));b.tabIndex=i===n?0:-1;});document.getElementById('flow-panel').setAttribute('aria-labelledby','flow-tab-'+n);document.getElementById('flow-kicker').textContent=String(n+1).padStart(2,'0')+' / '+s[0];document.getElementById('flow-title').textContent=s[1];document.getElementById('flow-copy').textContent=s[2];document.getElementById('flow-credit').textContent=s[3];document.getElementById('flow-image').src='assets/'+s[4];document.getElementById('flow-image').alt=s[5];document.getElementById('flow-caption').textContent=s[5];}flowButtons.forEach((b,i)=>{b.addEventListener('click',()=>showStage(i));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%6;else if(e.key==='ArrowLeft')n=(i+5)%6;else if(e.key==='Home')n=0;else if(e.key==='End')n=5;else return;e.preventDefault();showStage(n);flowButtons[n].focus();});});
const tasks={
  pouring:{label:'Pouring',simSpeed:'3×',human:'assets/pridex-pouring-human',simulation:'assets/pridex-pouring-simulation',robot:'assets/pridex-pouring'},
  cleaning:{label:'Plate Cleaning',simSpeed:'3×',human:'assets/pridex-cleaning-human',simulation:'assets/pridex-cleaning-simulation',robot:'assets/pridex-cleaning'},
  sweeping:{label:'Tabletop Sweeping',simSpeed:'2×',human:'assets/pridex-sweeping-human',simulation:'assets/pridex-sweeping-simulation',robot:'assets/pridex-sweeping'}
};
const videos=[...document.querySelectorAll('[data-stage]')];
const status=document.getElementById('media-status');
let generation=0;
function pauseAll(){videos.forEach(video=>video.pause());}
document.querySelectorAll('[data-clip]').forEach(button=>button.addEventListener('click',()=>{
  if(button.getAttribute('aria-pressed')==='true')return;
  generation++;
  pauseAll();
  const task=tasks[button.dataset.clip];
  videos.forEach(video=>{
    const stage=video.dataset.stage;
    video.poster=task[stage]+'.jpg';
    const source=video.querySelector('source');source.removeAttribute('data-src');source.src=task[stage]+'.mp4';
    const descriptions={human:`${task.label} human RGB demonstration`,simulation:`${task.label} trained RL teacher rollout in simulation, ${task.simSpeed} speed`,robot:`${task.label} real-robot visual policy deployment, 3× speed`};
    video.setAttribute('aria-label',descriptions[stage]);
    video.load();
  });
  document.getElementById('task-label').textContent=task.label.toUpperCase();
  document.getElementById('simulation-note').textContent=`Trained RL teacher · ${task.simSpeed} speed`;
  document.querySelectorAll('[data-clip]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  status.textContent='Task changed. All previous clips stopped. Press Play all, or play each stage separately.';
}));
document.getElementById('play-all').addEventListener('click',async()=>{
  const current=generation;document.querySelectorAll('.story-video').forEach(video=>video.pause());videos.forEach(video=>window.portfolioMedia.load(video));
  const results=await Promise.allSettled(videos.map(video=>{if(video.ended)video.currentTime=0;return video.play();}));
  if(current!==generation)return;
  status.textContent=results.every(result=>result.status==='fulfilled')?'Playing all three stages independently.':'Some clips could not start. Use the individual video controls.';
});
document.getElementById('pause-all').addEventListener('click',()=>{generation++;pauseAll();status.textContent='All three stages paused.';});
videos.forEach(video=>video.addEventListener('error',()=>{status.textContent='This clip could not load. Please try the individual video control.';}));

