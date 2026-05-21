/* ── CORE CONFIGURATIONS ── */
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  font-family:'Segoe UI', system-ui, -apple-system, sans-serif;
  background:#020617;
  color:#f8fafc;
  overflow-x:hidden;
}

/* ── HIGH-END FINTECH BACKGROUND MATRIX & GLOWS ── */
.matrix-grid-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.015) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: -2;
  pointer-events: none;
}
body::before{
  content:'';position:fixed;width:600px;height:600px;
  background:radial-gradient(circle, rgba(0,212,255,0.08), transparent 65%);
  top:-150px;left:-150px;z-index:-1;
  animation:floatGlow1 12s ease-in-out infinite;
}
body::after{
  content:'';position:fixed;width:600px;height:600px;
  background:radial-gradient(circle, rgba(124,58,237,0.07), transparent 65%);
  bottom:-150px;right:-150px;z-index:-1;
  animation:floatGlow2 14s ease-in-out infinite;
}
@keyframes floatGlow1{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(50px,30px) scale(1.1);}}
@keyframes floatGlow2{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-40px,-40px) scale(1.05);}}

/* ── LIVE EXCHANGE TICKER WITH STRUCTURAL FLASH STYLES ── */
.ticker-bar{
  position:fixed;top:0;width:100%;height:44px;
  display:flex;align-items:center;
  background:#030712;
  border-bottom:1px solid rgba(0,212,255,0.15);
  z-index:9999;
