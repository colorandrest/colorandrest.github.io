// Rendering and ground collision share these exact triangles.
export function createGroundSampler(positions, indices) {
 const size=100, bins=new Map();
 for(let i=0;i<indices.length;i+=3){
  const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
  const minX=Math.floor(Math.min(positions[a],positions[b],positions[c])/size);
  const maxX=Math.floor(Math.max(positions[a],positions[b],positions[c])/size);
  const minZ=Math.floor(Math.min(positions[a+2],positions[b+2],positions[c+2])/size);
  const maxZ=Math.floor(Math.max(positions[a+2],positions[b+2],positions[c+2])/size);
  for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++){
   const key=x+','+z;if(!bins.has(key))bins.set(key,[]);bins.get(key).push(i);
  }
 }
 return function sample(x,z){
  for(const i of bins.get(Math.floor(x/size)+','+Math.floor(z/size))||[]){
   const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
   const ax=positions[a],az=positions[a+2],bx=positions[b],bz=positions[b+2],cx=positions[c],cz=positions[c+2];
   const d=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);
   if(Math.abs(d)<1e-10)continue;
   const u=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/d;
   const v=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/d,w=1-u-v;
   if(u<-.00001||v<-.00001||w<-.00001)continue;
   const ay=positions[a+1],by=positions[b+1],cy=positions[c+1];
   const nx=(by-ay)*(cz-az)-(bz-az)*(cy-ay);
   const ny=(bz-az)*(cx-ax)-(bx-ax)*(cz-az);
   const nz=(bx-ax)*(cy-ay)-(by-ay)*(cx-ax);
   return {height:u*ay+v*by+w*cy,normalY:Math.abs(ny)/Math.hypot(nx,ny,nz)};
  }
  return null;
 };
}
