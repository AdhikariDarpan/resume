const currentYearSpan=document.getElementById('currentYear');
currentYearSpan.textContent=new Date().getFullYear();
/* ─── LOADER ─── */
let pct=0;
const lf=document.getElementById('lf'),ln=document.getElementById('ln');
const loadInt=setInterval(()=>{
  pct=Math.min(pct+Math.random()*11+2,100);
  const p=Math.floor(pct);
  lf.style.width=p+'%';ln.textContent=p+'%';
  if(pct>=100){clearInterval(loadInt);setTimeout(()=>document.getElementById('loader').classList.add('out'),200)}
},70);

/* ─── THREE.JS ─── */
const canvas=document.getElementById('bg-canvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);
camera.position.z=55;

// Stars
const sg=new THREE.BufferGeometry(),sc=4000,sp=new Float32Array(sc*3);
for(let i=0;i<sc*3;i++)sp[i]=(Math.random()-.5)*320;
sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0x8899ff,size:.14,transparent:true,opacity:.6})));

// Wireframe solids
const meshes=[],geos=[
  new THREE.IcosahedronGeometry(2.5,0),new THREE.OctahedronGeometry(2,0),
  new THREE.TorusGeometry(1.8,.5,8,14),new THREE.TetrahedronGeometry(2,0),
  new THREE.BoxGeometry(2.8,2.8,2.8),new THREE.TorusKnotGeometry(1.5,.45,60,8),
];
const cols=[0x00f5d4,0x8b5cf6,0xf472b6,0xfbbf24];
for(let i=0;i<16;i++){
  const m=new THREE.Mesh(geos[i%geos.length],new THREE.MeshBasicMaterial({color:cols[i%cols.length],wireframe:true,transparent:true,opacity:.18+Math.random()*.12}));
  m.position.set((Math.random()-.5)*110,(Math.random()-.5)*80,(Math.random()-.5)*40-5);
  m.rotation.set(Math.random()*Math.PI*2,Math.random()*Math.PI*2,0);
  m.userData={rx:(Math.random()-.5)*.006,ry:(Math.random()-.5)*.008,oy:m.position.y,fs:.3+Math.random()*.5,fa:1.5+Math.random()*2,ph:Math.random()*Math.PI*2};
  scene.add(m);meshes.push(m);
}
// Grid
const grid=new THREE.GridHelper(220,28,0x00f5d4,0x091525);
grid.position.y=-28;grid.material.transparent=true;grid.material.opacity=.25;scene.add(grid);

let mx=0,my=0,t=0;
document.addEventListener('mousemove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2});
function render(){
  requestAnimationFrame(render);t+=.012;
  camera.position.x+=(mx*10-camera.position.x)*.035;
  camera.position.y+=(-my*5-camera.position.y)*.035;
  camera.lookAt(0,0,0);
  meshes.forEach(m=>{
    m.rotation.x+=m.userData.rx;m.rotation.y+=m.userData.ry;
    m.position.y=m.userData.oy+Math.sin(t*m.userData.fs+m.userData.ph)*m.userData.fa;
  });
  renderer.render(scene,camera);
}
render();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

/* ─── CURSOR ─── */
const cur=document.getElementById('cur'),cr=document.getElementById('cur-r');
let cx=0,cy=0,tx2=0,ty2=0;
document.addEventListener('mousemove',e=>{tx2=e.clientX;ty2=e.clientY;cur.style.left=e.clientX-5+'px';cur.style.top=e.clientY-5+'px'});
(function tc(){cx+=(tx2-cx)*.12;cy+=(ty2-cy)*.12;cr.style.left=cx-19+'px';cr.style.top=cy-19+'px';requestAnimationFrame(tc)})();

/* ─── TYPED ─── */
const roles=['Developer','Engineer','Problem Solver','Tech Lead'];
let ri=0,ci2=0,del=false;
function type(){
  const role=roles[ri],el=document.getElementById('typed-line');
  if(!el)return;
  if(!del&&ci2<=role.length){el.textContent=role.slice(0,ci2++)}
  else if(del&&ci2>=0){el.textContent=role.slice(0,ci2--)}
  if(ci2>role.length){del=true;setTimeout(type,1600);return}
  if(ci2<0){del=false;ri=(ri+1)%roles.length;ci2=0;setTimeout(type,400);return}
  setTimeout(type,del?55:95);
}
setTimeout(type,2800);

/* ─── SKILLS ─── */
function buildSkills(){
  Object.entries(SKILLS).forEach(([cat,items])=>{
    const g=document.getElementById('tg-'+cat);
    g.innerHTML=items.map(s=>`<div class="tech-card">
      <div class="tech-icon">${s.icon}</div>
      <div class="tech-info">
        <div class="tech-name">${s.name}</div>
        <div class="tech-level">${s.level}</div>
        <div class="tech-bar-mini"><div class="tech-bar-fill" data-w="${s.pct}"></div></div>
      </div>
    </div>`).join('');
  });
}
buildSkills();
document.querySelectorAll('.tab-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.skills-panel').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('tab-'+b.dataset.tab).classList.add('active');
    setTimeout(()=>{
      document.querySelectorAll('#tab-'+b.dataset.tab+' .tech-bar-fill').forEach(f=>{f.style.width=f.dataset.w+'%'});
    },50);
  });
});

