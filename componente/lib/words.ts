export const WORDS: string[] = [
  "the","of","and","to","in","a","is","that","for","it","as","was","with","be","by","on","not","he","this","are",
  "at","or","have","from","had","but","they","which","one","you","were","her","all","she","there","would","their","we","him","been",
  "has","when","who","will","more","no","if","out","so","said","what","up","its","about","into","than","them","can","only","other",
  "new","some","could","time","these","two","may","then","do","first","any","my","now","such","like","our","over","man","me","even",
  "most","made","after","also","did","many","before","must","through","back","years","where","much","your","way","well","down","should","because","each",
  "just","those","people","how","too","little","state","good","very","make","world","still","own","see","men","work","long","get","here","between",
  "both","life","being","under","never","day","same","another","know","while","last","might","us","great","old","year","off","come","since","against",
  "go","came","right","used","take","three","states","himself","few","house","use","during","without","again","place","american","around","however","home","small",
  "found","mrs","thought","went","say","part","once","general","high","upon","school","every","don't","does","got","united","left","number","course","war",
  "until","always","away","something","fact","water","though","less","public","put","think","almost","hand","enough","far","took","head","yet","government","system",
  "better","set","told","nothing","night","end","why","called","didn't","eyes","find","going","look","asked","later","knew","point","next","city","business",
  "give","group","toward","young","days","let","room","president","side","social","present","given","order","several","national","second","possible","rather","per","face",
  "among","form","important","often","things","looked","early","white","case","become","need","big","four","within","felt","along","children","saw","light","power",
];

export function makeWords(count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return out;
}
