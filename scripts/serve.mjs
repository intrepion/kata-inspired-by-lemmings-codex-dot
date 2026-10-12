import {spawn} from 'node:child_process';
import {openSync,closeSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import net from 'node:net';
const directory=fileURLToPath(new URL('../',import.meta.url));
const port=5205;
// Refuse to replace any listener, including earlier projects.
const probe=net.createServer();
probe.once('error',()=>{console.error(`Port ${port} is occupied. Existing servers were left untouched.`);process.exitCode=1;});
probe.listen(port,'127.0.0.1',()=>probe.close(()=>{
 const log=openSync('/tmp/mosslight-rescue-5205.log','a');
 const child=spawn(process.execPath,[fileURLToPath(new URL('../node_modules/vite/bin/vite.js',import.meta.url)),'preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:directory,detached:true,stdio:['ignore',log,log]});
 child.on('error',error=>{console.error(error.message);process.exitCode=1;});
 child.unref();closeSync(log);
 console.log(`Mosslight production preview: http://127.0.0.1:${port} · PID ${child.pid}\nLog: /tmp/mosslight-rescue-5205.log`);
}));
