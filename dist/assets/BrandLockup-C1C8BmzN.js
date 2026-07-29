import{r as e}from"./useRouter-DeDOna9C.js";var t=e(),n={xs:{top:`text-[14px] leading-none`,sub:`text-[7px]`,gap:`gap-[3px]`,topTracking:`tracking-[0.04em]`,subTracking:`tracking-[0.3em]`,dash:`w-2`},sm:{top:`text-[20px] leading-none`,sub:`text-[9px]`,gap:`gap-1`,topTracking:`tracking-[0.04em]`,subTracking:`tracking-[0.3em]`,dash:`w-2.5`},md:{top:`text-[28px] leading-none`,sub:`text-[11px]`,gap:`gap-1.5`,topTracking:`tracking-[0.04em]`,subTracking:`tracking-[0.3em]`,dash:`w-3`},lg:{top:`text-[40px] leading-none`,sub:`text-[14px]`,gap:`gap-2`,topTracking:`tracking-[0.04em]`,subTracking:`tracking-[0.32em]`,dash:`w-4`},xl:{top:`text-[60px] leading-none`,sub:`text-[18px]`,gap:`gap-2.5`,topTracking:`tracking-[0.04em]`,subTracking:`tracking-[0.34em]`,dash:`w-6`}};function r({size:e=`md`,tone:r=`navy`,className:i=``}){let a=n[e];return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(`style`,{children:`
        @keyframes brandWriteErase {
          0%, 14% { width: 0; }
          45%, 66% { width: 24ch; }
          96%, 100% { width: 0; }
        }

        .brand-write-loop {
          display: inline-block;
          max-width: 24ch;
          overflow: hidden;
          white-space: nowrap;
          vertical-align: bottom;
          animation: brandWriteErase 5.2s steps(24, end) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-write-loop { animation: none; width: 24ch; }
        }

        @keyframes claimShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }

        .claim-premium {
          background: linear-gradient(
            100deg,
            #ff5e8a 0%,
            #ffb199 25%,
            #ffffff 45%,
            #a5f3fc 65%,
            #7c9cff 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: claimShimmer 4.5s linear infinite;
          filter: drop-shadow(0 1px 0 rgba(0,0,0,0.35));
        }

        @media (prefers-reduced-motion: reduce) {
          .claim-premium { animation: none; }
        }
      `}),(0,t.jsxs)(`span`,{className:`inline-flex flex-col items-center ${a.gap} uppercase rounded-md ${i}`,style:{fontFamily:`var(--font-display)`,background:`var(--brand-navy)`,padding:`0.5rem 0.9rem`},"aria-label":`Sidheshwar Enterprises`,children:[(0,t.jsx)(`span`,{className:`${a.top} ${a.topTracking} font-bold whitespace-nowrap claim-premium`,children:`CLAIM FOR SURE`}),(0,t.jsxs)(`span`,{className:`inline-flex items-center justify-center gap-1.5 whitespace-nowrap`,children:[(0,t.jsx)(`span`,{"aria-hidden":!0,className:`${a.dash} h-px`,style:{background:`var(--brand-gold-2)`}}),(0,t.jsxs)(`span`,{className:`italic ${a.sub} ${a.subTracking} font-semibold`,children:[(0,t.jsx)(`span`,{className:`brand-gold-text`,children:`BY `}),(0,t.jsxs)(`span`,{className:`brand-write-loop`,children:[(0,t.jsx)(`span`,{style:{color:`#ffffff`},children:`SIDHESHWAR`}),(0,t.jsx)(`span`,{className:`brand-gold-text`,children:` ENTERPRISES`})]})]}),(0,t.jsx)(`span`,{"aria-hidden":!0,className:`${a.dash} h-px`,style:{background:`var(--brand-gold-2)`}})]})]})]})}export{r as t};