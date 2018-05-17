//동기
console.log('hello');
console.log('world');

//비동기
setTimeout(() => console.log('world2'), 1000); //1초 뒤에 world2 출력
console.log('hello2');