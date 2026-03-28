import { useState, useEffect } from “react”;

const GEAR = [
{cat:“🏠 주거/쉘터”,items:[
{n:“제드 티맥스에어 샴페인골드 텐트”,p:650000},
{n:“코웻 접이식 캠핑 화로대”,p:19290},
{n:“바니바람막이 매드독 2중분체도장”,p:18500},
{n:“현승 타프팬화이트 실링팬”,p:21900},
]},
{cat:“🛏️ 침구/수면”,items:[
{n:“네처하이크 트리플 에어매트”,p:86520},
{n:“3단 발포매트”,p:24900},
{n:“이불 2개”,p:0},{n:“온열매트”,p:0},
{n:“다이소 에어베개 2개”,p:0},{n:“제드 에어베개 2개”,p:0},
{n:“다이소 에어쿠션 1개”,p:0},{n:“다이소 에어펌프 1개”,p:0},
]},
{cat:“🔥 화기/열원”,items:[
{n:“제라 서브스토브 버너”,p:0},{n:“가스버너”,p:0},
{n:“뚤론 팬히터”,p:28600},{n:“루메나 warmer pot pro”,p:69000},
{n:“30m 릴선”,p:0},{n:“5구 멀티탭 3m”,p:9000},{n:“접지형 멀티콘센트 3구”,p:5000},
]},
{cat:“🍽️ 식기/조리”,items:[
{n:“카즈미 식기세트”,p:26000},{n:“다이소 접시 5개”,p:0},
{n:“다이소 밥그릇 6개”,p:0},{n:“매드독 식기세척망+보관세트”,p:29000},
]},
{cat:“🪑 테이블/의자”,items:[
{n:“다닝고 테이블 2개”,p:30000},{n:“다닝고 가죽매트”,p:6900},
{n:“원스위크라이크 접이식 우드쉘프 4단”,p:22990},
{n:“의자 3개”,p:0},{n:“다이소 야외용 접이식의자”,p:3000},
]},
{cat:“💡 조명”,items:[
{n:“크레모아 울트라 3.0 Large”,p:60000},{n:“삼발 T1 텍티컬 랜턴”,p:29500},
{n:“레토 LED 캠핑 랜턴”,p:9900},{n:“캠핑 걸이형 전구 LED 2개”,p:4000},
{n:“미니 USB 무드등”,p:1000},{n:“캠핑 스트링전구”,p:2000},
]},
{cat:“🎒 수납/가방”,items:[
{n:“특대 부지로백”,p:5000},{n:“릴케이블 가방”,p:5000},
{n:“오거나이저 10포켓”,p:5000},{n:“메쉬 파우치”,p:2000},
]},
{cat:“⚙️ 기타 용품”,items:[
{n:“오징어 데크팩 16개”,p:2400},{n:“강철팩 22cm 8개”,p:0},
{n:“에이스스페이드 인디언행어레더”,p:2200},
{n:“마룬 쓰레기봉투거치대”,p:5000},{n:“마룬 에뜨레 휴지케이스”,p:3000},
{n:“목장갑”,p:3000},{n:“지닉스 경보기”,p:19900},{n:“브리즈문 경보기”,p:7900},
]},
{cat:“🐶 반려견 (메리)”,items:[{n:“메리 침대”,p:0},{n:“메리 밥/물 그릇”,p:0}]},
];

