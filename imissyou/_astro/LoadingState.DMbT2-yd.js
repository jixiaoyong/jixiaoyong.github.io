import{u as i,j as e}from"./index.CxUIVpTM.js";const o=({message:a,showQuote:t=!0})=>{const{language:r}=i(),s=r==="zh"?"加载中...":"Loading...";return e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-[60vh] flex-grow w-full max-w-4xl mx-auto px-4",children:[e.jsxs("div",{className:"flex flex-col items-center justify-center flex-grow",children:[e.jsx("div",{className:"loading-spinner mb-6"}),e.jsx("span",{className:"text-lg font-medium text-gray-500 dark:text-gray-400 tracking-wide",children:a||s})]}),t&&e.jsx("div",{className:"w-full text-center pb-12 sm:pb-20",children:e.jsx("span",{className:"block text-lg sm:text-xl font-serif italic text-gray-600 dark:text-gray-300 opacity-90 leading-relaxed max-w-2xl mx-auto transition-opacity duration-500"})}),e.jsx("style",{children:`
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(229, 231, 235, 0.5);
                    border-radius: 50%;
                    border-top-color: #3b82f6;
                    animation: spin 1s ease-in-out infinite;
                }
                
                :global(.dark) .loading-spinner {
                    border-color: rgba(75, 85, 99, 0.5);
                    border-top-color: #60a5fa;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `})]})};export{o as L};
