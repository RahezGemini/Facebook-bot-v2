 date = {};

 function kuldown(id, cmd, cd) {
   if (jeda(id, cmd, cd)) {
     if (!hadi[id]) {
       hadi[id] = {};
     }
     hadi[id][cmd] = Date.now();
     return "date";
   } else {
     return "time";
   }
 }

 function jeda(id, cmd, cd) {
   if (!date[id] || !date[id][cmd]) {
     return true;
   }
   const timePassed = (Date.now() - date[id][cmd]) / 1000;
   return timePassed >= cd;
 }

 module.exports = { kuldown };