const DEFAULTS = [
{id:1,name:“배나무꽃 캠핑장”,start:“2025-11-14”,end:“2025-11-16”,
loc:””,scores:[1,2,3],tags:[”#애견동반”,”#비추”],
memo:“깨끗하지 않음. 불친절. 트램펄린 있음.”},
{id:2,name:“포천 예담 가족캠핑장”,start:“2026-02-28”,end:“2026-03-02”,
loc:“경기도 포천”,scores:[5,4,5],tags:[”#애견동반”,”#깨끗”,”#친절”,”#추천”,”#재방문의사”],
memo:“제드 티맥스에어 첫 피칭. 친절하고 깨끗함. 강력 추천.”},
{id:3,name:“율동공원 캠핑장”,start:“2026-03-27”,end:“2026-03-28”,
loc:“경기도 성남”,scores:[4,4,4],tags:[”#애견동반”,”#깨끗”,”#가족캠핑”,”#첫캠핑”],
memo:“우리 가족끼리만 간 첫 캠핑. 깨끗하나 매너타임 미준수.”},
];

const SL = [“시설/청결도”,“뷰/자연환경”,“애견동반 편의”];
const SI = [“🏠”,“🌲”,“🐶”];
const TAGS = [”#애견동반”,”#깨끗”,”#친절”,”#불친절”,”#뷰맛집”,”#추천”,”#비추”,”#첫캠핑”,”#가족캠핑”,”#재방문의사”];

const nights = (s,e) => { const d=(new Date(e)-new Date(s))/864e5; return d>0?d:1; };
const avgScore = r => (r.scores.reduce((a,b)=>a+b,0)/3).toFixed(1);
const fmt = n => n.toLocaleString();

const Stars = ({val,max=5,size=14}) => (
<span>{Array.from({length:max},(_,i)=>
<span key={i} style={{color:i<val?”#f5c518”:”#2a3018”,fontSize:size}}>{i<val?“★”:“☆”}</span>
)}</span>
);

const StarInput = ({val,onChange}) => (

  <div style={{display:"flex",gap:4}}>
    {Array.from({length:5},(_,i)=>(
      <button key={i} onClick={()=>onChange(i+1)}
        style={{background:"none",border:"none",cursor:"pointer",fontSize:24,padding:0,lineHeight:1}}>
        {i<val?"⭐":"☆"}
      </button>
    ))}
  </div>
);

export default function App() {
const [tab, setTab] = useState(“log”);
const [records, setRecords] = useState(DEFAULTS);
const [showForm, setShowForm] = useState(false);
const [showDetail, setShowDetail] = useState(null);
const [editRec, setEditRec] = useState(null);

// form state
const [fName, setFName] = useState(””);
const [fStart, setFStart] = useState(””);
const [fEnd, setFEnd] = useState(””);
const [fLoc, setFLoc] = useState(””);
const [fScores, setFScores] = useState([3,3,3]);
const [fTags, setFTags] = useState([]);
const [fMemo, setFMemo] = useState(””);

useEffect(()=>{ load(); },[]);

async function load(){
try{
const r = await window.storage.get(“camp-v2”);
if(r) setRecords(JSON.parse(r.value));
}catch(e){}
}

async function persist(recs){
setRecords(recs);
try{ await window.storage.set(“camp-v2”,JSON.stringify(recs)); }catch(e){}
}

function openAdd(){
setEditRec(null);
setFName(””); setFStart(””); setFEnd(””); setFLoc(””);
setFScores([3,3,3]); setFTags([]); setFMemo(””);
setShowForm(true);
}

function openEdit(r){
setEditRec(r);
setFName(r.name); setFStart(r.start); setFEnd(r.end); setFLoc(r.loc);
setFScores([…r.scores]); setFTags([…r.tags]); setFMemo(r.memo);
setShowDetail(null); setShowForm(true);
}

async function save(){
if(!fName.trim()) return alert(“캠핑장 이름을 입력하세요”);
const rec = {
id: editRec?.id||Date.now(), name:fName.trim(),
start:fStart||new Date().toISOString().slice(0,10),
end:fEnd||new Date().toISOString().slice(0,10),
loc:fLoc.trim(), scores:[…fScores], tags:[…fTags], memo:fMemo.trim(),
};
const next = editRec ? records.map(r=>r.id===editRec.id?rec:r) : […records,rec];
await persist(next);
setShowForm(false);
}

async function del(id){
if(!confirm(“삭제할까요?”)) return;
await persist(records.filter(r=>r.id!==id));
setShowDetail(null);
}

const toggleTag = t => setFTags(p=>p.includes(t)?p.filter(x=>x!==t):[…p,t]);
const totalGear = GEAR.reduce((a,c)=>a+c.items.reduce((b,i)=>b+i.p,0),0);
const sorted = […records].sort((a,b)=>new Date(b.start)-new Date(a.start));
const best = records.length ? records.reduce((a,b)=>parseFloat(avgScore(a))>=parseFloat(avgScore(b))?a:b) : null;

const s = {
wrap:{minHeight:“100vh”,background:”#0c0f08”,color:”#e4ecd4”,fontFamily:”‘Noto Sans KR’,sans-serif”,fontSize:14},
header:{background:”#141810”,borderBottom:“1px solid #252e16”,padding:“16px 16px 0”,position:“sticky”,top:0,zIndex:50},
logo:{fontSize:18,fontWeight:900,color:”#b8e05a”},
logoSub:{fontSize:10,color:”#5a6e38”,fontWeight:300,marginLeft:6},
btnAdd:{background:”#7db82e”,color:”#0c0f08”,border:“none”,borderRadius:20,padding:“7px 14px”,fontSize:12,fontWeight:900,cursor:“pointer”},
statBox:{display:“flex”,borderTop:“1px solid #252e16”,marginTop:12},
stat:{flex:1,textAlign:“center”,padding:“10px 4px 12px”},
statNum:{fontSize:20,fontWeight:900,color:”#b8e05a”,lineHeight:1},
statLabel:{fontSize:9,color:”#5a6e38”,marginTop:2},
nav:{display:“flex”,background:”#141810”,borderTop:“1px solid #252e16”,position:“sticky”,bottom:0,zIndex:50},
navBtn:(active)=>({flex:1,padding:“10px 4px 8px”,background:“none”,border:“none”,
cursor:“pointer”,color:active?”#b8e05a”:”#5a6e38”,fontSize:10,fontWeight:700,
display:“flex”,flexDirection:“column”,alignItems:“center”,gap:3,fontFamily:“inherit”}),
card:{background:”#141810”,border:“1px solid #252e16”,borderRadius:14,marginBottom:10,overflow:“hidden”,cursor:“pointer”},
cardTop:{padding:“13px 13px 8px”,display:“flex”,justifyContent:“space-between”},
date:{fontSize:10,color:”#5a6e38”,marginBottom:2},
name:{fontSize:15,fontWeight:900,marginBottom:2},
loc:{fontSize:11,color:”#5a6e38”},
badge:{background:”#1c2114”,border:“1px solid #252e16”,borderRadius:8,padding:“3px 8px”,fontSize:10,fontWeight:700,color:”#5a6e38”,marginBottom:4},
scores:{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr”,gap:5,padding:“0 13px 8px”},
scoreItem:{background:”#1c2114”,borderRadius:8,padding:“7px 8px”},
scoreLabel:{fontSize:9,color:”#5a6e38”,marginBottom:3},
scoreBar:{height:4,background:”#252e16”,borderRadius:2,overflow:“hidden”,marginBottom:3},
scoreNum:{fontSize:10,fontWeight:700,color:”#b8e05a”},
tagsRow:{padding:“0 13px 8px”,display:“flex”,flexWrap:“wrap”,gap:4},
tag:(sp)=>({fontSize:10,padding:“3px 8px”,borderRadius:10,
background:sp?“rgba(123,184,46,.15)”:”#1c2114”,
color:sp?”#b8e05a”:”#5a6e38”,border:`1px solid ${sp?"rgba(123,184,46,.3)":"#252e16"}`}),
memo:{padding:“8px 13px 12px”,borderTop:“1px solid #252e16”,fontSize:12,color:”#7a8a5a”,lineHeight:1.6},
// gear
gearTotal:{background:”#141810”,border:“1px solid #252e16”,borderRadius:12,padding:“11px 13px”,
marginBottom:12,display:“flex”,justifyContent:“space-between”,alignItems:“center”},
gearSecTitle:{fontSize:10,fontWeight:700,color:”#5a6e38”,letterSpacing:1,textTransform:“uppercase”,
marginBottom:6,display:“flex”,justifyContent:“space-between”},
gearItem:{background:”#141810”,border:“1px solid #252e16”,borderRadius:8,padding:“9px 11px”,
marginBottom:5,display:“flex”,justifyContent:“space-between”,alignItems:“center”},
// modal
overlay:{position:“fixed”,inset:0,background:“rgba(0,0,0,.8)”,zIndex:200,display:“flex”,alignItems:“flex-end”,justifyContent:“center”},
modal:{background:”#141810”,borderRadius:“18px 18px 0 0”,width:“100%”,maxWidth:480,
maxHeight:“88vh”,overflowY:“auto”,padding:“18px 16px 36px”,borderTop:“1px solid #252e16”},
handle:{width:34,height:3,background:”#252e16”,borderRadius:2,margin:“0 auto 16px”},
modalTitle:{fontSize:16,fontWeight:900,marginBottom:16},
fl:{fontSize:10,fontWeight:700,color:”#5a6e38”,letterSpacing:1,textTransform:“uppercase”,marginBottom:4,display:“block”},
fi:{width:“100%”,background:”#1c2114”,border:“1px solid #252e16”,borderRadius:10,
padding:“10px 12px”,fontSize:13,color:”#e4ecd4”,fontFamily:“inherit”,outline:“none”},
ft:{width:“100%”,background:”#1c2114”,border:“1px solid #252e16”,borderRadius:10,
padding:“10px 12px”,fontSize:13,color:”#e4ecd4”,fontFamily:“inherit”,outline:“none”,minHeight:80,resize:“vertical”},
fg:{marginBottom:13},
frow:{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:8},
starRow:{display:“flex”,justifyContent:“space-between”,alignItems:“center”,padding:“5px 0”},
starLabel:{fontSize:12},
checkTags:{display:“flex”,flexWrap:“wrap”,gap:5},
checkTag:(on)=>({padding:“5px 11px”,borderRadius:20,border:`1px solid ${on?"#7db82e":"#252e16"}`,
background:on?“rgba(123,184,46,.2)”:”#1c2114”,color:on?”#b8e05a”:”#5a6e38”,
fontSize:11,cursor:“pointer”,fontFamily:“inherit”}),
btnRow:{display:“flex”,gap:8,marginTop:16},
btnCancel:{flex:1,padding:12,background:”#1c2114”,border:“1px solid #252e16”,borderRadius:12,
color:”#5a6e38”,fontSize:13,fontWeight:700,cursor:“pointer”,fontFamily:“inherit”},
btnSave:{flex:2,padding:12,background:”#7db82e”,border:“none”,borderRadius:12,
color:”#0c0f08”,fontSize:13,fontWeight:900,cursor:“pointer”,fontFamily:“inherit”},
btnDel:{width:“100%”,padding:11,background:“transparent”,border:“1px solid #d44”,
borderRadius:12,color:”#d44”,fontSize:12,fontWeight:700,cursor:“pointer”,fontFamily:“inherit”,marginTop:8},
detailGrid:{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr”,gap:7,marginBottom:14},
detailCard:{background:”#1c2114”,borderRadius:12,padding:11},
detailLabel:{fontSize:9,color:”#5a6e38”,marginBottom:5},
detailNum:{fontSize:22,fontWeight:900,color:”#b8e05a”},
memoBox:{background:”#1c2114”,borderRadius:10,padding:12,fontSize:13,color:”#8a9a6a”,lineHeight:1.7},
};

return (
<div style={s.wrap}>
{/* HEADER */}
<div style={s.header}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div style={s.logo}>⛺ 캠핑일지<span style={s.logoSub}>Family</span></div>
{tab===“log” && <button style={s.btnAdd} onClick={openAdd}>+ 기록 추가</button>}
</div>
<div style={s.statBox}>
<div style={s.stat}><div style={s.statNum}>{records.length}</div><div style={s.statLabel}>총 캠핑</div></div>
<div style={s.stat}><div style={s.statNum}>{records.reduce((a,r)=>a+nights(r.start,r.end),0)}</div><div style={s.statLabel}>총 박수</div></div>
<div style={s.stat}><div style={s.statNum}>{records.length?(records.reduce((a,r)=>a+parseFloat(avgScore(r)),0)/records.length).toFixed(1):”-”}</div><div style={s.statLabel}>평균 평점</div></div>
<div style={{...s.stat}}><div style={{...s.statNum,fontSize:10}}>{best?best.name.slice(0,6)+(best.name.length>6?”…”:””):”-”}</div><div style={s.statLabel}>최고 캠핑장</div></div>
</div>
</div>

```
  {/* CONTENT */}
  <div style={{padding:12}}>
    {tab==="log" && (
      sorted.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",color:"#5a6e38"}}>
          <div style={{fontSize:48,marginBottom:14}}>⛺</div>
          <div style={{fontSize:15,fontWeight:700,color:"#e4ecd4",marginBottom:6}}>첫 캠핑을 기록해보세요</div>
        </div>
      ) : sorted.map(r=>{
        const n=nights(r.start,r.end);
        return (
          <div key={r.id} style={s.card} onClick={()=>setShowDetail(r)}>
            <div style={s.cardTop}>
              <div>
                <div style={s.date}>{r.start} ~ {r.end}</div>
                <div style={s.name}>{r.name}</div>
                <div style={s.loc}>📍 {r.loc||"지역 미기재"}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={s.badge}>{n}박 {n+1}일</div>
                <div style={{fontSize:16}}>⭐ {avgScore(r)}</div>
              </div>
            </div>
            <div style={s.scores}>
              {r.scores.map((sc,i)=>(
                <div key={i} style={s.scoreItem}>
                  <div style={s.scoreLabel}>{SI[i]} {SL[i]}</div>
                  <div style={s.scoreBar}><div style={{height:"100%",width:`${sc/5*100}%`,background:"#7db82e",borderRadius:2}}/></div>
                  <div style={s.scoreNum}>{sc}/5</div>
                </div>
              ))}
            </div>
            {r.tags.length>0&&<div style={s.tagsRow}>{r.tags.map(t=><span key={t} style={s.tag(["#추천","#첫캠핑","#재방문의사"].some(x=>t.includes(x.slice(1))))}>{t}</span>)}</div>}
            {r.memo&&<div style={s.memo}>{r.memo}</div>}
          </div>
        );
      })
    )}

    {tab==="gear" && (
      <div>
        <div style={s.gearTotal}>
          <span style={{fontSize:11,color:"#5a6e38"}}>📦 총 장비 파악 금액</span>
          <span style={{fontSize:18,fontWeight:900,color:"#b8e05a"}}>{fmt(totalGear)}원</span>
        </div>
        {GEAR.map(c=>(
          <div key={c.cat} style={{marginBottom:14}}>
            <div style={s.gearSecTitle}>
              <span>{c.cat}</span>
              <span style={{fontSize:10,background:"#1c2114",borderRadius:10,padding:"2px 8px"}}>{c.items.length}개</span>
            </div>
            {c.items.map((it,i)=>(
              <div key={i} style={s.gearItem}>
                <span style={{fontSize:13}}>{it.n}</span>
                <span style={{fontSize:11,color:"#5a6e38"}}>{it.p?fmt(it.p)+"원":"-"}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* NAV */}
  <div style={s.nav}>
    <button style={s.navBtn(tab==="log")} onClick={()=>setTab("log")}>
      <span style={{fontSize:20}}>📋</span>캠핑일지
    </button>
    <button style={s.navBtn(tab==="gear")} onClick={()=>setTab("gear")}>
      <span style={{fontSize:20}}>🎒</span>장비목록
    </button>
  </div>

  {/* FORM MODAL */}
  {showForm&&(
    <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
      <div style={s.modal}>
        <div style={s.handle}/>
        <div style={s.modalTitle}>{editRec?"캠핑 기록 수정":"새 캠핑 기록"}</div>
        <div style={s.fg}><label style={s.fl}>캠핑장 이름</label>
          <input style={s.fi} value={fName} onChange={e=>setFName(e.target.value)} placeholder="캠핑장 이름"/></div>
        <div style={{...s.frow,...{marginBottom:13}}}>
          <div><label style={s.fl}>시작일</label><input style={s.fi} type="date" value={fStart} onChange={e=>setFStart(e.target.value)}/></div>
          <div><label style={s.fl}>종료일</label><input style={s.fi} type="date" value={fEnd} onChange={e=>setFEnd(e.target.value)}/></div>
        </div>
        <div style={s.fg}><label style={s.fl}>지역</label>
          <input style={s.fi} value={fLoc} onChange={e=>setFLoc(e.target.value)} placeholder="예) 경기도 포천"/></div>
        <div style={s.fg}>
          <label style={s.fl}>별점 평가</label>
          {SL.map((l,i)=>(
            <div key={i} style={s.starRow}>
              <span style={s.starLabel}>{SI[i]} {l}</span>
              <StarInput val={fScores[i]} onChange={v=>setFScores(p=>{const n=[...p];n[i]=v;return n;})}/>
            </div>
          ))}
        </div>
        <div style={s.fg}>
          <label style={s.fl}>태그</label>
          <div style={s.checkTags}>
            {TAGS.map(t=><button key={t} style={s.checkTag(fTags.includes(t))} onClick={()=>toggleTag(t)}>{t}</button>)}
          </div>
        </div>
        <div style={s.fg}><label style={s.fl}>메모</label>
          <textarea style={s.ft} value={fMemo} onChange={e=>setFMemo(e.target.value)} placeholder="특이사항, 주변 맛집, 다음에 챙길 것 등"/></div>
        <div style={s.btnRow}>
          <button style={s.btnCancel} onClick={()=>setShowForm(false)}>취소</button>
          <button style={s.btnSave} onClick={save}>저장</button>
        </div>
      </div>
    </div>
  )}

  {/* DETAIL MODAL */}
  {showDetail&&(
    <div style={s.overlay} onClick={e=>e.target===e.currentTarget&&setShowDetail(null)}>
      <div style={s.modal}>
        <div style={s.handle}/>
        <div style={{fontSize:11,color:"#5a6e38",marginBottom:4}}>{showDetail.start} ~ {showDetail.end} · {nights(showDetail.start,showDetail.end)}박</div>
        <div style={{fontSize:20,fontWeight:900,marginBottom:4}}>{showDetail.name}</div>
        <div style={{fontSize:12,color:"#5a6e38",marginBottom:14}}>📍 {showDetail.loc||"지역 미기재"}</div>
        <div style={s.detailGrid}>
          {showDetail.scores.map((sc,i)=>(
            <div key={i} style={s.detailCard}>
              <div style={s.detailLabel}>{SI[i]} {SL[i]}</div>
              <div style={s.detailNum}>{sc}<span style={{fontSize:12,color:"#5a6e38"}}>/5</span></div>
              <Stars val={sc} size={12}/>
            </div>
          ))}
        </div>
        {showDetail.tags.length>0&&(
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#5a6e38",letterSpacing:1,marginBottom:6}}>태그</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{showDetail.tags.map(t=><span key={t} style={s.tag(true)}>{t}</span>)}</div>
          </div>
        )}
        {showDetail.memo&&(
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#5a6e38",letterSpacing:1,marginBottom:6}}>메모</div>
            <div style={s.memoBox}>{showDetail.memo}</div>
          </div>
        )}
        <div style={s.btnRow}>
          <button style={s.btnCancel} onClick={()=>setShowDetail(null)}>닫기</button>
          <button style={s.btnSave} onClick={()=>openEdit(showDetail)}>수정</button>
        </div>
        <button style={s.btnDel} onClick={()=>del(showDetail.id)}>🗑️ 삭제</button>
      </div>
    </div>
  )}
</div>
```

);
}