/* ─── EXPERIENCE ─── */
function buildExp(){
  const cont=document.getElementById('exp-details');
  cont.innerHTML=EXP.map((e,i)=>`<div class="exp-detail ${i===0?'active':''}" id="exp-${i}">
    <div class="exp-role">${e.role}</div>
    <div class="exp-meta">${e.company} · ${e.period}</div>
    <div class="exp-desc">${e.desc}</div>
    <ul class="exp-achievements">${e.achievements.map(a=>`<li>${a}</li>`).join('')}</ul>
    <div class="exp-tags">${e.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div>
  </div>`).join('');
}
buildExp();
document.querySelectorAll('.exp-nav-item').forEach(n=>{
  n.addEventListener('click',()=>{
    document.querySelectorAll('.exp-nav-item').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.exp-detail').forEach(x=>x.classList.remove('active'));
    n.classList.add('active');
    document.getElementById('exp-'+n.dataset.exp).classList.add('active');
  });
});

/* ─── PROJECTS ─── */
function buildProjects(filter='all'){
  const g=document.getElementById('proj-grid');
  const filtered=filter==='all'?PROJECTS:PROJECTS.filter(p=>p.cats.includes(filter));
  g.innerHTML=filtered.map((p,idx)=>{
    const hasGit=p.gitUrl?`<a href="https://${p.gitUrl}" target="_blank" class="proj-link code">GitHub</a>`:'';
    const hasSite=p.siteUrl?`<a href="${p.siteUrl}" target="_blank" class="proj-link demo">Live Demo</a>`:'';
    const linksHTML=hasSite+hasGit;
    const defaultLink=!hasGit&&!hasSite?'<span style="font-family:\'JetBrains Mono\',monospace;font-size:.68rem;padding:.6rem 1.2rem;border-radius:4px;color:var(--muted);background:rgba(107,114,128,.1)">No Links Available</span>':'';
    return `<div class="proj-card" data-proj-idx="${idx}">
    <div class="proj-img">
      <div class="proj-img-bg" style="background:${p.gradient};width:100%;height:100%;position:absolute;inset:0"></div>
      ${p.image?`<img src="${p.image}" alt="${p.name}" class="proj-img-thumb" style="width:100%;height:100%;object-fit:cover;position:relative;z-index:1;">`:`<div class="proj-emoji">${p.emoji}</div>`}
      <div class="proj-overlay">
        <button class="proj-link features-btn" title="View Features">✨ Features</button>
        ${linksHTML||defaultLink}
      </div>
    </div>
    <div class="proj-body">
      <div class="proj-tags">${p.tags.map(t=>`<span class="ptag">${t}</span>`).join('')}</div>
      <div class="proj-name">${p.name}</div>
      <div class="proj-desc">${p.desc}</div>
      <div class="proj-stats">
        <span class="proj-stat"><div class="proj-stat-dot" style="background:${p.color}"></div>${p.lang}</span>
      </div>
    </div>
  </div>`;
  }).join('');
  
  // Features modal handler
  document.querySelectorAll('.features-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.preventDefault();
      const card=btn.closest('.proj-card');
      const idx=parseInt(card.dataset.projIdx);
      const proj=PROJECTS[idx];
      showFeaturesModal(proj);
    });
  });
  
  // tilt
  document.querySelectorAll('.proj-card').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`perspective(900px) rotateX(${-y*10}deg) rotateY(${x*10}deg) translateY(-8px)`;
    });
    c.addEventListener('mouseleave',()=>{c.style.transform='';c.style.transition='all .5s ease';setTimeout(()=>c.style.transition='all .4s',500)});
  });
}
buildProjects();

