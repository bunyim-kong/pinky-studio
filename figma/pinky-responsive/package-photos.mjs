// Development helper: embed the verified downloaded photos into the plugin.
import fs from 'node:fs';
import { products } from '../../src/data/products.js';
const hero='https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1200&q=85';
const edit='https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=85';
const urls=[...new Set([hero,edit,...products.map(p=>p.image),...products[0].gallery])];
const data=Object.fromEntries(urls.map((url,i)=>[url,fs.readFileSync('/tmp/pinky-photo-'+i+'.jpg').toString('base64')]));
const path=new URL('./code.js',import.meta.url);
const source=fs.readFileSync(path,'utf8').replace(/^const PHOTO_DATA = .*;\n/,'');
fs.writeFileSync(path,'const PHOTO_DATA = '+JSON.stringify(data)+';\n'+source);
fs.writeFileSync(new URL('./photos.json',import.meta.url),JSON.stringify(data));
console.log('Bundled '+urls.length+' verified skincare photographs.');
