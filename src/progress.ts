import { gardens } from './levels.ts';
export const SAVE_KEY='mosslight.campaign.v1';
export function decodeProgress(raw:string|null):number[]{
 const empty=()=>gardens.map(()=>0);
 try {const data=JSON.parse(raw??'null');if(data?.version!==1||!Array.isArray(data.best))return empty();
 const best=gardens.map((g,i)=>Number.isInteger(data.best[i])&&data.best[i]>=0&&data.best[i]<=g.crew?data.best[i]:0);
 // A corrupt later completion may not skip the sequential campaign.
 for(let i=1;i<best.length;i++)if(best[i-1]<gardens[i-1].quota)best[i]=0;
 return best;
 }catch{return empty();}
}
export function unlocked(best:number[]){const i=best.findIndex((n,i)=>n<gardens[i].quota);return i<0?gardens.length-1:i;}