/* ─── FEATURES MODAL ─── */
function showFeaturesModal(proj){
  const modal=document.createElement('div');
  modal.className='features-modal';
  modal.innerHTML=`
    <div class="modal-content">
      <button class="modal-close">✕</button>
      <div class="modal-header">
        <h2>${proj.name}</h2>
        <p class="modal-desc">${proj.desc}</p>
      </div>
      <div class="modal-features">
        <h3>Key Features</h3>
        <ul>
          ${proj.features.map(f=>`<li>${f}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-tech">
        <h3>Tech Stack</h3>
        <div class="tech-list">
          ${proj.tags.map(t=>`<span class="tech-chip">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.offsetWidth; // Trigger reflow for animation
  modal.classList.add('active');
  
  // Close button
  modal.querySelector('.modal-close').addEventListener('click',()=>{
    modal.classList.remove('active');
    setTimeout(()=>modal.remove(),300);
    document.body.style.overflow='';
  });
  
  // Close on backdrop click
  modal.addEventListener('click',e=>{
    if(e.target===modal){
      modal.classList.remove('active');
      setTimeout(()=>modal.remove(),300);
      document.body.style.overflow='';
    }
  });
  
  // Prevent body scroll
  document.body.style.overflow='hidden';
}

document.querySelectorAll('.filter-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');buildProjects(b.dataset.filter);
  });
});

/* ─── SEND ─── */
function sendMsg(btn){
  btn.textContent='✓ Sorry, jocking! This form is not functional in this demo. Please reach out via email or LinkedIn.';
  btn.style.background='linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(()=>{btn.textContent='Send Message ✦';btn.style.background=''},3500);
}

/* ─── SCROLL REVEAL ─── */
const io=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('in'),i*80)});
},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ─── SKILL BARS animate on view ─── */
const sio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.tech-bar-fill').forEach(f=>{f.style.width=f.dataset.w+'%'});
      sio.unobserve(e.target);
    }
  });
},{threshold:.2});
document.querySelectorAll('.skills-panel').forEach(p=>sio.observe(p));

/* ─── COUNT UP ─── */
const cio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const tgt=+e.target.dataset.count;let c=0;
      const it=setInterval(()=>{c=Math.min(c+tgt/50,tgt);e.target.textContent=Math.floor(c)+(tgt>=50?'+':'');if(c>=tgt)clearInterval(it)},25);
      cio.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

/* ─── NAV ON SCROLL ─── */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').style.background=scrollY>60?'rgba(248,249,252,.95)':'rgba(248,249,252,.85)';
});

/* ─── CLICK SPARKS ─── */
document.addEventListener('click',e=>{
  for(let i=0;i<10;i++){
    const p=document.createElement('div');
    const c=['#00f5d4','#8b5cf6','#f472b6','#fbbf24'][Math.floor(Math.random()*4)];
    p.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:5px;height:5px;border-radius:50%;background:${c};pointer-events:none;z-index:9997;transform:translate(-50%,-50%)`;
    document.body.appendChild(p);
    const a=Math.random()*Math.PI*2,d=25+Math.random()*50;
    let ox=0,oy=0,op=1;
    (function fr(){ox+=Math.cos(a)*d*.08;oy+=Math.sin(a)*d*.08;op-=.05;
      p.style.left=e.clientX+ox+'px';p.style.top=e.clientY+oy+'px';p.style.opacity=op;
      if(op>0)requestAnimationFrame(fr);else p.remove();
    })();
  }
});