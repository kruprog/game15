function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

  function getGenericField(fieldSize,callbackShuffler)
  {
      let s=fieldSize
      let b=Array(s*s).fill(0).map((v,i)=> i+1 );
      b[b.length-1]=0;
  
      let c= callbackShuffler ? callbackShuffler(b) : b;
      //return b;
      let m=Array(s).fill(Array(s).fill(0));    
  
      let m2=m.map((row,y) =>   
          row.map( (cell,x) => c[y*s+x] )
       )
  
      //console.log(m2)
      return m2    
  }


function gameCompleteCheck(field1,field2)
{
    if (!field1.length) return false;
    let c=1;
    let count=field1.length*field1[0].length;
    if (count<9) return false;
    for (let y=0;y<field1.length;y++)
    {
        for (let x=0;x<field1[y].length;x++)
        {
            if (field1[y][x]!==c) return false;
            
            c++;
            if (c===count) return true;
        }
    }
    return false;
    
}


function getRandomField(fieldSize)
{
    console.log('grf')

    let randomField=[];

    do {
        randomField=getGenericField(fieldSize,shuffle)
        
    } while (gameCompleteCheck(randomField) && fieldSize>2)

    return randomField

    
    //return getOrderedField()


}

export {getRandomField,gameCompleteCheck}