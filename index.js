function radixSort(arr) {
  console.time("基数排序耗时");

  if (!Array.isArray(arr)) return;

  let maxLength = 0;
  for (let v of arr) {
    const { length } = String(v);
    if (length > maxLength) {
      maxLength = length;
    }
  }
  for (i = 0; i < maxLength; i++) {
    arr = sort(arr, i);
  }

  function sort(arr, index) {
    let buckets = [];
    for (let i = 0; i < 10; i++) {
      buckets.push([]);
    }
    for (let v of arr) {
      let pad = String(v).padStart(maxLength, "0");
      let num = pad[maxLength - 1 - index];
      buckets[num].push(v);
    }
    let result = [];
    for (let bucket of buckets) {
      console.log(22,bucket)
      result.push(...bucket);
    }
    console.log(11,result)
    return result;
  }
  console.timeEnd("基数排序耗时");
  return arr;
}

const newArr = radixSort([1,4,23,46,123,2,5]);

