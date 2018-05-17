var sum = 0;

for(let i=1; i < 11; i++) {
    sum += i;
}
console.log(sum);
console.log('i= ',i); //error, 변수의 라이프사이클이 끝났기때문에