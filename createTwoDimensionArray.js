function createTwoDimensionArray(row , col){
  var tmp = new Array(row);
  for(let i = 0 ; i<row ; i++)
	 tmp[i] = new Array(col);
  return tmp;
}
