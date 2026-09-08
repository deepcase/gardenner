import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const port = Number(process.env.GARDENER_WEBSITE_PORT || process.env.GARDENER_HOME_PORT || 4173);
const types = { ".pdf":"application/pdf", ".mp4":"video/mp4", ".webm":"video/webm", ".wav":"audio/wav", ".png":"image/png", ".jpg":"image/jpeg", ".css": "text/css", ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".txt": "text/plain; charset=utf-8" };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relative = normalize(
      ["/", "/website", "/website/", "/home", "/home/"].includes(pathname)
        ? "website/index.html"
        : pathname.slice(1),
    );
    const file = join(project, relative);
    if (file !== project && !file.startsWith(`${project}${sep}`)) throw new Error("Invalid path");
    const info = await stat(file);
    if (!info.isFile()) throw new Error("Not a file");
    const headers={"Content-Type":types[extname(file)]||"application/octet-stream","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Accept-Ranges":"bytes"};
    let start=0,end=info.size-1,status=200;
    if(request.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if(!match||!match[1]&&!match[2]){response.writeHead(416,{...headers,"Content-Range":"bytes */"+info.size});response.end();return;}
      start=match[1]?Number(match[1]):Math.max(0,info.size-Number(match[2]));end=match[1]&&match[2]?Math.min(info.size-1,Number(match[2])):info.size-1;
      if(start>end||start>=info.size||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)){response.writeHead(416,{...headers,"Content-Range":"bytes */"+info.size});response.end();return;}
      status=206;headers['Content-Range']='bytes '+start+'-'+end+'/'+info.size;
    }
    headers['Content-Length']=Math.max(0,end-start+1);response.writeHead(status,headers);
    if(request.method==='HEAD'||!info.size){response.end();return;}
    createReadStream(file,{start,end}).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Gardenerim website: http://127.0.0.1:${port}/website/`));
