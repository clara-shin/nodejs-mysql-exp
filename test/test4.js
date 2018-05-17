//일반객체
var person = new Object();
person.name = '홍길동';
person.age = 25;

console.log(person);

//JSON객체
var person2 = { 
    name: '홍길동', 
    age: 25 
};
console.log(person2);

//이와같은 방식으로 DB에 데이터를 넣는 방식이 MongoDB이다.